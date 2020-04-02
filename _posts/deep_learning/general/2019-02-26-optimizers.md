---
layout: post
title: Optimizers
subtitle: 优化器
author: Bin Li
tags: [Deep Learning, Machine Learning]
image: 
comments: true
published: true
---

{% include toc.html %}

　　本文整理目前常用的所有优化器，并对其原理和优缺点做了整理，有纰漏的地方烦请在留言处提醒。

## 0. 优化器概览
　　整理一下常用的优化器，能够加速在深度学习中的训练速度（比传统的 GD 好很多）。本文整理的优化器方法主要分为两类：一是调整学习率，使得优化更稳定的；二是梯度估计修正，优化训练速度的。

<p align="center">
<img src="/img/media/15845085574343.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">神经网络常用优化方法的汇总</em>
</p>

　　这些优化算法可以使用下面公式来统一描述概括：

$$
\begin{aligned} \Delta \theta_{t} &=-\frac{\alpha_{t}}{\sqrt{G_{t}+\epsilon}} M_{t} \\ G_{t} &=\psi\left(g_{1}, \cdots, g_{t}\right) \\ M_{t} &=\phi\left(g_{1}, \cdots, g_{t}\right) \end{aligned}
$$

　　其中 $g_t$ 是第 $t$ 步的梯度；$\alpha_t$ 是第 $t$ 步的学习率，可以进行衰减，也可以不变；$\psi(\cdot)$ 是学习率缩放函数，可以取 1 或历史梯度的模的移动平均；$\phi(\cdot)$ 是优化后的参数更新方向，可以取当前的梯度 $g_t$ 或历史梯度的移动平均。

　　下图给出了这几种优化方法在 MNIST 数据集上收敛性的比较（学习率为 0.001，批量大小为 128）。

<p align="center">
<img src="/img/media/15845388684866.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">不同优化方法的比较</em>
</p>



## 1. 梯度下降法（Gradient Descent）
　　[梯度下降算法](https://binlidaily.github.io/2018-04-24-gradient-descent)通过使用不同数量的样本集，可以分为全量、单个和 Mini-Batch 的方式。在深度学习中很难做到使用全量数据，我们一般采取 Mini-Batch 的方式。

　　MBGD 采用小批量的样本更新：

> Repeat until convergence{
> 
> 　　for i=1 to k, {
> 
> $$\theta_j := \theta_j - \alpha \frac{1}{m} \sum_{l=1}^{m} \frac{\partial}{\theta_j}J(\theta)~~\text{(for every j)}$$
> 
> 　　}
> 
> }

　　可以看到，影响小批量梯度下降法的主要因素有：
1. 批量大小 $m$
2. 学习率 $\alpha$
3. 梯度计算值

　　为了更有效地训练深度神经网络，在标准的小批量梯度下降法的基础上，也经常使用一些改进方法以加快优化速度，比如如何选择批量大小、如何调整学习率以及如何修正梯度估计。我们分别从这三个方面来介绍在神经网络优化中常用的算法。这些改进的优化算法也同样可以应用在批量或随机梯度下降法上。

## 2. 选择批量大小（Batch Size）
　　在小批量梯度下降法中，批量大小对网络优化的影响也非常大。一般来说，批量大小不影响随机梯度的期望，但会影响随机梯度的方差。批量大小越大，随机梯度的方差越小，引入的噪声也越小，训练就越稳定，因此可以设置对应较大的学习率；当批量大小较小时，需要设置较小的学习率，否则模型可能会不收敛。

　　学习率通常要随着批量大小的增大而相应增大，减小而相应减小。一个简单有效的策略是采用线性缩放规则（Linear Scaling Rule）：当批量大小增加 $k$ 倍时，学习率也增加 $k$ 倍。线性缩放规则往往在批量大小比较小时适用，当批量大小非常大时，线性缩放会使得训练不稳定。Why？🤔 在小批量梯度下降法中，当批量大小的设置比较大时，通常需要比较大的学习率。但在刚开始训练时，由于参数是随机初始化的，梯度往往也比较大，再加上比较大的初始学习率，会使得训练不稳定。

　　此外，批量大小和模型的泛化能力的也有一定的关系。通过实验发现：批量大小越大，越有可能收敛到陡峭最小值；批量大小越小，越有可能收敛到平坦最小值。

## 3. 学习率调整
　　学习率是神经网络优化时的重要超参数。在梯度下降法中，学习率 $\alpha$ 的取值 非常关键，如果过大就不会收敛，如果过小则收敛速度太慢。常用的学习率调整方法包括学习率衰减、学习率预热、周期性学习率调整以及一些自适应调整学习率的方法，比如 AdaGrad、RMSprop、AdaDelta 等，自适应学习率方法可以针对每个参数设置不同的学习率。

### 3.1 学习率衰减
　　从经验上看，学习率在一开始要保持大些来保证收敛速度，在收敛到最优点附近时要小些以避免来回振荡。比较简单的学习率调整可以通过学习率衰减（Learning Rate Decay）的方式来实现，也称为学习率退火（Learning Rate Annealing）。

　　不失一般性，这里的衰减方式设置为按迭代次数进行衰减。

　　假设初始化学习率为 $\alpha_0$，在第 $t$ 次迭代时的学习率 $\alpha_t$。常见的衰减方法有以下几种：

　　1）**分段常数衰减**（Piecewise Constant Decay）：即每经过 $T_1, T_2, \dots, T_m$ 次迭代将学习率衰减为原来的 $\beta_1, \beta_2, \dots, \beta_m$ 倍，其中 $T_m$ 和 $\beta_m < 1$ 为根据经验设置的超参数。分段常数衰减也称为阶梯衰减（Step Decay）。

　　2）**逆时衰减**（Inverse Time Decay）：

$$
\alpha_{t}=\alpha_{0} \frac{1}{1+\beta \times t}
$$

　　其中 $\beta$ 为衰减率。

　　3）**指数衰减**（Exponential Decay）：

$$
\alpha_{t}=\alpha_{0} \beta^{t}
$$

　　其中 $\beta < 1$ 为衰减率。

　　4）**自然指数衰减**（Natural Exponential Decay）：

$$
\alpha_{t}=\alpha_{0} \exp (-\beta \times t)
$$

　　其中 $\beta$ 为衰减率。

　　5）**余弦衰减**（Cosine Decay）：

$$
\alpha_{t}=\frac{1}{2} \alpha_{0}\left(1+\cos \left(\frac{t \pi}{T}\right)\right)
$$

　　其中 $T$ 为总的迭代次数。

<p align="center">
<img src="/img/media/15845290923557.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">不同学习率衰减方法的比较</em>
</p>


### 3.2 学习率预热
　　在小批量梯度下降法中，当批量大小的设置比较大时，通常需要比较大的学习率。但在刚开始训练时，由于参数是随机初始化的，梯度往往也比较大，再加上比较大的初始学习率，会使得训练不稳定。

　　为了提高训练稳定性，我们可以在最初几轮迭代时，采用比较小的学习率，等梯度下降到一定程度后再恢复到初始的学习率，这种方法称为学习率预热（Learning Rate Warmup）。

　　一个常用的学习率预热方法是逐渐预热（Gradual Warmup）。假设预热的迭代次数为  $T^\prime$，初始学习率为 $\alpha_0$，在预热过程中，每次更新的学习率为：

$$
\alpha_{t}^{\prime}=\frac{t}{T^{\prime}} \alpha_{0}, \quad 1 \leq t \leq T^{\prime}
$$

　　当预热过程结束，再选择一种学习率衰减方法来逐渐降低学习率。

### 3.2 周期性学习率
　　为了使得梯度下降法能够逃离鞍点或尖锐最小值，一种经验性的方式是在训练过程中周期性地增大学习率。当参数处于尖锐最小值附近时，增大学习率有助于逃离尖锐最小值；当参数处于平坦最小值附近时，增大学习率依然有可能在该平坦最小值的吸引域（Basin of Attraction）内。因此，周期性地增大学习率虽然可能短期内损害优化过程，使得网络收敛的稳定性变差，但从长期来看有助于找到更好的局部最优解。

　　本节介绍两种常用的周期性调整学习率的方法：循环学习率和带热重启的随机梯度下降。

#### 3.2.1 循环学习率（Cyclic Learning Rate）
　　循环学习率是让学习率在一个缩放来调整学习率，称为三角循环学习率（Triangular Cyclic Learning Rate）。假设每个循环周期的长度相等都为 $2\Delta T$，其中前 $\Delta T$ 步为学习率线性增大阶段，后 $\Delta T$ 步为学习率线性缩小阶段。在第 $t$ 次迭代时，其所在的循环周期数 $m$ 为

$$
m=\left\lfloor 1+\frac{t}{2 \Delta T}\right\rfloor
$$

　　其中 $\lfloor \cdot \rfloor$ 表示“向下取整”函数。第 $t$ 次迭代的学习率为

$$
\alpha_{t}=\alpha_{\min }^{m}+\left(\alpha_{\max }^{m}-\alpha_{\min }^{m}\right)(\max (0,1-b))
$$

　　其中 $a^m_{\max}$ 和 $a^m_{\min}$ 分别为第 $m$ 个周期中学习率的上界和下界，可以随着 $m$ 的增大而逐渐降低；$b\in \left[0,1\right]$ 的计算为

$$
b=\left|\frac{t}{\Delta T}-2 m+1\right|
$$


#### 3.2.2 带热重启的随机梯度下降
　　带热重启的随机梯度下降（Stochastic Gradient Descent with Warm Restarts，SGDR）是用热重启方式来替代学习率衰减的方法。学习率每间隔一定周期后重新初始化为某个预先设定值，然后逐渐衰减。每次重启后模型参数不是从头开始优化，而是从重启前的参数基础上继续优化。

　　假设在梯度下降过程中重启 $M$ 次，第 $m$ 次重启在上次重启开始第 $T_m$ 个回 合后进行，$T_m$ 称为重启周期。在第 $m$ 次重启之前，采用余弦衰减来降低学习率． 第 $t$ 次迭代的学习率为

$$
\alpha_{t}=\alpha_{\min }^{m}+\frac{1}{2}\left(\alpha_{\max }^{m}-\alpha_{\min }^{m}\right)\left(1+\cos \left(\frac{T_{\operatorname{cur}}}{T_{m}} \pi\right)\right)
$$

　　其中 $a^m_{\max}$ 和 $a^m_{\min}$ 分别为第 $m$ 个周期中学习率的上界和下界，可以随着 $m$ 的增 大而逐渐降低；$T_{cur}$ 为从上次重启之后的回合（Epoch）数。$T_{cur}$ 可以取小数，比如 0.1、0.2 等，这样可以在一个回合内部进行学习率衰减。重启周期 $T_m$ 可以随着 重启次数逐渐增加，比如 $T_m=T_{m-1} \times k$，其中 $k\ge 1$ 为放大因子。

　　当 $a^m_{\max}=\alpha_0$ 和 $a^m_{\min}=0$，并不能重启时，此时上式就退化为余弦衰减。

　　假设初始学习率为 1，以下是这两种周期性学习率调整的示例：

<p align="center">
<img src="/img/media/15858011224575.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">周期性学习率调整</em>
</p>


### 3.3 自适应学习率
　　在标准的梯度下降法中，每个参数在每次迭代时都使用相同的学习率。由于每个参数的维度上收敛速度都不相同，因此根据不同参数的收敛情况分别设置学习率。

#### 3.3.1 AdaGrad
　　AdaGrad（Adaptive Gradient）算法是借鉴 l2 正则化的思想，每次迭代时自适应地调整每个参数的学习率。在第 $t$ 次迭代时，先计算每个参数梯度平方的累计值：

$$
G_{t}=\sum_{\tau=1}^{t} \mathbf{g}_{\tau} \odot \mathbf{g}_{\tau}
$$

　　其中 $\odot$ 是按元素乘积，$\boldsymbol{g}_{\tau} \in \mathbb{R}^{\mid\theta\mid}$ 是第 $\tau$ 次迭代时的梯度。

　　AdaGrad 算法的参数更新差值为

$$
\Delta \theta_{t}=-\frac{\alpha}{\sqrt{G_{t}+\epsilon}} \odot \boldsymbol{g}_{t}
$$

　　其中 $\alpha$ 是初始的学习率，$\epsilon$ 是为了保持数值稳定性而设置的非常小的常数，一般取值 $e^{-7}$ 到 $e^{-10}$。 此外，这里的开平方、除、加运算都是按元素进行的操作。

　　在 AdaGrad 算法中，如果某个参数的偏导数累积比较大，其学习率相对较小；相反，如果其偏导数累积较小，其学习率相对较大。但整体是随着迭代次数的增加，$G_t$ 开始增大，学习率逐渐缩小。

　　AdaGrad 算法的缺点是在经过一定次数的迭代依然没有找到最优点时，由于这时的学习率已经非常小，很难再继续找到最优点。

#### 3.3.2 RMSprop
　　RMSprop算法是 Geoff Hinton 提出的一种自适应学习率的方法，可以在有些情况下避免 AdaGrad 算法中学习率不断单调下降以至 于过早衰减的缺点。

　　RMSprop 算法首先计算每次迭代梯度 $g_t$ 平方的指数衰减移动平均，

$$
\begin{aligned} G_{t} &=\beta G_{t-1}+(1-\beta) \mathbf{g}_{t} \odot \mathbf{g}_{t} \\ &=(1-\beta) \sum_{\tau=1}^{t} \beta^{t-\tau} \mathbf{g}_{\tau} \odot \mathbf{g}_{\tau} \end{aligned}
$$

　　RMSprop 算法的参数更新差值为

$$
\Delta \theta_{t}=-\frac{\alpha}{\sqrt{G_{t}+\epsilon}} \odot \boldsymbol{g}_{t}
$$

　　其中 $\alpha$ 是初始的学习率，比如 0.001。

　　从上式可以看出，RMSProp 算法和 AdaGrad 算法的区别在于 $G_t$ 的计算由累 积方式变成了指数衰减移动平均。在迭代过程中，每个参数的学习率并不是呈衰减趋势，既可以变小也可以变大（动量法）。

#### 3.3.3 AdaDelta
　　AdaDelta（算）法也是 AdaGrad 算法的一个改进. 和 RMSprop 算法类似，AdaDelta 算法通过梯度平方的指数衰减移动平均来调整学习率。此外，AdaDelta 算法还引入了每次参数更新差值 $\Delta \theta$ 的平方的指数衰减权移动平均。

　　第 $t$ 次迭代时，参数更新差值 $\Delta \theta$ 的平方的指数衰减权移动平均为

$$
\Delta X_{t-1}^{2}=\beta_{1} \Delta X_{t-2}^{2}+\left(1-\beta_{1}\right) \Delta \theta_{t-1} \odot \Delta \theta_{t-1}
$$

　　其中 $\beta_1$ 为衰减率。此时 $\Delta \theta_t$ 还未知，因此只能计算到 $\Delta X_{t-1}$。

　　AdaDelta 算法的参数更新差值为

$$
\Delta \theta_{t}=-\frac{\sqrt{\Delta X_{t-1}^{2}+\epsilon}}{\sqrt{G_{t}+\epsilon}} \mathbf{g}_{t}
$$

　　其中 $G_t$ 的计算方式和 RMSprop 算法一样，$\Delta X_{t-1}^2$ 为参数更新差值 $\Delta \theta$ 的指数衰减权移动平均.

　　从上式可以看出，AdaDelta 算法将 RMSprop 算法中的初始学习率 $\alpha$ 改为动 态计算的 $\sqrt{\Delta X_{t-1}^{2}}$，在一定程度上平抑了学习率的波动.

## 4. 梯度估计修正
　　除了调整学习率之外，还可以进行梯度估计（Gradient Estimation）的修正。从图7.3看出，在随机（小批量）梯度下降法中，如果每次选取样本数量比较小，损失会呈现振荡的方式下降。也就是说，随机梯度下降方法中每次迭代的梯度估计和整个训练集上的最优梯度并不一致，具有一定的随机性。一种有效地缓解梯度估计随机性的方式是通过使用最近一段时间内的平均梯度来代替当前时刻的随机梯度来作为参数更新的方向，从而提高优化速度。


#### 4.1 动量法（Momentum）
　　动量（Momentum）是模拟物理中的概念. 一般而言，一个物体的动量指的是这个物体在它运动方向上保持运动的趋势，是物体的质量和速度的乘积。动量法（Momentum Method）是用之前积累动量来替代真正的梯度，每次迭代的梯度可以看作是加速度。

　　在第 $t$ 次迭代时，计算负梯度的“加权移动平均”作为参数的更新方向，

$$
\Delta \theta_{t}=\rho \Delta \theta_{t-1}-\alpha \mathbf{g}_{t}=-\alpha \sum_{\tau=1}^{t} \rho^{t-\tau} \mathbf{g}_{\tau}
$$

　　其中 $\rho$ 为动量因子，通常设为 0.9，$\alpha$ 为学习率。

　　这样，每个参数的实际更新差值取决于最近一段时间内梯度的加权平均值。当某个参数在最近一段时间内的梯度方向不一致时，其真实的参数更新幅度变小；相反，当在最近一段时间内的梯度方向都一致时，其真实的参数更新幅度变大，起到加速作用。

　　一般而言，在迭代初期，梯度方向都比较一致，动量法会起到加速作用，可以更快地到达最优点。在迭代后期，梯度方向会不一致，在收敛值附近振荡，动量法会起到减速作用，增加稳定性。从某种角度来说，当前梯度叠加上部分的上次梯度，一定程度上可以近似看作二阶梯度。
 
#### 4.2 Nesterov 加速梯度
　　Nesterov 加速梯度（Nesterov Accelerated Gradient，NAG），也叫 Nesterov 动量法（Nesterov Momentum）是一种对动量法的改进。

　　在动量法中，实际的参数更新方向 $\Delta \theta_t$ 为上一步的参数更新方向 $\Delta \theta_{t-1}$ 和当 前梯度的反方向 $-g_t$ 的叠加。这样，$$\Delta \theta_t$$ 可以被拆分为两步进行，先根据 $\Delta \theta_{t-1}$ 更新一次得到参数 $\hat{\theta}$，再用 $-g_t$ 进行更新。

$$
\begin{aligned} \hat{\theta} &=\theta_{t-1}+\rho \Delta \theta_{t-1} \\ \theta_{t} &=\hat{\theta}-\alpha \mathbf{g}_{t} \end{aligned}
$$

　　其中梯度 $g_t$ 为点 $\Delta \theta_{t-1}$ 上的梯度，因此在第二步更新中有些不太合理。更合理的更新方向应该为 $\hat{\theta}$ 上的梯度。

　　这样，合并后的更新方向为

$$
\Delta \theta_{t}=\rho \Delta \theta_{t-1}-\alpha g_{t}\left(\theta_{t-1}+\rho \Delta \theta_{t-1}\right)
$$

　　其中 $g_t\left(\theta_{t-1}+\rho \Delta \theta_{t-1}\right)$ 表示损失函数在点 $\hat{\theta}=\theta_{t-1}+\rho \Delta \theta_{t-1}$ 上的偏导数。

　　下图给出了动量法和 Nesterov 加速梯度在参数更新时的比较：

<p align="center">
<img src="/img/media/15845376355213.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">动量法和 Nesterov 在更新时的比较</em>
</p>




#### 4.3 梯度截断
　　在深度神经网络或循环神经网络中，除了梯度消失之外，**梯度爆炸**也是影响学习效率的主要因素。在基于梯度下降的优化过程中，如果梯度突然增大，用大的梯度更新参数反而会导致其远离最优点。为了避免这种情况，当梯度的模大于一定阈值时，就对梯度进行截断，称为梯度截断（Gradient Clipping）。

<p align="center">
<img src="/img/media/15858018707783.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">梯度爆炸问题示例</em>
</p>

　　上图给出了一个循环神经网络的损失函数关于参数的曲面。图中的曲面为只有一个隐藏神经元的循环神经网络 $h_t = \sigma \left( w h_{t-1}  + b \right)$ 的损失函数，其中 $w$ 和 $b$ 为参数．假如 $h_0$ 初始值为 0.3，损失函数为 $L=\left(h_{100} - 0.65 \right)^2$。从上图中可以看出，损失函数关于参数 $w$, $b$ 的梯度在某个区域会突然变大。

　　梯度截断是一种比较简单的启发式方法，把梯度的模限定在一个区间，当梯度的模小于或大于这个区间时就进行截断。一般截断的方式有以下几种：

　　**按值截断**：在第 $t$ 次迭代时，梯度为 $g_t$，给定一个区间 $\left[a,b\right]$，如果一个参数的梯度小于时，就将其设为 $a$；如果大于 $b$ 时，就将其设为 $b$。

$$
\boldsymbol{g}_{t}=\max \left(\min \left(\boldsymbol{g}_{t}, b\right), a\right)
$$

　　**按模截断**：是将梯度的模截断到一个给定的截断阈值 $b$。如果 $\left\|\boldsymbol{g}_{t}\right\|^2 \le b$，保持 $g_t$ 不变。如果 $\left\|\boldsymbol{g}_{t}\right\|^2 > b$，令

$$
\boldsymbol{g}_{t}=\frac{b}{\left\|\boldsymbol{g}_{t}\right\|} \boldsymbol{g}_{t}
$$

　　截断阈值 $b$ 是一个超参数，也可以根据一段时间内的平均梯度来自动调整。实验中发现，训练过程对阈值 $b$ 并不十分敏感，通常一个小的阈值就可以得到很好的结果。

## 5. 综合方法
### 5.1 Adam
　　自适应动量估计（Adaptive Moment Estimation，Adam）算法可以看作是动量法和 RMSprop 算法的结合，不但使用动量作为参数更新方向，而且可以自适应调整学习率。

　　Adam 算法一方面计算梯度平方 $g^2_t$ 的指数加权平均（和 RMSprop 算法类 似），另一方面计算梯度 $g_t$ 的指数加权平均（和动量法类似）。

$$
\begin{array}{c}M_{t}=\beta_{1} M_{t-1}+\left(1-\beta_{1}\right) g_{t} \\ G_{t}=\beta_{2} G_{t-1}+\left(1-\beta_{2}\right) g_{t} \odot g_{t}\end{array}
$$

　　其中 $\beta_1$ 和 $\beta_2$ 分别为两个移动平均的衰减率，通常取值为 $\beta_1=0.9$，$\beta_2$。

　$M_t$ 可以看作是梯度的均值（一阶矩），$G_t$ 可以看作是梯度的未减去均值的方 差（二阶矩）.

　　假设 $M_0=0$, $G_0=0$，那么在迭代初期 $M_t$ 和 $G_t$ 的值会比真实的均值和方差要小. 特别是当 $\beta_1$ 和 $\beta_2$ 都接近于 1 时，偏差会很大。因此，需要对偏差进行修正。

$$
\hat{M}_{t}=\frac{M_{t}}{1-\beta_{1}^{t}}
$$

$$
\hat{G}_{t}=\frac{G_{t}}{1-\beta_{2}^{t}}
$$

　　Adam 算法的参数更新差值为

$$
\Delta \theta_{t}=-\frac{\alpha}{\sqrt{\hat{G}_{t}+\epsilon}} \hat{M}_{t}
$$

　　其中学习率 $\alpha$ 通常设为 0.001，并且也可以进行衰减，比如 $\alpha_{t}=\alpha_{0} / \sqrt{t}$。

　　Adam 算法是 RMSProp 算法与动量法的结合，因此一种自然的 Adam 算法的改进方法是引入 Nesterov 加速梯度，称为 Nadam 算法。

## References
1. [最全的机器学习中的优化算法介绍](https://blog.csdn.net/qsczse943062710/article/details/76763739)
2. [深度学习笔记：优化方法总结 (BGD,SGD,Momentum,AdaGrad,RMSProp,Adam)](https://blog.csdn.net/u014595019/article/details/52989301)
3. [梯度下降算法总结](https://blog.csdn.net/KangRoger/article/details/64622249)
4. [详解梯度下降法的三种形式BGD、SGD以及MBGD](https://zhuanlan.zhihu.com/p/25765735)
5. [深度学习优化函数详解（6）-- adagrad](https://blog.csdn.net/tsyccnh/article/details/76769232)
6. [什么是指数加权平均、偏差修正？](https://www.cnblogs.com/guoyaohua/p/8544835.html)
7. [深度学习——优化器算法Optimizer详解（BGD、SGD、MBGD、Momentum、NAG、Adagrad、Adadelta、RMSprop、Adam）](https://www.cnblogs.com/guoyaohua/p/8542554.html)
8. **《神经网络与深度学习》** 邱锡鹏著
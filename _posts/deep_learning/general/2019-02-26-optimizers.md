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

　　整理一下常用的优化器，能够加速在深度学习中的训练速度（比传统的 GD 好很多）。本文整理的优化器方法主要分为两类：一是调整学习率，使得优化更稳定的；而是梯度估计修正，优化训练速度的。

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
　　常规的梯度下降算法需要使用全量的数据，在深度学习中很难做到使用全量数据，于是采用小批量的方式进行优化。

### 1.1 批量梯度下降（Batch Gradient Descent, BGD）
全量
### 1.2 随机梯度下降量（Stochastic Gradient Descent, SGD）
只用一个
### 1.3 小批量梯度下降法（Mini-Batch Gradient Descent, MBGD）
采用小批量的样本更新

　　影响小批量梯度下降法的主要因素有：
1. 批量大小 $K$
2. 学习率 $\alpha$
3. 梯度估计

　　为了更有效地训练深度神经网络，在标准的小批量梯度下降法的基础上，也经常使用一些改进方法以加快优化速度，比如如何选择批量大小、如何调整学习率以及如何修正梯度估计。我们分别从这三个方面来介绍在神经网络优化中常用的算法。这些改进的优化算法也同样可以应用在批量或随机梯度下降法上。

## 2. 批量大小选择


## 3. 学习率调整
　　学习率是神经网络优化时的重要超参数. 在梯度下降法中，学习率 $\alpha$ 的取值 非常关键，如果过大就不会收敛，如果过小则收敛速度太慢. 常用的学习率调整方法包括学习率衰减、学习率预热、周期性学习率调整以及一些自适应调整学习 率的方法，比如 AdaGrad、RMSprop、AdaDelta 等. 自适应学习率方法可以针对每个参数设置不同的学习率。


### 3.1 固定衰减学习率
* 分段常数衰减（Piecewise Constant Decay）
* 逆时衰减（Inverse Time Decay）
* 指数衰减（Exponential Decay）
* 自然指数衰减（Natural Exponential Decay）
* 余弦衰减（Cosine Decay）


<p align="center">
<img src="/img/media/15845290923557.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">不同学习率衰减方法的比较</em>
</p>


### 3.2 周期性学习率
### 3.2.1 循环学习率
### 3.2.2 SGDR

### 3.3 自适应学习率
　　在标准的梯度下降法中，每个参数在每次迭代时都使用相同的学习率。由于每个参数的维度上收敛速度都不相同，因此根据不同参数的收敛情况分别设置学习率。

### 3.3.1 AdaGrad
　　AdaGrad（Adaptive Gradient）算法是借鉴 l2 正则化的思想，每次迭代时自适应地调整每个参数的学习率。在第 $t$ 次迭代时，先计算每个参数梯度平方的累计值：

$$
G_{t}=\sum_{\tau=1}^{t} \mathbf{g}_{\tau} \odot \mathbf{g}_{\tau}
$$

　　其中 $\odot$ 是按元素乘积，$\boldsymbol{g}_{\tau} \in \mathbb{R}^{|\theta|}$ 是第 $\tau$ 次迭代时的梯度。

　　AdaGrad 算法的参数更新差值为

$$
\Delta \theta_{t}=-\frac{\alpha}{\sqrt{G_{t}+\epsilon}} \odot \boldsymbol{g}_{t}
$$

　　其中 $\alpha$ 是初始的学习率，$\epsilon$ 是为了保持数值稳定性而设置的非常小的常数，一般取值 $e^{-7}$ 到 $e^{-10}$。 此外，这里的开平方、除、加运算都是按元素进行的操作。

　　在 AdaGrad 算法中，如果某个参数的偏导数累积比较大，其学习率相对较小；相反，如果其偏导数累积较小，其学习率相对较大。但整体是随着迭代次数的增加，$G_t$ 开始增大，学习率逐渐缩小。

　　AdaGrad 算法的缺点是在经过一定次数的迭代依然没有找到最优点时，由于这时的学习率已经非常小，很难再继续找到最优点。

### 3.3.2 RMSprop
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

### 3.3.3 AdaDelta
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



### 4.1 动量法（Momentum）
　　动量（Momentum）是模拟物理中的概念. 一般而言，一个物体的动量指的是这个物体在它运动方向上保持运动的趋势，是物体的质量和速度的乘积。动量法（Momentum Method）是用之前积累动量来替代真正的梯度，每次迭代的梯度可以看作是加速度。

　　在第 $t$ 次迭代时，计算负梯度的“加权移动平均”作为参数的更新方向，

$$
\Delta \theta_{t}=\rho \Delta \theta_{t-1}-\alpha \mathbf{g}_{t}=-\alpha \sum_{\tau=1}^{t} \rho^{t-\tau} \mathbf{g}_{\tau}
$$

　　其中 $\rho$ 为动量因子，通常设为 0.9，$\alpha$ 为学习率。

　　这样，每个参数的实际更新差值取决于最近一段时间内梯度的加权平均值。当某个参数在最近一段时间内的梯度方向不一致时，其真实的参数更新幅度变小；相反，当在最近一段时间内的梯度方向都一致时，其真实的参数更新幅度变大，起到加速作用。

　　一般而言，在迭代初期，梯度方向都比较一致，动量法会起到加速作用，可以更快地到达最优点。在迭代后期，梯度方向会不一致，在收敛值附近振荡，动量法会起到减速作用，增加稳定性。从某种角度来说，当前梯度叠加上部分的上次梯度，一定程度上可以近似看作二阶梯度。
 
### 4.2 Nesterov 加速梯度
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

　　其中 $\mathfrak{g}_t\left(\theta_{t-1}+\rho \Delta \theta_{t-1}\right)$ 表示损失函数在点 $\hat{\theta}=\theta_{t-1}+\rho \Delta \theta_{t-1}$ 上的偏导数。

　　下图给出了动量法和 Nesterov 加速梯度在参数更新时的比较：

![](/img/media/15845376355213.jpg)


### 4.3 梯度截断



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
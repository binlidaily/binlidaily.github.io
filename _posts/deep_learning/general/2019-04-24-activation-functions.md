---
layout: post
title: Activation Functions
subtitle: 激活函数
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　激活函数（Activation Function）在神经网络和深度学习中起着很重要的作用，主要引入一些非线性的成分，增强了网络的表示能力和学习能力。Bengio 教授将[激活函数定义](https://arxiv.org/pdf/1603.00391v3.pdf)为：激活函数是映射 $h$：$\mathrm{R} \rightarrow \mathrm{R}$，且几乎处处可导。

　　激活函数需要具备以下几个性质：
1. 连续并可导（允许少数点上不可导）的非线性函数。可导的激活函数可以 直接利用数值优化的方法来学习网络参数。
2. 激活函数及其导函数要尽可能的简单，有利于提高网络计算效率。
3. 激活函数的导函数的值域要在一个合适的区间内，不能太大也不能太小，否则会影响训练的效率和稳定性。

## 1. 激活函数的饱和
### 1.1 软饱和
　　激活函数要求在定义域内处处可导，当如果只有在极限条件下偏导数才等于 $0$ 的函数称之为软饱和。当激活函数 $f^{\prime}(x)$ 满足下式时称为左侧软饱和：

$$
\lim _{n \rightarrow-\infty} f^{\prime}(x)=0
$$

　　当激活函数 $f^{\prime}(x)$ 满足下式时称为右侧软饱和：

$$
\lim _{n \rightarrow+\infty} f^{\prime}(x)=0
$$

　　同时满足左饱和和右饱和的为软饱和。

### 1.2 硬饱和
　　不用到达极限条件，只需要以一个常数 $C$ 作为临界就能达到偏导数为 $0$ 的称为硬饱和。对于任意的 $x$ 满足下式的函数被称为左侧硬饱和：

$$
f^{\prime}(x)=0, \text{当} |x|<c, c \text{为常数}
$$

　　对于任意的 $x$ 满足下式的函数被称为右侧硬饱和：

$$
f^{\prime}(x)=0, \text{当} |x|>c, c \text{为常数}
$$


## 2. Sigmoid Function
　　Sigmoid 是一个形状为 $S$ 的激活函数

$$
f(x)=\frac{1}{1+e^{-x}}
$$

<p align="center">
<img src="/img/media/15560939318918.jpg" width="520">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">Sigmoid 函数和求导结果</em>
</p>

　　Sigmoid 求导过程：

$$
\begin{aligned} \sigma^{\prime}(z) &=\left(\frac{1}{1+e^{-z}}\right)^{\prime} \\ &=(-1)\left(1+e^{-z}\right)^{(-1)-1} \cdot\left(e^{-z}\right)^{\prime} \\ &=\frac{1}{\left(1+e^{-z}\right)^{2}} \cdot\left(e^{-z}\right) \\ &=\frac{1}{1+e^{-z}} \cdot \frac{e^{-z}}{1+e^{-z}} \\ &=\frac{1}{1+e^{-z}} \cdot\left(1-\frac{1}{1+e^{-z}}\right) \\ &=\sigma(z)(1-\sigma(z)) \end{aligned}
$$

**优点**：
1. Sigmoid 函数输出映射在 $(0, 1)$ 之间，范围有限，且单调连续，可以做输出层。
2. 求导容易：$f^{\prime}(x)=f(x) \cdot(1-f(x))$。

**缺点**：
1. 由于其软饱和性，容易产生梯度消失，导致训练出现问题。
2. 其输出不是以 $0$ 为中心的。


### 2.1 为什么 Sigmoid 会出现梯度消失的现象呢？

　　Sigmoid 函数将数值映射到 0 到 1 之间，那么通过链式法则，多个 $(0,1)$ 之间的数相乘，得到的结果就会变得很小了。神经网络的反向传播是逐层对函数偏导相乘，因此当神经网络层数非常深的时候，最后一层产生的偏差就因为乘了很多的小于1的正实数而越来越小，最终就会变为 0，从而导致层数比较浅的权重没有更新，这就是梯度消失。


## 3. Tanh 函数
　　Tanh 函数是也一种 Sigmoid 型函数，其定义为：

$$
\tanh (x)=\frac{\exp (x)-\exp (-x)}{\exp (x)+\exp (-x)} = \frac{1-e^{-2 x}}{1+e^{-2 x}}
$$

　　Tanh 函数可以看作是放大并平移的 Logistic 函数，其值域是 $(−1, 1)$：

<p align="center">
<img src="/img/media/15842662494889.jpg" width="400">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">tanh 函数图像</em>
</p>


**优点**：
1. 比 Sigmoid 函数收敛速度更快。
2. 相比 Sigmoid，Tanh 是以 $0$ 为中心。
    1. 非零中心化的输出会使得其后一层的神经元的输入发生偏置偏移（Bias Shift），并进一步使得梯度下降的收敛速度变慢

**缺点**：
1. 没有改变 Sigmoid 的最大问题——由于软饱和性产生梯度消失问题。

## 4. 修正线性单元（Rectified Linear Unit, ReLU）
　　ReLU 是目前深度神经网络中经常使用的激活函数，实际上是一个斜坡（ramp）函数，其定义为：

$$
\begin{aligned} \operatorname{ReLU}(x) &=\left\{\begin{array}{ll}x & x \geq 0 \\ 0 & x<0\end{array}\right.\\ &=\max (0, x) \end{aligned}
$$

<p align="center">
<img src="/img/media/15842665839689.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">ReLU、Leaky ReLU、ELU 以及 Softplus 函数</em>
</p>


**优点**：
1. 相比 Sigmoid 和 Tanh，ReLU 在 SGD 中能够更快速的收敛，有说法是因为其有线性、非饱和的特点。
2. Sigmoid 和 tanh 涉及较多费时的操作，如指数操作，而 ReLU 具有更加简单的计算。
    1. 采用 ReLU 的神经元只需要进行加、乘和比较的操作，计算上更加高效
3. 相比于 Sigmoid 型函数的两端饱和，ReLU 函数为左饱和函数， 且在 $x > 0$ 时导数为 1，在一定程度上缓解了神经网络的梯度消失问题
4. ReLU 函数被认为有生物上的解释性，比如单侧抑制、宽兴奋边界（即兴奋程度也可以非常高）
5. 在没有无监督预训练的时候也能有较好的效果。🤔
<p align="center">
<img src="/img/media/15561085558892.jpg" width="400">
</p>
1. 为神经网络提供了**稀疏表达的能力**。

**缺点**：
1. ReLU 函数的输出是非零中心化的，给后一层的神经网络引入偏置偏移，会 影响梯度下降的效率
2. 由于负数部分恒为 0，会导致一些神经元无法激活，随着逐步的训练，可能出现神经元死亡，即无法更新的情况（可通过设置小学习率部分解决）。
    * 如果发生这种情况，那么从这一刻开始途径该神经元的梯度都变为零，即 ReLU 神经元在训练中不可逆的死亡了，称为死亡 ReLU 问题。

### 4.1 带泄露的 ReLU（Leaky ReLU）
　　为了解决 ReLU 可能导致一些神经元死掉，提出了 Leaky ReLU，具体公式如下：

$$
\begin{aligned} \text { LeakyReLU }(x) &=\left\{\begin{array}{ll}x & \text { if } x>0 \\ \gamma x & \text { if } x \leq 0\end{array}\right.\\ &=\max (0, x)+\gamma \min (0, x) \end{aligned}
$$

　　其中 $\gamma$ 是一个很小的参数，例如 0.01（用来控制 Leaky 的程度，可以作为超参，也可以用网络自己学习）。当 $\gamma < 1$ 时，带泄露的 ReLU 可以写为：


$$
\text{LeakyReLU} (x) = \max(x, \gamma x)
$$

　　相当于是一个比较简单的 maxout 单元。

## 5. 带参数的 ReLU（Parametric ReLU, PReLU）
　　带参数的 ReLU 引入一个可学习的参数，不同神经元可以有不同的参数，对于第 $i$ 个神经元，其 PReLU 的定义为：

$$
\begin{aligned} \operatorname{PReLU}_{i}(x) &=\left\{\begin{array}{ll}x & \text { if } x>0 \\ \gamma_{i} x & \text { if } x \leq 0\end{array}\right.\\ &=\max (0, x)+\gamma_{i} \min (0, x) \end{aligned}
$$

　　其中 $\gamma_i$ 为 $x \le 0$ 时函数的斜率。因此，PReLU 是非饱和函数。PReLU 可以允许不同神经元具有不同的参数，也可以一组神经元共享一个参数。
* 如果 $\gamma_i = 0$，那么 PReLU 就退化为 ReLU
* 如果 $\gamma_i$ 为一个很小的常数，则 PReLU 可以看作带泄露的 ReLU 

## 5. 指数线性单元（Exponential Linear Unit, ELU）
　　ELU 是一个近似的零中心化的非线性函数，其定义为

$$
\begin{aligned} \operatorname{ELU}(x) &=\left\{\begin{array}{ll}x & \text { if } x>0 \\ \gamma(\exp (x)-1) & \text { if } x \leq 0\end{array}\right.\\ &=\max (0, x)+\min (0, \gamma(\exp (x)-1)) \end{aligned}
$$

　　其中 $\gamma \ge 0$ 是一个超参数，决定 $x \le 0$ 时的饱和曲线，并调整输出均值在 0 附近。

## 6. Softplus 函数
　　Softplus 函数可以看作是 Rectifier 函数的平滑版本，其定义为：

$$
\text { Softplus }(x)=\log (1+\exp (x))
$$

　　Softplus 函数其导数刚好是 Logistic 函数。Softplus 函数虽然也具有单侧抑制、宽兴奋边界的特性，却没有稀疏激活性。

## 7. Swish 函数
　　Swish 函数是一种自门控（Self-Gated）激活函数，定义为：

$$
\operatorname{swish}(x)=x \sigma(\beta x)
$$

　　其中 $\sigma(\cdot)$ 为 Logistic 函数，$\beta$ 为可学习的参数或一个固定超参数。$\sigma(\cdot) \in (0,1)$ 可以看做一种软性的门控机制：
1. 当 $\sigma(\beta x)$ 接近于 1 时，门处于“开”状态，激活函数的输出近似于 x 本身
2. 当 $\sigma(\beta x)$ 接近于 0 时，门的状态为“关”，激活函数的输出近似于 0

<p align="center">
<img src="/img/media/15843219654032.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">Swish 函数</em>
</p>


　　从上图可知：
1. 当 $\beta = 0$ 时，Swish 函数变成线性函数 $x / 2$
2. 当 $\beta = 1$ 时，Swish 函数在 $x>0$ 时近似线性，在 $x < 0$ 时近似饱和，同时具有一定的非单调性. 当 $\beta \rightarrow + \infty$ 时，$\sigma(\beta x)$ 趋向于离散的 0-1 函数，Swish 函数近似为 ReLU 函数.

　　因此，Swish 函数可以看作是线性函数和 ReLU 函数之间的非线性插值函数，其程度由参数 $\beta$ 控制.

## 8. 高斯误差线性单元（Gaussian Error Linear Unit, GELU）
　　高斯误差线性单元和 Swish 函数比较类似，也是一种通过门控机制来调整其输出值的激活函数：

$$
\operatorname{GELU}(x)=x P(X \leq x)
$$

　　其中 $P(X \le x)$ 是高斯分布 $\mathcal{N}\left(\mu, \sigma^{2}\right)$ 的累积分布函数，其中 $\mu$, $\sigma$ 为超参数，一般设 $\mu=0$, $\sigma=1$ 即可。由于高斯分布的累积分布函数为 S 型函数，因此 GELU 可以用 Tanh 函数或 Logistic 函数来近似：

$$
\begin{array}{l}\operatorname{GELU}(x) \approx 0.5 x\left(1+\tanh \left(\sqrt{\frac{2}{\pi}}\left(x+0.044715 x^{3}\right)\right)\right) \\ \operatorname{GELU}(x) \approx x \sigma(1.702 x)\end{array}
$$

　　当使用 Logistic 函数来近似时，GELU 相当于一种特殊的 Swish 函数。

## 9. Maxout 单元
　　Maxout 单元也是一种分段线性函数. Sigmoid 型 函数、ReLU 等激活函数的输入是神经元的净输入 $z$，是一个标量. 而 Maxout 单元 的输入是上一层神经元的全部原始输出，是一个向量 $\boldsymbol{x}=\left[x_{1} ; x_{2} ; \cdots ; x_{D}\right]$。

　　每个 Maxout 单元有 $K$ 个权重向量 $\boldsymbol{w}_k \in \mathbb{R}^{D}$ 和偏置 $b_k(1\le k\le K)$。对于输入 $\boldsymbol{x}$，可以得到 $K$ 个净输入  $z_k(1\le k\le K)$。

$$
z_{k}=\boldsymbol{w}_{k}^{\top} \boldsymbol{x}+b_{k}
$$

　　其中 $\boldsymbol{w}_{k}=\left[w_{k, 1}, \cdots, w_{k, D}\right]^{\top}$ 为第 $k$ 个权重向量。

　　Maxout 单元的非线性函数定义为

$$
\operatorname{maxout}(\boldsymbol{x})=\max _{k \in[1, K]}\left(z_{k}\right)
$$

　　Maxout 单元不单是净输入到输出之间的非线性映射，而是整体学习输入到输出之间的非线性映射关系。 Maxout 激活函数可以看作任意凸函数的分段线性近似，并且在有限的点上是不可微的。

### 梯度爆炸
解决办法:
- 预训练加微调
- 梯度剪切、权重正则（针对梯度爆炸）
- 使用不同的激活函数
- 使用batchnorm
- 使用残差结构
- 使用LSTM网络


## References
1. [神经网络激活函数汇总（Sigmoid、tanh、ReLU、LeakyReLU、pReLU、ELU、maxout）](https://blog.csdn.net/edogawachia/article/details/80043673)
2. [深度学习系列（8）：激活函数](https://plushunter.github.io/2017/05/12/深度学习系列（8）：激活函数/)
3. [The Activation Function in Deep Learning 浅谈深度学习中的激活函数](https://www.cnblogs.com/rgvb178/p/6055213.html)
4. [深度学习中的激活函数导引](https://zhuanlan.zhihu.com/p/22142013)
5. [详解机器学习中的梯度消失、爆炸原因及其解决方法](https://blog.csdn.net/qq_25737169/article/details/78847691)
6. [深度学习中的激活函数汇总](http://spytensor.com/index.php/archives/23/?qmheji=sq6sf2)
7. 《神经网络与深度学习》邱锡鹏
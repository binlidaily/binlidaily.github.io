---
layout: post
title: Neural Network
subtitle: 神经网络
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　神经网络（Neural Network）是由具有适应性的简单单元组成的广泛并行互连的网络，它的组织能够模拟生物神经系统对真实世界物体所作出的交互反应。

## 1. 神经元模型
### 1.1 感知机
　　最早的神经元模型是由感知机来构建的，感知机工作原理：一个感知机接受几个二进制输入（$x_1, x_2, \dots, x_n$），并产生一个二进制输出。
<p align="center">
  <img width="400" height="" src="/img/media/15554869148437.jpg">
</p>

　　类似于生物神经网络中刺激度到达一个阈值时神经元就被激活，感知机代数形式如下：

$$
\text { output }=\left\{\begin{array}{ll}{0} & {\text { if } \sum_{j} w_{j} x_{j} \leq \text { threshold }} \\ {1} & {\text { if } \sum_{j} w_{j} x_{j}>\text { threshold }}\end{array}\right.
$$

　　可以将多个这样的感知机组合起来提高在深层次上的抽象能力，并且将上述代数形式转化成向量形式方便实现。基于此感知机可以实现“与”、“或”和“与非”等逻辑运算。

### 1.2 S 型神经元
　　为了防止对权重（或者偏置）做微小的变动就会对输出的影响太大，可以采用 Sigmoid 作为激活函数，这样的神经元就叫 S 型神经元。

$$
\sigma(z) \equiv \frac{1}{1+e^{-z}}
$$

### 1.3 神经网络架构
<p align="center">
  <img width="500" height="" src="/img/media/15554863850980.jpg">
</p>

　　由于历史的原因，尽管是由 S 型神经元⽽不是感知器构成，这种多层⽹络有时被称为多层感知器或者 MLP。此类神经网络都是以上一层的输出作为下一层的输入，被称为前馈神经网络（埋头向前，没有回路），而多层结构（两层或更多隐藏层）的网络被称为深度神经网络。

## 2. 反向传播算法
### 2.1 计算输出的矩阵表达形式
　　一般的模型训练都会使用梯度下降来学习权重和偏置，经过发展神经网络采用了反向传播（BackPropagation，BP）算法来快速计算梯度。反向传播的核心是一个对代价函数 $C$ 关于任何权重 $w$（或者偏置 $b$）的偏导 $\partial C / \partial w$ 的表达式。这个表达式告诉我们在改变权重和偏置时，代价函数变化的快慢。

　　首先定义权重的符号，使用 $w_{j k}^{l}$ 表示从 $(l-1)^{\mathrm{th}}$ 层的 $k^{\mathrm{th}}$ 个神经元到 $l^{\mathrm{th}}$ 层的 $j^{\mathrm{th}}$ 个神经元的链接上的权重。

<p align="center">
  <img width="600" height="" src="/img/media/15554908584367.jpg">
</p>

　　接着定义偏置和激活值的符号，我们使⽤ $b_{j}^{l}$ 表⽰在 $l^{\mathrm{th}}$ 层第 $j^{\mathrm{th}}$ 个神经元的偏置，使⽤ $a_{j}^{l}$ 表⽰ $l^{\mathrm{th}}$ 层第 $j^{\mathrm{th}}$ 个神经元的激活值。

<p align="center">
  <img width="330" height="" src="/img/media/15554914280189.jpg">
</p>

　　有了以上的符号基础，就能将 $l^{\mathrm{th}}$ 层第 $j^{\mathrm{th}}$ 个神经元的激活值 $a_{j}^{l}$ 就和 $(l-1)^{\mathrm{th}}$ 层的激活值通过⽅程关联起来：

$$
a_{j}^{l}=\sigma\left(\sum_{k} w_{j k}^{l} a_{k}^{l-1}+b_{j}^{l}\right)
$$

　　其中求和是在 $(l-1)^{\mathrm{th}}$ 层的所有 $k$ 个神经元上进⾏的。以向量形式改写得到：

$$
a^{l}=\sigma\left(w^{l} a^{l-1}+b^{l}\right)
$$

　　这个表达式给出了一种更加全局的思考每层激活值和前一层激活值的关联方式：我们仅仅用权重矩阵作用在激活值上，然后加上一个偏置向量，最后作用 $\sigma$ 函数。在这里我们继续定义上式$\sigma$ 函数传入的部分，即**带权输入**：

$$
z^{l} \equiv w^{l} a^{l-1}+b^{l}
$$

### 2.2 关于代价函数的两个假设
　　反向传播的目标是计算代价函数 $C$ 分别关于 $w$ 和 $b$ 的偏导数 $\partial C / \partial w$ 和 $\partial C / \partial b$，二次代价函数如下：

$$
C=\frac{1}{2 n} \sum_{x}\left\|y(x)-a^{L}(x)\right\|^{2}
$$

　　其中 $n$ 是训练样本的总数；求和运算遍历了每个训练样本 $x$；$y = y(x)$ 是对应的⽬标输出；$L$ 表⽰⽹络的层数；$a^L = a^L (x)$ 是当输⼊是 $x$ 时的⽹络输出的激活值向量。

　　为了应用反向传播，我们对代价函数 $C$ 有两个假设，第一个假设是代价函数可以被写成一个在每个训练样本 $x$ 上的代价函数 $C_x$ 的均值 $C=\frac{1}{n} \sum_{x} C_{x}$，其中对每个独立的训练样本其代价是 $C_{x}=\frac{1}{2}\left\|y-a^{L}\right\|^{2}$。需要这个假设是因为反向传播实际上是对一个独立的训练样本计算了 $\partial C_{x} / \partial w$ 和 $\partial C_{x} / \partial b$，然后通过在所有训练样本上平均化获得 $\partial C / \partial w$ 和 $\partial C / \partial b$。

　　第二个假设是代价可以写成神经网络输出的函数：

<p align="center">
  <img width="400" height="" src="/img/media/15555013843268.jpg">
</p>

　　⼆次代价函数满⾜这个要求，因为对于⼀个单独的训练样本 $x$ 其⼆次代价函数可以写作：

$$
C=\frac{1}{2}\left\|y-a^{L}\right\|^{2}=\frac{1}{2} \sum_{j}\left(y_{j}-a_{j}^{L}\right)^{2}
$$

　　这是输出的激活值函数。

### 2.3 反向传播的四个基本方程
　　反向传播其实是对权重和偏置变化影响代价函数过程的理解，最终极的含义其实就是计算偏导 $\partial C / \partial w_{j k}^{l}$ 和 $\partial C / \partial b_{j}^{l}$。在计算这些值前，我们先引入一个中间量，$\delta_{j}^{l}$，其被称为 $l^{t h}$ 层第 $j^{t h}$ 个神经元上的**误差**。反向传播将给出计算误差 $\delta_{j}^{l}$ 的流程，然后将其关联到计算 $\partial C / \partial w_{j k}^{l}$ 和 $\partial C / \partial b_{j}^{l}$ 上。

　　我们定义 $l$ 层的第 $j^{t h}$ 个神经元上的误差 $\delta_{j}^{l}$ 为：

$$
\delta_{j}^{l} \equiv \frac{\partial C}{\partial z_{j}^{l}}
$$

　　基于以上的定义，我们定义第一个方程，输出层误差的方程 $\delta^{L}$：每个元素定义如下：

$$
\delta_{j}^{L}=\frac{\partial C}{\partial a_{j}^{L}} \sigma^{\prime}\left(z_{j}^{L}\right)  \tag{BP1}
$$

　　其中右式第一项 $\partial C / \partial a_{j}^{L}$ 表示代价随着 $j^{t h}$ 输出激活值的变化而变化的速度，假如 $C$ 不太依赖⼀个特定的输出神经元 $j$，那么 $\delta_{j}^{L}$ 就会很⼩，这也是我们想要的效果。右式第二项 $\sigma^{\prime}\left(z_{j}^{L}\right)$ 刻画了在 $z_{j}^{L}$ 处激活函数 $\sigma$ 变化的速度。如果用矩阵形式表示方程（BP1）：

$$
\delta^{L}=\nabla_{a} C \odot \sigma^{\prime}\left(z^{L}\right) \tag{BP1a}
$$

　　第二个方程，使用下一层的误差 $\delta^{l+1}$ 来表示当前层的误差 \delta^{l}：

$$
\delta^{l}=\left(\left(w^{l+1}\right)^{T} \delta^{l+1}\right) \odot \sigma^{\prime}\left(z^{l}\right) \tag{BP2}
$$

　　第三个方程，代价函数关于网络中任意偏置的改变率：

$$
\frac{\partial C}{\partial b_{j}^{l}}=\delta_{j}^{l} \tag{BP3}
$$

　　第四个方程，代价函数关于任何一个权重的改变率：

$$
\frac{\partial C}{\partial w_{j k}^{l}}=a_{k}^{l-1} \delta_{j}^{l}  \tag{BP4}
$$


<details><summary markdown="span">四个基本方程的证明</summary>

</details>


<details><summary markdown="span">Appendix</summary>
### Hadmard
　　反向传播算法基于常规的线性代数运算 —— 诸如向量加法，向量矩阵乘法等。但是有⼀个运算不⼤常⻅。特别地，假设 $s$ 和 $t$ 是两个同样维度的向量。那么我们使⽤ $s \odot t$ 来表⽰按元素的乘积。所以 $s \odot t$ 的元素就是 $(s \odot t)_{j}=s_{j} t_{j}$。给个例⼦，

$$
\left[ \begin{array}{l}{1} \\ {2}\end{array}\right] \odot \left[ \begin{array}{l}{3} \\ {4}\end{array}\right]=\left[ \begin{array}{l}{1 * 3} \\ {2 * 4}\end{array}\right]=\left[ \begin{array}{l}{3} \\ {8}\end{array}\right]
$$

　　这种类型的按元素乘法有时候被称为 Hadamard 乘积，或者 Schur 乘积。


### 微积分中的链式法则


</details>

## References
1. [CHAPTER 1: Using neural nets to recognize handwritten digits](http://neuralnetworksanddeeplearning.com/chap1.html)
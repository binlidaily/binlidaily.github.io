---
layout: post
title: Locally Weighted Linear Regression
subtitle: 局部加权线性回归
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　实践过程中纯直线的数据关系比较少，所以线性回归有一定的局限性，标准的线性回归是一种无偏差估计，在计算所有点的时候都是无偏差的计算误差并通过优化方法优化误差，如果针对不同的点能够对误差进行调整便可以一定程度上避免标准线性回归带来的欠拟合现象，也就是引入偏差来降低预测的均方误差，本部分总结下局部加权线性回归的方法。

## 局部加权线性回归

$$
\begin{array}{l}{h\left(x_{o}\right)=x_{o}^{T} \hat{\beta}\left(x_{o}\right)} \\ {\hat{\beta}\left(x_{o}\right)=\text{argmin}_{\beta} \sum_{x, y} w\left(x, x_{o}\right)\left(y-x^{T} \beta\right)^{2}} \\ {w\left(x, x_{o}\right)=e^{-\frac{\left(x-x_{o}\right)^{2}}{2 \tau^{2}}}} \\ {\hat{\beta}\left(x_{o}\right)=\left(X^{T} W X\right)^{-1} X^{T} W y}\end{array}
$$

　　局部加权线回归（Locally Weighted Linear Regression, LWLR）是非参数（non-parametric）回归方法，基于数据的一种模型，在我们做预测的时候需要所有的样本来进行计算。而针对局部加权，可以想象成是很多个简单的普通线性回归在特定小数据集上的组合，如图：

<p align="center">
  <img width="" height="300" src="/img/media/15481642982152.jpg">
</p>

　　那么问题就来了，用特定小数据集来刻画出一个普通线性回归（如图中蓝线），那么对于特定的一个样本 $x_0$，该选用多少个样本去拟合出一个简单的线性回归？学习到 KNN 的想法，我们可以定义一个跨度 $\tau$，即一个离样本 $x_0$ 最近的一个数据子集，不同文献中对这个跨度称呼不同。

　　相较于普通的线性回归，区别在于计算 cost function 时引入了权重。

$$\sum _ { i } {1\over 2}w(x_i, x_0) \left( y_i - x_i  w \right) ^ { 2 }$$

　　其中 $x_0$ 是参考点，那么如何计算其中的 $w(x_i, x_0)$？首先我们需要明确选择的标准，当 $y_i$ 和 $x_i w$ 相差较大时，$w(x_i, x_0)$ 值就需要对应的大，在调整时强调关注这些样本；当 $y_i$ 和 $x_i w$ 相差较小时，$w(x_i, x_0)$ 值就需要对应取较小值，即可以忽略这些拟合得较好的样本。

　　那么一种常用的计算权重的方法如下的公式：

$$w(x, x_0) = \exp \left( - \frac { \left( x - x_0 \right) ^ { 2 } } { 2 \tau ^ { 2 } } \right)$$

　　其中 $\tau$ 是我们人为设的权重，用来控制权重随样本 $x$ 与参考点 $x_0$ 的距离下降的速率。

<p align="center">
  <img width="" height="" src="/img/media/15482226822741.jpg">
</p>

　　可以看到以参考点 $x_0$ 为中心，$\tau$ 能够控制张口（吴恩达的讲义称之为 bandwidth 参数），框出对应的训练样本子集，用来训练 $x_0$ 这个点附近的普通线性回归模型。那么选择合适的 $\tau$ 也是很重要的：

<p align="center">
  <img width="" height="" src="/img/media/15482230316998.jpg">
</p>

　　增大 $\tau$ 的值就会增大



The parameter τ controls how quickly the weight of a training example falls oﬀ with distance of its x (i) from the query point x; τ is called the bandwidth parameter, and is also something that you’ll get to experiment with in your homework.

　　我们可以参考 OLS 的方式来求解 LWLR，首先用矩阵的形式来表示：

$${1\over 2} (W(y - Xw))^T(W(y - Xw))$$

　　其中的 $W$ 是一个对角矩阵，因为 $y - Xw$ 是大小为 $n\times1$ 的向量，$W$ 与之相乘之后不能改变大小，于是必须是方阵，然而只能一个数跟对应下标的数值相乘，于是又必须是一个只有对角线上有值的方阵。

　　对于求偏导，我们利用换元法来计算：

$$v=W(y-Xw)$$

　　类似之前的做法，我们有：

$$f={1\over 2}v:v$$

$$
\begin{aligned}
df &= {1\over2}*2v:dv \\
&= -v:Xdw \\
&= -X^Tv:dw
\end{aligned}
$$

$$
\begin{aligned}
{\partial f}\over{\partial w} &=  -X^Tv \\
&= -X^TW(y-Xw)
\end{aligned}
$$

　　接着我们令偏导为零，$-X^TW(y-Xw)=0$，则：

$$\hat{w} = (X^TWX)^{-1}X^TWy$$


## References
1. [机器学习算法实践-标准与局部加权线性回归](http://pytlab.org/2017/10/24/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E7%AE%97%E6%B3%95%E5%AE%9E%E8%B7%B5-%E6%A0%87%E5%87%86%E4%B8%8E%E5%B1%80%E9%83%A8%E5%8A%A0%E6%9D%83%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92/)
2. [Day 97: Locally weighted regression](https://medium.com/100-days-of-algorithms/day-97-locally-weighted-regression-c9cfaff087fb)
3. [Understanding Locally Weighted Linear Regression](https://datascience.stackexchange.com/questions/16850/understanding-locally-weighted-linear-regression)
4. [Locally Weighted Linear Regression (Loess)](https://xavierbourretsicotte.github.io/loess.html)
5. [Local regression](https://en.wikipedia.org/wiki/Local_regression)
6. [CS229 Notes1](http://cs229.stanford.edu/notes/cs229-notes1.pdf)
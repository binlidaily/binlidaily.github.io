---
layout: post
title: Locally Weighted Linear Regression
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

## 局部加权线性回归（Locally Weighted Linear Regression, LWLR）
![](/img/media/15346068354911.jpg)

局部加权线性回归相较于普通的线性回归，区别在于计算 cost function 时引入了权重。

$$\sum _ { i } {1\over 2}w(x_i, x_0) \left( y_i - x_i  w \right) ^ { 2 }$$

计算权重的时候用如下的公式：
$$w(x, x_0) = \exp \left( - \frac { \left( x - x_0 \right) ^ { 2 } } { 2 \tau ^ { 2 } } \right)$$

其中 $\tau$ 是我们人为设的权重，用来控制权重随距离下降的速率。样本越接近的地方，权重就越小，上式就有这样的效果。

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
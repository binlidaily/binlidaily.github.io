---
layout: post
title: Polynomial Regression
subtitle: 多项式回归算法 
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　多项式要在线性回归的基础上对训练数据做对应的拓展，可以想象成就是线性回归，不过在线性回归之前，我们将输入数据X做了一下多项式的变换。

　　例如，假设我们的输入数据 X 是下面这样：

$$
\mathbf{x}=\left[ \begin{array}{c}{2} \\ {-1} \\ {\frac{1}{3}}\end{array}\right]
$$

　　对于一般的线性回归，我们只要找到对应的参数就可以完成设定了，这里没有将 bias 的 1 加进去。

$$y=a_1x$$

　　那么，如果多项式回归我们设定的阶数是 $3$ 的话，在进行线性回归代入前，我们将 $X$ 转化成多项式形式：

$$
X=\left[ \begin{array}{ccc}{2} & {4} & {8} \\ {-1} & {1} & {-1} \\ {\frac{1}{3}} & {\frac{1}{3^{2}}} & {\frac{1}{3^{3}}}\end{array}\right]
$$


　　那么最后的形式就是：

$$y=\alpha_1x+\alpha_2x^2+\alpha_3x^3$$





## References
1. [Deriving an Incremental Form of the Polynomial Regression Equations](http://erikerlandson.github.io/blog/2012/07/05/deriving-an-incremental-form-of-the-polynomial-regression-equations/)
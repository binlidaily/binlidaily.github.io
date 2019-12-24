---
layout: post
title: Sigmoid Function
subtitle: S 型函数
author: Bin Li
tags: [Mathematics]
image: 
comments: true
published: true
---

　　Sigmoid function 在传统机器学习和深度学习中都很常见，本文介绍其结构、形状，以及一些特性。

## 1. 结构
　　Sigmoid function 可以将实数映射到 $\{0，1\}$ 之间，数学形式如下：

$$
{g(x) }= {1\over{1+e^{-x}}}
$$

　　从式子上可以看出，当 $x$ 接近与无穷大时，分母会接近于 $1$，则整体结果接近与 $1$；当 $x$ 接近于无穷小时，分母接近于无穷大，则整体结果接近于 $0$。这样就可以做二分类问题了。当然，也可以将结果当成概率来看待，概率值大于 $0.5$ 的认为是 $1$ ，小于 $0.5$ 的认为是 $0$.

<p align="center">
    <img width="445" length="" src="/img/media/15068430849483.jpg">
</p>

优点：
1. Sigmoid 函数的输出在 $(0, 1)$ 之间，输出范围有限，优化稳定，可以用作输出层。
2. 连续函数，便于求导。

缺点：
1. Sigmoid  函数在变量取绝对值非常大的正值或负值时会出现饱和现象，意味着函数会变得很平，并且对输入的微小改变会变得不敏感。
2. 在反向传播时，当梯度接近于0，权重基本不会更新，很容易就会出现梯度消失的情况，从而无法完成深层网络的训练。
3. Sigmoid 函数的输出不是 0 均值的，会导致后层的神经元的输入是非 0 均值的信号，这会对梯度产生影响。
4. 计算复杂度高，因为 Sigmoid 函数是指数形式。

## 2. 求导

$$
\begin{aligned} 
g^{\prime}(z) &=\frac{d}{d z} \frac{1}{1+e^{-z}} \\ 
&=\frac{1}{\left(1+e^{-z}\right)^{2}}\left(e^{-z}\right) \\ 
&=\frac{1}{\left(1+e^{-z}\right)^{2}} \cdot\left(\frac{1+e^{-z}}{1+e^{-z}}\cdot e^{-z}\right) \\ 
&=\frac{1}{\left(1+e^{-z}\right)} \cdot\left(1-\frac{1}{\left(1+e^{-z}\right)}\right) \\ 
&=g(z)(1-g(z)) \end{aligned}
$$

---
layout: post
title: Normal Distribution
subtitle:
author: Bin Li
tags: [Mathematics, Probability Theory]
image: 
comments: true
published: true
---

　　正态分布为什么常见？真正原因是中心极限定理（central limit theorem）。

> 多个独立统计量的和的平均值，符合正态分布。
> 大量独立随机变量的和经过适当标准化之后趋近于正态分布，与这些变量原本的分布无关。

　　根据中心极限定理，如果一个事物受到多种因素的影响，不管每个因素本身是什么分布，它们加总后，结果的平均值就是正态分布。

　　那为什么财富明明也受到多种因素的影响，怎么就不是正态分布呢？

　　原来，正态分布只适合各种因素累加的情况，如果这些因素不是彼此独立的，会互相加强影响，那么就不是正态分布了。

　　统计学家发现，如果各种因素对结果的影响不是相加，而是相乘，那么最终结果不是正态分布，而是对数正态分布（log normal distribution），即 $x$ 的对数值 $\log(x)$ 满足正态分布。

![](/img/media/15482158122325.jpg)

　　$\mu$ 是中轴基准线，$\sigma$ 可以看成张口，其值越大，分布曲线张口越大，就越矮胖。

$$
f\left(x | \mu, \sigma^{2}\right)=\frac{1}{\sqrt{2 \pi \sigma^{2}}} e^{-\frac{(x-\mu)^{2}}{2 \sigma^{2}}}
$$

　　标准正态分布的均值是0，标准差是1，但并不意味着均值为0，标准差为1的分布是标准正态分布。T分布的均值也0，标准差也可以为1。决定一个分布是否是标准正态分布的参数还有峰度和偏度，最重要的还是看概率密度函数吧。

## References
1. [正态分布为什么常见？](http://www.ruanyifeng.com/blog/2017/08/normal-distribution.html)
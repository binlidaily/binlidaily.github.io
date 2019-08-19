---
layout: post
title: Laplace Distribution
subtitle:
author: Bin Li
tags: [Mathematics, Probability Theory]
image: 
comments: true
published: true
---

　　 拉普拉斯分布（Laplace Distribution）可以看成是两个指数分布背靠背连在一起，所以它也被称为双指数分布，其中 $\mu$ 是位置参数（控制对称轴在哪个位置），$b>0$ 是尺度参数（控制波峰尖锐程度，数值越小波形越尖）。

$$
\begin{array}{l}{f(x | \mu, b)=\frac{1}{2 b} \exp \left(-\frac{|x-\mu|}{b}\right)} \\ {\quad=\frac{1}{2 b}\left\{\begin{array}{ll}{\exp \left(-\frac{\mu-x}{b}\right)} & {\text { if } x<\mu} \\ {\exp \left(-\frac{x-\mu}{b}\right)} & {\text { if } x \geq \mu}\end{array}\right.}\end{array}
$$


　　不同的参数的波形如下：
<p align="center">
  <img width="" height="" src="/img/media/15656742029911.jpg">
</p>




## References
1. [机器学习：最小二乘、正则化和广义线性模型](https://www.jianshu.com/p/f71848c7aaf3)
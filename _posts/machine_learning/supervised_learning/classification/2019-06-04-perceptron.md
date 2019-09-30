---
layout: post
title: Perceptron
subtitle: 感知机
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---


![-w346](/img/media/15607797105579.jpg)

$$
\begin{aligned} h(\mathbf{x}) &=\operatorname{sign}\left(\left(\sum_{i=1}^{d} w_{i} x_{i}\right)-\text { threshold }\right) \\ &=\operatorname{sign}\left(\left(\sum_{i=1}^{d} w_{i} x_{i}\right)+\underbrace{(-\text { threshold })}_{w_{0}} \cdot \underbrace{(+1)}_{x_{0}}\right) \\ &=\operatorname{sign}\left(\sum_{i=0}^{d} w_{i} x_{i}\right) \\ &=\operatorname{sign}\left(\mathbf{w}^{T} \mathbf{x}\right) \end{aligned}
$$


那么如何找到最合适的那条线呢？

![-w1198](/img/media/15663112216852.jpg)

![-w1190](/img/media/15663113008552.jpg)

知错能改算法。

PLA 什么时候能停下来？找到一条线在这个情况下所有样本都分类正确。 前提是线性可分。

![](/img/media/15663860467640.jpg)

这里能小于是因为有错才更新。

![](/img/media/15663862262701.jpg)

说明 PLA 会更新，最后更新多少轮会停下来。

![](/img/media/15663152785447.jpg)


## Pocket Algorithm
![-w1012](/img/media/15663867895418.jpg)

如果线性可分，Pocket 会比较慢。

## 原始问题

## 对偶问题

## References
1. [林轩田机器学习基石笔记2：PLA算法](https://blog.csdn.net/qq_35044025/article/details/79049992)
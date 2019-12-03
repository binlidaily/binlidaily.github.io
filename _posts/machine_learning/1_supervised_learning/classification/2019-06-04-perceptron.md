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

$$
\begin{aligned} w_{f}^{T} w_{t} &=w_{f}^{T}\left(w_{t-1}+y_{n(t-1)} x_{n(t-1)}\right) \\ & \geq w_{f}^{T} w_{t-1}+\min _{n} y_{n} w_{f}^{T} x_{n} \\ & \geq w_{0}+T \cdot \min _{n} y_{n} w_{f}^{T} x_{n} \\ & \geq T \cdot \min _{n} y_{n} w_{f}^{T} x_{n} \end{aligned}
$$

$$
\begin{aligned}\left\|w_{t}\right\|^{2} &=\left\|w_{t-1}+y_{n(t-1)} x_{n(t-1)}\right\|^{2} \quad \text { using }(3) \\ &=\left\|w_{t-1}\right\|^{2}+2 y_{n(t-1)} w_{t}^{T} x_{n(t-1)}+\left\|y_{n(t-1)} x_{n(t-1)}\right\|^{2} \\ & \leq\left\|w_{t-1}\right\|^{2}+0+\left\|y_{n(t-1)} x_{n(t-1)}\right\|^{2} \quad \text { using }(2) \\ & \leq\left\|w_{t-1}\right\|^{2}+\max _{n}\left\|x_{n}\right\|^{2} \\ & \leq\left\|w_{0}\right\|+T \cdot \max _{n}\left\|x_{n}\right\|^{2}=T \cdot \max _{n}\left\|x_{n}\right\|^{2} \end{aligned}
$$

![](/img/media/15663860467640.jpg)

这里能小于是因为有错才更新。

$$
\begin{aligned} \frac{w_{f}^{T}}{\left\|w_{f}\right\|} \frac{w_{T}}{\left\|w_{T}\right\|} &=\frac{T \cdot \min _{n} y_{n} w_{f}^{T} x_{n}}{\left\|w_{f}^{T}\right\| \cdot\left\|w_{t}\right\|} \\ &=\frac{T \cdot \min _{n} y_{n} w_{f}^{T} x_{n}}{\left\|w_{f}^{T}\right\| \cdot \sqrt{T} \cdot \max _{n}\left\|x_{n}\right\|} \\ & \geq \frac{\sqrt{T} \cdot \min y_{n} w_{f}^{T} x_{n}}{\left\|w_{f}^{T}\right\| \max _{n}\left\|x_{n}\right\| }=\sqrt{T} \cdot \text { constant } \end{aligned}
$$

$$
\frac{w_{f}^{T}}{\left\|w_{f}\right\|} \frac{w_{T}}{\left\|w_{T}\right\|} \leq 1
$$

$$
\begin{aligned} & \frac{\sqrt{T} \cdot \min y_{n} w_{f}^{T} x_{n}}{\left\|w_{f}^{T}\right\| \cdot \max _{n}\left\|x_{n}\right\|} \leq 1 \\ \Leftrightarrow T & \leq \frac{\max _{n}\left\|x_{n}\right\|^{2} \cdot\left\|w_{v}^{T}\right\|^{2}}{\min ^{2} y_{n} w_{f}^{T} x_{n}}=\frac{R^{2}}{\rho^{2}} \end{aligned}
$$

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
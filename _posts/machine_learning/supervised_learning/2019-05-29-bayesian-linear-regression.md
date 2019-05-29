---
layout: post
title: Bayesian Linear Regression
subtitle: 贝叶斯线性回归
tags: [Machine Learning]
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

　　之前整理过[线性回归](https://binlidaily.github.io/2018-06-03-linear-regression/)是从频率统计的角度来解释的，本文通过贝叶斯学派的观点重新解释一下线性回归模型。我们使用概率分布而非点估计来构建线性回归，因变量 $y$ 不是被估计的单个值，而是假设从一个分布中提取而来。贝叶斯线性回归模型如下：

$$
y \sim N\left(w^{T} X, \sigma^{2} I\right)
$$

　　输出 $y$ 是由均值和方差两个特征刻画的正态分布，这**两个值**都可以通过数据求得。贝叶斯线性回归不是找到模型参数的单一最佳值，而是确定模型参数的后验分布。我们根据如下的贝叶斯定理

$$
\text { Posterior }=\frac{\text {Likelihood} * \text{Prior}}{\text {Normalization}}
$$

　　可以得到模型参数的后验概率分布是以样本输入输出作为条件的：

$$
P(w \vert  y, X)=\frac{P(y \vert  w, X) * P(w \vert  X)}{P(y \vert  X)}
$$

　　其中，$P(w\vert y, X)$ 是给定输入和输出时的模型参数的后验概率分布。它等于输出的似然 $P(y\vert w, X)$ 乘以给定输入的参数 $w$ 的先验概率 $P(w\vert X)$ 并且除以归一化常数。


## References
1. [贝叶斯线性回归方法的解释和优点](https://www.jiqizhixin.com/articles/2018-04-25-3)
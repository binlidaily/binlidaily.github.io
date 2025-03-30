---
layout: post
title: Convex Optimization
subtitle: 凸优化
author: "Bin Li"
tags: [Machine Learning]
category: "Optimization"
comments: true
published: true
---

{% include toc.html %}

hoeffding 不等式给出了随机变量的和与其期望值偏差的概率上限。

## 凸优化的一些概念
### 鞍点
　　一个不是局部最小值的驻点（一阶导数为 0 的点）称为鞍点。数学含义是：目标函数在此点上的梯度（一阶导数）值为 0， 但从该点出发的一个方向是函数的极大值点，而在另一个方向是函数的极小值点。

## References
1. [什么是凸函数及如何判断一个函数是否是凸函数](https://www.cnblogs.com/always-fight/p/9377554.html)
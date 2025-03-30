---
layout: post
title: Quasi-Newton's Method
subtitle: 牛顿法
author: Bin Li
tags: [Mathematics]
image: 
comments: true
published: true
---

　　牛顿法每次得带都需要求解复杂的 Hessian 矩阵的逆矩阵导致速度很慢甚至当海森矩阵奇异时可能导致数值计算失败或产生的数值不稳定，于是拟牛顿法 (Quasi-Newton's Method)被提了出来，它使用**正定矩阵**来近似海森矩阵的逆。

<p align="center">
  <img width="330" height="" src="/img/media/1280px-Newton_optimization_vs_grad_descent.svg.png"> 
</p>

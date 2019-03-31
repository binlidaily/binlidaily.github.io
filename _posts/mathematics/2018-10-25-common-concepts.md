---
layout: post
title: 一些没有弄明白的数学概念
subtitle:
author: Bin Li
tags: [Mathematics]
image: 
comments: true
published: true
---

### 自由度
基本上是参数个数减1.

### 极大似然估计

假设 $X​$ 是一随机变量（random variable），$x​$  是它的一个实现（realization）。 

* $P(x;\theta)​$（密度函数）：参数为 $\theta​$ 时 $x​$ 出现的概率。这里的 $\theta​$ 是一个参数（parameter），是固定的，但是可能已知也可能未知。 
* $P(X|\theta)$ （条件概率）：随机变量 $\Theta$ 为 $\theta$ 时，$x$ 出现的概率。这里 $\theta$ 是随机变量 $\Theta$ 的一个实现。随机变量 $\Theta$ 是不确定的，服从一个概率分布。

* $P(x,\theta) $（联合概率）：随机变量 $\Theta$ 为 $\theta$ 且随机变量 $X$ 为 $x$ 的概率。

### 先验概率 vs 后验概率
* 先验概率
    * 事件发生前的预判概率。可以是基于历史数据的统计，可以由背景常识得出，也可以是人的主观观点给出。
    * 一般都是单独事件概率，如 $P(x)$，$P(y)$。
* 后验概率
    * 指某件事已经发生，想要计算这件事发生的原因是由某个因素引起的概率。
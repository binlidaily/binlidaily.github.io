---
layout: post
title: Optimizers
subtitle:
author: Bin Li
tags: [Deep Learning, Machine Learning]
image: 
comments: true
published: true
---

　　整理一下常用的优化器，能够加速在深度学习中的训练速度（比传统的 GD 好很多）。

![](/img/media/15845085574343.jpg)

## 梯度下降法（Gradient Descent）
　　常规的梯度下降算法需要使用全量的数据，在深度学习中很难做到使用全量数据，于是采用小批量的方式进行优化。

### 批量梯度下降（Batch Gradient Descent, BGD）
全量
### 随机梯度下降量（Stochastic Gradient Descent, SGD）
只用一个
### 小批量梯度下降法（Mini-Batch Gradient Descent, MBGD）
采用小批量的样本更新

　　影响小批量梯度下降法的主要因素有：
1. 批量大小 $K$
2. 学习率 $\alpha$
3. 梯度估计

　　为了更有效地训练深度神经网络，在标准的小批量梯度下降法的基础上，也经常使用一些改进方法以加快优化速度，比如如何选择批量大小、如何调整学习率以及如何修正梯度估计。我们分别从这三个方面来介绍在神经网络优化中常用的算法。这些改进的优化算法也同样可以应用在批量或随机梯度下降法上。

## 批量大小选择


## 学习率调整
### 固定衰减学习率
* 分段常数衰减（Piecewise Constant Decay）
* 逆时衰减（Inverse Time Decay）
* 指数衰减（Exponential Decay）
* 自然指数衰减（Natural Exponential Decay）
* 余弦衰减（Cosine Decay）

![](/img/media/15845290923557.jpg)

### 周期性学习率
- [ ] 循环学习率
- [ ] SGDR

### 自适应学习率
#### AdaGrad
#### RMSprop
#### AdaDelta
测试与喜爱

## 梯度估计修正
### 动量法（Momentum）
### Nesterov 加速梯度
### 梯度截断

## 综合方法


## References
1. [最全的机器学习中的优化算法介绍](https://blog.csdn.net/qsczse943062710/article/details/76763739)
2. [深度学习笔记：优化方法总结 (BGD,SGD,Momentum,AdaGrad,RMSProp,Adam)](https://blog.csdn.net/u014595019/article/details/52989301)
3. [梯度下降算法总结](https://blog.csdn.net/KangRoger/article/details/64622249)
4. [详解梯度下降法的三种形式BGD、SGD以及MBGD](https://zhuanlan.zhihu.com/p/25765735)
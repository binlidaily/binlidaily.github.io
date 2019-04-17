---
layout: post
title: Neural Network
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

神经网络（Neural Network）是由具有适应性的简单单元组成的广泛并行互连的网络，它的组织能够模拟生物神经系统对真实世界物体所作出的交互反应。

## 1. 神经元模型
### 1.1 感知机
最早的神经元模型是由感知机来构建的，感知机工作原理：一个感知机接受几个二进制输入（$x_1, x_2, \dots, x_n$），并产生一个二进制输出。
<p align="center">
  <img width="450" height="" src="/img/media/15554869148437.jpg">
</p>

类似于生物神经网络中刺激度到达一个阈值时神经元就被激活，感知机代数形式如下：
$$
\text { output }=\left\{\begin{array}{ll}{0} & {\text { if } \sum_{j} w_{j} x_{j} \leq \text { threshold }} \\ {1} & {\text { if } \sum_{j} w_{j} x_{j}>\text { threshold }}\end{array}\right.
$$

可以将多个这样的感知机组合起来提高在深层次上的抽象能力，并且将上述代数形式转化成向量形式方便实现。基于此感知机可以实现“与”、“或”和“与非”等逻辑运算。

### 1.2 S 型神经元
为了防止对权重（或者 bias）做微小的变动就会对输出的影响太大，可以采用 Sigmoid 作为激活函数，这样的神经元就叫 S 型神经元。

### 1.3 神经网络架构
<p align="center">
  <img width="" height="" src="/img/media/15554863850980.jpg">
</p>

由于历史的原因，尽管是由 S 型神经元⽽不是感知器构成，这种多层⽹络有时被称为多层感知器或者 MLP。此类神经网络都是以上一层的输出作为下一层的输入，被称为前馈神经网络（埋头向前，没有回路）。



## References
1. [CHAPTER 1 Using neural nets to recognize handwritten digits](http://neuralnetworksanddeeplearning.com/chap1.html)
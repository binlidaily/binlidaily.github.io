---
layout: post
title: 误差反向传播算法（Backpropagation）
subtitle: 深度学习的基础
tags: [深度学习]
author: 思成言
comments: true
published: true
bigimg: /img/AI/10-algorithms-machine-learning-engineers-need-to-know-article.jpeg
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

　　机器学习本质是学习一个函数，学习的过程是指找到这个函数中合适的参数。那如何更新参数，则是很重要的问题，一般采用梯度下降法（Gradient Descent）。在深度学习的实际实际应用中，需要更高效的更新参数，于是研究除了链式法则（Chain Rule）。

　　学习过程的目标是最小化损失函数，一轮一轮更新参数。通过拆解，更新参数分为2个部分，前向和后向传播过程：

1. 前向过程：求导后，其实就是输入。

2. 后向传播：主要是因为输出层是确认的，一层一层往回计算，速度会很快。

<p align="center">
  <img width="" height="" src="/img/AI/deeplearning/2025-05-11-误差反向传播算法（Backpropagation）/backpropagation.jpeg">
</p>

　　对于一些可以直接求导的函数，用Gradient Descent还是比较方便，但如果是非线性函数（如pooling等操作），如何进行误差反向传播更新参数？

　　不同的池化函数做法不一样，最大池化，是把结果直接放到最大的位置上。平均池化，是做平均返回等。
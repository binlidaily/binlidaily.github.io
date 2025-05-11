---
layout: post
title: 误差反向传播算法（Backpropagation）
subtitle: 深度学习的基础
tags: [算法]
author: 思成言
comments: true
published: true
bigimg: /img/AI/10-algorithms-machine-learning-engineers-need-to-know-article.jpeg
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

　　两个要点，梯度下降法（Gradient Descent）和链式法则（Chain Rule）。目标是最小化损失函数，一轮一轮更新参数。通过拆解，更新参数分为2个部分，前向和后向传播过程，后向主要是因为输出层是确认的，一层一层往回计算。

<p align="center">
  <img width="" height="" src="/img/AI/deeplearning/2025-05-11-误差反向传播算法（Backpropagation）/backpropagation.jpeg">
</p>
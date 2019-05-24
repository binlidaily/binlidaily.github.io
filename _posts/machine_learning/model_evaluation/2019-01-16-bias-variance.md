---
layout: post
title: Bias and Variance
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---







![-w568](/img/media/15319044453260.jpg)

如上两个数据，会得到完全一样的模型结果，显然模型在这两个数据集上效果是不一样的，那么我们要如何判断这些模型的好坏呢？有一种方法是可以利用预测值 $\hat{y}$ 序列和真实值 $y$ 序列的**相关系数**来衡量。

线性回归有一个问题就是可能出现欠拟合的现象，因为线性回归是具有最小均方误差的**无偏估计**，那么如果出现欠拟合就不能得到最好的预测效果。如果允许引入一些偏差就能降低预测的均方误差，其中一个办法就是局部加权线性回归（Locally Weighted Linear Regression, LWLR）。

无偏估计，也就是说只要你采用这种方法进行估算，估算的结果的期望值（你可以近似理解为很多次估算结果的平均数）既不会大于真实的平均数，也不会小于之。换句话说：你这种估算方法没有系统上的偏差，而产生误差的原因只有一个：随机因素（也就是你的手气好坏造成的）。

[那么为什么有偏效果就更好？](https://www.matongxue.com/madocs/808.html)

![](/img/media/15320525983645.jpg)

如上图所示，有时候会出现这种情况，那么在这种情况下有偏但有效性好（这种情况就是欠拟合的情况），还是可取的。一般情况下，无偏是比有偏好的。

## References
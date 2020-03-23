---
layout: post
title: Normalization
subtitle: 归一化
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　神经网络中有各种归一化算法：Batch Normalization (BN)、Layer Normalization (LN)、Instance Normalization (IN)、Group Normalization (GN)。从公式看它们都差不多，如下式所示：无非是减去均值，除以标准差，再施以线性映射。

$$
y=\gamma\left(\frac{x-\mu(x)}{\sigma(x)}\right)+\beta
$$

　　这些归一化算法的主要区别在于操作的 feature map 维度不同。

逐层归一化一方面可以使得大部分神经层的输入处于不饱和区域，从而让梯度变大，避免梯度消失问题；另一方面还可以使得神经网络 的优化地形（Optimization Landscape）更加平滑，以及使梯度变得更加稳定， 从而允许我们使用更大的学习率，并提高收敛速度。

## 1. Batch Normalization（批归一化）


## References
1. [如何区分并记住常见的几种 Normalization 算法](http://www.tensorinfinity.com/paper_184.html)
2. [机器学习面试的12个基础问题，强烈推荐！](https://mp.weixin.qq.com/s/_jyIhPPBg82f5U6fp1vEig)


---
layout: post
title: Normalization
subtitle:
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

## References
1. [如何区分并记住常见的几种 Normalization 算法](http://www.tensorinfinity.com/paper_184.html)


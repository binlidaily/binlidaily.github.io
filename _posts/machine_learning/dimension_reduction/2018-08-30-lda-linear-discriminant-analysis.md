---
layout: post
title: Linear Discriminant Analysis
subtitle: 线性判别分析
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

线性判别分析（Linear Discriminant Analysis, LDA）是一种经典的线性学习方法，其思想很朴素：给定了训练样本集，设法将样本映射到一条直线上，使得同类样本的投影点尽可能近，不同类样本的投影点尽可能远。对新样本进行预测时，也是映射到改直线上，看离哪一类的样本近就选择对应类别。

## LDA 的思想
LDA是一种监督学习的降维技术，也就是说它的数据集的每个样本是有类别输出的。这点和PCA不同。PCA是不考虑样本类别输出的无监督降维技术。LDA的思想可以用一句话概括，就是“投影后类内方差最小，类间方差最大”。

![](/img/media/15541236020775.jpg)

在我们将上面直观的内容转化为可以度量的问题之前，我们先了解些必要的数学基础知识，这些在后面讲解具体LDA原理时会用到。

协方差可以看成一种特殊的方差，其值越小，数据越不离散。

## References
1. [Linear Discriminant Analysis – Bit by Bit](https://sebastianraschka.com/Articles/2014_python_lda.html)
2. [线性判别分析LDA原理总结](https://www.cnblogs.com/pinard/p/6244265.html)
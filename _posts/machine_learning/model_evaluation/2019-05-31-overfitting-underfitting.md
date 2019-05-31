---
layout: post
title:  Overfitting and Underfitting
subtitle: 过拟合与欠拟合
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

深度学习里面怎么防止过拟合？（data aug；dropout；multi-task learning）如何防止过拟合，我跟他列举了4中主要防止过拟合方法：Early Stopping、数据集扩充、正则化法以及dropout，还详细跟他说了每种方法原理及使用的场景，并解释我在哪些项目里具体用到了这些方法，

1）增大数据集

可能是因为数据集少，导致对训练集过度学习。

直接思路就是扩展数据集，除了常规根据业务特性加入更大范围或者更长时间段的方式外，也可以通过时间窗口滑动、上采样等手段在已有数据集通过一定技巧来产生更多数据。

2）Early stopping

在多轮迭代训练中，在训练效果收敛之前停止训练。简单说，训练时有一个校验集，当在校验集上效果不再提升时，停止训练

3）正则化方法

通过 L1 或 L2 正则，使部分特征权重变小或者权重为 0，降低模型复杂度。

4）Dropout

在神经网络中，随机丢弃一些隐层节点，也是降低模型复杂度的一种方式。
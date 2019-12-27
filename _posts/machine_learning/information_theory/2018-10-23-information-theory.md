---
layout: post
title: Information Theory
subtitle:
author: Bin Li
tags: [Information Theory]
image: 
comments: true
published: true
---


### KL 散度（Kullback-Leibler Divergence）
　　KL 散度（相对熵），是一种**量化两种概率分布 P 和 Q 之间差异的方式**，又叫相对熵。在概率学和统计学上，我们经常会使用一种更简单的、近似的分布来替代观察数据或太复杂的分布。K-L散度能帮助我们度量使用一个分布来近似另一个分布时所损失的信息。

$$
D_{K L}(p(x) \| q(x))=\sum_{x \in X} p(x) \ln \frac{p(x)}{q(x)}
$$


## References
1. [如何理解K-L散度（相对熵）](https://www.jianshu.com/p/43318a3dc715)
2. [熵、交叉熵、相对熵（KL 散度）意义及其关系](https://blog.csdn.net/lanchunhui/article/details/53365438)
---
layout: post
title: Decision Stump
subtitle: 决策树桩
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　决策树桩（Decision Stump）就是单层决策树，意味着对每一列属性进行一次判断，例如下面对 pental length 进行判断就确定其属于什么花：

<p align="center">
  <img width="" height="" src="/img/media/15602214330109.jpg">
</p>

　　从树结构上来看，其由一个内部节点与叶子节点直接相连，用作分类器的决策树桩叶子节点保存这最终的分类结果。

　　从实际意义上来看，决策树桩根据一个属性的单个判断就确定最终的分类结果，比如根据水果形状是否为圆形就判断该水果是不是西瓜，这体现了单一简单的特性，这种特性比较适合做集成学习中的弱学习器，因为其至少比随机的效果好一些，又计算较为容易。

　　从数据公式上看，显然我们需要寻找具有最低错误率的单层决策树，以下定义优化的目标函数为：

$$
\underset{1 \leq i \leq d}{\arg \min } \frac{1}{N} \sum_{n=1}^{N} 1_{y_{n} \neq g_{i}(\mathbf{x})}
$$

　　其中 $i$ 表示属性列，$N$ 为样本集的大小，$d$ 为属性列的个数。


<p align="center">
  <img width="" height="" src="/img/media/15453087717633.jpg">
</p>

<p align="center">
  <img width="" height="" src="/img/media/15453175023379.jpg">
</p>


　　这里就是 Decision Stump 的思想，只从纵向或者横向切一刀，分两类。上图标出黄色的部分就想一个圆柱的树桩切面图一样。


## References
1. [机器学习基础（十八） —— decision stump](https://blog.csdn.net/lanchunhui/article/details/50980635)
2. [Induction of One-Level Decision Tree](http://lyonesse.stanford.edu/~langley/papers/stump.ml92.pdf)
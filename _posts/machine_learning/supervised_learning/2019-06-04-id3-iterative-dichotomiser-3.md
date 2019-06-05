---
layout: post
title: Iterative Dichotomiser 3
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---


　　熵表示的是数据中包含的信息量的大小。熵越小，数据的纯度越高，亦即数据越趋于一致，这是我们希望划分自后每个子结点的样子。信息增益 = 划分前熵 - 划分后熵。信息增益越大，则意味着使用属性a来进行划分所获得的 “纯度提升” 越大 。也就是说，用属性a来划分训练集，得到的结果中纯度比较高。

ID3 优点：
* 理论清晰，方法简单，学习能力较强

缺点：
* 只能处理分类属性的数据，不能处理连续的数据
* 划分过程会由于子集规模过小而造成统计特征不充分而停止
* ID3 采用信息增益来划分子树，所以导致倾向于选择取值较多的属性
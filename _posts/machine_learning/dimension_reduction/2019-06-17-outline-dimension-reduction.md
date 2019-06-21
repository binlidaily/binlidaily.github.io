---
layout: post
title: Outline of Dimension Reduction
subtitle: 降维算法
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　在机器学习中，数据通常需要被表示成向量形式以输入模型进行训练。对高维向量进行处理和分析时，会极大消耗系统资源，甚至导致维度灾难，于是需要进行降维，用一个低维度的向量表示高纬度的特征就显得尤为重要。

常见降维方法有：

* 主成分分析 Principal Component Analysis (PCA)
* 线性判别分析 [Linear Discriminant Analysis (LDA)](https://binlidaily.github.io/2018-08-30-lda-linear-discriminant-analysis/)
* Manifold Learning
    * 等距映射 Isometric Mapping (Isomap)
    * 局部线性嵌入 Locally Linear Embedding (LLE)
* 局部保留投影 Locality Preserving Projection (LPP)
* 拉普拉斯特征映射 Laplacian Eigenmaps

如果没有外部标签数据，如果评价两个聚类算法的优劣？
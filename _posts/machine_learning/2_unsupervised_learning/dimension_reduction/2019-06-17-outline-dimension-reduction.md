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

Principal Component Analysis (PCA)
Latent Dirichlet Allocation (LDA)
Latent Semantic Analysis (LSA)


## 提问是最好的学习方法
### 降低数据维度的动机是什么？
1. 加速随后的模型训练过程，在某些情况下，可以起到去除噪声和冗余特征的效果，使得模型效果更好。
2. 进行数据可视化，深入了解最重要的特征。
3. 压缩数据，节省存储空间。

### 数据降维的主要弊病是什么？
1. 会不可避免地丢失一些信息，可能会降低后续的模型训练效果。
2. 可能会变成计算密集型过程，进行大量的计算，消耗CPU资源。
3. 会在机器学习过程中加入更多复杂度。
4. 投射（转换）之后的特征一般来说很难解释。

### 什么是**维度灾难**？
　　维度灾难指那些一般在低维空间不会出现但在高维空间中出现的问题。最常见的维度灾难的问题就是，一般来说在随机采样的高维空间数据是非常稀疏的，这就增加了过拟合的风险，也就是说没有足够量的数据是没有办法更好地拟合此时的模式。


### 如何衡量降维算法的性能好坏？
　　比较直观的想法是，如果降维算法能够消除大量数据维度并且不减少很多信息就说明该降维算法比较可取。具体的衡量办法有两个：

1. 采用反向转换（reverse transformation）过程从降维后的数据恢复到降维前的维度上，然后比较恢复后的数据与原数据的构造误差（reconstruction error）。这个方法的缺点很明显，就是不是所有的降维方法都想 PCA 那样有反向变换的途径。
2. 如果我们是在将数据输入给后续机器学习模型训练之前先进行降维操作的话，我们可以通过衡量采用降维的数据后机器学习模型的性能来侧面衡量降维的性能。

### 将两个不同的降维方法串联起来用是否有意义？
　　我们说当然是可以将两个不同的降维算法串起来用的，一个比较常用的例子是，利用 PCA 可以快速的消除大量无用的维度，然后再采用慢得多的降维方法（例如 LLE）来进行降维。这种两步式的降维和直接用一部采用 LLE 降维的方式效果基本没有太大差别，但是会省很多时间。


## References
1. 《Hands-on》
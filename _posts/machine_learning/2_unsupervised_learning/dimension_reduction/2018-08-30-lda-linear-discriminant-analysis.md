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

　　线性判别分析（Linear Discriminant Analysis, LDA）是一种经典的**有监督**线性学习方法，其思想很朴素：给定了训练样本集，设法将样本映射到一条直线上，使得同类样本的投影点尽可能近，不同类样本的投影点尽可能远。

　　简单概括就是：投影后类内方差最小，类间方差最大。对新样本进行预测时，也是映射到该直线上，看离哪一类的样本近就选择对应类别。通常也被用来做降维，接下来从二分类到多分类的拓展介绍 LDA。



## LDA 二分类
　　LDA 是一种监督学习的降维技术，也就是说它的数据集的每个样本是有类别输出的。这点和 PCA 不同。PCA 是不考虑样本类别输出的无监督降维技术。LDA 的思想如下图所示：

![](/img/media/15819470567079.jpg)

　　给定数据集 $D=\\{(x_i, y_i)\\}_{i=1}^{m}$，$y \in \\{0, 1\\}$，令 $X_j$、$\mu_j$、$\Sigma_j$ 分别表示第 $j \in \\{0,1\\}$ 类实例的集合、均值向量、协方差矩阵。

　　有了以上的假设后，将数据投影到直线 $w$ 上，那么有：
* 两类样本的中心在直线上的投影分别为 $w^T\mu_0$ 和 $w^T\mu_1$
* 所有样本点都投影到直线上后，两类样本的协方差分别为 $w^T\Sigma_0w$ 和 $w^T\Sigma_1w$
* 这里是讨论二分类，且样本维度为 2，所以这四个投影值都是实数

　　要实现投影后类内方差最小，即 $w^T\Sigma_0w + w^T\Sigma_1w$ 尽可能小；而类间方差最大，即 $\|w^T\mu_0 - w^T\mu_1 \|^2_2$ 尽可能大，综合考虑之下，可得到最大化的目标：

$$
\begin{aligned} J &=\frac{\left\|\boldsymbol{w}^{\mathrm{T}} \boldsymbol{\mu}_{0}-\boldsymbol{w}^{\mathrm{T}} \boldsymbol{\mu}_{1}\right\|_{2}^{2}}{\boldsymbol{w}^{\mathrm{T}} \boldsymbol{\Sigma}_{0} \boldsymbol{w}+\boldsymbol{w}^{\mathrm{T}} \boldsymbol{\Sigma}_{1} \boldsymbol{w}} \\ &=\frac{\boldsymbol{w}^{\mathrm{T}}\left(\boldsymbol{\mu}_{0}-\boldsymbol{\mu}_{1}\right)\left(\boldsymbol{\mu}_{0}-\boldsymbol{\mu}_{1}\right)^{\mathrm{T}} \boldsymbol{w}}{\boldsymbol{w}^{\mathrm{T}}\left(\boldsymbol{\Sigma}_{0}+\boldsymbol{\Sigma}_{1}\right) \boldsymbol{w}} \end{aligned}
$$

　　这里把上式 $w$ 中间的部分，在分子分母上分别做一个另外的定义。定义类内散度矩阵（within-class scatter matrix）：

$$
\begin{aligned} \mathbf{S}_{w} &=\mathbf{\Sigma}_{0}+\mathbf{\Sigma}_{1} \\ &=\sum_{\boldsymbol{x} \in X_{0}}\left(\boldsymbol{x}-\boldsymbol{\mu}_{0}\right)\left(\boldsymbol{x}-\boldsymbol{\mu}_{0}\right)^{\mathrm{T}}+\sum_{\boldsymbol{x} \in X_{1}}\left(\boldsymbol{x}-\boldsymbol{\mu}_{1}\right)\left(\boldsymbol{x}-\boldsymbol{\mu}_{1}\right)^{\mathrm{T}} \end{aligned}
$$

　　类间散度矩阵（between-class scatter matrix）：

$$
\mathbf{S}_{b}=\left(\boldsymbol{\mu}_{0}-\boldsymbol{\mu}_{1}\right)\left(\boldsymbol{\mu}_{0}-\boldsymbol{\mu}_{1}\right)^{\mathrm{T}}
$$

　　则目标函数可以从写为：

$$
J=\frac{\boldsymbol{w}^{\mathrm{T}} \mathbf{S}_{b} \boldsymbol{w}}{\boldsymbol{w}^{\mathrm{T}} \mathbf{S}_{w} \boldsymbol{w}}
$$



在我们将上面直观的内容转化为可以度量的问题之前，我们先了解些必要的数学基础知识，这些在后面讲解具体LDA原理时会用到。

协方差可以看成一种特殊的方差，其值越小，数据越不离散。

* [ ] 怎么做预测？

## References
1. [Linear Discriminant Analysis – Bit by Bit](https://sebastianraschka.com/Articles/2014_python_lda.html)
2. [线性判别分析LDA原理总结](https://www.cnblogs.com/pinard/p/6244265.html)
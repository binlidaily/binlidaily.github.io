---
layout: post
title: Principal Components Analysis
subtitle: 主成分分析
author: Bin Li
tags: [Machine Learning, Dimension Reduction, Unsupervised Learning]
image: 
comments: true
published: true
---

　　主成分分析 (Principal Components Analysis, PCA) 旨在找到数据中的主成分，并利用这些主成分表征原始数据，从而达到降维的目的。一般从理论上解释 PCA 原理有两个方向，一是从最大方差理论，二是从最小平方误差理论。

## 1. PCA 最大方差理论
　　我们想将高维空间的数据映射到一个低维空间，映射的结果考虑是要尽量使得数据分散得开，也就是**最大化投影方差**。这样考虑的一个依据是来自信号处理领域的信噪比，我们认为信号具有较大方差，噪声具有较小方差，信号与噪声之比称为信噪比。信噪比越大意味着数据的质量越好，反之，信噪比越小意味着数据的质量越差。如下图拿二维数据为例：

<p align="center">
  <img width="400" height="" src="/img/media/15611834879719.jpg">
</p>


　　对于给定的一组数据点 $\\{v_1, v_2, \ldots, v_n \\}$，其中所有向量均为列向量，中心化后的表示为

$$
\left\{x_{1}, x_{2}, \ldots, x_{n}\right\}=\left\{v_{1}-\mu, v_{2}-\mu, \ldots, v_{n}-\mu\right\}
$$

　　其中 $\mu=\frac{1}{n} \sum_{i=1}^{n} v_{i}$。我们知道，向量内积在几何上表示为第一个向量投影到第二个向量上的长度，因此向量 $x_i$ 在单位方向向量 $w$ 上的投影坐标可以表示为 $\left(\boldsymbol{x}_i, \boldsymbol{\omega}\right)=\boldsymbol{x}_i^{\mathrm{T}} \boldsymbol{\omega}$。所以我们的目标是找到一个投影方向 $w$，使得在 $w$ 上的投影方差尽可能大。

　　计算方差之前，我们先计算投影后的均值：

$$
\boldsymbol{\mu}^{\prime}=\frac{1}{n} \sum_{i=1}^{n} \boldsymbol{x}_{i}^{\mathrm{T}} \boldsymbol{\omega}=\left(\frac{1}{n} \sum_{i=1}^{n} \boldsymbol{x}_{i}^{\mathrm{T}}\right) \boldsymbol{\omega}=0
$$

　　投影后的均值为 0，所以在计算方差时就不用考虑均值了，这也是为什么 PCA 要做中心化！那么方差计算如下：

$$
\begin{aligned}
D(\boldsymbol{x})&=\frac{1}{n} \sum_{i=1}^{n}\left(\boldsymbol{x}_{i}^{\mathrm{T}} \boldsymbol{\omega}\right)^{2}\\
&=\frac{1}{n} \sum_{i=1}^{n}\left(\boldsymbol{x}_{i}^{\mathrm{T}} \boldsymbol{\omega}\right)^{\mathrm{T}}\left(\boldsymbol{x}_{i}^{\mathrm{T}} \boldsymbol{\omega}\right) \\
&=\frac{1}{n} \sum_{i=1}^{n} \boldsymbol{\omega}^{\mathrm{T}} \boldsymbol{x}_{i} \boldsymbol{x}_{i}^{\mathrm{T}} \boldsymbol{\omega} \\
&= \boldsymbol{\omega}^{\mathrm{T}}\left(\frac{1}{n} \sum_{i=1}^{n} \boldsymbol{x}_{i} \boldsymbol{x}_{i}^{\mathrm{T}}\right) \boldsymbol{\omega} 
\end{aligned}
$$

　　仔细一看，其实 $\Sigma = \frac{1}{n} \sum_{i=1}^{n}  \boldsymbol{x}_i \boldsymbol{x}_i^{\mathrm{T}} $ 就是样本协方差矩阵。另外，由于 $w$ 是单位方向向量，即有 $\omega^{T} \omega=1$。因此我们要求解一个最大化问题，可表示为

$$
\begin{array}{l}{\max \left\{\boldsymbol{\omega}^{\mathrm{T}} \Sigma \boldsymbol{\omega}\right\}} \\ {\text {s.t. } \boldsymbol{\omega}^{\mathrm{T}} \boldsymbol{\omega}=1}\end{array}
$$

　　引入拉格朗日乘子，并对 $w$ 求导令其等于 0，便可以推出：

$$
\Sigma \omega=\lambda \omega
$$

　　此时方差可以写成:

$$
D(\boldsymbol{x})=\boldsymbol{\omega}^{\mathrm{T}} \boldsymbol{\Sigma} \boldsymbol{\omega}=\lambda \boldsymbol{\omega}^{\mathrm{T}} \boldsymbol{\omega}=\lambda
$$

　　熟悉线性代数的读者马上就会发现，原来，$x$ 投影后的方差就是协方差矩阵的特征值。我们要找到最大的方差也就是协方差矩阵最大的特征值，最佳投影方向就是最大特征值所对应的特征向量。次佳投影方向位于最佳投影方向的正交空间中，是第二大特征值对应的特征向量，以此类推。

总结一下 PCA 求解步骤：
1. 对样本数据进行中心化处理。
2. 求样本协方差矩阵：$\Sigma = \frac{1}{n} \sum_{i=1}^{n}  \boldsymbol{x}_i \boldsymbol{x}_i^{\mathrm{T}} $。
3. 对协方差矩阵进行特征值分解，将特征值从大到小排列。
    * 通过奇异值分解（SVD 求取 $\Sigma$ 的 特征向量（eigenvectors）
        * $\left(U, S, V^{T}\right)=SVD(\Sigma)$
4. 从 $U$ 中取出前 $d$ 个左奇异特征向量 $U_\text{sub}= \\{\omega_{1}, \omega_{2}, \dots, \omega_{d}\\}$，通过以下映射将 $n$ 维样本映射到 $d$ 维

$$
\boldsymbol{x}_{i}^{\prime}=U_\text{sub}^T \cdot x_i=\left[\begin{array}{c}{\boldsymbol{\omega}_{1}^{\mathrm{T}} \boldsymbol{x}_{i}} \\ {\boldsymbol{\omega}_{2}^{\mathrm{T}} \boldsymbol{x}_{i}} \\ {\vdots} \\ {\boldsymbol{\omega}_{d}^{\mathrm{T}} \boldsymbol{x}_{i}}\end{array}\right]
$$

　　新的 $x_i^\prime$ 的第 $d$ 维就是 $x_i$ 在第 $d$ 个主成分 $w_d$ 方向上的投影，通过选取最大的 $d$ 个特征值对应的特征向量，我们将方差较小的特征（噪声）抛弃，使得每个 $n$ 维列向量 $x_i$ 被映射为 $d$ 维列向量 $x_i^\prime$，定义降维后的信息占比为

$$
\eta=\sqrt{\frac{\sum_{i=1}^{d} \lambda_{i}^{2}}{\sum_{i=1}^{n} \lambda_{i}^{2}}}
$$

　　降维后的维度 $d^\prime$ 可以通过如下几种方式得到：
1. 由用户根据经验事先指定
2. 通过在 $d^\prime$ 不同的地位空间中对 $k$ 近邻分类器（或其他小开销的学习器）进行交叉验证来选取较好的 $d^\prime$ 值
3. 还可以从重构的角度设置一个重构阈值，例如 $t=95 \%$，然后通过选取使得下式成立的最小 $d^\prime$ 值

$$
\frac{\sum_{i=1}^{d^{\prime}} \lambda_{i}}{\sum_{i=1}^{d} \lambda_{i}} \geqslant t
$$

## 2. PCA 最小平方误差理论

## 3. 核化 PCA
　　传统的 PCA 只能做线性降维，对于非线性的情况效果就不尽人意。那么是不是可以像 SVM 那样，我们先把数据映射到高维空间，在高维空间就能用 PCA 线性降维了！

　　待重新整理，周志华图书中说的不清楚，可参考附录 3，说的比较清楚。

　　假设 $z_i = \phi\left(\boldsymbol{x}_{i}\right)$，$i=1,2, \ldots, m$， 是样本 $x_i$ 在高维特征空间中由 $w$ 确定的超平面上的像，因为高维特征空间可以用 PCA 线性降维，则具体就是求解如下的式子：


$$
\left(\sum_{i=1}^{m} z_{i} z_{i}^{\mathrm{T}}\right) \boldsymbol{\omega} = \left(\sum_{i=1}^{m} \phi\left(\boldsymbol{x}_{i}\right) \phi\left(\boldsymbol{x}_{i}\right)^{\mathrm{T}}\right) \boldsymbol{\omega}=\lambda \boldsymbol{\omega}
$$

　　做一下变换求解 $\boldsymbol{\omega}$:

$$
\begin{aligned} 
\boldsymbol{\omega} &=\frac{1}{\lambda}\left(\sum_{i=1}^{m} \boldsymbol{z}_{i} \boldsymbol{z}_{i}^{\mathrm{T}}\right) \boldsymbol{\omega}\\
&=\sum_{i=1}^{m} \boldsymbol{z}_{i} \frac{\boldsymbol{z}_{i}^{\mathrm{T}} \boldsymbol{\omega}}{\lambda} \\ &=\sum_{i=1}^{m} \boldsymbol{z}_{i} \boldsymbol{\alpha}_{i} \\
&=\sum_{i=1}^{m} \phi\left(\boldsymbol{x}_{i}\right) \boldsymbol{\alpha}_{i}\end{aligned} 
$$

　　其中 $\boldsymbol{\alpha}_i=\frac{1}{\lambda} \boldsymbol{z}_i^{\mathrm{T}} \boldsymbol{\omega}$，一般情况下我们不知道 $\phi$ 的具体形式，于是引入核函数：

$$
\kappa\left(\boldsymbol{x}_{i}, \boldsymbol{x}_{j}\right)=\phi\left(\boldsymbol{x}_{i}\right)^{\mathrm{T}} \phi\left(\boldsymbol{x}_{j}\right)
$$

　　如果我们记 $\mathbf{K}$ 为 $\kappa$ 对应的核矩阵，$\mathbf{K}_{ij}=\kappa\left(\boldsymbol{x}_i, \boldsymbol{x}_j\right)$，$\mathbf{A}=\left(\boldsymbol{\alpha}_1 ; \boldsymbol{\alpha}_2 ; \ldots ; \boldsymbol{\alpha}_m\right)$，则上面式子可以化简为：

$$
\mathbf{K} \mathbf{A}=\lambda \mathbf{A}
$$

　　这里就跟传统的 PCA 一样了，只剩下特征值分解问题了，取 $\mathbf{K}$ 最大的 $d^\prime$ 个特征值对应的特征向量即可。

　　对于新样本 $x$，其投影后的第 $j$ $\left(j=1,2, \ldots, d^{\prime}\right)$ 维坐标为：

$$
\begin{aligned} z_{j} &=\boldsymbol{w}_{j}^{\mathrm{T}} \phi(\boldsymbol{x})\\
&=\sum_{i=1}^{m} \alpha_{i}^{j} \phi\left(\boldsymbol{x}_{i}\right)^{\mathrm{T}} \phi(\boldsymbol{x}) \\ &=\sum_{i=1}^{m} \alpha_{i}^{j} \kappa\left(\boldsymbol{x}_{i}, \boldsymbol{x}\right) \end{aligned}
$$

　　其中 $\boldsymbol{\alpha}_i$ 已经规范化，$\boldsymbol{\alpha}_i^j$ 是 $\boldsymbol{\alpha}_i$ 的第 $j$ 个分量。我们可以看到为获得投影后的坐标，KPCA 需要做所有样本的加和，计算开销比较大。


## References
1. [Linear Discriminant Analysis – Bit by Bit](https://sebastianraschka.com/Articles/2014_python_lda.html)
2. 《机器学习》周志华
3. [Kernel Principal Components Analysis](/assets/Kernel-PCA.pdf)
4. [Feature-Engineering中文版第6章：降维：用 PCA 压缩数据集](https://tianchi.aliyun.com/notebook-ai/detail?spm=5176.12281897.0.0.698639a9P5jdJr&postId=62468)
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

## PCA 最大方差理论
　　我们想将高维空间的数据映射到一个低维空间，映射的结果考虑是要尽量使得数据分散得开，也就是**最大化投影方差**。这样考虑的一个依据是来自信号处理领域的信噪比，我们认为信号具有较大方差，噪声具有较小方差，信号与噪声之比称为信噪比。信噪比越大意味着数据的质量越好，反之，信噪比越小意味着数据的质量越差。如下图拿二维数据为例：

![-w447](/img/media/15611834879719.jpg)

　　对于给定的一组数据点 $\left\{v_1, v_2, \ldots, v_n\right\}$，其中所有向量均为列向量，中心化后的表示为

$$
\left\{x_{1}, x_{2}, \ldots, x_{n}\right\}=\left\{v_{1}-\mu, v_{2}-\mu, \ldots, v_{n}-\mu\right\}
$$

　　其中 $\mu=\frac{1}{n} \sum_{i=1}^{n} v_{i}$。我们知道，向量内积在几何上表示为第一个向量投影到第二个向量上的长度，因此向量 $x_i$ 在单位方向向量 $w$ 上的投影坐标可以表示为 $\left(\boldsymbol{x}_{i}, \boldsymbol{\omega}\right)=\boldsymbol{x}_{i}^{\mathrm{T}} \boldsymbol{\omega}$。所以我们的目标是找到一个投影方向 $w$，使得在 $w$ 上的投影方差尽可能大。

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

　　仔细一看，其实 $\left(\frac{1}{n} \sum_{i=1}^{n} \omega^{\mathrm{T}} \boldsymbol{x}_{i} \boldsymbol{x}_{i}^{\mathrm{T}} \boldsymbol{\omega}\right)$ 就是样本协方差矩阵，我们将其写作 $\Sigma$。另外，由于 $w$ 是单位方向向量，即有 $\omega^{T} \omega=1$。因此我们要求解一个最大化问题，可表示为

$$
\begin{array}{l}{\max \left\{\boldsymbol{\omega}^{\mathrm{T}} \Sigma \boldsymbol{\omega}\right\}} \\ {\text {s.t. } \boldsymbol{\omega}^{\mathrm{T}} \boldsymbol{\omega}=1}\end{array}
$$

　　引入拉格朗日乘子，并对 $w$ 求导令其等于 0，便可以推出 $\Sigma \omega=\lambda \omega$，此时

$$
D(\boldsymbol{x})=\boldsymbol{\omega}^{\mathrm{T}} \boldsymbol{\Sigma} \boldsymbol{\omega}=\lambda \boldsymbol{\omega}^{\mathrm{T}} \boldsymbol{\omega}=\lambda
$$

　　熟悉线性代数的读者马上就会发现，原来，x投影后的方差就是协方差矩阵的特征值。我们要找到最大的方差也就是协方差矩阵最大的特征值，最佳投影方向就是最大特征值所对应的特征向量。次佳投影方向位于最佳投影方向的正交空间中，是第二大特征值对应的特征向量，以此类推。

总结一下 PCA 求解步骤：
1. 对样本数据进行中心化处理。
2. 求样本协方差矩阵。
3. 对协方差矩阵进行特征值分解，将特征值从大到小排列。
4. 取特征值前 $d$ 大对应的特征向量 $\omega_{1}, \omega_{2}, \dots, \omega_{d}$，通过以下映射将 $n$ 维样本映射到 $d$ 维

$$
\boldsymbol{x}_{i}^{\prime}=\left[\begin{array}{c}{\boldsymbol{\omega}_{1}^{\mathrm{T}} \boldsymbol{x}_{i}} \\ {\boldsymbol{\omega}_{2}^{\mathrm{T}} \boldsymbol{x}_{i}} \\ {\vdots} \\ {\boldsymbol{\omega}_{d}^{\mathrm{T}} \boldsymbol{x}_{i}}\end{array}\right]
$$

　　新的 $x_i^\prime$ 的第 $d$ 维就是 $x_i$ 在第 $d$ 个主成分 $w_d$ 方向上的投影，通过选取最大的 $d$ 个特征值对应的特征向量，我们将方差较小的特征（噪声）抛弃，使得每个 $n$ 维列向量 $x_i$ 被映射为d维列向量 $x_i^\prime$，定义降维后的信息占比为

$$
\eta=\sqrt{\frac{\sum_{i=1}^{d} \lambda_{i}^{2}}{\sum_{i=1}^{n} \lambda_{i}^{2}}}
$$

## PCA 最小平方误差理论

## 核化 PCA
　　传统的 PCA 只能做线性降维，对于非线性的情况效果就不尽人意。那么是不是可以像 SVM 那样，我们先把数据映射到高维空间，在高维空间就能用 PCA 线性降维了！
## References
1. [Linear Discriminant Analysis – Bit by Bit](https://sebastianraschka.com/Articles/2014_python_lda.html)
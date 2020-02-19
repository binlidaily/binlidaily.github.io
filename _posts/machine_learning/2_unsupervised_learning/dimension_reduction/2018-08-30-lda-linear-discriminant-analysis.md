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
\arg \max _w J=\frac{\boldsymbol{w}^{\mathrm{T}} \mathbf{S}_{b} \boldsymbol{w}}{\boldsymbol{w}^{\mathrm{T}} \mathbf{S}_{w} \boldsymbol{w}}
$$

　　所以 LDA 的优化目标就是 $S_b$ 和 $S_w$ 的广义瑞利商（Generalized Rayleigh Quotient），可以用其对应的优化方法。

　　西瓜书上介绍了一种方法说，看到分子分母上都是关于 $w$ 的二次项，因此其解跟 $w$ 的长度无关，只跟其方向有关。不失一般性，可以令：

$$
\boldsymbol{w}^{\mathrm{T}} \mathbf{S}_{w} \boldsymbol{w} = 1
$$

　　则优化目标等价于：

$$
\begin{array}{cl}{\min _{\boldsymbol{w}}} & {-\boldsymbol{w}^{\mathrm{T}} \mathbf{S}_{b} \boldsymbol{w}} \\ {\text { s.t. }} & {\boldsymbol{w}^{\mathrm{T}} \mathbf{S}_{w} \boldsymbol{w}=1}\end{array}
$$

　　由拉格朗日乘子法，上式等价于：

$$
\begin{aligned} c(w) &=-w^{\top} S_{b} w+\lambda\left(w^{\top} S_{w} w-1\right) \\ \Rightarrow & \frac{d c}{d w}=-2 S_{b} w+2 \lambda S_{w} w=0 \\ \Rightarrow & S_{b} w=\lambda S_{w} w \end{aligned}
$$

　　其中 $\lambda$ 为拉格朗日乘子。

　　注意到 $S_{b}w$ 的方向恒为 $\boldsymbol{\mu}_{0}-\boldsymbol{\mu}_{1}$，不妨令：

$$
S_{b} = \lambda \left( \boldsymbol{\mu}_{0}-\boldsymbol{\mu}_{1} \right)
$$

　　将其带入上式得：

$$
w = S_{w}^{-1} \left( \boldsymbol{\mu}_{0}-\boldsymbol{\mu}_{1} \right)
$$

　　也就是说我们只要求出原始二类样本的均值和方差就可以确定最佳的投影方向 $w$ 了。考虑到数值解的稳定性，在实践中一般对 $S_w$进行奇异值分解，然后就得 $ S_{w}^{-1} $。

## LDA 多分类
　　假设数据集 $D=\\{(x_i, y_i)\\}_{i=1}^{m}$，$y\in \\{C_1, C_2, \dots,C_k\\}$，任意样本 $x_i$ 为第 $j$ 类样本的集合，令 $X_j$、$\mu_j$、$\Sigma_j$ 分别表示第 $j \in \\{C_1, C_2, \dots,C_k\\}$ 类实例的集合、均值向量、协方差矩阵。

　　定义类内散度矩阵 $S_w$ 为每个类别的散度矩阵之和（类间方差），即：

$$
\mathbf{S}_{w}=\sum_{i=1}^{N} \sum_{\boldsymbol{x} \in X_{i}}\left(\boldsymbol{x}-\boldsymbol{\mu}_{i}\right)\left(\boldsymbol{x}-\boldsymbol{\mu}_{i}\right)^{\mathrm{T}}
$$

　　在考虑类间散度矩阵 $S_b$，因为要顾忌到所有样本，所以采用加权：

$$
\sum_{i=1}^{N} m_{i}\left(\boldsymbol{\mu}_{i}-\boldsymbol{\mu}\right)\left(\boldsymbol{\mu}_{i}-\boldsymbol{\mu}\right)^{\mathrm{T}}
$$

　　其中 $\mu$ 表示所有样例的均值向量。那么优化目标就变成了：

$$
\max _{\mathbf{W}} \frac{\operatorname{tr}\left(\mathbf{W}^{\mathrm{T}} \mathbf{S}_{b} \mathbf{W}\right)}{\operatorname{tr}\left(\mathbf{W}^{\mathrm{T}} \mathbf{S}_{w} \mathbf{W}\right)}
$$

　　其中 $\mathbf{W} \in \mathbb{R}^{d \times(N-1)}$。同理可以通过如下广义特征值问题求解：

$$
\mathbf{s}_{b} \mathbf{w}=\lambda \mathbf{S}_{w} \mathbf{w}
$$

　　结果就是计算矩阵 $\mathbf{s}_{w}^{-1}\mathbf{s}_{b}$ 的最大的 $d$ 个特征值和对应的 $d$ 个特征向量 $(w_1, w_2, \dots, w_d)$，得到投影矩阵 $W= (w_1, w_2, \dots, w_d)$。

LDA 算法流程：

输入：数据集 $D=\\{(x_i, y_i)\\}_{i=1}^{m}$，$y \in \\{C_1, C_2, \dots,C_k\\}$，任意样本 $x_i$ 为第 $j$ 类样本的集合，$n$ 维，降维到的维度为 $d$.

输出：降维后的数据集 $D^\prime$.

1）计算类内散度矩阵 $S_w$

2）计算类间散度矩阵 $S_w$

3）计算矩阵 $\mathbf{s}_{w}^{-1}\mathbf{s}_{b}$

4）计算矩阵 $\mathbf{s}_{w}^{-1}\mathbf{s}_{b}$ 的特征值与特征向量，按从小到大的顺序选取前 $d$ 个特征值和对应的 $d$ 个特征向量 $(w_1, w_2, \dots, w_d)$，得到投影矩阵 $W$.

5）对样本集中的每一个样本特征 $x_i$，转化为新的样本 $z_i = W^Tx_i$

6）得到输出样本集 $D=\\{(x_i, y_i)\\}_{i=1}^{d}$，$y \in \\{C_1, C_2, \dots,C_k\\}$


## References
1. [Linear Discriminant Analysis – Bit by Bit](https://sebastianraschka.com/Articles/2014_python_lda.html)
2. [线性判别分析LDA原理总结](https://www.cnblogs.com/pinard/p/6244265.html)
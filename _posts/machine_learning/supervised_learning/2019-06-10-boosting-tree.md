---
layout: post
title: Boosting Tree
subtitle: 提升树
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published:  true
---

　　在之前我们整理过了 [Adaboost](https://binlidaily.github.io/2018-10-29-adaboost/) 算法的原理，当时还没有具体讨论改用什么样的基函数，本文就介绍以决策树作为基函数的提升方法，称为提升树（boosting tree）。一般的提升方法实际采用加法模型（即基函数的线性组合）与前向分布算法。对于分类问题决策树采用 CART 二叉分类树，回归问题即采用 CART 二叉回归树。我们采用一层的决策树，称之为决策树桩（Decision Stump）。则提升树模型可以表示为决策树的加法模型：

$$
f_K(x) = \sum_{k=1}^K T(x;\Theta_k)
$$

　　其中 $T(x;\Theta_k)$ 表示二叉决策树，$\Theta_k$ 表示决策树的参数，$K$ 表示二叉决策树的个数。

　　先捋清 Adaboost 和 Boosting Tree 的关系，**AdaBoost + 决策树 = 提升树**。



## 提升树算法
　　决策树采用前向分布算法，首先确定初始提升树 $f_0(x)=0$，第 $k$ 步的模型是：

$$
f_k(x) = f_{k-1}(x) + T(x;\Theta)
$$

　　其中 $f_{k-1}(x)$ 是当前模型，采用经验风险极小化来确定下一棵决策树的参数 $\Theta_m$：

$$
\hat{\Theta}_k = \arg  \min_{\Theta_x} \sum _{i=1} ^{M} L(y_i, f_{x-1}+T(x_i; \Theta_k))
$$

　　针对不同问题的提升树算法，主要区别在损失函数不同。决策树用的 0/1 损失，对于分类问题一般采用指数损失函数，而对于回归问题则采用平方误差损失函数。对于二分类问题，只需将 Adaboost 算法中的基函数限制为二类分类树即可，所以接下来着重展开提升树回归问题的介绍。

　　首先假设一些基本，数据集记作：

$$
T = \left\{ \left( x_1 , y _ { 1 } \right) , \left( x _ { 2 } , y _ { 2 } \right) , \ldots . \left( x _ { m } , y _ { m } \right) \right\}
$$

　　其中 $x_i \in \mathcal{X} \subseteq \mathcal{R}^n$，$\mathcal{X}$ 为输入空间，$y_i \in \mathcal{Y} \subseteq \mathcal{R}$，$\mathcal{Y}$ 为输出空间。在讨论[决策树](https://binlidaily.github.io/2018-09-11-decision-tree/)的时候讨论过这个问题，如果将输入空间 $\mathcal{X}$ 划分为 $J$ 个互不相交的区域 $R_1, R_2, \dots, R_J$，并且在每个区域上都输出一个常量 $c_j$，那么树可以表示为：

$$
T(x;\Theta) = \sum _{j=1} ^ J c_j I(x\in R_j)
$$

　　其中，参数 $\Theta=\{(R_1, c_1), (R_2, c_2), \dots, (R_J, c_J)\}$ 表示树的区域划分和各区域上的常数，$J$ 是回归树的复杂度即叶节点个数。

　　回归问题提升树使用以下前向分布算法：

$$
\begin{aligned}
f_0(x)&=0 \\
f_m(x)&=f_{m-1}(x)+T(x; \Theta_m), ~~ m=1,2,\dots,M \\
f_M(x)&=\sum_{m=1}^M T(x; \Theta_m)
\end{aligned}
$$

　　在前向分布算法的第 $m$ 步，给定当前模型 $f_{m-1}(x)$，需求解：

$$
\hat{\Theta}_m=\arg \min_{\Theta_m} \sum_{i=1}^N L(y_i, f_{m-1}(x)+T(x_i;\Theta_m))
$$

　　从而得到 $\hat{\Theta}_m$，即第 $m$ 棵树的参数。

　　当采用平方误差损失函数时，

$$
L(y, f(x))=(y-f(x))^2
$$

　　其损失变为：

$$
\begin{aligned}
L(y, f_{m-1}(x)+T(x;\Theta_m)) &= \left[y- f_{m-1}(x)-T(x; \Theta_m)\right]^2 \\
&= \left[ r- T(x; \Theta_m)\right] ^2
\end{aligned}
$$

　　其中有

$$
r=y-f_{m-1}(x)
$$

　　$r$ 便是当前模型需要拟合的数据残差（residual），该残差可以看成是前一个模型没有很好拟合的部分。残差越小，则当前模型需要拟合的结果越小（因为要损失 $L$ 最小，逼近零），即需要当前模型的几率就越低，那么说明模型已经慢慢训练好了。

　　于是训练当前回归树的流程就变成了：

1. 利用前面的模型结果，计算出残差 $r_{mi}$
2. 拟合残差 $r_{mi}$ 学习到当前的回归树，得到 $T(x;\Theta_m)$
3. 更新 $f_m(x)=f_{m-1}(x)+T(x; \Theta_m)$

　　迭代跑过了所有的回归树后就能得到最终的回归问题提升树：

$$f_M(x)=\sum_{m=1}^M T(x; \Theta_m)$$

## References
1. 统计学习方法
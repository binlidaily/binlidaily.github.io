---
layout: post
title: Forward Stagewise Algorithm
subtitle: 前向分布算法
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published:  true
---

　　前向分布算法 (Forward Stagewise Algorithm) 是求解加法模型优化问题的一种常见的方式。前向分布算法可以看成是在加法模型的基础上，从前往后逐渐建立基学习器来逼近目标函数的过程：

$$
\begin{aligned}
f_0(x)&=0 \\
f_m(x)&=f_{m-1}(x)+T(x; \Theta_m), ~~ m=1,2,\dots,M \\
f_M(x)&=\sum_{m=1}^M T(x; \Theta_m)
\end{aligned}
$$

　　考虑如下的加法模型

$$
f(x)=\sum_{m=1}^{M} \beta_{m} b\left(x ; \gamma_{m}\right)
$$

　　其中 $b\left(x ; \gamma_{m}\right)$ 为基函数，$\gamma_{m}$ 为基函数参数，$\beta_{m}$ 为基函数系数。

　　在给定了训练数据和损失函数 $L(y, f(x))$ 的条件下，学习加法模型 $f(x)$  就成为经验风险极小化即如下损失函数极小化的问题。

$$
\min _{\beta_{m}, \gamma_{m}} \sum_{i=1}^{N} L\left(y_{i}, \sum_{m=1}^{M} \beta_{m} b\left(x_{i} ; \gamma_{m}\right)\right)
$$

　　通常来说这是一个复杂的优化问题，前向分布算法求解的思路是：因为是加法模型，那么从前往后，每一步只学习一个基学习器及其系数，逐步逼近优化目标函数，那么就能简化优化的复杂度了。

　　那么我们就只要每步优化如下的损失函数：

$$
\min _{\beta, \gamma} \sum_{i=1}^{N} L\left(y_{i}, \beta b\left(x_{i} ; \gamma\right)\right)
$$

**前向分布算法流程**
* 输入：
    * 训练数据集：$T=\\{\left(x_{1}, y_{1}\right),\left\langle x_{2}, y_{2}\right), \cdots,\left(x_{N}, y_{N}\right)\\}$
    * 损失函数：$L(y, f(x))$
    * 基函数集：$\\{b(x ; \gamma)\\}$
* 输出：加法模型 $f(x)$

1. 初始化 $f_{0}(x)=0$

{:start="2"}

2. 对 $m=1,2, \cdots, M$

　　a) 极小化损失函数

$$
\left(\beta_{m}, \gamma_{m}\right)=\arg \min _{\beta, \gamma} \sum_{i=1}^{N} L\left(y_{i}, f_{m-1}\left(x_{i}\right)+\beta b\left(x_{i} ; \gamma\right)\right)
$$

　　得到基函数系数 $\beta_{m}$，基函数参数 $\gamma_{m}$。

　　b) 更新当前的强学习器

$$
f_{m}(x)=f_{m-1}(x)+\beta_{m} b\left(x ; \gamma_{m}\right)
$$

{:start="3"}

3. 求解到加法模型

$$
f(x)=f_{M}(x)=\sum_{m=1}^{M} \beta_{m} b\left(x ; \gamma_{m}\right)
$$


![-w778](/img/media/15602413685705.jpg)

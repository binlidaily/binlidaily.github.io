---
layout: post
title: Steepest Descent
subtitle: 最速下降法
author: "Bin Li"
tags: [Machine Learning]
category: "Optimization"
comments: true
published: true
---

　　最速下降法是梯度下降法的变种，如果我们要求函数 L(x) 的极⼩值，梯度下降法的从⼀个初始迭代点 $x_0$ 开始， 反复沿着当前点处的负梯度⽅向迭代:

$$
\mathbf{x}_{t+1}=\mathbf{x}_{t}-\rho \nabla_{\mathbf{x}} L\left(\mathbf{x}_{t}\right)
$$

　　只要学习率 $\rho$（步⻓）选取得当，并且还没达到驻点处，每次迭代函数值是下降的。可以证明，沿着负梯度⽅向，函数值下降是最快的。如果令

$$
\Delta \mathbf{x}_{t}=-\rho \nabla_{\mathbf{x}} L\left(\mathbf{x}_{t}\right)
$$

　　这称为增量。则最后得到的最优解为每次增量的累加

$$
\mathbf{x}_{T}=\sum_{t=0}^{T} \Delta \mathbf{x}_{t}
$$

　　即它是由之前每次迭代时的增量序列累加起来的。这⾥的学习率是⼈⼯设定的常数，最速下降法对梯度下降法的改进是学习率 $\rho$ 是由算法确定的，⾃适应变化，如果令梯度为

$$
\mathbf{g}_{t}=\nabla_{\mathbf{x}} L\left(\mathbf{x}_{t}\right)
$$

　　则步⻓为下⾯⼀元函数优化问题的解

$$
\rho_{t}=\arg \min _{\rho} L\left(\mathbf{x}_{t-1}-\rho \mathbf{g}_{t}\right)
$$

　　这称为**直线搜索**，它沿着最速下降⽅向搜索最佳步⻓。在⽜顿法中也使⽤了这种技术。

## References
1. [SIGAI Gradient Boosting](/assets/gradient_boosting.pdf)
2. [【最优化】一文搞懂最速下降法](https://zhuanlan.zhihu.com/p/32709034)
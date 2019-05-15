---
layout: post
title: Ridge and Lasso Regression
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

## Shrinking coefficients to understanding our data 缩减系数

**为什么会提出lasso或者ridge回归？**

当数据的特征比样本点还多的时候，X矩阵就可能不满秩了，那么在计算矩阵的逆的时候就会出错。为了解决这个问题，统计学家就引入了岭回归（ridge regression），即我们要介绍的第一种缩减方法。接着我们会介绍效果更好但是计算也更复杂的lasso regression。最后我们会介绍一种叫做向前逐步回归（forward stagewise regression），效果跟lasso相当，但是其计算相对较少。

通过学习，认识到好像上述原因并不是最核心的。我们不难发现，当OLS中的系数如果过大，那么决策函数的结果可能会爆炸，对较大方差的情况非常敏感。为了控制方差过大，我们就需要对系数进行正则化。那么就会想到如下的一种约束方式：

$$
\begin{aligned}
minimize~ & {1\over{2}}\Sigma_{i=1}^m (y_i-x_iw)^2 \\
s.t.~ & \Sigma_{j=1}^p w_j^2 < \lambda
\end{aligned}
$$

对应了ridge regression 或者：
$$
\begin{aligned}
minimize~ & {1\over{2}}\Sigma_{i=1}^m (y_i-x_iw)^2 \\
s.t.~ & \Sigma_{j=1}^p |w_j| < \lambda
\end{aligned}
$$
对应了lasso regression。

### Ridge regression
简单来说，岭回归就是在$X^TX$上加了一个$\lambda I$从而使得矩阵非奇异，那么回归系数就变成了：

$$\hat{w}=(X^TX+\lambda I)^{-1}X^Ty$$

其实，这就对应在目标函数上加了一个 L1 norm:

$${1\over{2}}\Sigma_{i=1}^m (y_i-x_iw)^2+\lambda ||w||^2$$

以上的形式可以通过对w求导化简得到回归系数的式子。

岭回归最先用在处理特征数多于样本数的情况，现在也用在估计中加入偏差，从而得到更好的估计。这里通过引进$\lambda$来限制所有$w$之和，通过引入该惩罚项，能够减少不重要的参数，这个技术在统计学中叫做缩减（shrinkage）。

### Lasso regression
依据上述添加约束的介绍，Lasso regression的公式就是在OLS的基础上加上 L1 norm：

$${1\over{2}}\Sigma_{i=1}^m (y_i-x_iw)^2+\lambda \Sigma_{j=1}^p |w_j|$$

Lasso regression在训练之前要对数据进行标准化，这个是什么原因？

* [ ] 注意中心化和去中心化的思路和目的。

## References

---
layout: post
title: Gradient Boosting
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　[提升树](https://binlidaily.github.io/2019-06-10-boosting-tree/)利用加法模型和前向分布算法实现学习的优化过程，且当损失函数是平方损失 (回归) 和指数损失 (分类) 时，每一步的优化是很简单的，但对一般损失函数 (损失函数类别可参考[这篇介绍](https://binlidaily.github.io/2018-12-07-loss-functions/)) 而言，往往每一步优化并不那么容易。针对这一问题，Freidman 提出了梯度提升算法 (Gradient Boosting)，这是利用最速梯度下降的近似方法来实现的，关键是利用**损失函数的负梯度在当前模型的值**作为回归问题提升树算法中的残差的近似值，拟合一个回归树，其值如下：

$$- \left[ \frac { \partial L \left( y _ { i } , f \left( x _ { i } \right) \right) } { \partial f \left( x _ { i } \right) } \right] _ { f ( x ) = f _ { m - 1 } ( x ) }$$


![-w798](/img/media/15602347070035.jpg)

　　我们从均方差损失中可以看到损失函数负梯度正好就是残差值，这也是利用损失函数负梯度拟合残差的一个灵感来源？

　　那么梯度提升算法的思路如下：

![-w1098](/img/media/15602352595888.jpg)

　　详细的部分可以参考[原论文](/assets/trebst.pdf)，如果我们用决策树作为基函数来实现梯度提升算法的话就得到了闻名遐迩的 [GBDT](https://binlidaily.github.io/2019-06-11-gbdt-gradient-boosting-decision-tree/)。


## References
1. [Gradient Boosting from scratch](https://medium.com/mlreview/gradient-boosting-from-scratch-1e317ae4587d)
2. [梯度提升树(GBDT)原理小结](https://www.cnblogs.com/pinard/p/6140514.html)
3. [Greedy Function Approximation: A Gradient Boosting Machine](https://statweb.stanford.edu/~jhf/ftp/trebst.pdf)
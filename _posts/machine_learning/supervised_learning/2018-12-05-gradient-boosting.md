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

wiki 上有伪代码的总结：
![-w732](/img/media/15443555046407.jpg)

另一个伪代码介绍:

![-w969](/img/media/15443556126300.jpg)


　　详细的部分可以参考[原论文](https://statweb.stanford.edu/~jhf/ftp/trebst.pdf)，或者另一个[总结](http://www.cse.chalmers.se/~richajo/dit865/files/gb_explainer.pdf)。


## References
1. [Gradient Boosting from scratch](https://medium.com/mlreview/gradient-boosting-from-scratch-1e317ae4587d)
2. [梯度提升树(GBDT)原理小结](https://www.cnblogs.com/pinard/p/6140514.html)
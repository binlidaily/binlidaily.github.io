---
layout: post
title: Field-aware Factorization Machines
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---


对于标称型数据来说，一般需要进行 One-hot 编码，以此虽然增多了特征维度，但是大部分是很稀疏的。加之工业界一般数据量都比较大，因此数据稀疏性和数量大的特性是实际问题中不可避免的挑战。

同时通过观察大量的样本数据可以发现，某些特征经过关联之后，与label之间的相关性就会提高。例如，“USA”与“Thanksgiving”、“China”与“Chinese New Year”这样的关联特征，对用户的点击有着正向的影响。换句话说，来自“China”的用户很可能会在“Chinese New Year”有大量的浏览、购买行为，而在“Thanksgiving”却不会有特别的消费行为。这种关联特征与label的正向相关性在实际问题中是普遍存在的，如“化妆品”类商品与“女”性，“球类运动配件”的商品与“男”性，“电影票”的商品与“电影”品类偏好等。因此，引入两个特征的组合是非常有意义的。

多项式模型是包含特征组合的最直观的模型。在多项式模型中，特征 $ x_i $ 和 $ x_j $ 的组合采用 $ x_ix_j $ 表示，即 $ x_i $ 和 $ x_j $ 都非零时，组合特征 $ x_ix_j $ 才有意义。从对比的角度，本文只讨论二阶多项式模型。模型的表达式如下：

$$
y ( \mathbf { x } ) = w _ { 0 } + \sum _ { i = 1 } ^ { n } w _ { i } x _ { i } + \sum _ { i = 1 } ^ { n } \sum _ { j = i + 1 } ^ { n } w _ { i j } x _ { i } x _ { j }
$$

其中，$n$ 代表样本的特征数量，$x_i$ 是第 $i$ 个特征的值，$w_0$、$w_i$、$w_{ij}$ 是模型参数。



## References
1. [深入FFM原理与实践](https://tech.meituan.com/deep_understanding_of_ffm_principles_and_practices.html)
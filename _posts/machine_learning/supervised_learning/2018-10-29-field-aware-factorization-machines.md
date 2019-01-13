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

## FM
对于标称型数据来说，一般需要进行 One-hot 编码，以此虽然增多了特征维度，但是大部分是很稀疏的。加之工业界一般数据量都比较大，因此数据稀疏性和数量大的特性是实际问题中不可避免的挑战。

同时通过观察大量的样本数据可以发现，某些特征经过关联之后，与label之间的相关性就会提高。例如，“USA”与“Thanksgiving”、“China”与“Chinese New Year”这样的关联特征，对用户的点击有着正向的影响。换句话说，来自“China”的用户很可能会在“Chinese New Year”有大量的浏览、购买行为，而在“Thanksgiving”却不会有特别的消费行为。这种关联特征与label的正向相关性在实际问题中是普遍存在的，如“化妆品”类商品与“女”性，“球类运动配件”的商品与“男”性，“电影票”的商品与“电影”品类偏好等。因此，引入两个特征的组合是非常有意义的。

**为什么要考虑特征之间的关联信息？**

大量的研究和实际数据分析结果表明：某些特征之间的关联信息（相关度）对事件结果的的发生会产生很大的影响。从实际业务线的广告点击数据分析来看，也正式了这样的结论。

**如何表达特征之间的关联？**

表示特征之间的关联，最直接的方法的是构造组合特征。样本中特征之间的关联信息在one-hot编码和浅层学习模型（如LR、SVM）是做不到的。目前工业界主要有两种手段得到组合特征：

* 人工特征工程（数据分析＋人工构造）；
* 通过模型做组合特征的学习（深度学习方法、FM/FFM方法）

多项式模型是包含特征组合的最直观的模型。在多项式模型中，特征 $ x_i $ 和 $ x_j $ 的组合采用 $ x_ix_j $ 表示，即 $ x_i $ 和 $ x_j $ 都非零时，组合特征 $ x_ix_j $ 才有意义。从对比的角度，本文只讨论二阶多项式模型。模型的表达式如下：

$$
y ( \mathbf { x } ) = w _ { 0 } + \sum _ { i = 1 } ^ { n } w _ { i } x _ { i } + \sum _ { i = 1 } ^ { n } \sum _ { j = i + 1 } ^ { n } w _ { i j } x _ { i } x _ { j }
$$

其中，$n$ 代表样本的特征数量，$x_i$ 是第 $i$ 个特征的值，$w_0$、$w_i$、$w_{ij}$ 是模型参数。

## FFM
Field-aware Factorization Machine (FFM)参考了这篇的 [field](https://pdfs.semanticscholar.org/eeb9/34178ea9320c77852eb89633e14277da41d8.pdf) (？)想法

## References
1. [深入FFM原理与实践](https://tech.meituan.com/deep_understanding_of_ffm_principles_and_practices.html)
2. [Factorization Machines](http://www.algo.uni-konstanz.de/members/rendle/pdf/Rendle2010FM.pdf)
3. [Field-aware Factorization Machines](https://www.csie.ntu.edu.tw/~r01922136/slides/ffm.pdf)
4. [第09章：深入浅出ML之Factorization家族](http://www.52caml.com/head_first_ml/ml-chapter9-factorization-family/)
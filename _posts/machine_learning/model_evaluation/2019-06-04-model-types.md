---
layout: post
title: Types of Model
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

## 生成模型和判别模型
无论是生成式模型还是判别式模型，都可作为分类器使用，分类器的数学表达即为：给定输入 $X$ 以及分类变量 $Y$，求 $P(Y\vert X)$。

判别式模型直接估算 $P(Y\vert X)$，或者也可像 SVM 那样，估算出输入和输出之间的映射，与概率无关；

判别式模型的典型代表是：logistic 回归；
产生式模型的思想是先估计联合概率密度 $P(X,Y)$，再通过贝叶斯公式求出 $P(Y\vert X)$；

生成式模型的典型代表则是：朴素贝叶斯模型；

一般认为判别式模型更受欢迎，“人们更应该直接去解决问题，永远不要把求解更复杂的问题作为中间阶段”（Vapnik），Andrew Ng 的论文[1]对此作了较为全面的分析，产生式模型（朴素贝叶斯）在少量样本的情况下，可以取得更好的精确率，判别式模型（logistics 回归）在样本增加的情况下，逐渐逼近前者的概率；

## 参数方法（parameter）与非参数方法（nonparameter）
参数方法表示参数固定，不随数据点的变化而变化； 
非参数方法并不意味着没有参数，而是说，参数的数目随数据点而变化，

**1. 参数方法举例**
logistic regression：p(y=1|x,α)=11+exp(−xTα)p(y=1|x,α)=11+exp⁡(−xTα)，显然参数，αα 的维数会随着数据集属性列个数的变化而变化，而不会随着数据规模的变化而变化；

**2. 非参数方法举例**
Nearest-Neighbor：比如一个二分类问题，新来一个测试点，当要计算其所属类别时，需要与全部训练集计算距离；

## References
1. [生成式模型（generative） vs 判别式模型（discriminative）](https://blog.csdn.net/lanchunhui/article/details/60321358)
2. [参数方法（parameter）与非参数方法（nonparameter）](https://blog.csdn.net/lanchunhui/article/details/53574727)
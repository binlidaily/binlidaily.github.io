---
layout: post
title: Regularization
subtitle: 正则化
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　正则化在机器学习中非常的重要，其是模型选择的典型方法。


正则化不能提高模型在数据集上的效果，但是能提高泛化能力。能够解决过拟合问题。

注意范数和正则的区别！

注意正则化项求导的时候怎么操作？

L1 正则化可以产生稀疏权重矩阵，即产生一个稀疏模型，也可以用于特征选择。L1 正则化在一定程度上也可以防止过拟合。

L2 正则化可以防止模型过拟合。

　　过拟合的时候，拟合函数的系数往往非常大，为什么？如下图所示，过拟合，就是拟合函数需要顾忌每一个点，最终形成的拟合函数波动很大。在某些很小的区间里，函数值的变化很剧烈。这就意味着函数在某些小区间里的导数值（绝对值）非常大，由于自变量值可大可小，所以只有系数足够大，才能保证导数值很大。

![](/img/media/15592896875283.jpg)

　　而正则化是通过约束参数的范数使其不要太大，所以可以在一定程度上减少过拟合情况。


## References
1. [机器学习中正则化项L1和L2的直观理解](https://blog.csdn.net/jinping_shi/article/details/52433975)
2. [机器学习中使用正则化来防止过拟合是什么原理？](https://www.zhihu.com/question/20700829)
3. [正则化为什么能防止过拟合](https://www.cnblogs.com/alexanderkun/p/6922428.html)
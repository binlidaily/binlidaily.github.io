---
layout: post
title: Machine Learning Misc
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

这里记录待整理的一些概念或者问题！

统计学习方法的三大要素：模型，策略和算法。

### Parametric algorithms VS Non-parametric Algorithms
　　参数方法指的是那些有固定且有限的参数的模型，只需要存储这些参数即可不需要存储数据，因为我们在预测是不需要利用训练数据。参数化模型（Parametric Model）假设模型参数的维度固定，模型可以由有限维参数完全刻画。

　　非参数模型假设模型的维度不固定或者说无穷大，随着训练数据量的增加而不断增大。

　　参数化模型适合问题简单的情况，现实中问题往往比较复杂，非参数化模型更加有效。


![](/img/media/15586905041983.jpg)


## Concepts of Machine Learning
* Structured data

The objective of any supervised learning algorithm is to define a loss function and minimize it. 

One-Hot编码的另一个特点就是导致特征空间大。例如，商品品类有550维特征，一个categorical特征转换为550维数值特征，特征空间剧增。

同时通过观察大量的样本数据可以发现，某些**特征经过关联**之后，与label之间的相关性就会提高。例如，“USA”与“Thanksgiving”、“China”与“Chinese New Year”这样的关联特征，对用户的点击有着正向的影响。换句话说，来自“China”的用户很可能会在“Chinese New Year”有大量的浏览、购买行为，而在“Thanksgiving”却不会有特别的消费行为。这种关联特征与label的正向相关性在实际问题中是普遍存在的，如“化妆品”类商品与“女”性，“球类运动配件”的商品与“男”性，“电影票”的商品与“电影”品类偏好等。因此，引入两个特征的组合是非常有意义的。

ToB：To Business 对于企业的业务。
ToC：To Customer 针对消费者的业务。

---

对于一个机器学习算法，值得注意的几个点：
* decision function (prediction)
* cost function
* parameter solutions

比如用线性回归的时候主要关注的几个点如下：

$$
h ( x ) = x ^ { T } \hat { \beta }
$$

$$
\hat { \beta } = \operatorname { argmin } _ { \beta } \sum _ { x , y } \left( y - x ^ { T } \beta \right) ^ { 2 }
$$

$$
\hat { \beta } = \left( X ^ { T } X \right) ^ { - 1 } X ^ { T } y
$$



连续型数据很难在机器学习模型中使用，可以用分桶或者归一化的方式。

* lightgbm
* xgboost
* catboost

## 工具汇总
* [Sklearn](https://scikit-learn.org/stable/modules/classes.html)
* [Sklearn tools 使用 github](https://github.com/renxingkai/Sklearn_MachineLearining)

## References
1. [List of techniques in regression, classification, clustering, and deep learning](https://www.linkedin.com/pulse/list-techniques-regression-classification-clustering-deep-weili-zhang/)
2. [机器学习算法集锦：从贝叶斯到深度学习及各自优缺点](https://zhuanlan.zhihu.com/p/25327755)
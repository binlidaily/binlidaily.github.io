---
layout: post
title: Outline Of Machine Learning
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---



这里记录待整理的一些概念或者问题！

![-w779](/img/media/15635978283880.jpg)


![](/img/media/15626742791086.jpg)


决策函数 = 损失函数 + 正则化部分。

统计学习方法的三大要素：模型，策略和算法。
![](/img/media/15617050405329.jpg)


![](/img/media/15617050084091.jpg)



1. Bagging + 决策树 = 随机森林
2. AdaBoost + 决策树 = 提升树
3. Gradient Boosting + 决策树 = GBDT

![Scan Jun 19, 2019 at 8.29 P](/img/media/Scan%20Jun%2019,%202019%20at%208.29%20PM.jpg)


### Parametric algorithms VS Non-parametric Algorithms
　　参数方法指的是那些有固定且有限的参数的模型，只需要存储这些参数即可不需要存储数据，因为我们在预测是不需要利用训练数据。参数化模型（Parametric Model）假设模型参数的维度固定，模型可以由有限维参数完全刻画。

　　非参数模型假设模型的维度不固定或者说无穷大，随着训练数据量的增加而不断增大。

　　参数化模型适合问题简单的情况，现实中问题往往比较复杂，非参数化模型更加有效。


![](/img/media/15586905041983.jpg)


![-w1181](/img/media/15673036119106.jpg)

![-w1178](/img/media/15673037152066.jpg)
![-w1187](/img/media/15673040257026.jpg)
![-w1171](/img/media/15673042676385.jpg)
![-w1195](/img/media/15673048473766.jpg)

noise 可能来自x 也可能来自 y。 

![-w1197](/img/media/15675196287275.jpg)


## 算法分类汇总


* 有监督学习
    * 分类
        1. 逻辑回归
        2. 支持向量机
        3. K 近邻
        4. 朴素贝叶斯分类器
        5. 决策树
        6. Adaboost
        7. Random Forest 分类
        8. XGBoost 分类
        9. LightGBM 分类
        10. 线性判别分析
        11. 高斯过程分类
    * 回归
        12. 线性回归
        13. 多项式回归
        14. 岭回归
        15. 脊/套索回归
        16. ElasticNet回归
        17. 贝叶斯回归
        18. SGD 回归
        19. SVR
        20. KNN 回归
        21. 决策树回归
        22. 神经网络
        23. RandomForest 回归
        24. XGBoost 回归
        25. LightGBM 回归
        26. 高斯过程回归
* 无监督学习
    * 聚类
        1. K-Means
        2. 高斯混合模型
        3. DBSCAN
    * 降维
        4. 主成分分析
        5. 线性判别分析
        6. t-SNE


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
3. [Approaching (Almost) Any Machine Learning Problem | Abhishek Thakur](http://blog.kaggle.com/2016/07/21/approaching-almost-any-machine-learning-problem-abhishek-thakur/)
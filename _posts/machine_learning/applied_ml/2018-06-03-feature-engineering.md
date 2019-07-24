---
layout: post
title: Feature Engineering
author: Bin Li
tags: [Machine Learning]
category: ""
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　在机器学习应用中，特征工程扮演着重要的角色。数据和特征决定了机器学习算法的上限，而模型、算法的选择和优化只是不断逼近这个上限而已。特征工程 (Feature Engineering) 介于“数据”和“模型”之间，是利用数据的专业领域知识和现有数据，从源数据中抽取出来对预测结果有用的信息，用在机器学习算法上的过程。美国计算机科学家 Peter Norvig 有两句经典的名言：

* “基于大量数据的简单模型胜过基于少量数据的复杂模型。”
* “更多的数据胜过聪明的算法，而好的数据胜过多的数据。”

　　吴恩达更是说过“应用机器学习基本上就是特征工程”。对于工业界来说，大部分复杂模型的算法精进都是资深的数据科学家的任务，大部分人员的工作还是跑数据、map-reduce，hive SQL，数据仓库搬砖，做一些业务分析、数据清洗、特征工程（找特征）的工作。当然在实际工作中，特征工程旨在去除原始数据中的杂质和冗余，设计更高效的特征以刻画求解的问题与预测模型之间的关系。

　　特征工程面对的数据一般分为两大类：
1. 结构化数据。
    * 结构化数据可以看做关系型数据库的一张表，每列都有清晰的定义，包含了数值型、类别性两种基本类型。
    * 每一行数据表示一个样本信息。
2. 非结构化数据。
    * 非结构化数据主要包括文本、图像、音频、视频数据，其包含的信息无法用一个简单的数值表示，也没有清晰的定义，并且每条数据的大小各不相同。


　　特征工程一般分成[特征提取](https://binlidaily.github.io/2019-06-13-feature-extraction/) (Feature Extraction) 和[特征选择](https://binlidaily.github.io/2018-10-25-feature-selection/) (Feature Selection) 两个方面。

2. If variable's distribution has a long tail, apply Box-Cox transformation (taking log() is a quick & dirty way).

3. One could also perform analysis of residuals or log-odds (for linear model) to check for strong nonlinearities.

4. Create a feature which captures the frequency of the occurrence of each level of the categorical variable. For high cardinality, this helps a lot. One might use ratio/percentage of a particular level to all the levels present.

5. For every possible value of the variable, estimate the mean of the target variable; use the result as an engineered feature.

6. Encode a variable with the ratio of the target variable.

7. Take the two most important variables and throw in second order interactions between them and the rest of the variables - compare the resulting model to the original linear one

8. if you feel your solutions should be smooth, you can apply a radial basis function kernel .  This is like applying a smoothing transform.  

9. If you feel you need covariates , you can apply a polynomial kernel, or add the covariates explicitly

10. High cardinality features : convert to numeric by preprocessing: out-of-fold average two variable combinations

11. Additive transformation

12. difference relative to baseline

13. Multiplicative transformation : interactive effects

14. divisive : scaling/normalisation

15. thresholding numerical features to get boolean values

16. Cartesian Product Transformation

17. Feature crosses: cross product of all features -- Consider a feature A, with two possible values {A1, A2}. Let B be a feature with possibilities {B1, B2}. Then, a feature-cross between A & B (let’s call it AB) would take one of the following values: {(A1, B1), (A1, B2), (A2, B1), (A2, B2)}. You can basically give these ‘combinations’ any names you like. Just remember that every combination denotes a synergy between the information contained by the corresponding values of A and B.

18. Normalization Transformation: -- One of the implicit assumptions often made in machine learning algorithms (and somewhat explicitly in Naive Bayes) is that the the features follow a normal distribution. However, sometimes we may find that the features are not following a normal distribution but a log normal distribution instead. One of the common things to do in this situation is to take the log of the feature values (that exhibit log normal distribution) so that it exhibits a normal distribution.If the algorithm being used is making the implicit/explicit assumption of the features being normally distributed, then such a transformation of a log-normally distributed feature to a normally distributed feature can help improve the performance of that algorithm.

19. Quantile Binning Transformation

20. whitening the data

21. Windowing -- If points are distributed in time axis, previous points in the same window are often very informative

22. Min-max normalization : does not necessarily preserve order

23. sigmoid / tanh / log transformations

24. Handling zeros distinctly – potentially important for Count based features

25. Decorrelate / transform variables

26. Reframe Numerical Quantities

27. Map infrequent categorical variables to a new/separate category.

28.Sequentially apply a list of transforms.

29. One Hot Encoding

30. Target rate encoding

Hash Trick Multivariate:

31. PCA

32. MODEL STACKING

33. compressed sensing

34..guess the average” or “guess the average segmented by variable X”

Projection : new basis

35. Hack projection:

Perform clustering and use distance between points to the cluster center as a feature
PCA/SVD -- Useful technique to analyze the interrelationships between variables and perform dimensionality reduction with minimum loss of information (find the axis through the data with highest variance / repeat with the next orthogonal axis and so on , until you run out of data or dimensions; Each axis acts a new feature)
36.Sparse coding -- choose basis : evaluate the basis  based on how well  you can use it to reconstruct the input and how sparse it is take some sort of gradient step to improve that evaluation

efficient sparse coding algorithms
deep auto encoders
37 :Random forest: train bunch of decision trees :use each leaf as a feature

## References
1. [机器学习之 特征工程](https://juejin.im/post/5b569edff265da0f7b2f6c65)
2. [The Comprehensive Guide for Feature Engineering](https://adataanalyst.com/machine-learning/comprehensive-guide-feature-engineering/)
3. [【持续更新】机器学习特征工程实用技巧大全](https://zhuanlan.zhihu.com/p/26444240)
4. ✳️ [Machine Learning Kaggle Competition Part Two: Improving Feature engineering, feature selection, and model evaluation](https://towardsdatascience.com/machine-learning-kaggle-competition-part-two-improving-e5b4d61ab4b8)
5. [Feature Engineering 特徵工程中常見的方法](https://vinta.ws/code/feature-engineering.html)
6. [机器学习之step by step实战及知识积累笔记](https://www.cnblogs.com/kidsitcn/p/9176602.html)
7. [特征工程：数据科学家的秘密武器！](https://yq.aliyun.com/articles/82611)
8. [机器学习项目的完整流程](https://blog.csdn.net/qq_24831889/article/details/83241104#53_badcase_186)
9. [连续数据的处理方法](https://www.leiphone.com/news/201801/T9JlyTOAMxFZvWly.html)
10. [机器学习中的数据清洗与特征处理综述](https://tech.meituan.com/2015/02/10/machinelearning-data-feature-process.html)
11. [python开发：特征工程代码模版(一)](http://shataowei.com/2017/12/01/python%E5%BC%80%E5%8F%91%EF%BC%9A%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B%E4%BB%A3%E7%A0%81%E6%A8%A1%E7%89%88-%E4%B8%80/)
12. [python开发：特征工程代码模版(二)](http://shataowei.com/2017/12/01/python%E5%BC%80%E5%8F%91%EF%BC%9A%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B%E4%BB%A3%E7%A0%81%E6%A8%A1%E7%89%88-%E4%BA%8C/)
13. [Normalization(标准化)的原理和实现详解](http://www.dongdongbai.com/index.php/2017/12/11/97/)
14. [数据挖掘的流程和方法、技巧总结](https://zhuanlan.zhihu.com/p/33429338)
15. [4.3. 预处理数据](http://doc.codingdict.com/sklearn/59/)
16. [scikit-learn preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html)
17. [A Comprehensive Guide to Data Exploration](https://www.analyticsvidhya.com/blog/2016/01/guide-data-exploration/)
18. [**What are good ways to handle discrete and continuous inputs together?**](https://www.quora.com/What-are-good-ways-to-handle-discrete-and-continuous-inputs-together)
19. [One-hot vs dummy encoding in Scikit-learn](https://stats.stackexchange.com/questions/224051/one-hot-vs-dummy-encoding-in-scikit-learn)
20. [如何理解统计学中「自由度」这个概念？](https://www.zhihu.com/question/20983193)
21. [One-Hot 编码与哑变量](http://www.jiehuozhe.com/article/3)
22. [Smarter Ways to Encode Categorical Data for Machine Learning (Part 1 of 3)](https://towardsdatascience.com/smarter-ways-to-encode-categorical-data-for-machine-learning-part-1-of-3-6dca2f71b159)
23. [python数据处理，特征工程，比赛等一定会用到的方法](https://www.twblogs.net/a/5b8364342b71776c51e2d0b2/zh-cn)
24. [Feature Engineering: Data scientist's Secret Sauce !](https://www.linkedin.com/pulse/feature-engineering-data-scientists-secret-sauce-ashish-kumar)
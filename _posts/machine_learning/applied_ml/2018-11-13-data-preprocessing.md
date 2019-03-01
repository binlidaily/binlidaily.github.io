---
layout: post
title: Data Preprocessing
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

通过数据预处理，我们需要将训练集表示为矩阵X（大小：n_samples * n_features）和矢量y（长度：n_samples）。矢量y可以被转换为矩阵Y（大小：n_samples * n_classes）。

Convert Format
* [Categorical Encoding](https://pbpython.com/categorical-encoding.html)
* [Sklearn LabelEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html)
* [Sklearn OneHotEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html)
* [Pandas Categorical dtype](https://pandas.pydata.org/pandas-docs/stable/user_guide/categorical.html)
* [pandas.get_dummies](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.get_dummies.html)

## Data Preprocessing
Data preprocessing refers to the transformations applied to our data before feeding it to the algorithm.

Data Preprocessing is a technique that is used to convert the raw data into a clean data set. In other words, whenever the data is gathered from different sources it is collected in raw format which is not feasible for the analysis. there are plenty of steps for data preprocessing and we just listed some of them :

1. removing Target column (id)
2. Sampling (without replacement)
3. Dealing with Imbalanced Data
4. Introducing missing values and treating them (replacing by average values)
5. Noise filtering
6. Data discretization
7. Normalization and standardization
8. PCA analysis
9. Feature selection (filter, embedded, wrapper)
 
## 特征工程中处理已有的特征
### 类别特征
类别特征，表示某个数据点属于某一个类别，或具有某一种类的特性。类别特征在能用到模型训练时，默认用自然数表示，如果不是一般需要用 LabelEncoder 或者 OrdinalEncoder 方式将字符串转换成自然数。如果某一列特征具有 $K$ 种不同类别，那么其取值就是 $\{ 0, 1, 2, \dots, K-1\}$


### 数值特征
数值特征（numerical feature），可以是连续的（continuous），也可以是离散的（discrete），一般表示为一个实数值。

### 1. 标准化（Standardization）
使用 [sklearn.preprocessing.StandardScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)，能够转换为Z-score，使数值特征列的算数平均为0，方差（以及标准差）为1。但是不免疫outlier。

$$
x^{\prime}=\frac{x-\mu}{\sigma}
$$

也可以使用 [sklearn.preprocessing.RobustScaler](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html) ，如果数值特征列中存在数值极大或极小的outlier（通过EDA发现），应该使用更稳健（robust）的统计数据：用中位数而不是算术平均数，用分位数（quantile）而不是方差。这种标准化方法有一个重要的参数：（分位数下限，分位数上限），最好通过EDA的数据可视化确定。免疫outlier。

### 2. 归一化（Normalization）
使用 [sklearn.preprocessing.Normalizer](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html) 来归一化，把每一行数据归一化，使之有unit norm，norm的种类可以选l1、l2或max。不免疫outlier。

$$
\vec{x^{\prime}}=\frac{\vec{x}}{l(\vec{x})}
$$

其中 $l$ 表示 $norm$ 函数。

### 3. 区间缩放（scaling）
使用 [sklearn.preprocessing.MaxAbsScaler](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html)，将一列的数值，除以这一列的最大绝对值。不免疫outlier。

$$
x^{\prime}=\frac{x}{\max (|X|)}
$$

## Data Standardization
* sklearn.preprocessing.LabelBinarizer：用于one vs all的label encoding，类似于独热编码，生成一个(n_examples * n_classes)大小的0~1矩阵，每个样本仅对应一个label。
* sklearn.preprocessing.MultiLabelBinarizer：用于label encoding，生成一个(n_examples * n_classes)大小的0~1矩阵，每个样本可能对应多个label。
* [sklearn.preprocessing.OrdinalEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html#sklearn.preprocessing.OrdinalEncoder)：用于categorical features的编码，生成一个(n_examples)大小的0~(n_classes-1)矢量，每个样本仅对应一个label。
* sklearn.preprocessing.LabelEncoder：用于label encoding，生成一个(n_examples)大小的0~(n_classes-1)矢量，每个样本仅对应一个label。与sklearn.preprocessing.OrdinalEncoder基本相似。


## Data Normalization
z-score

### Clean up rare values in a feature column
```python
stat_min = 10 #while small is arbitrary, we'll use the common minimum in statistics: http://nicholasjjackson.com/2012/03/08/sample-size-is-10-a-magic-number/
title_names = (data1['Title'].value_counts() < stat_min) #this will create a true false series with title name as index

#apply and lambda functions are quick and dirty code to find and replace with fewer lines of code: https://community.modeanalytics.com/python/tutorial/pandas-groupby-and-python-lambda-functions/
data1['Title'] = data1['Title'].apply(lambda x: 'Misc' if title_names.loc[x] == True else x)
```


## References
1. [机器学习特征工程实用技巧大全](https://zhuanlan.zhihu.com/p/26444240)
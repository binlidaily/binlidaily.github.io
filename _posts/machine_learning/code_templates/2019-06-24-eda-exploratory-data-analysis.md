---
layout: post
title: Exploratory Data Analysis
subtitle: 数据可视化分析
author: Bin Li
tags: [Machine Learning, Coding, Python]
image: 
comments: true
published: true
---

　　在[博文](http://gitlinux.net/2019-03-15-feature-engineering/)中做过了一些总结，这里主要对 EDA 做一个整理。画图[这里](http://frankchen.xyz/2018/01/12/Data-Science-Notes/)整理的还不错。

## 1. 数据大局观
### 1.1 数据概览
　　从数据的宏观角度感受一下数据，包括有哪些类型的数据，缺失值怎么样。
```python
# 看一共有多少列数据，具体哪些特征类型，object 类型这里能看
dfoff.info()
# 结合几个例子具体的例子
dfoff.head()
dfoff.sample(5)
# 看数据偏度，数据类型（这里只会列出数值类型的）
dfoff.describe()
# 查看空值
dfoff.isna().sum()
dfoff.isnull().sum()
## 计算缺失值比率
dfoff.isna().sum() / (dfoff.count() + dfoff.isna().sum())
# 查看不空值
dfoff.notna().sum()
dfoff.notnull().sum()
# 看一共有多少个取值
dfoff['Discount_rate'].count()
# 看一共有多少哪些不同值
dfoff['Discount_rate'].unique()
# 看每个列的取值个数
dfoff.nunique()
# count 不同值的个数
dfoff['Discount_rate'].nunique()
# 查看正负样本
dfoff['label'].value_counts()
# 排序
data(['a', 'b'], ascending=[True, False])
```

### 1.2 数据简单处理
　　Pandas 对象的所有描述性统计信息默认情况下是排除缺失值的，我们要对缺失值进行特别处理。

### 1.2.1 缺失值处理
　　除了一些能够将缺失值当做特征信息的模型，比如说决策树类模型，一般的模型都需要对缺失值进行处理，一般分两类，缺失值过滤和缺失值填充。

```python
# 1. 缺失值过滤
## 对 Series 类别数据过滤缺失值
series.dropna()
series[series.notnull()]
## 对 DataFrame 类别数据过滤缺失值
### * 默认是删掉所有含有 nan 的行，可以用 how 来选择所有属性为 nan 才删除
### * 可以用 axis 来选择是删行还是列，默认是0，即行
### * 用 thresh 来选择一行或一列缺失值大于等于多少时才删
df.dropna(how='all', axis=1, thresh=2)
# 2. 缺失值填充
```

## 2. 数据可视化

　　散点矩阵图。
```python
from pandas.tools.plotting import scatter_matrix

attrs = ['Discount_rate', 'Distance', 'target']
scatter_matrix(dfoff[attrs], figsize=(12, 8))
```
## Pandas 操作


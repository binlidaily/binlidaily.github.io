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

　　在[博文](http://gitlinux.net/2019-03-15-feature-engineering/)中做过了一些总结，这里主要对 EDA 做一个整理。

## 数据概览
```python
# 看数据偏度，数据类型（这里只会列出数值类型的）
dfoff.describe()
# 看具体的特征类型，object 类型这里能看
dfoff.info()
# 看几个例子
dfoff.head()
dfoff.sample(5)
# 查看空值
dfoff.isna().sum()
dfoff.isnull().sum()
# 查看不空值
dfoff.notna().sum()
dfoff.notnull().sum()
# 看一共有多少哪些不同值
dfoff['Discount_rate'].unique()
# count 不同值的个数
dfoff['Discount_rate'].nunique()
# 查看正负样本
dfoff['label'].value_counts()
```
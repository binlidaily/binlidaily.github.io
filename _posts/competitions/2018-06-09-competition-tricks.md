---
layout: post
title: "竞赛流程记录"
author: "Bin Li"
tags: [Competitions]
category: ""
comments: true
published: false
---

## 探索性的可视化
一般可以用到 seaborn 库做可视化，找到一些异常点去除掉。

## 数据清洗
处理缺省值，可以用平均值，众数，计数等替换。

## 特征工程
数值型转换为类标类型，可以根据连续特征的众数和平均数做一个认为的映射，映射到对应的类别上。（这里其实应该也可以用one-hot）

我们可以尽量多的创造出特征，而且相信模型能够选出正确的特征。

### 管道
当有了管道，做特征组合就好做很多。

## 特征选择
可以用 Lasso，Ridge，RandomForest 或者 GradientBoostingTree

## 集成
### 权重平均
通过普通的集成，能够提取一些特征，这些特征可以和原特征整合到一起。



## Reference
[All You Need is PCA (LB: 0.11421, top 4%)](https://www.kaggle.com/massquantity/all-you-need-is-pca-lb-0-11421-top-4)
[Kaggle 首战拿银总结 | 入门指导 (长文、干货）](https://zhuanlan.zhihu.com/p/26645088)


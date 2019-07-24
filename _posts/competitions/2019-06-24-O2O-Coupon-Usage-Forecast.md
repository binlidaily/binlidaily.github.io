---
layout: post
title: O2O 优惠券预测使用
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　之前参加过这个比赛，名次不是很高，看到天池将其又重开当成新手赛了，想重新刷一下，看能不能得到更好的结果。

## 0. TODO
1. 如何处理样本不平衡？采样？
2. 如何利用线上的数据？
    * 检查是否所有 test 所有用户都在线上有对应的数据？没有要怎么处理？

## 1. 问题大局观
　　 本赛题提供用户在2016年1月1日至2016年6月30日之间真实线上线下消费行为，预测用户在2016年7月领取优惠券后15天以内的使用情况。注意：为了保护用户和商家的隐私，所有数据均作匿名处理，同时采用了有偏采样和必要过滤。

　　采用的是`平均 AUC`（ROC曲线下面积）作为评价标准。 即对每个优惠券 coupon_id 单独计算核销预测的 AUC 值，再对所有优惠券的 AUC 值求平均作为最终的评价标准。

```python
import numpy as np
from sklearn.metrics import roc_auc_score
y_true = np.array([0, 0, 1, 1])
y_scores = np.array([0.1, 0.4, 0.35, 0.8])
roc_auc_score(y_true, y_scores)
```

　　预测会不会使用优惠券的概率，其实是一个二分类的概率问题。目标特征目前没有直接的数据，需要进一步找出目标特征，然后发现大部分都是负样本，正样本很少。所以用最朴素的逻辑回归都能得到 99% 的准确率，数据不平衡！

## 2. 数据探索
### 2.1 线下数据
　　线下数据一共七列数据，三个 ID 类特征，两个日期类数据，一个字符串，一个连续型数据。

```python
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 1754884 entries, 0 to 1754883
Data columns (total 7 columns):
User_id          int64
Merchant_id      int64
Coupon_id        float64
Discount_rate    object
Distance         float64
Date_received    float64
Date             float64
dtypes: float64(4), int64(2), object(1)
memory usage: 93.7+ MB
```

**User_id**
* 与在线数据中的 User_id 要对上

**Merchant_id**
* 与在线数据中的 Merchant_id 要对上

**Coupon_id**
* 与在线数据中的 Coupon_id 要对上

**Discount_rate**
* 转成比率后发现只有 20 类折扣的优惠券


### 缺失值处理
线下数据
* Coupon_id：优惠券 id，缺失用 0
* Discount_rate：0
* Distance：众数 
* Date_received：有序的类别化处理，自然序列编码
* Date：


## 代码模板

```python
# 检查是否线下的所有用户都在线上的数据集中
dfoff['User_id'].isin(pd.to_numeric(dfon['User_id'], errors='coerce')).all()】
```
## References
1. [机器学习实践-O2O优惠券预测-对第一名的思路源码分析（一）](https://jiayi797.github.io/2017/03/08/机器学习实践-O2O优惠券预测-对第一名的思路源码分析（一）/)
2. [1st Place Solution for O2O Coupon Usage Forecast](https://github.com/wepe/O2O-Coupon-Usage-Forecast)
3. [天池 O2O 优惠券使用预测思路解析与代码实战](https://redstonewill.com/1681/)
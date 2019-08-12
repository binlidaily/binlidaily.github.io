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

　　因为在测试的时候没有很重要的特征 Date，所以我们很难就现有的六个特征进行太多的特征工程，而且肯定会有瓶颈。于是在尝试了第一名提出的解决办法，使用特征的滑动窗口方式。将数据分成三个部分:

|  | 预测区间 | 特征区间 |
| :-: | :-: | :-: |
| 测试集 | Dataset3: 20160701-20160731 | feature3: 20160315-20160630 |
| 训练集 1 | Dataset2: 20160515-20160615 | feature2: 20160201-20160514 |
| 训练集 2 | Dataset1: 20160414-20160514 | feature1: 20160101-20160413 |

　　我们的目标是利用特征区间或者特征区间加预测区间提取特征来对预测区间进行预测，当然在提特征时如果掺入了预测区间，其实已经是 data leakage 了，算是违规的，但是得看你怎么用对吧。在提取特征时主要构建了五个方面的特征：

1. 优惠券相关的特征
    * 注意
        * 使用了预测区间构造一部分不需要 Date 特征的数据，纯跟优惠券字段有关的
        * 使用特征区间的 Date 和预测区间的 date_received 交互关联的信息
    * 构造特征的思考
        * 优惠券打折力度、类别等特征
2. 商家相关的特征
    * 注意
        * 只在特征区间进行商家相关特征的构造，这就考验特征工程的功力了
        * 不需要跟 Date 字段扯上关系
    * 构造特征的思考
        * 每个商店的优惠券特征
        * 每个商店的距离特征
3. 用户相关的特征
    * 只在特征区间进行用户相关特征的构造
    * 构造特征的思考
        * 每个用户购买商品的特征
        * 每个用户离商店距离的特征
        * 每个用户使用和不是用优惠券购买的特征
4. 用户和商家交互的特征
    * 注意
        * 只在特征区间进行用户和商家交互的相关特征构造
    * 构造特征的思考
        * 每个用户在每个商家购买、领取优惠券相关特征
5. 预测区间的特征挖掘
    * 注意
        * 这里其实有点儿 Data Leakage 了
    * 构造特征的思考
        * 每个用户当月收到的优惠券统计量相关特征
        * 每个用户领取优惠券的时间的相关特征

　　每一类特征放在一个函数里，思路看起来会很清晰。然后在函数最后汇总特征时，需要注意构造的特征该怎么 merge，谁 merge 谁，on 在哪些特征上。


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

目标是领券后 15 日消费概率，这个 15 是怎么来的？我们尝试先画出领券后消费的和没领券后消费的情况。

### 缺失值处理
线下数据
* Coupon_id：优惠券 id，缺失用 0
* Discount_rate：0
* Distance：众数 
* Date_received：有序的类别化处理，自然序列编码
* Date：

## 解题思路


## 代码模板
```python
# 检查是否线下的所有用户都在线上的数据集中
dfoff['User_id'].isin(pd.to_numeric(dfon['User_id'], errors='coerce')).all()
```




## References
1. [机器学习实践-O2O优惠券预测-对第一名的思路源码分析（一）](https://jiayi797.github.io/2017/03/08/机器学习实践-O2O优惠券预测-对第一名的思路源码分析（一）/)
2. [1st Place Solution for O2O Coupon Usage Forecast](https://github.com/wepe/O2O-Coupon-Usage-Forecast)
3. [天池 O2O 优惠券使用预测思路解析与代码实战](https://redstonewill.com/1681/)
4. [天池竞赛系列-O2O优惠券使用预测复赛第三名思路](https://blog.csdn.net/bryan__/article/details/53907292)
5. [『 天池竞赛』O2O优惠券使用预测思路总结](https://blog.csdn.net/shine19930820/article/details/53995369)
6. [Xgboost实践+天池比赛O2O优惠券auc接近天池第一名0.81（auc0.80，支持CPU、GPU源代码下载链接）](https://blog.csdn.net/myourdream2/article/details/86618120)
---
layout: post
title: Confusion Matrix
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---


![](/img/media/15508200692360.jpg)

* 准确率（accuracy）就是正确预测的数量除以预测总数；
* 类别精度（precision）表示当模型判断一个点属于该类的情况下，判断结果的可信程度。
* 类别召回率（recall）表示模型能够检测到该类的比率。
* 类别的 F1 分数是精度和召回率的调和平均值（F1 = 2×precision×recall / (precision + recall)），F1 能够将一个类的精度和召回率结合在同一个指标当中。

对于一个给定类，精度和召回率的不同组合如下：

* 高精度+高召回率：模型能够很好地检测该类；
* 高精度+低召回率：模型不能很好地检测该类，但是在它检测到这个类时，判断结果是高度可信的；
* 低精度+高召回率：模型能够很好地检测该类，但检测结果中也包含其他类的点；
* 低精度+低召回率：模型不能很好地检测该类。



## References
1. [机器学习中如何处理不平衡数据？](https://mp.weixin.qq.com/s/x48Ctb0_Eu1kcSGTYLt5BQ)
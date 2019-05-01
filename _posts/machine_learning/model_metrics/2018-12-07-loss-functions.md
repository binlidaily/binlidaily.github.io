---
layout: post
title: Loss Functions & Metrics
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

## 1. 回归问题
　　回归问题的评价指标有 MSE，RMSE，MAE 等。
### 1.1 Mean Squared Error
　　均方误差（Mean Squared Error，MSE）用真实值减去预测值的结果求平方和。

$$
\frac{1}{m} \sum_{i=1}^{m}\left(y_{i}-\hat{y}_{i}\right)^{2}
$$

　　这也正是线性回归的损失函数。

### 1.2 Root Mean Squard Error
　　均方根误差（Root Mean Squard Error，RMSE）在均方误差基础上求平凡根。

$$
\sqrt{\frac{1}{m} \sum_{i=1}^{m}\left(y_{i}-\hat{y}_{i}\right)^{2}}
$$

　　均方根误差跟均方误差效果差不多，为了在量纲上一致具有更好解释性，对强调量纲的结果可以用 RMSE。

### 1.3 Mean Absolute Error
　　平均绝对误差（Mean Absolute Error，MAE）采用衡量真实值和预测值的差值的绝对值方式：

$$
\frac{1}{m} \sum_{i=1}^{m}\left|\left(y_{i}-\hat{y}_{i}\right)\right|
$$

　　相比之下，MSE 对偏差较大的数据点惩罚较大，MAE 对偏差较小的数据点惩罚较大，如下图对同一批数据采用不同衡量指标的拟合结果：

![](/img/media/15566915918190.jpg)

![](/img/media/15566916053242.jpg)



分类问题：
* Hinge loss
* Cross Entropy loss

目标检测：
* mAP

深度学习
* [Softmax](https://www.zhihu.com/question/23765351)


## References
1. [5 Regression Loss Functions All Machine Learners Should Know](https://heartbeat.fritz.ai/5-regression-loss-functions-all-machine-learners-should-know-4fb140e9d4b0)
2. [回归问题中如何更好地利用MAE和MSE提高模型性能？](https://www.chzzz.club/post/227.html)
3. [迴歸評價指標MSE、RMSE、MAE、R-Squared](https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/404042/)
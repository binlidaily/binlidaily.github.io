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
　　均方根误差（Root Mean Squard Error，RMSE）在均方误差基础上求平方根。

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

<p align="center">
  <img width="" height="" src="/img/media/15566915918190.jpg">
</p>

　　可以看到，MSE 对偏离较大的点惩罚较重，所以线性回归的结果向着偏离点偏移了。

<p align="center">
  <img width="" height="" src="/img/media/15566916053242.jpg">
</p>

　　想比之下，MAE 基本上忽略了偏离点的影响。在现实实践中，当我们剔除了数据集中的异常点后，模型往往对两端极值（极大值和极小值）拟合效果不好，可以将这个情况看成两端极值偏离较远，拟合起来有难度，对于偏离较大的我们可以采用 MSE 拟合，而对于中间正常部分则可以采用 MAE 进行拟合。也就是说，这种情况下将模型分别采用 MSE 和 MAE 训练，然后加权融合往往能够提高模型效果。

### 对数误差

　　[对数损失](https://www.zhihu.com/question/27126057)是用于极大似然估计的。

$$
L(Y, P(Y | X))=-\log P(Y | X)
$$

　　一组参数在一堆数据下的似然值，等于每一条数据再这组参数下的条件概率之积。

而损失函数一般是每条数据的损失之和，为了把积变为和，就取了对数。

再加一个负号是为了让最大似然值和最小损失对应起来。


---

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
4. [Log Loss](http://wiki.fast.ai/index.php/Log_Loss)
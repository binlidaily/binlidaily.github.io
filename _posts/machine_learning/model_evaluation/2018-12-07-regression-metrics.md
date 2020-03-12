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

{% include toc.html %}


## 1. 回归问题
　　回归问题的评价指标有 MSE，RMSE，MAE 等。

### 1.1 Least Squares Error
　　最小二乘误差，或者叫（最小）平方误差 (Least Squares Error, LSE) 就是采用 L2 范数作为损失函数：

$$
\text{LSE} = \sum_{i=1}^{n}\left(y_{i}-\hat{y}_{i}\right)^{2}
$$

　　MSE 就是在 LSE 的基础上做了平均。

　　使用的算法：
1. 线性回归

### 1.2 (Mean) Squared Error
　　均方误差（Mean Squared Error，MSE）用真实值减去预测值的结果求平方和。

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n}\left(y_{i}-\hat{y}_{i}\right)^{2}
$$

　　这也正是线性回归的损失函数。

### 1.3 Root Mean Squard Error
　　均方根误差（Root Mean Squard Error，RMSE）在均方误差 MSE 基础上求平方根。

$$
\text{R M S E} = \sqrt{\frac{1}{n} \sum_{i=1}^{n}\left(y_{i}-\hat{y}_{i}\right)^{2}}
$$

　　均方根误差跟均方误差效果差不多，为了在量纲上一致具有更好解释性，对强调量纲的结果可以用 RMSE。

　　值得注意的是，如果数据样本中存在个别偏离程度非常大的离群点（Outlier）时，即使离群点数量非常少，也会让 RMSE 指标变得非常差。为了应对这种缺点有几个考虑的方案：

1. 如果我们认定这些离群点是噪声的话，就需要在数据预处理阶段把这些噪声过滤掉。
2. 如果不认为这些离群点是噪声，就需要进一步提高模型的预测能力，将离群点产生的机制建模进去。
3. 还可以找一个更合适的指标来评估该模型，比如平均绝对百分比误差 MAPE。


### 1.4 Least Absolute Deviation
　　最小绝对偏差 (Least Absolute Deviation，LAD) 就是采用 L1 范数作为损失函数：

$$
\text{LAD} = \sum_{i=1}^{n}\left|\left(y_{i}-\hat{y}_{i}\right)\right|
$$


### 1.5 Mean Absolute Error
　　平均绝对误差（Mean Absolute Error，MAE）采用衡量真实值和预测值的差值的绝对值方式：

$$
\text{MAE} = \frac{1}{n} \sum_{i=1}^{n}\left|\left(y_{i}-\hat{y}_{i}\right)\right|
$$

　　可见，MAE 就是在 LAD 的基础上做了一个平均。

　　在于 MSE 的对比之下可见，MSE 对偏差较大的数据点惩罚较大，MAE 对偏差较小的数据点惩罚较大，如下图对同一批数据采用不同衡量指标的拟合结果：

<p align="center">
  <img width="" height="" src="/img/media/15566915918190.jpg">
</p>

　　可以看到，MSE 对偏离较大的点惩罚较重，所以线性回归的结果向着偏离点偏移了。

<p align="center">
  <img width="" height="" src="/img/media/15566916053242.jpg">
</p>

　　想比之下，MAE 基本上忽略了偏离点的影响。在现实实践中，当我们剔除了数据集中的异常点后，模型往往对两端极值（极大值和极小值）拟合效果不好，可以将这个情况看成两端极值偏离较远，拟合起来有难度，对于偏离较大的我们可以采用 MSE 拟合，而对于中间正常部分则可以采用 MAE 进行拟合。也就是说，这种情况下将模型分别采用 MSE 和 MAE 训练，然后加权融合往往能够提高模型效果。

### 1.6 Mean Absolute Percent Error
　　平均绝对百分比误差（Mean Absolute Percent Error, MAPE）定义为：

$$
\text{MAPE}=\frac{100 \%}{n} \sum_{i=1}^{n}\left|\frac{y_i-\hat{y}_{i}}{y_i}\right|
$$

　　相比 RMSE，MAPE 相当于把每个点的误差都进行了归一化，降低了离群点带来的绝对误差的影响。




### $R^2$ 决定系数


---

分类问题：
* Hinge loss
* Cross Entropy loss

目标检测：
* mAP

深度学习
* [Softmax](https://www.zhihu.com/question/23765351)

在激活函数是sigmoid之类的函数的时候，用平方损失的话会导致误差比较小的时候梯度很小，这样就没法继续训练了，这时使用交叉熵损失就可以避免这种衰退。如果是线性输出或别的激活函数神经元的话完全可以用平方损失。

## References
1. [5 Regression Loss Functions All Machine Learners Should Know](https://heartbeat.fritz.ai/5-regression-loss-functions-all-machine-learners-should-know-4fb140e9d4b0)
2. [回归问题中如何更好地利用MAE和MSE提高模型性能？](https://www.chzzz.club/post/227.html)
3. [迴歸評價指標MSE、RMSE、MAE、R-Squared](https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/404042/)
4. [Log Loss](http://wiki.fast.ai/index.php/Log_Loss)
5. [Hinge Loss、交叉熵损失、平方损失、指数损失、对数损失、0-1损失、绝对值损失](https://www.cnblogs.com/nxf-rabbit75/p/10440805.html)
6. [机器学习中的各种“熵”](https://lumingdong.cn/various-entropies-in-machine-learning.html#%E4%BA%A4%E5%8F%89%E7%86%B5%EF%BC%88cross_entropy%EF%BC%89)
7. [确定不收藏？机器学习必备的分类损失函数速查手册](https://redstonewill.com/1584/)
8. [机器学习中常见的损失函数](https://blog.csdn.net/colourful_sky/article/details/80057445)
9. [机器学习中的目标函数总结](https://zhuanlan.zhihu.com/p/44722270)
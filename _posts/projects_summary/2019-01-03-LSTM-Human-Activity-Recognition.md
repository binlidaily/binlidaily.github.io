---
layout: post
title: Human Activity Recognition
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　这是之前实习的时候做过的一个类似项目，用传感器信息来分析当前手机使用者的状态，目标是用来打击黑产。

## 数据

数据结构：

* 一行是一个特征下所有的时间步下的特征
* 连续多行构成一个输入维度

输入数据是一个张量：

``` python
timesteps = len(X_train[0])				# 时间步
input_dim = len(X_train[0][0])
n_classes = _count_classes(Y_train)
```

```python
Resultant shape is (7352 train/2947 test samples, 128 timesteps, 9 signals)
```





## References
1. [LSTMs for Human Activity Recognition](https://github.com/guillaume-chevalier/LSTM-Human-Activity-Recognition)
1. [Human-Activity-Recognition-Using-Smartphones-Sensor-DataSet](https://github.com/MadhavShashi/Human-Activity-Recognition-Using-Smartphones-Sensor-DataSet)

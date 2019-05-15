---
layout: post
title: Collection of Utilities
subtitle:
author: Bin Li
tags: [Competitions]
image: 
comments: true
published: false
---

## 数据运算 （Data Operation）
### 计算方差
```python
def calculate_variance(X):
    """ Return the Variance of features in Dataset X"""
    mean = np.ones(np.shape(X)) * X.mean(0)   # mean of every columns
    n_samples = np.shape(X)[0]
    variance = (1 / n_samples) * np.diag((X - mean).T.dot(X - mean))
    
    return variance
```

## 数据操作（Data Manipulation）



















### 数据标准化（Data Standarization）

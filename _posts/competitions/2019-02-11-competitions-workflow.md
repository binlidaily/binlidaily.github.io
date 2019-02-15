---
layout: post
title: Competitions Workflow
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

## 数据处理
看数据的整体情况：
```python
train_df.describe()
train_df.info()
```

### 1、空值处理
```python
train_df.isnull().sum()
train_df.isna().sum()
```

对空值或者非数字字符填充对应的数值：

```python
# Fill NA/NaN values using the specified method
# imputing missing data
# numerical data
combi['Item_Weight'].fillna(combi['Item_Weight'].mean(), inplace = True)
# categorical data
combi['Outlet_Size'].fillna("missing", inplace = True)
```

看每个特征的类型：
1. Categorical Data（标称型）
2. Numerical/Continual Data（数值型）
3. Ordinal Data（序数型）
4. Time Data（时间型）

## 特征转化
标称型数据要用独热编码（One-Hot Encoding）。
## References
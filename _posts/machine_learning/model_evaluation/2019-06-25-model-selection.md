---
layout: post
title:  Model Selection
subtitle: 模型选择
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

交叉验证，分层交叉验证（训练集和测试集中的不同类平衡问题），留一法。

![-w809](/img/media/15614280810659.jpg)


```python
# StratifiedKFold用法类似Kfold，但是他是分层采样，确保训练集，测试集中各类别样本的比例与原始数据集中相同。
folder = StratifiedKFold(n_splits=3, shuffle=True)
```

为元参数寻找最优值意味着需要多次重用验证集。而重用验证集又意味着它们也成为了训练过程的一部分。在上面提到的方法中，有限的实例集中的每一个实例都被用于各种用途，而合理的做法 是，需要将数据分为 3 个集合: 一个训练集、一个验证集和一个（最后的）测试集。其中测试 集仅在最后测试性能时用到一次。

## References
1. 《机器学习与优化》
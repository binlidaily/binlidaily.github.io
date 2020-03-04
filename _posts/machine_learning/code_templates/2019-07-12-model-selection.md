---
layout: post
title: Model Selection
subtitle: 
author: Bin Li
tags: [Model Selection, Python]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　模型选择在实践中非常重要，这里对常用的函数进行总结，方便查看。


```python
# 以 moons 数据集为例
from sklearn.datasets import make_moons
X, y = make_moons(n_samples=10000, noise=0.4, random_state=42)

# 划分数据
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 用 grid search 找最佳参数，并利用 CV 做选择
from sklearn.model_selection import GridSearchCV
params = {'max_leaf_nodes': list(range(2, 100)), 'min_samples_split': [2, 3, 4]}
grid_search_cv = GridSearchCV(DecisionTreeClassifier(random_state=42), params, n_jobs=-1, verbose=1, cv=3)
grid_search_cv.fit(X_train, y_train)
## 查看最优的参数组合
grid_search_cv.best_estimator_

# 拿最优的参数组合来预测，默认用最优的
from sklearn.metrics import accuracy_score
y_pred = grid_search_cv.predict(X_test)
accuracy_score(y_test, y_pred)
```

## References
1. [Chapter 6 – Decision Trees](https://github.com/ageron/handson-ml/blob/master/06_decision_trees.ipynb)
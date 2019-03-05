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

特征列比较多，可以查看所有的列：
```python

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
标称型数据要用独热编码（One-Hot Encoding），有好多种的编码实现方式，整理下这几个之间的区别：
* Categorical Encoding
* Sklearn LabelEncoder (将数据处理成 0 到 n_class-1 的结果)
* Sklearn OneHotEncoder （将数据的一个特征以 n_class-1 列的向量表示，用0、1来表示取值，有顺序关系的？）
* Pandas Categorical dtype
* pandas.get_dummies (针对字符类型会变成One-hot，数字类型会保留原有的！)

```python
onehot_encoder = OneHotEncoder(sparse=False)
train_OneHotEncoded = onehot_encoder.fit_transform(train_Embarked)
test_OneHotEncoded = onehot_encoder.fit_transform(test_Embarked)

copy_df["EmbarkedS"] = train_OneHotEncoded[:,0]
copy_df["EmbarkedC"] = train_OneHotEncoded[:,1]
copy_df["EmbarkedQ"] = train_OneHotEncoded[:,2]
copyTest_df["EmbarkedS"] = test_OneHotEncoded[:,0]
copyTest_df["EmbarkedC"] = test_OneHotEncoded[:,1]
copyTest_df["EmbarkedQ"] = test_OneHotEncoded[:,2]
```

## 算法训练
因为树形算法（决策树及其衍生算法）不需要考虑特征的类型（标称型还是离散型），所以可以直接先拿树形算法跑一下，找到各个特征的重要程度。

### k 轮交叉验证
```python
# k-cv
N_FOLDS = 5
y = train_df['score']
kfold = StratifiedKFold(n_splits=N_FOLDS, shuffle=True, random_state=2019)
kf = kfold.split(X, y)

# iteration
cv_pred = np.zeros(test_df.shape[0])

count = 0
for i, (train_idx, test_idx) in enumerate(kf):
    print('fold: ',i, ' training')
    X_train, X_test, y_train, y_test = X.iloc[train_idx, :], X.iloc[test_idx, :], y.iloc[train_idx], y.iloc[test_idx]
```

### 提交结果
```python
submit_df = test_df[['uid']]
submit_df['score'] = cv_pred
submit_df.columns = ['id', 'score']

# int
submit_df['score'] = submit_df['score'].apply(lambda x: int(np.round(x)))
submit_df.to_csv('./submission/baseline_0.06357.csv', index=False)
```

## References
1. [【持续更新】机器学习特征工程实用技巧大全](https://zhuanlan.zhihu.com/p/26444240)
2. [Understanding Feature Engineering (Part 1) — Continuous Numeric Data](https://towardsdatascience.com/understanding-feature-engineering-part-1-continuous-numeric-data-da4e47099a7b)
3. [AI圈-人工智能竞赛Top解决方案](https://github.com/AI-Sphere/Awesome-AI-Competitions)
4. [Data Science Challenge / Competition](https://iphysresearch.github.io/DataSciComp/?sub=PF%2CAC%2CDM%2CCV%2CNLP%2CRL%2CSP%2CIT)
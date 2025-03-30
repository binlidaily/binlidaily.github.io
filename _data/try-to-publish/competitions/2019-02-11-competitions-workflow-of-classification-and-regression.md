---
layout: post
title: Competitions Workflow Of Classification And Regression
subtitle: 分类和回归类型比赛的流程整理
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

为了方便以后快速上手，整理下流程，这里只针对分类和回归问题。

## 1. 数据观察与处理
看数据的整体情况：
```python
# 数据基本情况（缺失值、个字段数据类型）
train_df.info()
# 数值型字段的统计分布
train_df.describe()
```

如果用的是 Jupyter 而特征列比较多时，可以查看所有的列：
```python
import matplotlib.pyplot as plt
# show more columns with trian_df.describe()
pd.set_option('display.max_columns', 50)
```

### 1.1 空值处理
```python
train_df.isnull().sum()
# 二者等价
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



### 1.2 EDA
观察变量的密度曲线（找寻浮点型特征规律）：
```python
# 将认为有问题的可以看下密度曲线
plt.figure(figsize=(8, 6))
# train_df['用户近6个月平均消费值（元）'].plot(kind='kde')
sns.kdeplot(train_df['用户近6个月平均消费值（元）'])
```

在类别特征中不同取值下，观察目标变量的分布：
```python
check_feat = '当月是否看电影'
train_df[check_feat].value_counts()

for val in train_df[check_feat].unique():
    plt.figure(figsize=(8, 6))
    sns.distplot(train_df.loc[train_df[check_feat] == val, '信用分'].values, bins=50, kde=False)
```

观察顺序性的数值型字段（有大小关系的）和目标变量的相关关系（单变量）：

```python
x_cols = [col for col in train_df.columns if col not in ['信用分'] if train_df[col].dtype != 'object']

labels = []
values = []
for col in x_cols:
    labels.append(col)
    values.append(np.corrcoef(train_df[col].values, train_df['信用分'].values)[0, 1])
corr_df = pd.DataFrame({'cols_labels': labels, 'corr_values': values})
corr_df = corr_df.sort_values(by='corr_values')

idx = np.arange(len(labels))
width = 0.5

fig, ax = plt.subplots(figsize=(12, 40))
rects = ax.barh(idx, np.array(corr_df['corr_values'].values), color='y')
ax.set_yticks(idx)
ax.set_yticklabels(corr_df['cols_labels'].values, rotation='horizontal')
ax.set_xlabel('Correlation coefficient')
ax.set_title('Correlation coefficient of the variables')
```

观察所有连续变量之间的两两相关关系：

```python
corr_mat = train_df.corr(method='spearman')
f, ax = plt.subplots(figsize=(12, 12))

sns.heatmap(corr_mat, vmax=1., square=True)
plt.title('Important variables correlation map', fontsize=15)
```

## 2. 特征工程
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

看每个特征的类型：
1. Categorical Data（标称型）
2. Numerical/Continual Data（数值型）
3. Ordinal Data（序数型）
4. Time Data（时间型）

## References
1. [【持续更新】机器学习特征工程实用技巧大全](https://zhuanlan.zhihu.com/p/26444240)
2. [Understanding Feature Engineering (Part 1) — Continuous Numeric Data](https://towardsdatascience.com/understanding-feature-engineering-part-1-continuous-numeric-data-da4e47099a7b)
3. [AI圈-人工智能竞赛Top解决方案](https://github.com/AI-Sphere/Awesome-AI-Competitions)
4. [Data Science Challenge / Competition](https://iphysresearch.github.io/DataSciComp/?sub=PF%2CAC%2CDM%2CCV%2CNLP%2CRL%2CSP%2CIT)
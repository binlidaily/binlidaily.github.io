---
layout: post
title: "传统机器学习的应用流程总结"
author: "Bin Li"
tags: [Competitions]
category: ""
comments: true
published: ture
---

## 探索性的可视化
一般可以用到 seaborn 库做可视化，找到一些异常点去除掉。

对类别特征进行绘图分析：
```python
sns.countplot(x='Survived', data=train_df)
```
![](/img/media/15393321529801.jpg)

拼接多个类别特征进行绘图分析：
```python
# explore the relationship between Survived and Pclass
sns.factorplot(x='Survived', col='Pclass', kind='count', data=train_df)
# this make the x-label rotate 45°
# plt.xticks(rotation=45)
```
![](/img/media/15393321990639.jpg)

对数值特征进行绘图分析：
```python
sns.distplot(df_train.Fare, kde=False)
```
![](/img/media/15393350239731.jpg)

画散点图，其中一个是标签类型：
```python
sns.stripplot(x='Survived',
             y='Fare',
             data=train_df,
             alpha=0.3,
             jitter=True)
```
![](/img/media/15393364294278.jpg)

Draw a categorical scatterplot with non-overlapping points:
```python
sns.swarmplot(x='Survived',
             y='Fare',
             data=train_df)
```
![](/img/media/15393365644325.jpg)

颜色区分标签，X轴、Y轴是两类特征的绘图分析：
```python
sns.lmplot(x='Age',
          y='Fare',
          hue='Survived',
          data=train_df,
          fit_reg=False,
          scatter_kws={'alpha':0.5})
```
![](/img/media/15393488202275.jpg)

上面的操作中，将`fit_reg`设置为True就能绘制fit的直线。

想要看类似每一对特征的数据绘制分析图：
```python
sns.pairplot(train_df_dropna, hue='Survived')
```
![](/img/media/15394198766858.jpg)



## 数据清洗
处理缺省值，可以用平均值，众数，计数等替换。

## 特征工程
数值型转换为类标类型，可以根据连续特征的众数和平均数做一个认为的映射，映射到对应的类别上。（这里其实应该也可以用one-hot）

我们可以尽量多的创造出特征，而且相信模型能够选出正确的特征。

### Numerical Features

### Categorical Features
#### Encode categorical features into numerical ones
直接离散化，从0开始以自然数增长的形式加以区别每个类：
```python
# Factorize the values 
labels, uniques = pd.factorize(trian_df.Class)

# Save the encoded variables in `iris.Class`
trian_df.Class = labels

# Print out the first rows
trian_df.Class.head()
```

#### Scale Features
将离散数据归一化到在零附近。

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler().fit(X)

rescaledX = scaler.transform(X)
```

#### Bin continuous variables in groups
```python
# Define the bins
mybins = range(0, df.age.max(), 10)

# Cut the data from the DataFrame with the help of the bins
df['age_bucket'] = pd.cut(df.age, bins=mybins)

# Count the number of values per bucket
df['age_bucket'].value_counts()
```

### 管道
当有了管道，做特征组合就好做很多。

## 特征选择 
可以用 Lasso，Ridge，RandomForest 或者 GradientBoostingTree计算出各个特征的权重，然后按照比例选择。

### 利用决策树计算每个特征的重要性

```python
# Import `RandomForestClassifier`
from sklearn.ensemble import RandomForestClassifier

# Isolate Data, class labels and column values
X = train_df.iloc[:,0:4]
Y = train_df.iloc[:,-1]
names = iris.columns.values

# Build the model
rfc = RandomForestClassifier()

# Fit the model
rfc.fit(X, Y)

# Print the results
print("Features sorted by their score:")
print(sorted(zip(map(lambda x: round(x, 4), rfc.feature_importances_), names), reverse=True))
```

可以通过绘图来直观地找出重要性较大的特征：
```python
# Isolate feature importances 
importance = rfc.feature_importances_

# Sort the feature importances 
sorted_importances = np.argsort(importance)

# Insert padding
padding = np.arange(len(names)-1) + 0.5

# Plot the data
plt.barh(padding, importance[sorted_importances], align='center')

# Customize the plot
plt.yticks(padding, names[sorted_importances])
plt.xlabel("Relative Importance")
plt.title("Variable Importance")

# Show the plot
plt.show()
```
![](/img/media/15394280464000.jpg)


## 集成
### 权重平均
通过普通的集成，能够提取一些特征，这些特征可以和原特征整合到一起。


---

## 机器学习应用模板
### 数据导入

### 数据处理


### 线下验证
#### 计算训练数据上的准确率
```python
# Compute accuracy on the training set
train_accuracy = clf.score(X, y)
```

#### 利用有标签的训练数据进行调参
```python
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42, stratify=y)

# ----------------------------------------
# Setup arrays to store train and test accuracies
dep = np.arange(1, 9)
train_accuracy = np.empty(len(dep))
test_accuracy = np.empty(len(dep))

# Loop over different values of k
for i, k in enumerate(dep):
    # Setup a k-NN Classifier with k neighbors: knn
    clf = tree.DecisionTreeClassifier(max_depth=k)

    # Fit the classifier to the training data
    clf.fit(X_train, y_train)

    # Compute accuracy on the training set
    train_accuracy[i] = clf.score(X_train, y_train)

    # Compute accuracy on the testing set
    test_accuracy[i] = clf.score(X_test, y_test)

# Generate plot
plt.title('clf: Varying depth of tree')
plt.plot(dep, test_accuracy, label = 'Testing Accuracy')
plt.plot(dep, train_accuracy, label = 'Training Accuracy')
plt.legend()
plt.xlabel('Depth of tree')
plt.ylabel('Accuracy')
plt.show()
```
利用通过plot出来的准确率走势图看出参数取值多少时最好，很明显这里我们选择了`max_depth=3`。
![](/img/media/15394209074718.jpg)

进一步可以通过Grid Search和CV来找到更好的参数`max_depth`：
```python
# Setup the hyperparameter grid
dep = np.arange(1,9)
param_grid = {'max_depth' : dep}

# Instantiate a decision tree classifier: clf
clf = tree.DecisionTreeClassifier()

# Instantiate the GridSearchCV object: clf_cv
clf_cv = GridSearchCV(clf, param_grid=param_grid, cv=5)

# Fit it to the data
clf_cv.fit(X, y)

# Print the tuned parameter and score
print("Tuned Decision Tree Parameters: {}".format(clf_cv.best_params_))
print("Best score is {}".format(clf_cv.best_score_))
```
输出如下：
```python

Tuned Decision Tree Parameters: {'max_depth': 3}
Best score is 0.8294051627384961
```

接着我们可以基于此时找到的比较好的参数的模型`clf_cv`来进行预测：
```python
Y_pred = clf_cv.predict(test)
df_test['Survived'] = Y_pred
df_test[['PassengerId', 'Survived']].to_csv('results/dec_tree_feat_eng.csv', index=False)
```

### 结果整理
#### 拆分数据
```python
train_X = features_positive[:train_df.shape[0]]
test_X = features_positive[train_df.shape[0]:]
```
### 交叉验证
```python
x_score = []
cv_pred = []

skf = StratifiedKFold(n_splits=n_splits, random_state=seed, shuffle=True)

for index, (train_index, test_index) in enumerate(skf.split(X_train, y_train)):
    print('---------------->', index) # 0-4
    
    X_tra, X_val, y_tra, y_val = X_train[train_index], X_train[test_index], y_train[train_index], y_train[test_index]
    
    clf = KNeighborsClassifier(n_neighbors=15)
    clf.fit(X_tra, y_tra)
    
    y_pred = clf.predict(X_val)
    y_pred = [np.argmax(item) for item in y_pred]

    x_score.append(f1_score(y_val, y_pred, average='weighted'))
    
    # for whole testing set
    y_test = clf.predict(X_test)
    y_test = [np.argmax(item) for item in y_test]
    
    if index == 0:
        cv_pred = np.array(y_test).reshape(-1, 1)
    else:
        cv_pred = np.hstack((cv_pred, np.array(y_test).reshape(-1, 1)))
```

### 导出结果
```python
# vote for the results
y_pred = []

for line in cv_pred:
    # bincount: Count number of occurrences of each value in array of non-negative ints.
    y_pred(np.argmax(np.bincount(line)))

# without cv just start from here
my_submission = pd.DataFrame({'PassengerId': passenger_id, 'Survived': y_pred})
my_submission.to_csv('auto_ft_submission.csv', index=False)
```

## Reference
1. [All You Need is PCA (LB: 0.11421, top 4%)](https://www.kaggle.com/massquantity/all-you-need-is-pca-lb-0-11421-top-4)
2. [Kaggle 首战拿银总结 | 入门指导 (长文、干货）](https://zhuanlan.zhihu.com/p/26645088)
3. ❇️ [EDA, Machine Learning, Feature Engineering, and Kaggle](https://ugoproto.github.io/ugo_py_doc/EDA_Machine_Learning_Feature_Engineering_and_Kaggle/)
4. [Automatic extraction of relevant features from time series](https://github.com/blue-yonder/tsfresh)


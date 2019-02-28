---
layout: post
title: Exploratory Data Analysis
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

EDA 最重要的就是用来找到有用的特征。 kind : {point, bar, count, box, violin, strip}

### Confusion Matrix
The left diagonal shows the number of correct predictions made for each class while the right diagonal shows the number of wrong prredictions made. 

<p align="center">
  <img width="" height="" src="/img/media/15497143871291.jpg">
</p>


Similar to the relational plots, it’s possible to add another dimension to a categorical plot by using a `hue` semantic. 如果需要看某一个特征在某一个标称型特征取值上的不同分布可以用 `hue` 来指定这个标称型特征。


## 一、柱状图（直方图）
### 1.1 sns.countplot 
针对标称类型比较常用：

```python
sns.countplot(x='Sex', data=df_train)
# sns.countplot(df_train['Sex'])
```
<p align="center">
  <img width="" height="" src="/img/media/15512470426193.jpg">
</p>

### 1.4 sns.barplot
对两个特征进行直方图查看，x 轴最好是标称类型的特征：
```python
sns.barplot('cost_sensitivity', 'score', data=train_df)
# sns.barplot(train_df['cost_sensitivity'], train_df['score'])
```

<p align="center">
  <img width="" height="" src="/img/media/15512500138791.jpg">
</p>

可以看到，barplot是一个柱状图上面加一个黑线。
柱状图的值默认情况下对应的要显示的样本的均值，本图中也就是 32.5，而黑线默认情况则标识了95%的置信区间。
何为95%的置信区间？95%的置信区间指的是对于当前样本所属的分布而言，当有个新的值产生时，这个值有95%的可能性在该区间内，5%的可能性不在该区间内。
我们可以通过速算公式计算95%的置信区间，范围为（26.5，37.5），跟上图可以对应上。
由此可见，barplot主要用来描述样本的均值和置信区间（置信区间本质上应该算是对整个分布的预估，而不仅仅是展示当前样本里面的信息）。


### 1.2 df.hist
用 Pandas 的 DataFrame 类型额 hist 函数也可以画出类似的直方图。如果不选择对应的特征（如 age）则绘制出所有特征的直方图，可以大致看出每个特征的分布。
```python
train_df['age'].hist()
```

<p align="center">
  <img width="" height="" src="/img/media/15512474161501.jpg">
</p>

### 1.3 df.value_counts().plot.bar()
当处理一个特征的计数、均值等统计量时，可以用这种形式画出直方图。

```python
train_df['cost_sensitivity'].value_counts().plot.bar()
```

<p align="center">
  <img width="" height="" src="/img/media/15512489380381.jpg">
</p>

## 二、散点图
### 2.1 plt.scatter
这个需要提供 x 和 y 轴，如果是分析一列特征的话，可以用如下的方式：
```python
plt.scatter(range(train_df.shape[0]), np.sort(train_df['score'].values))
```

<p align="center">
  <img width="" height="" src="/img/media/15512509414576.jpg">
</p>

### 2.2 sns.stripplot
当一个是标称类型绘制的散点图:
```python
sns.stripplot(x="day", y="total_bill", data=tips_df, jitter=0.05)
```

<p align="center">
  <img width="400" height="" src="/img/media/15512524816477.jpg">
</p>


## 大规模批量处理
### pd.plotting.scatter_matrix
查看多个变量之间的联系，首先看每对特征之间的关系，一次方便找出有结构的特征：
```python
# scatter plot matrix
pd.plotting.scatter_matrix(df_train, figsize=(10,10))
plt.figure();
```

![](/img/media/15497164413654.jpg)


### pairplot
```python
# Using seaborn pairplot to see the bivariate relation between each pair of features
sns.pairplot(df_train, hue="Sex");
```
![](/img/media/15497166516619.jpg)

### df.hist
```python
train_df.hist(figsize=(20, 30))
plt.figure()
```

![-w415](/img/media/15512519310768.jpg)



### 饼状图
```python
train_df['cost_sensitivity'].value_counts().plot.pie(autopct='%1.1f%%',shadow=True)
```
![](/img/media/15512485792581.jpg)


## 查看多个特征的相互作用
### violinplots
x 轴最好是标称型特征。

```python
sns.violinplot("Pclass", "Age", hue="Survived", data=df_train, split=True)
```

![-w356](/img/media/15512516164114.jpg)

### Box plot (箱位图)
通过四分位点来查看数据分布，x 轴上的特征最好为标称型特征：
```python
sns.boxplot(x="Pclass", y="Age", data=df_train)
plt.show()
```

### kdeplot
查看 kernel density estimate 的时候可以用：
```python
sns.kdeplot(train_df['score'], train_df['age'], shade=True, cbar=True)
```

![](/img/media/15512379906946.jpg)


### sns.jointplot
查看两个变量：

```python
sns.jointplot(x='Fare',y='Age' ,data=df_train, kind='reg');
```
![](/img/media/15497171771824.jpg)

### Swarm plot
```python
sns.swarmplot(x='Pclass',y='Age',data=df_train);
```
![](/img/media/15497172962556.jpg)

### Correlation （Heatmap）
只有数值类型的特征才会计算对应的 Correlation。

* POSITIVE CORRELATION: If an increase in feature A leads to increase in feature B, then they are positively correlated. A value 1 means perfect positive correlation.

* NEGATIVE CORRELATION: If an increase in feature A leads to decrease in feature B, then they are negatively correlated. A value -1 means perfect negative correlation.

Now lets say that two features are highly or perfectly correlated, so the increase in one leads to increase in the other. This means that both the features are containing highly similar information and there is very little or no variance in information. This is known as MultiColinearity as both of them contains almost the same information.

```python
plt.figure(figsize=(7,4)) 
sns.heatmap(df_train.corr(),annot=True,cmap='cubehelix_r') #draws  heatmap with input as the correlation matrix calculted by(iris.corr())
plt.show();
```

![](/img/media/15497173437296.jpg)



## 多特征综合分析
### factorplot
```python
sns.factorplot('Pclass','Survived',hue='Sex',data=df_train)
plt.show();
```
![](/img/media/15497174557705.jpg)

这些线段是置信区间。

### sns.catplot
```python
sns.catplot(x="time", y="pulse", hue="kind", data=exercise)
```

![](/img/media/15512681739777.jpg)



### distplot
```
sns.distplot(train_df['score']) 
```

![](/img/media/15512388080846.jpg)



### sns.lmplot
绘制数据并且用回归模型拟合画出拟合结果：

```python
sns.lmplot(x='Age', 
           y='Fare', 
           hue='Survived', 
           data=df_train, 
           fit_reg=True, scatter_kws={'alpha':0.5})
```
![](/img/media/15512478769956.jpg)


## Grid 方式
想一口气看一个特征不同取值下的分布：
```python
# Modify the graph above by assigning each species an individual color.
g = sns.FacetGrid(df_train, hue="Survived", col="Pclass", margin_titles=True, palette={1:"seagreen", 0:"gray"})
g=g.map(plt.scatter, "Fare", "Age",edgecolor="w").add_legend();
```
![](/img/media/15497150165341.jpg)




## Feature Engineering
EDA 最重要的就是用来找到有用的特征，这里就从特征工程目的出发划分这些工具的类别方便查找使用。

### 查看特征的分布
对于单个离散的特征，可以用：
* **sns.distplot()**
* sns.kdeplot()

对于单个类别的特征，可以用：
* sns.countplot
* df.hist
* df.value_counts().plot.bar()


对于查看两个离散特征，可以用：
* sns.kdeplot()
* sns.lmplot()
* **sns.jointplot()**

对于一个标称类型，一个离散类型，可以用：
* sns.barplot()
* sns.factorplot()
* sns.swarmplot()
* sns.violinplot()
* sns.boxplot()
* sns.stripplot

对于两个标称类型，可以用：
* sns.factorplot()
* sns.catplot


Categorical scatterplots:

stripplot() (with kind="strip"; the default)
swarmplot() (with kind="swarm")
Categorical distribution plots:

boxplot() (with kind="box")
violinplot() (with kind="violin")
boxenplot() (with kind="boxen")
Categorical estimate plots:

pointplot() (with kind="point")
barplot() (with kind="bar")
countplot() (with kind="count")

## References
1. [Steering Wheel of Fortune - Porto Seguro EDA](https://www.kaggle.com/headsortails/steering-wheel-of-fortune-porto-seguro-eda)
2. [EDA To Prediction(DieTanic)](https://www.kaggle.com/ash316/eda-to-prediction-dietanic)
3. [A Comprehensive ML Workflow with Python](https://www.kaggle.com/mjbahmani/a-comprehensive-ml-workflow-with-python)
4. [Data Visualization in Python: Advanced Functionality in Seaborn](https://blog.insightdatascience.com/data-visualization-in-python-advanced-functionality-in-seaborn-20d217f1a9a6)
5. [EDA, Machine Learning, Feature Engineering, and Kaggle](https://ugoproto.github.io/ugo_py_doc/EDA_Machine_Learning_Feature_Engineering_and_Kaggle/)
6. [数据可视化入门（一）——用seaborn进行单变量分析 ](https://www.jianshu.com/p/361ca66e9224)
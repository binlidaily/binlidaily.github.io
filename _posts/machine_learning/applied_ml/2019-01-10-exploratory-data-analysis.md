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



### Confusion Matrix
The left diagonal shows the number of correct predictions made for each class while the right diagonal shows the number of wrong prredictions made. 


![](/img/media/15497143871291.jpg)

## Visualization
### Scatter plot
Scatter plot 主要用来看两个数值变量的关系。

```python
# Modify the graph above by assigning each species an individual color.
g = sns.FacetGrid(df_train, hue="Survived", col="Pclass", margin_titles=True,
                  palette={1:"seagreen", 0:"gray"})
g=g.map(plt.scatter, "Fare", "Age",edgecolor="w").add_legend();
```
![](/img/media/15497150165341.jpg)

```python
plt.figure(figsize=(8,6))
plt.scatter(range(df_train.shape[0]), np.sort(df_train['Age'].values))
plt.xlabel('index')
plt.ylabel('Survived')
plt.title('Explore: Age')
plt.show()
```
![](/img/media/15497150348424.jpg)

### Box plot
通过四分位点来查看数据分布：
```python
ax= sns.boxplot(x="Pclass", y="Age", data=df_train)
ax= sns.stripplot(x="Pclass", y="Age", data=df_train, jitter=True, edgecolor="gray")
plt.show()
```

### Histogram
查看直方图：
```python
# histograms
df_train.hist(figsize=(15,20));
plt.figure();
```
![](/img/media/15497155726550.jpg)

查看是否符合正态分布：
```python
df_train["Age"].hist();
```
![](/img/media/15497156832071.jpg)

```python
f,ax=plt.subplots(1,2,figsize=(20,10))
df_train[df_train['Survived']==0].Age.plot.hist(ax=ax[0],bins=20,edgecolor='black',color='red')
ax[0].set_title('Survived= 0')
x1=list(range(0,85,5))
ax[0].set_xticks(x1)
df_train[df_train['Survived']==1].Age.plot.hist(ax=ax[1],color='green',bins=20,edgecolor='black')
ax[1].set_title('Survived= 1')
x2=list(range(0,85,5))
ax[1].set_xticks(x2)
plt.show()
```
![](/img/media/15497157169135.jpg)

饼状图和直方图：
```python
f,ax=plt.subplots(1,2,figsize=(18,8))
df_train['Survived'].value_counts().plot.pie(explode=[0,0.1],autopct='%1.1f%%',ax=ax[0],shadow=True)
ax[0].set_title('Survived')
ax[0].set_ylabel('')
sns.countplot('Survived',data=df_train,ax=ax[1])
ax[1].set_title('Survived')
plt.show()
```
![](/img/media/15497158030260.jpg)

```python
f,ax=plt.subplots(1,2,figsize=(18,8))
df_train[['Sex','Survived']].groupby(['Sex']).mean().plot.bar(ax=ax[0])
ax[0].set_title('Survived vs Sex')
sns.countplot('Sex',hue='Survived',data=df_train,ax=ax[1])
ax[1].set_title('Sex:Survived vs Dead')
plt.show()
```
![](/img/media/15497158146835.jpg)

计数直方图：
```python
sns.countplot('Pclass', hue='Survived', data=df_train)
plt.title('Pclass: Sruvived vs Dead')
plt.show()
```

![](/img/media/15497162272664.jpg)

### Multivariate Plots
查看多个变量之间的联系，首先看每对特征之间的关系，一次方便找出有结构的特征：
```python
# scatter plot matrix
pd.plotting.scatter_matrix(df_train,figsize=(10,10))
plt.figure();
```
![](/img/media/15497164413654.jpg)

### violinplots
```python
# violinplots on petal-length for each species
sns.violinplot(data=df_train,x="Sex", y="Age")
```
![](/img/media/15497166218833.jpg)


```python
f,ax=plt.subplots(1,2,figsize=(18,8))
sns.violinplot("Pclass","Age", hue="Survived", data=df_train,split=True,ax=ax[0])
ax[0].set_title('Pclass and Age vs Survived')
ax[0].set_yticks(range(0,110,10))
sns.violinplot("Sex","Age", hue="Survived", data=df_train,split=True,ax=ax[1])
ax[1].set_title('Sex and Age vs Survived')
ax[1].set_yticks(range(0,110,10))
plt.show()
```
![](/img/media/15497166334407.jpg)

### pairplot
```python
# Using seaborn pairplot to see the bivariate relation between each pair of features
sns.pairplot(df_train, hue="Sex");
```
![](/img/media/15497166516619.jpg)

### kdeplot
查看 kernel density estimate 的时候可以用：
```python
sns.kdeplot(train_df['score'], train_df['age'], shade=True, cbar=True)
```

### joinplot
```python
sns.jointplot(x='Fare',y='Age',data=df_train);
```
![](/img/media/15497167800899.jpg)

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

### Bar Plot
```python
df_train['Pclass'].value_counts().plot(kind="bar");
```

![](/img/media/15497173760162.jpg)

### Factorplot
```python
sns.factorplot('Pclass','Survived',hue='Sex',data=df_train)
plt.show();
```
![](/img/media/15497174557705.jpg)

```python
sns.factorplot('SibSp','Survived',hue='Pclass',data=df_train)
plt.show()
```
![](/img/media/15497175493301.jpg)

```python
#let's see some others factorplot
f,ax=plt.subplots(1,2,figsize=(20,8))
sns.barplot('SibSp','Survived', data=df_train,ax=ax[0])
ax[0].set_title('SipSp vs Survived in BarPlot')
sns.factorplot('SibSp','Survived', data=df_train,ax=ax[1])
ax[1].set_title('SibSp vs Survived in FactorPlot')
plt.close(2)
plt.show();
```

![](/img/media/15497186312487.jpg)

### distplot
```python
f,ax=plt.subplots(1,3,figsize=(20,8))
sns.distplot(df_train[df_train['Pclass']==1].Fare,ax=ax[0])
ax[0].set_title('Fares in Pclass 1')
sns.distplot(df_train[df_train['Pclass']==2].Fare,ax=ax[1])
ax[1].set_title('Fares in Pc
```
```lass 2')
sns.distplot(df_train[df_train['Pclass']==3].Fare,ax=ax[2])
ax[2].set_title('Fares in Pclass 3')
plt.show()  
```

![](/img/media/15497186954700.jpg)

想一口气看一个特征不同取值下的分布：
```python
g = sns.FacetGrid(df, col="origin") 
g.map(sns.distplot, "mpg")
```
![](/img/media/15506669821279.jpg)

```python
g = sns.FacetGrid(df, col="origin") 
g.map(sns.distplot, "mpg")
```
![](/img/media/15506679946357.jpg)

## References
1. [Steering Wheel of Fortune - Porto Seguro EDA](https://www.kaggle.com/headsortails/steering-wheel-of-fortune-porto-seguro-eda)
2. [EDA To Prediction(DieTanic)](https://www.kaggle.com/ash316/eda-to-prediction-dietanic)
3. [A Comprehensive ML Workflow with Python](https://www.kaggle.com/mjbahmani/a-comprehensive-ml-workflow-with-python)
4. [Data Visualization in Python: Advanced Functionality in Seaborn](https://blog.insightdatascience.com/data-visualization-in-python-advanced-functionality-in-seaborn-20d217f1a9a6)
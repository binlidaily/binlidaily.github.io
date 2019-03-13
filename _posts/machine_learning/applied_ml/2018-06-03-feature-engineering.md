---
layout: post
title: Feature Engineering
author: Bin Li
tags: [Machine Learning]
category: ""
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

在机器学习应用中，特征工程扮演着重要的角色。数据和特征决定了机器学习算法的上限，而模型的算法只是不断逼近这个上限而已。特征工程（Feature Engineering）介于“数据”和“模型”之间，是利用数据的专业领域知识和现有数据，从源数据中抽取出来对预测结果有用的信息，用在机器学习算法上的过程。美国计算机科学家 Peter Norvig 有两句经典的名言：
* “基于大量数据的简单模型胜过基于少量数据的复杂模型。”
* “更多的数据胜过聪明的算法，而好的数据胜过多的数据。”

吴恩达更是说过“应用机器学习基本上就是特征工程”。对于工业界来说，大部分复杂模型的算法精进都是资深的数据科学家的任务，大部分人员的工作还是跑数据、map-reduce，hive SQL，数据仓库搬砖，做一些业务分析、数据清洗、特征工程（找特征）的工作。

特征工程一般分成特征提取 (Feature Extraction) 和特征选择 (Feature Selection) 两个方面，接下来分别更细致地介绍:

## 特征提取 (Feature Extraction) 
特征的挖掘一般跟专业领域知识强相关，特征工程可以说是业务逻辑的一种数据层面的表示。

### 1. 探索性数据分析 (Exploratory Data Analysis, EDA)
EDA 的目的是尽可能地洞察数据集、发现数据的内部结构、提取重要的特征、检查异常值、检验基本假设、建立初步的模型。EDA 技术一般分为两类：
* 可视化技术
    * 箱型图、直方图、多变量图、链图、帕累托图、散点图、茎叶图
    * 平行坐标、让步比、多维尺度分析、目标投影追踪
    * 主成分分析、降维、非线性降维等
* 定量技术
    * 样本均值、方差分位数、峰度、偏度等

细节可以参考之前整理过的有关 EDA 的[博文](https://binlidaily.github.io/2019-01-10-exploratory-data-analysis/)。

### 2. 数值特征 /定量特征 (Numerical Features)
对于数值特征，我们主要考虑的因素是它的**大小和分布**，一般分为`连续型`（身高体重等）和`离散型`（计数等）。对于那些目标变量为输入特征的**光滑函数**的模型，例如线性回归、逻辑回归等，其对输入特征的大小很敏感，所以需要归一化。也就是说我们需要进行特征变换来满足非线性模型的假设，还可以进行特征交叉提升模型的表达能力，让线性模型具有非线性模型的性质。以下介绍几种常见的数值特征的处理方法。

### 2.1 截断 / 离群点盖帽？
* 对于连续型数值特征，超出合理范围的很可能是噪声，需要截断
* 在保留重要信息的前提下进行截断，截断后的也可作为类别特征
* 长尾数据可以先进行对数变换，再截断

一般的做法是在 EDA 后看到某特征有一些离群点，就可以用截断的方式将其处理一下：
```python
up_limit = np.percentile(data_df[col].values, 99.9) # 99.9%分位数
low_limit = np.percentile(data_df[col].values, 0.1) # 0.1%分位数
data_df.loc[data_df[col] > up_limit, col] = up_limit
data_df.loc[data_df[col] < low_limit, col] = low_limit
```

例子：将这些原始年龄值除以 10，然后通过 floor 函数对原始年龄数值进行截断。

```python
fcc_survey_df['Age_bin_round'] = np.array(np.floor(np.array(fcc_survey_df['Age']) / 10.))
fcc_survey_df[['ID.x', 'Age','Age_bin_round']].iloc[1071:1076]
```

![](/img/media/15523795162029.jpg)

这样连续数值就没有那么精细了，也能反映出相互之间的差别。

### 2.2 离散化（Discretization）

离散化又被称为量化或者叫做分桶（二值化也是一种分桶），是一种将连续型特征转换到离散特征上的一种方式，而离散特征可以被用做类别特征，这对大多数模型来说比较友好。通过离散化甚至可以将非线性特性引入到线性模型中，从而使得线性模型更具泛化性。

### 2.2.1 二值化 (Binarization)
计数特征可以考虑转换为是否的二值化形式，基于要解决的问题构建模型时，通常原始频数或总数可能与此不相关。比如如果我要建立一个推荐系统用来推荐歌曲，我只希望知道一个人是否感兴趣或是否听过某歌曲。我不需要知道一首歌被听过的次数，因为我更关心的是一个人所听过的各种各样的歌曲。

```python
watched = np.array(popsong_df['listen_count'])
watched[watched >= 1] = 1
popsong_df['watched'] = watched
# 当然也可以用 Pandas 中 DataFrame 的方式
popsong_df['watched'] = 0
popsong_df.loc[popsong_df['listen_count'] >= 1, 'watched'] = 1
```

你也可以使用 scikit-learn 中 preprocessing 模块的 Binarizer 类来执行同样的任务，而不一定使用 numpy 数组。

```python
from sklearn.preprocessing import Binarizer
bn = Binarizer(threshold=0.9)
pd_watched =bn.transform([popsong_df['listen_count']])[0]
popsong_df['pd_watched'] = pd_watched
popsong_df.head(11)
```
![](/img/media/15523797913264.jpg)



### 2.2.2 分桶 (Binning) 
如果直接利用原始的连续数值型特征有一个问题，那就是这些特征的数值**分布**通常是有偏向的，也就是说有些数据特别多而一些值就相对很少出现。另外，这些特征的**大小**变化范围也是需要注意的。如果直接利用这些特征，模型的效果一般不好，于是需要处理这些特征，有分桶和变换的方式。

对需要分桶的情况做一个经验性的总结：
* 连续型数值特征的数值分布有偏向的可以分桶
* 离散型数值特征的数值跨越了不同的数量级可以分桶

分桶可以将连续性数值特征转换为离散型特征（类别），每一个桶代表了某一个范围的连续性数值特征的密度。

### 2.2.2.1 固定宽度分桶 (Fixed-Width Binning)

固定每个分桶的宽度，即每个桶的值域是固定的，如果每个桶的大小一样，也称为均匀分桶。这里用年龄作为例子进行说明，如下所示年龄有一点右偏的数据分布：

![](/img/media/15523887500985.jpg)

我们尝试用如下的固定宽度来分桶：
```shell
Age Range: Bin
---------------
 0 -  9  : 0
10 - 19  : 1
20 - 29  : 2
30 - 39  : 3
40 - 49  : 4
50 - 59  : 5
60 - 69  : 6
  ... and so on
```

1、如果采用数据舍入的方式，我们可以对浮点型的年龄特征除以10：

```python
fcc_survey_df['Age_bin_round'] = np.array(np.floor(
                              np.array(fcc_survey_df['Age']) / 10.))
fcc_survey_df[['ID.x', 'Age', 'Age_bin_round']].iloc[1071:1076]
```

![](/img/media/15523898042213.jpg)

2、那如果我们需要想要更灵活的方式（按照自己的意愿）来操作要怎么做呢？比如这样分桶：

```python
Age Range : Bin
---------------
 0 -  15  : 1
16 -  30  : 2
31 -  45  : 3
46 -  60  : 4
61 -  75  : 5
75 - 100  : 6
```

可以用 Pandas 的 cut 函数：
```python
bin_ranges = [0, 15, 30, 45, 60, 75, 100]
bin_names = [1, 2, 3, 4, 5, 6]
fcc_survey_df['Age_bin_custom_range'] = pd.cut(
                                           np.array(
                                              fcc_survey_df['Age']), 
                                              bins=bin_ranges)
fcc_survey_df['Age_bin_custom_label'] = pd.cut(
                                           np.array(
                                              fcc_survey_df['Age']), 
                                              bins=bin_ranges,            
                                              labels=bin_names)
# view the binned features 
fcc_survey_df[['ID.x', 'Age', 'Age_bin_round', 
               'Age_bin_custom_range',   
               'Age_bin_custom_label']].iloc[10a71:1076]
```

![](/img/media/15523901338278.jpg)

3、可以采用 [sklearn.preprocessing.KBinsDiscretizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.KBinsDiscretizer.html#sklearn.preprocessing.KBinsDiscretizer) 的方式：

```python
>>> X = [[-2, 1, -4,   -1],
...      [-1, 2, -3, -0.5],
...      [ 0, 3, -2,  0.5],
...      [ 1, 4, -1,    2]]
>>> est = KBinsDiscretizer(n_bins=3, encode='ordinal', strategy='uniform')
>>> est.fit(X)  
KBinsDiscretizer(...)
>>> Xt = est.transform(X)
>>> Xt  
array([[ 0., 0., 0., 0.],
       [ 1., 1., 1., 0.],
       [ 2., 2., 2., 1.],
       [ 2., 2., 2., 2.]])
# 看下分桶边界
>>> est.bin_edges_[0]
array([-2., -1.,  0.,  1.])
>>> est.inverse_transform(Xt)
array([[-1.5,  1.5, -3.5, -0.5],
       [-0.5,  2.5, -2.5, -0.5],
       [ 0.5,  3.5, -1.5,  0.5],
       [ 0.5,  3.5, -1.5,  1.5]])
```



### 2.2.2.2 自定义分桶

1、自定义分桶可以利用上面固定宽度分桶的最后一种方式，修改成自己想要的分桶间隔就好。

2、也可以采用 Pandas 的 map 方式：

```python
def map_age(age_x):
    if age_x <= 18:
        return 1
    elif x <= 20:
        return 2
    elif x <= 35:
        return 3
    elif x <= 45:
        return 4
    else:
        return 5

data_df['age'] = data_df['age'].map(lambda x : map_age(x))
```

### 2.2.2.3 自适应分桶 / 分位数分桶 (Adaptive Binning)

不管是固定宽度分桶还是自定义分桶，分桶的效果都很难使得结果能够呈现均匀分布，有的桶多，有的桶很少甚至为空。于是，我们可以采用分位数分桶来自适应地做划分，使得结果更加均匀一些。一般常用的有2分位点，4分位点和10分位点用以分桶。

![](/img/media/15523923167184.jpg)

观察数据可以看出有一定右偏的趋势，我们先利用四分位点看下数据情况：

```python
quantile_list = [0, .25, .5, .75, 1.]
quantiles = fcc_survey_df['Income'].quantile(quantile_list)
quantiles

# Output
------
0.00      6000.0
0.25     20000.0
0.50     37000.0
0.75     60000.0
1.00    200000.0
Name: Income, dtype: float64
```

在柱状图上画出分位点标线：

```python
fig, ax = plt.subplots()
fcc_survey_df['Income'].hist(bins=30, color='#A9C5D3', 
                             edgecolor='black', grid=False)
for quantile in quantiles:
    qvl = plt.axvline(quantile, color='r')
ax.legend([qvl], ['Quantiles'], fontsize=10)
ax.set_title('Developer Income Histogram with Quantiles', 
             fontsize=12)
ax.set_xlabel('Developer Income', fontsize=12)
ax.set_ylabel('Frequency', fontsize=12)
```

![](/img/media/15523937291720.jpg)


利用 qcut 基于分位点来分桶：
```python
quantile_labels = ['0-25Q', '25-50Q', '50-75Q', '75-100Q']
fcc_survey_df['Income_quantile_range'] = pd.qcut(
                                            fcc_survey_df['Income'], 
                                            q=quantile_list)
fcc_survey_df['Income_quantile_label'] = pd.qcut(
                                            fcc_survey_df['Income'], 
                                            q=quantile_list,       
                                            labels=quantile_labels)

fcc_survey_df[['ID.x', 'Age', 'Income', 'Income_quantile_range', 
               'Income_quantile_label']].iloc[4:9]
```
![](/img/media/15523938726097.jpg)

当然，分桶之后得到了离散型的数值型特征，或者可以看成类别特征，还需要一定的处理才能更好地服务于模型。

### 2.3 数据舍入(Rounding)

处理连续性数据特征如比例或者百分比类型的特征时，我们不需要高精度的原始数值，通常我们将其舍入近似到数值整型就够用了，这些整型数值可以被视作类别特征或者原始数值（即离散特征）都可以。

举个例子：

```python
items_popularity = pd.read_csv('datasets/item_popularity.csv',  
                               encoding='utf-8')
items_popularity['popularity_scale_10'] = np.array(
                               np.round((items_popularity['pop_percent'] * 10)),  
                               dtype='int')
items_popularity['popularity_scale_100'] = np.array(
                               np.round((items_popularity['pop_percent'] * 100)),    
                               dtype='int')
items_popularity
```

![](/img/media/15523893068452.jpg)

可以得到不同粒度下的近似结果。当然，舍入近似结果不一定都是乘以某个数，我们在下面讲分桶的时候可以看到，可以用舍入近似的方式来做，效果可以分桶。


### 2. 归一化（Normalization）
使用 [sklearn.preprocessing.Normalizer](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html) 来归一化，把每一行数据归一化，使之有 unit norm，norm 的种类可以选l1、l2或max。不免疫outlier。

$$
\vec{x^{\prime}}=\frac{\vec{x}}{l(\vec{x})}
$$

其中 $l$ 表示 $norm$ 函数。

### 3. 区间缩放（scaling）
使用 [sklearn.preprocessing.MaxAbsScaler](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html)，将一列的数值，除以这一列的最大绝对值。不免疫outlier。

$$
x^{\prime}=\frac{x}{\max (|X|)}
$$





### 2.5 缩放
缩放是将数值变量缩放到一个确定的范围，把有量纲表达式变为无量纲表达式。

### 2.5.1 标准化缩放 (又称 Z 缩放)
标准化（无量钢化/中心化）把特征转化为服从标准正太分布的形式，其实是计算标准分数 (Standard Score, Z-score)，经过处理的数据符合标准正态分布，使得数值特征的算术平均数为零，标准差为 1。

$$
x^\prime =\frac{x-\mu}{\sigma}
$$

其中 $\mu$ 为所有样本数据的均值，$\sigma$ 为所有样本数据的标准差。

Sklearn 有两种方法实现：
1、使用 [sklearn.preprocessing.scale()](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.scale.html) 函数，可以直接将给定数据进行标准化。

```python
>>> from sklearn import preprocessing
>>> import numpy as np
>>> X = np.array([[ 1., -1.,  2.],
...               [ 2.,  0.,  0.],
...               [ 0.,  1., -1.]])
>>> X_scaled = preprocessing.scale(X)

>>> X_scaled                                          
array([[ 0.  ..., -1.22...,  1.33...],
       [ 1.22...,  0.  ..., -0.26...],
       [-1.22...,  1.22..., -1.06...]])

>>> #处理后数据的均值和方差
>>> X_scaled.mean(axis=0)
array([ 0.,  0.,  0.])

>>> X_scaled.std(axis=0)
array([ 1.,  1.,  1.])
```

2、使用 [sklearn.preprocessing.StandardScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html) 类，使用该类的好处在于可以保存训练集中的参数（均值、方差）直接使用其对象转换测试集数据。

```python
>>> scaler = preprocessing.StandardScaler().fit(X)
>>> scaler
StandardScaler(copy=True, with_mean=True, with_std=True)

>>> scaler.mean_                                      
array([ 1. ...,  0. ...,  0.33...])

>>> scaler.std_                                       
array([ 0.81...,  0.81...,  1.24...])

>>> scaler.transform(X)                               
array([[ 0.  ..., -1.22...,  1.33...],
       [ 1.22...,  0.  ..., -0.26...],
       [-1.22...,  1.22..., -1.06...]])

>>> # 可以直接使用训练集对测试集数据进行转换
>>> scaler.transform([[-1.,  1., 0.]])                
array([[-2.44...,  1.22..., -0.26...]])
```

注意：
* 计算时对每个特征分别进行。将数据按特征（按列进行）减去其均值，并除以其方差。得到的结果是，对于每个特征来说所有数据都聚集在 0 附近，方差为 1。
* 如果个别特征或多或少看起来不是很像**标准正态分布(具有零均值和单位方差)**，那么它们的表现力可能会较差。
* 不免疫 outlier？
* 对目标变量为输入特征的光滑函数的模型，其输入特征的大小比较敏感，对特征进行标准化缩放比较有效。
* 对于稀疏数据，可以接受 scipy.sparse 的矩阵作为输入，同时指定参数with_mean=False 取消中心化（centering 是破坏数据稀疏性的原因），with_std=False 则不做 scaling 处理。

如果数值特征列中存在数值极大或极小的 outlier（通过EDA发现），可以使用 [sklearn.preprocessing.RobustScaler](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html) ，应该使用更稳健（robust）的统计数据：用中位数而不是算术平均数，用分位数（quantile）而不是方差。这种标准化方法有一个重要的参数：（分位数下限，分位数上限），最好通过EDA的数据可视化确定。免疫 outlier。

### 2.5.2 最大最小值缩放

最大最小缩放是将特征缩放到给定的最小值和最大值之间，通常在零和一之间。
$$
{x}^\prime=\frac{x-x_{Min}}{x_{Max}-x_{Min}}
$$
使用 [sklearn.preprocessing.MinMaxScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html) 实现：

```python
>>> X_train = np.array([[ 1., -1.,  2.],
...                     [ 2.,  0.,  0.],
...                     [ 0.,  1., -1.]])
...
>>> min_max_scaler = preprocessing.MinMaxScaler()
>>> X_train_minmax = min_max_scaler.fit_transform(X_train)
>>> X_train_minmax
array([[ 0.5       ,  0.        ,  1.        ],
       [ 1.        ,  0.5       ,  0.33333333],
       [ 0.        ,  1.        ,  0.        ]])

>>> # 将相同的缩放应用到测试集数据中
>>> X_test = np.array([[ -3., -1.,  4.]])
>>> X_test_minmax = min_max_scaler.transform(X_test)
>>> X_test_minmax
array([[-1.5       ,  0.        ,  1.66666667]])


>>> # 缩放因子等属性
>>> min_max_scaler.scale_                             
array([ 0.5       ,  0.5       ,  0.33...])

>>> min_max_scaler.min_                               
array([ 0.        ,  0.5       ,  0.33...])
```

当然，在构造类对象的时候也可以直接指定最大最小值的范围：feature_range=(min, max)，此时应用的公式变为：

```python
X_std=(X-X.min(axis=0))/(X.max(axis=0)-X.min(axis=0))
X_scaled=X_std/(max-min)+min
```

🐽 注意：
* 这种归一化方法比较适用在数值比较集中的情况。
* 两个缺陷：
  * 当有新数据加入时，可能导致 max 和 min 发生变化，需要重新定义。
  * 如果 max 和 min 不稳定，很容易使得归一化结果不稳定，使得后续使用效果也不稳定。实际使用中可以用经验常量值来替代 max 和 min。

### 2.5. 最大绝对值缩放

在实际情况中,我们经常忽略特征的分布形状，直接经过去均值来对某个特征进行中心化，再通过除以非常量特征(non-constant features)的标准差进行缩放。而对稀疏数据进行中心化会破坏稀疏数据的结构，这样做没什么意义。但如果稀疏数据的特征跨越不同数量级的情况下也最好进行标准化，最大绝对值缩放就可以派上用场了。

最大绝对值缩放按照每个特征的最大绝对值进行缩放（除以最大绝对值），使得每个特征的范围变成了 $[-1, 1]$，该操作不会移动或者居中数据，所以不会破坏稀疏性。

使用 [sklearn.preprocessing.MaxAbsScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html#sklearn.preprocessing.MaxAbsScaler) 实现：

```python
>>> X_train = np.array([[ 1., -1.,  2.],
...                     [ 2.,  0.,  0.],
...                     [ 0.,  1., -1.]])
...
>>> max_abs_scaler = preprocessing.MaxAbsScaler()
>>> X_train_maxabs = max_abs_scaler.fit_transform(X_train)
>>> X_train_maxabs                # doctest +NORMALIZE_WHITESPACE^
array([[ 0.5, -1\. ,  1\. ],
 [ 1\. ,  0\. ,  0\. ],
 [ 0\. ,  1\. , -0.5]])
# 测试集
>>> X_test = np.array([[ -3., -1.,  4.]])
>>> X_test_maxabs = max_abs_scaler.transform(X_test)
>>> X_test_maxabs                 
array([[-1.5, -1\. ,  2\. ]])
>>> max_abs_scaler.scale_         
array([ 2.,  1.,  2.])
```

🐽注意：
* 使用最大绝对值缩放之前应该确认，训练数据应该是已经零中心化或者是稀疏数据。
* 该操作不会移动或者居中数据，所以不会破坏稀疏性。

最大最小值缩放和最大绝对值缩放两种缩放属于**区间缩放**，使用这种缩放的目的包括实现特征极小方差的鲁棒性以及在稀疏矩阵中保留零元素。

### 2.5.3 基于某种范数的缩放

### 2.5.4 平方根缩放或者对数缩放

### 2.5.5 Box-Cox 转换


### 带有异常值的缩放

### 稀疏数据的缩放






### 缺失值处理
* 补值
    * 简单的可以是补一个平均值、或者众数
    * 对于含异常值的变量，更健壮的做法是补中位数
    * 还可以通过模型预测缺失值
* 直接忽略
    * 将缺失作为一种信息编码喂给模型进行学习

### 特征交叉
* 表示数值特征之间的相互作用
* 可以对两个数值变量进行加、减、乘、除等操作

### 非线性编码
* 多项式核、高斯核等编码
* 将随机森林模型的叶节点进行编码喂给线性模型
* 基因算法以及局部线性嵌入、谱嵌入、t-SNE 等

### 行统计量
* 对行向量进行统计作为一类特征
* 例如统计行向量中的空值个数、零值个数、正负值个数
* 以及均值、方差、最小值、最大值、偏度、峰度等







## 特征选择 (Feature Selection) 




![](/img/media/15427027069088.jpg)

Features:
1. numeric
2. categorical
3. ordinal
4. datetime
5. coordinates

层次化特征，微观特征，宏观特征。

## 特征工程-创造特征

### 1)  好的特征
好的特征以及数据样本决定我们模型优化的上限，所以找到好的特征非常重要。好的特征来源于对业务的深入理解。首先自己要深入理解业务的运作方式，了解影响模型 label 目标的主要业务因素；其次多和业务的专家沟通，获取到从他们角度认为重要的因素；拉入更多人员进行头脑风暴，找到尽可能多的影响因素。

不同特征当前可用性也不一样。 初期我们要更多关注那些已有数据、线上易获取的特征；然后对于一些我们排序出来重要因素，如果当前没有数据以及线上无法获取，我们要尽快准备；

具体特征都是业务相关的，宏观上讲一些可能的方向供参考，例如用户使用上下文中可以感知的因素的属性、用户历史的业务数据因素、时间因素、地域因素、用户的个性化因素（年龄、爱好等）、用户使用场景中各种历史沉淀的评分因素（好评、差评等数量）、场景各种对象的属性特征（例如长度、颜色、形状等）。

### 2)  特征可视化
将特征数据通过散点图、分布图等方式观察下特征数据的特点，一方面可以观察特征对于分类等数据区分度，更重要的是可以根据数据分布，确认特征是否存在异常情况，例如由于线上 bug 导致部分数据是错误的。这一块建议重点关注，可能比较费时，但是可以避免后面模型优化或 bad case 排查的工作量。

### 3)  统计特征
有了原始的特征因素后，可以让这个特征具备更强的表达性。统计化是一个常用的方式，主要有最大值、最小值、平均值、标准差、方差、中位数、分布区间统计数等。例如周一的平均订单数、最大订单数等。可以查看下节中类别特征与数值特征的组合。

### 4)  特征组合
组合多个相关特征提取出其相关的规律，例如多个特征加和、求差、乘除、求斜率、变化比率、增长倍数等。


**数值特征的简单变换**

1. 单独特征列乘以一个常数（constant multiplication）或者加减一个常数：对于创造新的有用特征毫无用处；只能作为对已有特征的处理，也就是说数据预处理中特征归一化等操作是不能产生新的特征的。
2. 任何针对单独特征列的单调变换（如对数）：不适用于决策树类算法。对于决策树而言，$X$、$X^3$、$X^5$ 之间没有差异， $|X|$、 $X^2$、 $X^4$ 之间没有差异，除非发生了舍入误差。
3. **线性组合**（linear combination）：**仅适用于决策树**以及基于决策树的ensemble（如gradient boosting, random forest），因为常见的axis-aligned split function不擅长捕获不同特征之间的相关性；**不适用于SVM、线性回归、神经网络等**。
4. 多项式特征（polynomial feature）：[sklearn.preprocessing.PolynomialFeatures](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html)。
5. 比例特征（ratio feature）：$X_1 / X_2$。
6. 绝对值（absolute value）：$|X_1 - X_2|$
7. 其他一些操作的特征：
$max(X_1, X_2)$，$min(X_1, X_2)$，$X_1 xor X_2$。

**类别特征与数值特征的组合**

用 N1 和 N2 表示数值特征，用 C1 和 C2 表示类别特征，利用 Pandas 的 groupby 操作，可以创造出以下几种有意义的新特征（其中，C2 还可以是离散化了的 N1）：
```
median(N1)_by(C1)  \\ 中位数
mean(N1)_by(C1)  \\ 算术平均数
mode(N1)_by(C1)  \\ 众数
min(N1)_by(C1)  \\ 最小值
max(N1)_by(C1)  \\ 最大值
std(N1)_by(C1)  \\ 标准差
var(N1)_by(C1)  \\ 方差
freq(C2)_by(C1)  \\ 频数

freq(C1) \\这个不需要groupby也有意义
```

仅仅将已有的类别和数值特征进行以上的有效组合，就能够大量增加优秀的可用特征。

将这种方法和线性组合等基础特征工程方法结合（仅用于决策树），可以得到更多有意义的特征，如：
```
N1 - median(N1)_by(C1)
N1 - mean(N1)_by(C1)
```


将多个维度特征相互交叉，产生更多具体场景化的特征，例如和不同时段段、和不同的地理位置范围组合。


### 5)  特征拆解
将一个特征拆为多个**更易理解**的特征。 例如日期，可以拆为年、月、日、小时、分、秒、星期几、是否为周末。

### 6)  数字型特征重构
通过调整数字单位等方式，可以调整数字大小。 例如6500 克 可以表达6.5千克； 也可以进一步拆解表达为6千克、0.5千克等。这不是没啥道理嘛……

### 7)  One-Hot encoding
将类型特征映射多个是否特征，例如颜色可映射是否为为红色、是否为绿色、是否为蓝色。

### 8) 统计性特征映射为解释型特征
将一个数字型或统计性特征，映射为多个范围区间，然后为每个区间为一个类别，接着借助于 onehot encoding 就变为一系列是否的解释型特征。例如历史月订单 0~5 为低频、6~15 为中频、 大于16为高频， 订单量10数字就可以变为 [0,1,0] 这三维特征。

### x) 用基因编程创造新特征
Welcome to gplearn’s documentation!

基于genetic programming的symbolic regression，具体的原理和实现参见文档。目前，python环境下最好用的基因编程库为gplearn。基因编程的两大用法：

* 转换（transformation）：把已有的特征进行组合转换，组合的方式（一元、二元、多元算子）可以由用户自行定义，也可以使用库中自带的函数（如加减乘除、min、max、三角函数、指数、对数）。组合的目的，是创造出和目标y值最“相关”的新特征。这种相关程度可以用spearman或者pearson的相关系数进行测量。spearman多用于决策树（免疫单特征单调变换），pearson多用于线性回归等其他算法。
* 回归（regression）：原理同上，只不过直接用于回归而已。

### x) 用决策树创造新特征
在决策树系列的算法中（单棵决策树、GBDT、随机森林），每一个样本都会被映射到决策树的一片叶子上。因此，我们可以把样本经过每一棵决策树映射后的index（自然数）或one-hot-vector（哑编码得到的稀疏矢量）作为一项新的特征，加入到模型中。

具体实现：apply() 以及 decision_path() 方法，在 scikit-learn 和 xgboost 里都可以用。



* 决策树、基于决策树的 ensemble
    * spearman correlation coefficient


* 线性模型、SVM、神经网络
    * 对数（log）
    * pearson correlation coefficient



### 9) 挖掘特征
对于有些特征我们的数据没有明确的标注，但是我们认为也很重要。这是可以用机器学习以及部分样本标注或人工标注的方式挖掘一些特征。 例如假设大部分用户的性别我们不知道，但是部分用户可以通过各种其他途径知道。那可以基于这个样本训练出一个性别分类预测的模型，然后预测出所有用户的性别，将这个预测结果做为特征。

### 10) 特征自学习
在深度学习中，在构造出得到好的原始特征和适用于特征的网络结构后，特征组合和抽象会交给深度学习自行学习。 典型可以参考 CNN 算法，通过网络的卷积、池化等操作将原始图片特征，通过网络层学习抽象出了高层次的边缘、轮廓等特征。

### 11) 特征筛选
当有很多特征时，有部分特征是强相关的，属于冗余特征；有部分特征可能贡献小甚至负面贡献。 这时候需要做一些特征筛选。例如特征两两组合确认特征之间的相关性系数，对于相关性非常高的特征只保留一个；**特征和 Label 标注做相关性判断，去掉一些相关性差的特征；**当然也可以通过控制特征增长的过程，从基础特征集合开始，逐渐加入新特征或新特征集实验，如果新特征效果不好，则丢弃。

有些模型自带特征筛选的能力，例如gbdt（ xgboost）、回归中正则化等。通过这些模型一定程度也能达到特征筛选的目标。不过如果特征量特别多，建议在上线前，去掉无效特征，这样既可以避免特征维护的工作量，同时也能提高线上性能。

### x) 特征平滑处理
1. 长尾数据：进行取对数。这里可以参考数据预处理的博文。

```python
train_df[col] = train_df[col].map(lambda x : p.log1p(x))
```



---

Feature engineering is a vital component of modelling process, and it is the toughest to automate. It takes domain expertise and a lot of exploratory analysis on the data to engineer features

1. single variable Basic transformations: x, x^2 ,sqrt x ,log x, scaling

2. If variable's distribution has a long tail, apply Box-Cox transformation (taking log() is a quick & dirty way).

3. One could also perform analysis of residuals or log-odds (for linear model) to check for strong nonlinearities.

4. Create a feature which captures the frequency of the occurrence of each level of the categorical variable. For high cardinality, this helps a lot. One might use ratio/percentage of a particular level to all the levels present.

5. For every possible value of the variable, estimate the mean of the target variable; use the result as an engineered feature.

6. Encode a variable with the ratio of the target variable.

7. Take the two most important variables and throw in second order interactions between them and the rest of the variables - compare the resulting model to the original linear one

8. if you feel your solutions should be smooth, you can apply a radial basis function kernel .  This is like applying a smoothing transform.  

9. If you feel you need covariates , you can apply a polynomial kernel, or add the covariates explicitly

10. High cardinality features : convert to numeric by preprocessing: out-of-fold average two variable combinations

11. Additive transformation

12. difference relative to baseline

13. Multiplicative transformation : interactive effects

14. divisive : scaling/normalisation

15. thresholding numerical features to get boolean values

16. Cartesian Product Transformation

17. Feature crosses: cross product of all features -- Consider a feature A, with two possible values {A1, A2}. Let B be a feature with possibilities {B1, B2}. Then, a feature-cross between A & B (let’s call it AB) would take one of the following values: {(A1, B1), (A1, B2), (A2, B1), (A2, B2)}. You can basically give these ‘combinations’ any names you like. Just remember that every combination denotes a synergy between the information contained by the corresponding values of A and B.

18. Normalization Transformation: -- One of the implicit assumptions often made in machine learning algorithms (and somewhat explicitly in Naive Bayes) is that the the features follow a normal distribution. However, sometimes we may find that the features are not following a normal distribution but a log normal distribution instead. One of the common things to do in this situation is to take the log of the feature values (that exhibit log normal distribution) so that it exhibits a normal distribution.If the algorithm being used is making the implicit/explicit assumption of the features being normally distributed, then such a transformation of a log-normally distributed feature to a normally distributed feature can help improve the performance of that algorithm.

19. Quantile Binning Transformation

20. whitening the data

21. Windowing -- If points are distributed in time axis, previous points in the same window are often very informative

22. Min-max normalization : does not necessarily preserve order

23. sigmoid / tanh / log transformations

24. Handling zeros distinctly – potentially important for Count based features

25. Decorrelate / transform variables

26. Reframe Numerical Quantities

27. Map infrequent categorical variables to a new/separate category.

28.Sequentially apply a list of transforms.

29. One Hot Encoding

30. Target rate encoding

Hash Trick Multivariate:

31. PCA

32. MODEL STACKING

33. compressed sensing

34..guess the average” or “guess the average segmented by variable X”

Projection : new basis

35. Hack projection:

Perform clustering and use distance between points to the cluster center as a feature
PCA/SVD -- Useful technique to analyze the interrelationships between variables and perform dimensionality reduction with minimum loss of information (find the axis through the data with highest variance / repeat with the next orthogonal axis and so on , until you run out of data or dimensions; Each axis acts a new feature)
36.Sparse coding -- choose basis : evaluate the basis  based on how well  you can use it to reconstruct the input and how sparse it is take some sort of gradient step to improve that evaluation

efficient sparse coding algorithms
deep auto encoders
37 :Random forest: train bunch of decision trees :use each leaf as a feature

## References
1. [机器学习之 特征工程](https://juejin.im/post/5b569edff265da0f7b2f6c65)
2. [The Comprehensive Guide for Feature Engineering](https://adataanalyst.com/machine-learning/comprehensive-guide-feature-engineering/)
3. [【持续更新】机器学习特征工程实用技巧大全](https://zhuanlan.zhihu.com/p/26444240)
4. ✳️ [Machine Learning Kaggle Competition Part Two: Improving Feature engineering, feature selection, and model evaluation](https://towardsdatascience.com/machine-learning-kaggle-competition-part-two-improving-e5b4d61ab4b8)
5. [Feature Engineering 特徵工程中常見的方法](https://vinta.ws/code/feature-engineering.html)
6. [机器学习之step by step实战及知识积累笔记](https://www.cnblogs.com/kidsitcn/p/9176602.html)
7. [特征工程：数据科学家的秘密武器！](https://yq.aliyun.com/articles/82611)
8. [机器学习项目的完整流程](https://blog.csdn.net/qq_24831889/article/details/83241104#53_badcase_186)
9. [连续数据的处理方法](https://www.leiphone.com/news/201801/T9JlyTOAMxFZvWly.html)
10. [机器学习中的数据清洗与特征处理综述](https://tech.meituan.com/2015/02/10/machinelearning-data-feature-process.html)
11. [python开发：特征工程代码模版(一)](http://shataowei.com/2017/12/01/python%E5%BC%80%E5%8F%91%EF%BC%9A%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B%E4%BB%A3%E7%A0%81%E6%A8%A1%E7%89%88-%E4%B8%80/)
12. [python开发：特征工程代码模版(二)](http://shataowei.com/2017/12/01/python%E5%BC%80%E5%8F%91%EF%BC%9A%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B%E4%BB%A3%E7%A0%81%E6%A8%A1%E7%89%88-%E4%BA%8C/)
13. [Normalization(标准化)的原理和实现详解](http://www.dongdongbai.com/index.php/2017/12/11/97/)
14. [数据挖掘的流程和方法、技巧总结](https://zhuanlan.zhihu.com/p/33429338)
15. [4.3. 预处理数据](http://doc.codingdict.com/sklearn/59/)
16. [scikit-learn preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html)

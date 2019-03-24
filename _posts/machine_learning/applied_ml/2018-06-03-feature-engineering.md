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

## 一.  特征提取 (Feature Extraction) 
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

将一个数字型或统计性特征，映射为多个范围区间，然后为每个区间为一个类别，接着借助于 onehot encoding 就变为一系列是否的解释型特征。例如历史月订单 0~5 为低频、6~15 为中频、 大于16为高频， 订单量10数字就可以变为 [0,1,0] 这三维特征。

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

### 2.4 缺失值处理

因为各种各样的原因，真实世界中的许多数据集都包含缺失数据，这类数据经常被编码成空格、NaNs，或者是其他的占位符（有的时候是 0，需要具体分析）。对于缺失值一般有两大类处理方式：

- 1. 补值

  - 简单的可以是补一个平均值 (mean)、或者众数 (mode)
  - 对于含异常值的变量，更健壮的做法是补中位数 (median)
  - 还可以通过模型预测缺失值

- 2. 直接忽略

  - 将缺失作为一种信息编码喂给模型进行学习

- 对于竞赛而言最好不要直接删除，最好另作`特殊编码`，或者想办法最大程度保留缺失值所带来的`信息`。：

  - `统计`样本的缺失值数量，作为新的特征。
  - 将缺失数量做一个`排序`，如果发现3份数据（train、test、unlabeled）都呈阶梯状，于是就可以根据缺失数量将数据划分为若干部分，作为新的特征。
  - 使用`随机森林`中的临近矩阵对缺失值进行`插值`，但要求数据的因变量没有缺失值。

对于统计量的补值有两种操作方式：

1、针对 Pandas 方式：

```python
# combi.isnull().sum()
# combi.isna().sum()
# isnull is an alias for isna
# imputing missing data
# numerical data
combi['Item_Weight'].fillna(combi['Item_Weight'].mean(), inplace = True)
# categorical data
combi['Outlet_Size'].fillna("missing", inplace = True)
```

2、使用 [Imputer](https://sklearn.org/modules/generated/sklearn.preprocessing.Imputer.html) 类，可以更方便的来统计到行列不同维度的信息：

```python
>>> import numpy as np
>>> from sklearn.preprocessing import Imputer
>>> imp = Imputer(missing_values='NaN', strategy='mean', axis=0)
>>> imp.fit([[1, 2], [np.nan, 3], [7, 6]])
Imputer(axis=0, copy=True, missing_values='NaN', strategy='mean', verbose=0)
>>> X = [[np.nan, 2], [6, np.nan], [7, 6]]
>>> print(imp.transform(X))                           
[[ 4\.          2\.        ]
 [ 6\.          3.666...]
 [ 7\.          6\.        ]]
```

代码模板：

```python
df = df.drop(['PassengerId','Name','Ticket','Cabin'], axis=1)  #对于大量缺失数据的列可直接删除
df = df.dropna()                                               #删除含有NaN数据的行
df = df.fillna('-1')                                           #全部直接人工赋值
```

注意：

* 看填充时要不要加上 values，不然结果是一个 Series！

### 2.5 缩放

这里的缩放囊括了标准化和归一化等，要弄清楚这两者之间的关系。

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

### 2.5.2 区间缩放 (Scaling)

最大最小值缩放和最大绝对值缩放两种缩放属于**区间缩放**，使用这种缩放的目的包括实现特征极小方差的鲁棒性以及在稀疏矩阵中保留零元素。

### 2.5.2.1 最大最小值缩放

最大最小缩放是将特征缩放到给定的最小值和最大值之间，通常在零和一之间。


$$
{x}^\prime=\frac{x-x_{Min}}{x_{Max}-x_{Min}}
$$


1、使用 [sklearn.preprocessing.minmax_scale](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.minmax_scale.html) 函数实现：

```python
>>> from sklearn import preprocessing
>>> import numpy as np
>>> X = np.array([[ 1., -1.,  2.],
...               [ 2.,  0.,  0.],
...               [ 0.,  1., -1.]])
>>> X_scaled = preprocessing.minmax_scale(X)

>>> X_scaled                                          
array([[0.5       , 0.        , 1.        ],
       [1.        , 0.5       , 0.33333333],
       [0.        , 1.        , 0.        ]])

>>> #处理后数据的均值和方差
>>> X_scaled.mean(axis=0)
array([0.5       , 0.5       , 0.44444444])

>>> X_scaled.std(axis=0)
array([0.40824829, 0.40824829, 0.41573971])
```

2、使用 [sklearn.preprocessing.MinMaxScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html) 实现：

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

### 2.5.2.2 最大绝对值缩放

在实际情况中,我们经常忽略特征的分布形状，直接经过去均值来对某个特征进行中心化，再通过除以非常量特征(non-constant features)的标准差进行缩放。而对稀疏数据进行中心化会破坏稀疏数据的结构，这样做没什么意义。但如果稀疏数据的特征跨越不同数量级的情况下也最好进行标准化，最大绝对值缩放就可以派上用场了。

最大绝对值缩放按照每个特征的最大绝对值进行缩放（除以最大绝对值），使得每个特征的范围变成了 $[-1, 1]$，该操作不会移动或者居中数据，所以不会破坏稀疏性。

1、使用 [sklearn.preprocessing.maxabs_scale](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.maxabs_scale.html) 函数实现：

```python
>>> from sklearn import preprocessing
>>> import numpy as np
>>> X = np.array([[ 1., -1.,  2.],
...               [ 2.,  0.,  0.],
...               [ 0.,  1., -1.]])
>>> X_scaled = preprocessing.maxabs_scale(X)

>>> X_scaled                                          
array([[ 0.5, -1. ,  1. ],
       [ 1. ,  0. ,  0. ],
       [ 0. ,  1. , -0.5]])

>>> #处理后数据的均值和方差
>>> X_scaled.mean(axis=0)
array([0.5       , 0.        , 0.16666667])

>>> X_scaled.std(axis=0)
array([0.40824829, 0.81649658, 0.62360956])
```

2、使用 [sklearn.preprocessing.MaxAbsScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html#sklearn.preprocessing.MaxAbsScaler) 类实现：

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

### 2.5.3 归一化（Normalization）

归一化是**缩放单个样本以具有单位范数**的过程，即变换后的单行数据样本的范数等于1（好处？🤔）。如果你计划使用二次形式(如点积或任何其他核函数)来量化任何样本间的相似度，则此过程将非常有用。这是文本分类或聚类的常用操作，例如，对于两个 TF-IDF 向量的 l2-norm 进行点积，就可以得到这两个向量的余弦相似性。

数据归一化就是将训练集中某一列数值特征的值缩放到0和1之间。

**注意归一化和标准化的区别**：标准化作用于每个特征列，通过去均值和缩放以方差值的方式将样本的所有特征列转化到同一量纲下；归一化作用于每一数据行，通过缩放以原样本的某个范数使得计算样本间相似度的时候有统一的标准。

1、[sklearn.preprocessing.normalize](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.normalize.html) 函数提供了一个快速简单的方法在类似数组的数据集上执行操作，使用 `l1` 或 `l2`范式:

```python
>>> X = [[ 1., -1.,  2.],
...      [ 2.,  0.,  0.],
...      [ 0.,  1., -1.]]
>>> X_normalized = preprocessing.normalize(X, norm='l2')

>>> X_normalized                                      
array([[ 0.40..., -0.40...,  0.81...],
 [ 1\.  ...,  0\.  ...,  0\.  ...],
 [ 0\.  ...,  0.70..., -0.70...]])
```

2、使用 [sklearn.preprocessing.Normalizer](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html) 类来归一化，把每一行数据归一化，使之有单位范数（Unit Norm），norm 的种类可以选l1、l2或max。不免疫outlier。


$$
\vec{x^{\prime}}=\frac{\vec{x}}{l(\vec{x})}
$$


其中 $l$ 表示 $norm$ 函数。

在这种情况下， `fit` 方法是无用的：该类是无状态的，因为该操作独立对待样本。

```python
>>> normalizer = preprocessing.Normalizer().fit(X)  # fit does nothing
>>> normalizer
Normalizer(copy=True, norm='l2')
>>> normalizer.transform(X)                            
array([[ 0.40..., -0.40...,  0.81...],
 [ 1\.  ...,  0\.  ...,  0\.  ...],
 [ 0\.  ...,  0.70..., -0.70...]])

>>> normalizer.transform([[-1.,  1., 0.]])             
array([[-0.70...,  0.70...,  0\.  ...]])
```

### 2.5.4 带有异常值的缩放

如果你的数据包含许多异常值，使用均值和方差缩放可能并不是一个很好的选择。这种情况下，你可以使用 robust_scale 以及 RobustScaler 作为替代品。它们对你的数据的中心和范围使用更有鲁棒性的估计。

1、使用 [sklearn.preprocessing.robust_scale](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.robust_scale.html) 函数：

```python
>>> from sklearn import preprocessing
>>> import numpy as np
>>> X = np.array([[ 1., -2.,  2.],
...               [ -2.,  1.,  3.],
...               [ 4.,  1., -2.]])
>>> X_scaled = preprocessing.robust_scale(X)

>>> X_scaled                                          
array([[ 0. , -2. ,  0. ],
       [-1. ,  0. ,  0.4],
       [ 1. ,  0. , -1.6]])

>>> #处理后数据的均值和方差
>>> X_scaled.mean(axis=0)
array([ 0.        , -0.66666667, -0.4       ])

>>> X_scaled.std(axis=0)
array([0.81649658, 0.94280904, 0.86409876])
```

2、使用 [sklearn.preprocessing.RobustScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html#sklearn.preprocessing.RobustScaler) 类：

```python
>>> from sklearn.preprocessing import RobustScaler
>>> X = [[ 1., -2.,  2.],
...      [ -2.,  1.,  3.],
...      [ 4.,  1., -2.]]
>>> transformer = RobustScaler().fit(X)
>>> transformer
RobustScaler(copy=True, quantile_range=(25.0, 75.0), with_centering=True,
       with_scaling=True)
>>> transformer.transform(X)
array([[ 0. , -2. ,  0. ],
       [-1. ,  0. ,  0.4],
       [ 1. ,  0. , -1.6]])
```

### 2.5.5 稀疏数据的缩放

中心化稀疏（矩阵）数据会破坏数据的稀疏结构，因此很少有一个比较明智的实现方式。但是缩放稀疏输入是有意义的，尤其是当几个特征在不同的量级范围时，最推荐的缩放方式是采用最大绝对值缩放，具体操作方式参考上述对应章节。

### 2.5.6 对数缩放（有偏度的正态分布）

如果数据不是正态分布的，尤其是数据的平均数和中位数相差很大的时候（表示数据非常歪斜）。

1、对 Numpy Array 类型的数据处理：

```python
log_data = np.log(data)
# fcc_survey_df['Income_log'] = np.log((1+ fcc_survey_df['Income']))
```

2、对 Pandas DataFrame 数据的处理：

```python
data_df[col] = data_df[col].map(lambda x : np.log1p(x))
```

### 2.5.7 其他缩放待整理

* 平方根缩放
* 反余切函数缩放

### 2.6 特征交叉 (Feature Interaction) / 特征组合 (Feature Crosses)
通过特征组合多个相关特征提取出其相关的规律。

### 2.6.1 组合特征

* 可以对两个数值变量进行加 ($X_1 + X_2$)、减 ($X_1 - X_2$)、乘 ($X_1 \times X_2$)、除 ($X_1/X_2$)、绝对值 ($\vert X_1 - X_2\vert$)等操作。

* 求斜率、变化比率、增长倍数、$max(X_1, X_2)​$，$min(X_1, X_2)​$，$X_1 xor X_2​$等。

### 2.6.2 生成多项式特征

在机器学习中，通过增加一些输入数据的非线性特征来增加模型的复杂度通常是有效的。一个简单通用的办法是使用多项式特征，这可以获得特征的更高维度和互相间关系的项。

1、使用 [PolynomialFeatures](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html) 类实现：

```python
>>> import numpy as np
>>> from sklearn.preprocessing import PolynomialFeatures
>>> X = np.arange(6).reshape(3, 2)
>>> X                                                 
array([[0, 1],
 [2, 3],
 [4, 5]])
>>> poly = PolynomialFeatures(2)
>>> poly.fit_transform(X)                             
array([[  1.,   0.,   1.,   0.,   0.,   1.],
 [  1.,   2.,   3.,   4.,   6.,   9.],
 [  1.,   4.,   5.,  16.,  20.,  25.]])
```

$X$ 的特征已经从 $(X_1, X_2)$  转换为 $(1, X_1, X_2, X_1^2, X_1X_2, X_2^2)$。

在一些情况下，只需要特征间的交互项，这可以通过设置 `interaction_only=True` 来得到:

```python
>>> X = np.arange(9).reshape(3, 3)
>>> X                                                 
array([[0, 1, 2],
 [3, 4, 5],
 [6, 7, 8]])
>>> poly = PolynomialFeatures(degree=3, interaction_only=True)
>>> poly.fit_transform(X)                             
array([[   1.,    0.,    1.,    2.,    0.,    0.,    2.,    0.],
 [   1.,    3.,    4.,    5.,   12.,   15.,   20.,   60.],
 [   1.,    6.,    7.,    8.,   42.,   48.,   56.,  336.]])
```

$X$ 的特征已经从 $(X_1, X_2, X_3)$ 转换为 $(1, X_1, X_2, X_3, X_1X_2, X_1X_3, X_2X_3, X_1X_2X_3)$。

### 2.7 非线性转换（修正分布）

### 2.7.1 映射到均分分布 (Uniform distribution) 上的转换（分位点转换）

利用分位点信息来转换特征使之符合均匀分布，这种转换倾向于将最常见的数值打散，如此能减少（边际）异常值的影响 (在这方面比缩放方法好)。 然而，该转换确实扭曲了特征内部和特征之间的相关性和距离。可以采用以下两种方式，基于分位数函数提供非参数变换，将数据映射到具有 0 和 1 之间的值的均匀分布。

1、[`quantile_transform`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.quantile_transform.html#sklearn.preprocessing.quantile_transform) 函数：

```python
>>> import numpy as np
>>> from sklearn.preprocessing import quantile_transform
>>> rng = np.random.RandomState(0)
>>> X = np.sort(rng.normal(loc=0.5, scale=0.25, size=(25, 1)), axis=0)
>>> quantile_transform(X, n_quantiles=10, random_state=0)
array([...])
```

2、[`QuantileTransformer`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.QuantileTransformer.html#sklearn.preprocessing.QuantileTransformer) 类：

```python
>>> from sklearn.datasets import load_iris
>>> from sklearn.model_selection import train_test_split
>>> iris = load_iris()
>>> X, y = iris.data, iris.target
>>> X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
>>> quantile_transformer = preprocessing.QuantileTransformer(random_state=0)
>>> X_train_trans = quantile_transformer.fit_transform(X_train)
>>> X_test_trans = quantile_transformer.transform(X_test)
>>> np.percentile(X_train[:, 0], [0, 25, 50, 75, 100]) 
array([ 4.3,  5.1,  5.8,  6.5,  7.9])
```

这个结果对应于以 cm 为单位的萼片长度。 应用分位数变换后，这些标志接近先前定义的百分位数：

```python
>>> np.percentile(X_train_trans[:, 0], [0, 25, 50, 75, 100])
... 
array([ 0.00... ,  0.24...,  0.49...,  0.73...,  0.99... ])
# 测试
>>> np.percentile(X_test[:, 0], [0, 25, 50, 75, 100])
... 
array([ 4.4  ,  5.125,  5.75 ,  6.175,  7.3  ])
>>> np.percentile(X_test_trans[:, 0], [0, 25, 50, 75, 100])
... 
array([ 0.01...,  0.25...,  0.46...,  0.60... ,  0.94...])
```

### 2.7.2 映射到正态分布 (Gaussian distribution) 上的转换

如果数据不是正态分布的，尤其是数据的平均数和中位数相差很大的时候（表示数据非常歪斜）。这里主要采用一种叫做 [Power Transformer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PowerTransformer.html#sklearn.preprocessing.PowerTransformer) 的方法，这种转换通过一些列参数单调变换使得数据更符合正太分布。[`PowerTransformer`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PowerTransformer.html#sklearn.preprocessing.PowerTransformer) 现在支持两种转换，两者都有一个参数 $\lambda$ 需要设定：

* Box-Cox 转换：要求输入数据严格为正数。
* Yeo-Johnson 变换：则正数或负数都。

实践方法有四种：

1、比较粗糙的版本可以直接查看对数缩放的实现。

2、另一种方式是[`PowerTransformer`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PowerTransformer.html#sklearn.preprocessing.PowerTransformer) 类的 Box-Cox 转换操作，这个方法能够计算出能够最佳减小数据倾斜的指数变换方法。


$$
\begin{split}x_i^{(\lambda)} =
\begin{cases}
\dfrac{x_i^\lambda - 1}{\lambda} & \text{if } \lambda \neq 0, \\[8pt]
\ln{(x_i)} & \text{if } \lambda = 0,
\end{cases}\end{split}
$$


```python
>>> pt = preprocessing.PowerTransformer(method='box-cox', standardize=False)
>>> X_lognormal = np.random.RandomState(616).lognormal(size=(3, 3))
>>> X_lognormal                                         
array([[1.28..., 1.18..., 0.84...],
       [0.94..., 1.60..., 0.38...],
       [1.35..., 0.21..., 1.09...]])
>>> pt.fit_transform(X_lognormal)                   
array([[ 0.49...,  0.17..., -0.15...],
       [-0.05...,  0.58..., -0.57...],
       [ 0.69..., -0.84...,  0.10...]])
```

上面代码显示地设定了standardize=False，默认的情况下转换结果会进行零均值、单位方差的归一化操作，即符合正态分布。

3、另一种方式是[`PowerTransformer`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PowerTransformer.html#sklearn.preprocessing.PowerTransformer) 类的 Yeo-Johnson 转换操作，这也是 Sklearn 的默认选项：


$$
\begin{split}x_i^{(\lambda)} =
\begin{cases}
 [(x_i + 1)^\lambda - 1] / \lambda & \text{if } \lambda \neq 0, x_i \geq 0, \\[8pt]
\ln{(x_i) + 1} & \text{if } \lambda = 0, x_i \geq 0 \\[8pt]
-[(-x_i + 1)^{2 - \lambda} - 1] / (2 - \lambda) & \text{if } \lambda \neq 2, x_i < 0, \\[8pt]- \ln (- x_i + 1) & \text{if } \lambda = 2, x_i < 0
\end{cases}\end{split}
$$


```python
>>> import numpy as np
>>> from sklearn.preprocessing import PowerTransformer
>>> pt = PowerTransformer()
>>> data = [[1, 2], [3, 2], [4, 5]]
>>> print(pt.fit(data))
PowerTransformer(copy=True, method='yeo-johnson', standardize=True)
>>> print(pt.lambdas_)
[ 1.386... -3.100...]
>>> print(pt.transform(data))
[[-1.316... -0.707...]
 [ 0.209... -0.707...]
 [ 1.106...  1.414...]]
```

4、还可以使用上面提到的分位点转换：

```python
>>> quantile_transformer = preprocessing.QuantileTransformer(
...     output_distribution='normal', random_state=0)
>>> X_trans = quantile_transformer.fit_transform(X)
>>> quantile_transformer.quantiles_ 
array([[4.3...,   2...,     1...,     0.1...],
       [4.31...,  2.02...,  1.01...,  0.1...],
       [4.32...,  2.05...,  1.02...,  0.1...],
       ...,
       [7.84...,  4.34...,  6.84...,  2.5...],
       [7.87...,  4.37...,  6.87...,  2.5...],
       [7.9...,   4.4...,   6.9...,   2.5...]])
```

### 2.8 非线性编码

- 多项式核、高斯核等编码
- 将随机森林模型的叶节点进行编码喂给线性模型
- 基因算法以及局部线性嵌入、谱嵌入、t-SNE 等

### 2.8.1 用基因编程创造新特征

基于genetic programming的symbolic regression，具体的原理和实现参见文档。目前，python环境下最好用的基因编程库为gplearn。基因编程的两大用法：

- 转换（transformation）：把已有的特征进行组合转换，组合的方式（一元、二元、多元算子）可以由用户自行定义，也可以使用库中自带的函数（如加减乘除、min、max、三角函数、指数、对数）。组合的目的，是创造出和目标y值最“相关”的新特征。这种相关程度可以用spearman或者pearson的相关系数进行测量。spearman多用于决策树（免疫单特征单调变换），pearson多用于线性回归等其他算法。
- 回归（regression）：原理同上，只不过直接用于回归而已。

### 2.8.2 用决策树创造新特征

在决策树系列的算法中（单棵决策树、GBDT、随机森林），每一个样本都会被映射到决策树的一片叶子上。因此，我们可以把样本经过每一棵决策树映射后的index（自然数）或one-hot-vector（哑编码得到的稀疏矢量）作为一项新的特征，加入到模型中。

具体实现：apply() 以及 decision_path() 方法，在 scikit-learn 和 xgboost 里都可以用。

- 决策树、基于决策树的 ensemble
  - spearman correlation coefficient

- 线性模型、SVM、神经网络
  - 对数（log）
  - pearson correlation coefficient

### 2.9 行统计量

除了对原始数值变量进行处理外，直接对行向量进行统计也作为一类特征。

* 例如统计行向量中的空值个数、零值个数、正负值个数
* 以及均值、方差、最小值、最大值、[偏度、峰度](https://support.minitab.com/zh-cn/minitab/18/help-and-how-to/statistics/basic-statistics/supporting-topics/data-concepts/how-skewness-and-kurtosis-affect-your-distribution/)等

1、偏度、峰度计算：

```python
import pandas as pd
x = [53, 61, 49, 66, 78, 47]
s = pd.Series(x)
print(s.skew())
print(s.kurt())
```

### 2.10 数字型特征重构

通过调整数字单位等方式，可以调整数字大小。 例如 6500 克 可以表达6.5千克； 也可以进一步拆解表达为6千克、0.5千克等。似乎是没啥道理，但是确有时有用。比如这个[比赛](https://www.datafountain.cn/competitions/337/details/rule?id=84982)，其中一个充值金额的特征，判断看是否数值为整数可以构成一个强特征。

### 3. 类别特征 / 标称特征 / 定性特征 (Categorical Features)

类别特征取值可以是数值类型，但是数值没有任何数学意义，不能做数学运算。类别特征不仅可以从原始数据中直接获得，还可以通过数值特征离散化得到。

### 3.1 自然数编码

- 类别特征要变成数值才能喂给模型
- 采用自然数编码给每一个类别分配一个编号
- 除非类别特征本身有顺序特征外，类别特征的数值大小没有意义，所以自然数编码效果一般不是很好，可以对类别编号进行洗牌，训练多个模型进行融合进一步提升模型效果
- 但是一般来说操作消耗内存小，训练时间快

1、使用 [OrdinalEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html#sklearn.preprocessing.OrdinalEncoder) 类将类别特征编码到一个 $n\_samples$ 大小的 $[0, n\_classes-1]$ 内取值的矢量，每个样本仅对应一个 label，即输入大小为 (n_samples, n_features) 的数组：

```python
>>> from sklearn.preprocessing import OrdinalEncoder
>>> enc = OrdinalEncoder()
>>> X = [['Male', 1], ['Female', 3], ['Female', 2]]
>>> enc.fit(X)
... 
OrdinalEncoder(categories='auto', dtype=<... 'numpy.float64'>)
>>> enc.categories_
[array(['Female', 'Male'], dtype=object), array([1, 2, 3], dtype=object)]
>>> enc.transform([['Female', 3], ['Male', 1]])
array([[0., 2.],
       [1., 0.]])
>>> enc.inverse_transform([[1, 0], [0, 1]])
array([['Male', 1],
       ['Female', 2]], dtype=object)
```

fit_transform() 函数就是先 fit() 完直接 transform()。

2、使用 [LabelEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html) 类将类别标签（Target labels）编码到 $[0, n\_classes-1]​$ 内取值的结果，输入大小为(n_samples,) 的数组：

```python
>>> from sklearn import preprocessing
>>> le = preprocessing.LabelEncoder()
>>> le.fit([1, 2, 2, 6])
LabelEncoder()
>>> le.classes_
array([1, 2, 6])
>>> le.transform([1, 1, 2, 6]) 
array([0, 0, 1, 2]...)
>>> le.inverse_transform([0, 0, 1, 2])
array([1, 1, 2, 6])
```

### 3.2 独热编码 (One-Hot Encoding)

除非类别特征本身有顺序特征，那么可以用自然编码，除此之外类别特征大小没有意义，一般采用独热编码得到稀疏矩阵。将一个类别特征编码成 $n\_classes​$ 维度的 $0/1​$ 向量，取对应类别的地方取 1，其他全为了 0，所以很稀疏。

1、使用 [OneHotEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html) 类针对无顺序性类别特征进行独热编码，输入大小为 (n_samples, n_features) 的数组：

```python
>>> from sklearn.preprocessing import OneHotEncoder
>>> enc = OneHotEncoder(handle_unknown='ignore')
>>> X = [['Male', 1], ['Female', 3], ['Female', 2]]
>>> enc.fit(X)
... 
OneHotEncoder(categorical_features=None, categories=None,
       dtype=<... 'numpy.float64'>, handle_unknown='ignore',
       n_values=None, sparse=True)
>>> enc.categories_
[array(['Female', 'Male'], dtype=object), array([1, 2, 3], dtype=object)]
>>> enc.transform([['Female', 1], ['Male', 4]]).toarray()
array([[1., 0., 1., 0., 0.],
       [0., 1., 0., 0., 0.]])
>>> enc.inverse_transform([[0, 1, 1, 0, 0], [0, 0, 0, 1, 0]])
array([['Male', 1],
       [None, 2]], dtype=object)
>>> enc.get_feature_names()
array(['x0_Female', 'x0_Male', 'x1_1', 'x1_2', 'x1_3'], dtype=object)
```

得到的结果大小是 $(特征个数 \times 每个特征的类别个数)$，例如这里的结果是 5 维的向量，前两个表示男女的特征，后三个是整数型特征。

2、使用 [LabelBinarizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelBinarizer.html) 类针对类别标签（Target labels）独热编码，输入大小为(n_samples,) 的数组：

```python
>>> from sklearn import preprocessing
>>> lb = preprocessing.LabelBinarizer()
>>> lb.fit([1, 2, 6, 4, 2])
LabelBinarizer(neg_label=0, pos_label=1, sparse_output=False)
>>> lb.classes_
array([1, 2, 4, 6])
>>> lb.transform([1, 6])
array([[1, 0, 0, 0],
       [0, 0, 0, 1]])
```

3、使用 [pandas.get_dummies](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.get_dummies.html)：

```python
>>> df = pd.DataFrame({'A': ['a', 'b', 'a'], 'B': ['b', 'a', 'c'],
...                    'C': [1, 2, 3]})
>>> pd.get_dummies(df, prefix=['col1', 'col2'])
   C  col1_a  col1_b  col2_a  col2_b  col2_c
0  1       1       0       0       1       0
1  2       0       1       1       0       0
2  3       1       0       0       0       1
```

当然这里的 get_dummies 是做 One-Hot Encoding，与 Dummy Encoding（哑编码）还是有些区别的，真正的Dummy Encoding 是将一个类别特征编码成 $n\_classes- 1 $ 维度的 $0/1$ 向量，编码时这 $n\_classes- 1 $ 个类的对应在其位置上取值为 1，其他取 0，剩下的那个类用这 $n\_classes- 1 $ 全部去 0 的状态表示。

🐽注意：

* 使用独热编码将离散特征的取值拓展到了欧式空间，离散特征的某个取值就对应欧式空间的某个点。
* 离散特征独热编码后，会让特征之间的距离计算更加合理，没有没有顺序性，$x_1 = (1)$, $x_2 = (2)$, $x_3 = (3)$ 之间的距离就没有意义，而 $x_1 = (1, 0, 0)$, $x_2 = (0, 1, 0)$, $x_3 = (0, 0, 1)$ 之间的距离就更 make sense。
* 用：独热编码用来解决类别型数据的离散值问题，不用：将离散型特征进行one-hot编码的作用，是为了让距离计算更合理，但如果特征是离散的，并且不用 One-Hot 编码就可以很合理的计算出距离，那么就没必要进行 One-Hot 编码。
* One-Hot 编码可能引起 dummy variable trap，即截取（或叫 bias）会引起[共线问题](http://www.jiehuozhe.com/article/3)，所以这个时候用 Dummy Encoding 比较好。

### 3.3 分层编码

这种编码就是业务相关的了，需要专业领域知识。例如对于邮政编码或者身份证号的类别特征，可以取不同数位进行分层，然后按照层次进行自然数编码。

- [ ] 求具体实例。🙄

### 3.4 散列编码

* 对于有些取值特别多的类别特征，利用 One-Hot Encoding 得到的特征矩阵就非常得稀疏，为减少稀疏程度可以在独热编码之前利用散列编码。
* 实际应用中可以重复选取不同的散列函数，利用融合的方式来提升模型效果。
* 散列方法可能会导致特征取值冲突，这些冲突会削弱模型的效果。🤔
* 自然数编码和分层编码可以看做散列编码的特例

* [ ] 求具体实例。Hash 编码词向量？🙄

### 3.5 计数编码 (Count encoding)

* 计数编码是将类别特征用其对应的计数代替，这对线性和非线性模型都有效。
* 计数编码对异常值比较敏感，特征取值也可能冲突。[参考](https://wrosinski.github.io/fe_categorical_encoding/)🤔

```python
def count_encode(X, categorical_features, normalize=False):
    print('Count encoding: {}'.format(categorical_features))
    X_ = pd.DataFrame()
    for cat_feature in categorical_features:
        X_[cat_feature] = X[cat_feature].astype(
            'object').map(X[cat_feature].value_counts())
        if normalize:
            X_[cat_feature] = X_[cat_feature] / np.max(X_[cat_feature])
    X_ = X_.add_suffix('_count_encoded')
    if normalize:
        X_ = X_.astype(np.float32)
        X_ = X_.add_suffix('_normalized')
    else:
        X_ = X_.astype(np.uint32)
    return X_
# run
train_count_subreddit = count_encode(X_train, ['subreddit'])
# not normalized
221941    221941
98233      98233
33559      33559
32010      32010
25567      25567
Name: subreddit_count_encoded, dtype: int64
# normalized
1.000000    221941
0.442609     98233
0.151207     33559
0.144228     32010
0.115197     25567
Name: subreddit_count_encoded_normalized, dtype: int64
```

### 3.6 计数排名编码 (LabelCount encoding)

* 计数排名编码利用计数的排名对类别特征进行编码，对线性和非线性模型都有效。
* 对异常点不敏感，且类别特征取值不会冲突。

```python
def labelcount_encode(X, categorical_features, ascending=False):
    print('LabelCount encoding: {}'.format(categorical_features))
    X_ = pd.DataFrame()
    for cat_feature in categorical_features:
        cat_feature_value_counts = X[cat_feature].value_counts()
        value_counts_list = cat_feature_value_counts.index.tolist()
        if ascending:
            # for ascending ordering
            value_counts_range = list(
                reversed(range(len(cat_feature_value_counts))))
        else:
            # for descending ordering
            value_counts_range = list(range(len(cat_feature_value_counts)))
        labelcount_dict = dict(zip(value_counts_list, value_counts_range))
        X_[cat_feature] = X[cat_feature].map(
            labelcount_dict)
    X_ = X_.add_suffix('_labelcount_encoded')
    if ascending:
        X_ = X_.add_suffix('_ascending')
    else:
        X_ = X_.add_suffix('_descending')
    X_ = X_.astype(np.uint32)
    return X_
# run
train_lc_subreddit = labelcount_encode(X_train, ['subreddit'])
# descending
0    221941
1     98233
2     33559
3     32010
4     25567
Name: subreddit_labelcount_encoded_descending, dtype: int64
# ascendign
40    221941
39     98233
38     33559
37     32010
36     25567
Name: subreddit_labelcount_encoded_ascending, dtype: int64
```

### 3.7 目标编码 (Target encoding)

* 对于基数（类别变量所有可能不同取值的个数）很大的离散特征，例如 IP 地址、网站域名、城市名、家庭地址、街道、产品编号等，之前介绍的编码方式效果往往不好，比如：
  * 对于自然数编码，简单模型容易欠拟合，而复杂模型容易过拟合。
  * 对于独热编码，得到的特征矩阵太稀疏。
* 对于高基数类别变量的一种解决办法是基于目标变量对类别特征进行编码，即有监督的编码方式，该方法适用于分类和回归问题。
* 对于分类问题的高基数类别特征：
  * 采用交叉验证的方式，将样本划分为5份，针对其中每一份数据，计算离散特征每个取值在另外4份数据中每个类别的比例。
  * 为了避免过拟合，也可以采用嵌套的交叉验证划分方法。
* 对于回归问题的高基数类别特征：
  * 采用交叉验证的方式，计算目标变量均值对类别变量编码。[参考](https://wrosinski.github.io/fe_categorical_encoding/) 🤔

- [ ] 求实例🙄

```python
def target_encode(X, X_valid, categorical_features, X_test=None,
                  target_feature='target'):
    print('Target Encoding: {}'.format(categorical_features))
    X_ = pd.DataFrame()
    X_valid_ = pd.DataFrame()
    if X_test is not None:
        X_test_ = pd.DataFrame()
    for cat_feature in categorical_features:
        group_target_mean = X.groupby([cat_feature])[target_feature].mean()
        X_[cat_feature] = X[cat_feature].map(group_target_mean)
        X_valid_[cat_feature] = X_valid[cat_feature].map(group_target_mean)
    X_ = X_.astype(np.float32)
    X_ = X_.add_suffix('_target_encoded')
    X_valid_ = X_valid_.astype(np.float32)
    X_valid_ = X_valid_.add_suffix('_target_encoded')
    if X_test is not None:
        X_test_[cat_feature] = X_test[cat_feature].map(group_target_mean)
        X_test_ = X_test_.astype(np.float32)
        X_test_ = X_test_.add_suffix('_target_encoded')
        return X_, X_valid_, X_test_
    return X_, X_valid_
```

### 3.8 类别特征之间交叉组合

* 类别特征的笛卡尔积操作可以产生新的类别特征，但是注意这是在类别特征基数不大的前提下。
* 还有一种交叉组合的思路是基于分组统计的组合。求实例 🙄
* 其他的思路就是利用专业领域知识自己试了。

1、对于笛卡尔积操作也就是暴力特征组合时可以用 [itertools.combinations](https://docs.python.org/2/library/itertools.html#itertools.combinations)：

```python
from itertools import combinations
ralate_var = ['是否经常逛商场的人', '是否去过高档商场', '当月是否看电影', 
              '当月是否景点游览', '当月是否体育场馆消费']
print('waiting for group pair features...')
for rv in combinations(ralate_var, 2):
    rv2 = '_'.join(rv) 
    data['relate_' + rv2] = data[rv[0]] * data[rv[1]]
    print(rv2 + 'finished!')
    
for rv in combinations(ralate_var, 3):
    rv2 = '_'.join(rv) 
    data['relate_' + rv2] = data[rv[0]] * data[rv[1]] * data[rv[2]]
    print(rv2 + 'finished!')
    
for rv in combinations(ralate_var, 4):
    rv2 = '_'.join(rv) 
    data['relate_' + rv2] = data[rv[0]] * data[rv[1]] * data[rv[2]] * data[rv[3]]
    print(rv2 + 'finished!')
    
print('All finished!!!')
```

### 3.9 类别特征和数值特征之间交叉组合

### 3.9.1 特征聚合 (feature aggregation)

* 通常基于类别特征的某个类别计算数值特征的一些统计量，一般在多个表好操作一些。

1、用 N1 和 N2 表示数值特征，用 C1 和 C2 表示类别特征，利用 Pandas 的 groupby 操作，可以创造出以下几种有意义的新特征（其中，C2 还可以是离散化了的 N1）：

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

```python
import pandas as pd

# 根据客户 id （client id）进行贷款分组，并计算贷款平均值、最大值、最小值
stats = loans.groupby('client_id')['loan_amount'].agg(['mean', 'max', 'min'])
stats.columns = ['mean_loan_amount', 'max_loan_amount', 'min_loan_amount']

# 和客户的 dataframe 进行合并
stats = clients.merge(stats, left_on = 'client_id', right_index=True, how = 'left')

stats.head(10)
```

![img](/img/media/1652824cd936d8b8imageslim.png)

2、人工操作：

```python
start_time = time.time()

for cat_feat in categorical_cols:
    for num_feat in numerical_cols:
        cat_num_mean = train_df.groupby(cat_feat)[num_feat].mean()
        train_df[cat_feat+'_'+num_feat+'_'+'mean'] = train_df[cat_feat].map(cat_num_mean)
        test_df[cat_feat+'_'+num_feat+'_'+'mean'] = test_df[cat_feat].map(cat_num_mean)
print 'elapsed time: ', time.time() - start_time
```



### 4. 时间特征

* 时间类特征既可以看做连续值，也可以看做离散值
* 对于连续值来说，有持续时间，如用户浏览一家商户的时间；有间隔时间，如用户上次登录（购买、点击等行为）距现在的时间
* 对于离散值来说，有如下特征：一天中的哪个时间段、一周中的第几天、一年中的第几周、一年中的第几个月、一年中的第几个季度、工作日or周末、节假日or促销节
* 窗体压缩化 (Windowing)：如果所有的点都分布在时间轴上，那么在同一个窗口里的先前的点往往包含丰富的信息。

### 4.2 特征拆解

将一个特征拆为多个**更易理解**的特征。 例如日期，可以拆为年、月、日、小时、分、秒、星期几、是否为周末。

### 5. 空间特征

### 6. 文本特征

* 词袋（word bag）:指对于文本数据预处理后，去掉停用词，剩下的词组成的list，在词库中映射的稀疏向量
* n元词袋：将词袋中的词扩展到n-gram，分词后相邻的n个词也进入词袋
* TF-idf特征：一种用来评估一个字词对于一个文件集或一个语料库中的一份文件的重要程度的统计方法。字词的重要性与它在文件中出现的次数成正比，与它在语料库中出现的频率成反比。TF(Term freqiency)，TF(t)=词t在当前文中出现的次数/词t在全部文档中出现的次数，IDF(t)=ln(总文档数/含t的文档数)，TF-IDF权重=TF(t)*IDF(t)
* word2vec：现有的工具有Google word2vec、gensim

### 7. 特征工程 Tricks

* 选出最重要的两个变量，并计算他们相互之间、以及与其它变量之间的二阶交叉作用并放入模型中，比较由此产生的模型结果与最初的线性模型的结果。
* 白化数据 (Whitening the Data)
* S型/正切/对数转换 (Sigmoid / Tanh / Log Transformations)
* 去相关性/转换变量 (decorrelation)



## 二.  特征选择 (Feature Selection) 











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
17. [A Comprehensive Guide to Data Exploration](https://www.analyticsvidhya.com/blog/2016/01/guide-data-exploration/)
18. [**What are good ways to handle discrete and continuous inputs together?**](https://www.quora.com/What-are-good-ways-to-handle-discrete-and-continuous-inputs-together)
19. [One-hot vs dummy encoding in Scikit-learn](https://stats.stackexchange.com/questions/224051/one-hot-vs-dummy-encoding-in-scikit-learn)
20. [如何理解统计学中「自由度」这个概念？](https://www.zhihu.com/question/20983193)
21. [One-Hot 编码与哑变量](http://www.jiehuozhe.com/article/3)
22. [Smarter Ways to Encode Categorical Data for Machine Learning (Part 1 of 3)](https://towardsdatascience.com/smarter-ways-to-encode-categorical-data-for-machine-learning-part-1-of-3-6dca2f71b159)
23. [python数据处理，特征工程，比赛等一定会用到的方法](https://www.twblogs.net/a/5b8364342b71776c51e2d0b2/zh-cn)
24. [Feature Engineering: Data scientist's Secret Sauce !](https://www.linkedin.com/pulse/feature-engineering-data-scientists-secret-sauce-ashish-kumar)
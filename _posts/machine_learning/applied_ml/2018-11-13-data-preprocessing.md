---
layout: post
title: Data Preprocessing
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

 * 异常值处理
 * 平滑处理
 * 标准化处理


## 异常数据处理
### 缺失值
1. 当缺失值很多时，这个特征可以不要
2. 给缺失值补一个：
    * 当缺失值比较少可以选择**众数**或者**平均值**。
    * 还可以通过机器学习的方法来填充缺失值，比如根据相似性进行填充 K 邻近。
3. 当缺失值较多时，也可以把是否缺失做一个特征，树形算法可以直接处理缺失值。

### 异常点
判断异常点是采集的错误，还是不具有普适性数据。简单的尝试是将分布在最小值和最大值附近的离散点做一个截断：

```python
up_limit = np.percentile(train_df[col].values, 99.9) # 99.9%分位数
low_limit = np.percentile(train_df[col].values, 0.1) # 0.1%分位数
train_df[col][train_df[col] > up_limit] = up_limit
train_df[col][train_df[col] < low_limit] = low_limit
# train_df.loc[train_df[col] > up_limit, col] = up_limit
# train_df.loc[train_df[col] < low_limit, col] = low_limit
```

### 有偏度的特征
1. 常见于数值类型的变量，最简单的方法是用`log(x+1)`或者`倒数`或者`指数exp`处理，使数据呈现正态分布

```python
train_df[col] = train_df[col].map(lambda x : p.log1p(x))
```
2. 应用Box-Cox转换

### 长尾型并不是偏度正太的数据特征
* 离散化数据，分区间处理，即分桶。


### 一般 bool 类型的组合
![](/img/media/15519285885784.jpg)


### 暴力特征
采用各种批量的组合特征。


----


通过数据预处理，我们需要将训练集表示为矩阵X（大小：n_samples * n_features）和矢量y（长度：n_samples）。矢量y可以被转换为矩阵Y（大小：n_samples * n_classes）。

Convert Format
* [Categorical Encoding](https://pbpython.com/categorical-encoding.html)
* [Sklearn LabelEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html)
* [Sklearn OneHotEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html)
* [Pandas Categorical dtype](https://pandas.pydata.org/pandas-docs/stable/user_guide/categorical.html)
* [pandas.get_dummies](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.get_dummies.html)

## Data Preprocessing
Data preprocessing refers to the transformations applied to our data before feeding it to the algorithm.

Data Preprocessing is a technique that is used to convert the raw data into a clean data set. In other words, whenever the data is gathered from different sources it is collected in raw format which is not feasible for the analysis. there are plenty of steps for data preprocessing and we just listed some of them :

1. removing Target column (id)
2. Sampling (without replacement)
3. Dealing with Imbalanced Data
4. Introducing missing values and treating them (replacing by average values)
5. Noise filtering
6. Data discretization
7. Normalization and standardization
8. PCA analysis
9. Feature selection (filter, embedded, wrapper)
 

 
 数据预处理的主要任务如下：

（1）数据清理：填写空缺值，平滑噪声数据，识别，删除孤立点，解决不一致性

（2）数据集成：集成多个数据库，数据立方体，文件

（3）数据变换：规范化（消除冗余属性）和聚集（数据汇总），将数据从一个较大的子空间投影到一个较小的子空间

（4）数据归约：得到数据集的压缩表示，量小，但可以得到相近或相同的结果

（5）数据离散化：数据规约的一部分，通过概念分层和数据的离散化来规约数据，对数字型数据比较重要。

1.数据清洗

（1）处理空缺值：

A, 忽略元组

B．人工填写空缺值

C．使用一个全局变量填充空缺值

D．使用属性的平均值填充空缺值

E．使用与给定元组属同一类的所有样本的平均值

F．使用最可能的值填充空缺值，使用像Bayesian公式或判定树这样的基于推理的方法

（2）处理噪声数据

噪声：一个测量变量中的随机错误或偏差

A.分箱（binning）（等深或等宽分箱）

首先排序数据，并将他们分到等深的箱中

然后可以按箱的平均值平滑，按箱中值平滑，按箱的边界值平滑

B．聚类：检测并且去除孤立点

C．计算机和人工检查结合：计算机检测可疑数据，然后对他们进行人工判断

D．回归：通过让数据适应回归函数来平滑数据，对连续的数字型数据较好

2.数据集成

数据集成：将多个数据源中的数据整合到一个一致的存储中

模式集成：整合不同数据源中的元数据，实体识别问题：匹配来自不同数据源的现实世界中相同的实体。（人工干预或利用字段的元信息，比较字段的描述性元信息，看他们是否相同）。检测并解决数据值的冲突：对现实世界中的同一实体，来自不同数据源的属性值可能是不同的（因为不同的数据表示或不同的度量）

处理数据集成中的冗余数据：

集成多个数据库时出现冗余数据的主要原因：同一属性在不同的数据库中会有不同的字段名；一个属性可以由另外一个表导出

有些冗余可以被相关分析检测到:检测各个属性之间的相关性

事先根据其元数据或相关性分析对数据进行预处理，就能够减少或避免结果数据中的冗余与不一致性，提高数据挖掘的质量。

3.数据变换

A．平滑：去除数据中的噪声

B．聚集：数据汇总，数据立方体的构建，数据立方体的计算/物化(一个数据立方体在方体的最底层叫基本方体，基本方体就是已知存在的数据，对现有的数据按照不同维度进行汇总就可以得到不同层次的方体，所有的方体联合起来叫做一个方体的格，也叫数据立方体。数据立方体中所涉及到的计算就是汇总)

C．数据概化：沿概念分层向上汇总，数据立方体的不同的维之间可能存在着一个概念分层的关系

D．规范化：将数据按比例缩放，使这些数据落入到一个较小的特定的区间之内。方法有：

   a.最小----最大规范化

   b.Z-score规范化

   c.小数定标规范化

E．属性的构造：通过现有属性构造新的属性，并添加到属性集中

4.数据归约

（1）数据归约可以用来得到数据集的归约表示，它小得多，但可以产生相同（或几乎相同的）分析结果

（2）数据归约策略

   A.数据立方体聚集：

   数据立方体是根据不同的维度对数据进行汇总，立方体的越顶层，其汇总程度就越高，数据量就越少。

对数据的表示就越概化。最底层的方体对应于基本方体，基本方体对应于感兴趣的实体。

在数据立方体中存在着不同级别的汇总，数据立方体可以看做方体的格，每一个较高层次的抽象将进一步减少结果数据集。

数据立方体提供了对预计算的汇总数据的快速访问，原则是使用与给定任务相关的最小方体，并且在可能的情况下，对于汇总数据的查询应当使用数据立方体。

   B.维归约：用来检测或删除不相关的或基本不相关的属性或冗余属性或维，来减少数据量。

属性子集的选择：找出最小属性集，使得数据类的概念分布尽可能的接近使用所有属性的原分布，把不相关的属性全部删除。

可以减少出现在发现模式上的属性的数目，使得模式便于理解。

主要方法有：启发式的（探索式的try and error）方法，该方法包括逐步向前选择（从空属性集开始，每次选择都选择当前属性集中最符合的目标，

最好的属性，加到当前的属性集中，这样逐步的向前选择，把有用的属性一个一个的添加进来），

逐步向后删除（从属性全集开始，每次删除还在当前属性集中的最不适合的那个属性，最坏的属性，这样一个一个的删除，最后留下来的就是相关的属性），

向前选择和向后删除相结合（每次选择一个最好的属性，并且删除一个最坏的属性），判定归纳树

   C.数据压缩：使用一些编码机制来压缩数据集。无损压缩（可以根据压缩之后的数据完整的构造出压缩之前的数据wrar. zip等，如字符串压缩）

和有损压缩（无法通过压缩之后的数据来完整的构造出压缩之前的数据，如音频/视频压缩，有时可以在不解压缩整体数据的情况下，重构某个片段，主要应用于流媒体传输）。

两种有损数据压缩的方法：小波变换和主要成分分析

   D.数值归约：使用较小的，替代的数据来估计，替换，表示原数据（用参数模型）：通过选择替代的，较小的数据表示形式来减少数据量。

方法主要有：有参方法（使用一个参数模型来估计数据，最后只要存储参数即可，有线性回归方法，多元回归，对数线性模型（近似离散的多维数据概率分布））和

无参方法（直方图（将某属性的数据划分为不相交的子集或桶，桶中放置该值的出现频率，其中桶和属性值的划分规则有：等深，等宽，V-最优，MaxDiff），

聚类(将数据集划分为聚类，然后通过聚类来表示数据集，如果数据可以组成各种不同的聚类，则该技术非常有效，反之如果数据界线模糊，则该方法无效。

数据可以分层聚类，并被存储在多层索引树中)，选样(允许用数据的较小随机样本（子集）表示大的数据集。对数据集D的样本选择方法有：简单随机选择n个样本，不放回（由D的N个元组中抽取n个样本），

简单随机选择n个样本，回放（由D的N个元组中抽取n个样本，元组被抽取后将被回放，同一元组可能再次被抽取到），聚类选样（聚类分析和简单随机选样的结合，

D中元组被分入到M个互不相交的聚类中，可以在其中的m个聚类上进行简单随机选样，m<M）,分层选样（D被划分为互不相交的层，则可通过对每一层的简单随机选样得到D的分层选样）

5.离散化和概念分层的产生

离散化：将连续属性的范围划分为区间，以减少所必需处理的数据的量。

主要应用于以下三类数据：名称型（无序集合中的值），序数（有序集合中的值），连续值（实数）。

使用连续属性的范围的划分，使用某一范围的值来代替某一段的值。

离散化可以有效的规约数据（基于判定树的分类挖掘）。离散化是通过将属性域划分为区间，减少给定连续属性值的个数，区间的标号可以代替实际的数据值。

概念分层是通过使用高层的概念来替代底层的属性值。

A.数值型数据如何离散化：

（1）分箱 binning：分箱技术递归的用于结果划分，可以产生概念分层。

（2）直方图分析 histogram:直方图分析方法递归的应用于每一部分，可以自动产生多级概念分层。

（3）聚类分析：将数据划分成簇，每个簇形成同一概念层上的一个节点，每个簇可再分成多个子簇，形成子节点。

（4）基于熵的离散化（基于统计学的）

（5）通过自然划分分段：将数值区域划分为相对一致的，易于阅读的，看上去更直观或自然的区间。

自然划分的3-4-5规则：如果一个区间最高有效位上包含3,6,7或9个不同的值就将该区间划分为3个等宽子区间；

如果一个区间最高有效位上包含2，4或8个不同的值，就将该区间划分为4个等宽的子区间；

如果一个区间最高有效位上包含1，5或10个不同的值，就将该区间划分为5个等宽的子区间；

再将该规则递归的应用于每个子区间。（对于数据集中出现的最大值和最小值的极端分布，为避免上述方法出现的结果扭曲，可以在顶层分段时，选用一个大部分的概率空间5%--95%）

B.分类数据的离散化：

（1）分类数据指无序的离散数据，它有有限个值（可能是很多个）

（2）分类数据的概念分层生成方法：（属性的序代表的是属性之间的一个包含关系，说明其在概念分层中的层次的高低）

由用户或专家在模式级显式的说明属性的部分序。在定义数据库时就注明属性之间的包含关系，在进行数据汇总时，直接找到该包含关系，

利用此包含关系进行数据向上汇总。

通过显示数据分组说明分层结构的一部分。

说明属性集，但不说明它们的偏序，然后系统根据算法自动产生属性的序，构造有意义的概念分层。

如何根据实际的数据来自动的生成一个偏序？根据在给定的属性集中每个属性所包含的不同值的个数，可以自动生成概念分层，不同值个数最多的属性将被放在概念分层的最底层。

对只说明部分属性集的情况，则可根据数据库模式中的数据语义定义对属性的捆绑信息，来恢复相关属性。在定义数据库的同时定义一个捆绑信息，将存在偏序关系的几个属性捆绑在一起。

 
## 特征工程中处理已有的特征
### 类别特征
类别特征，表示某个数据点属于某一个类别，或具有某一种类的特性。类别特征在能用到模型训练时，默认用自然数表示，如果不是一般需要用 LabelEncoder 或者 OrdinalEncoder 方式将字符串转换成自然数。如果某一列特征具有 $K$ 种不同类别，那么其取值就是 $\{ 0, 1, 2, \dots, K-1\}$


### 数值特征
数值特征（numerical feature），可以是连续的（continuous），也可以是离散的（discrete），一般表示为一个实数值。

### 1. 标准化（Standardization）
使用 [sklearn.preprocessing.StandardScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)，能够转换为Z-score，使数值特征列的算数平均为0，方差（以及标准差）为1。但是不免疫outlier。

$$
x^{\prime}=\frac{x-\mu}{\sigma}
$$

也可以使用 [sklearn.preprocessing.RobustScaler](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html) ，如果数值特征列中存在数值极大或极小的outlier（通过EDA发现），应该使用更稳健（robust）的统计数据：用中位数而不是算术平均数，用分位数（quantile）而不是方差。这种标准化方法有一个重要的参数：（分位数下限，分位数上限），最好通过EDA的数据可视化确定。免疫outlier。

### 2. 归一化（Normalization）
使用 [sklearn.preprocessing.Normalizer](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html) 来归一化，把每一行数据归一化，使之有unit norm，norm的种类可以选l1、l2或max。不免疫outlier。

$$
\vec{x^{\prime}}=\frac{\vec{x}}{l(\vec{x})}
$$

其中 $l$ 表示 $norm$ 函数。

### 3. 区间缩放（scaling）
使用 [sklearn.preprocessing.MaxAbsScaler](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html)，将一列的数值，除以这一列的最大绝对值。不免疫outlier。

$$
x^{\prime}=\frac{x}{\max (|X|)}
$$

## Data Standardization
* sklearn.preprocessing.LabelBinarizer：用于one vs all的label encoding，类似于独热编码，生成一个(n_examples * n_classes)大小的0~1矩阵，每个样本仅对应一个label。
* sklearn.preprocessing.MultiLabelBinarizer：用于label encoding，生成一个(n_examples * n_classes)大小的0~1矩阵，每个样本可能对应多个label。
* [sklearn.preprocessing.OrdinalEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html#sklearn.preprocessing.OrdinalEncoder)：用于categorical features的编码，生成一个(n_examples)大小的0~(n_classes-1)矢量，每个样本仅对应一个label。
* sklearn.preprocessing.LabelEncoder：用于label encoding，生成一个(n_examples)大小的0~(n_classes-1)矢量，每个样本仅对应一个label。与sklearn.preprocessing.OrdinalEncoder基本相似。


## Data Normalization
z-score

### Clean up rare values in a feature column
```python
stat_min = 10 #while small is arbitrary, we'll use the common minimum in statistics: http://nicholasjjackson.com/2012/03/08/sample-size-is-10-a-magic-number/
title_names = (data1['Title'].value_counts() < stat_min) #this will create a true false series with title name as index

#apply and lambda functions are quick and dirty code to find and replace with fewer lines of code: https://community.modeanalytics.com/python/tutorial/pandas-groupby-and-python-lambda-functions/
data1['Title'] = data1['Title'].apply(lambda x: 'Misc' if title_names.loc[x] == True else x)
```

## 降维
通常就是指 dimensionality reduction。

Principal Component Analysis (PCA)
Latent Dirichlet Allocation (LDA)
Latent Semantic Analysis (LSA)

## References
1. [机器学习特征工程实用技巧大全](https://zhuanlan.zhihu.com/p/26444240)
2. [使用sklearn做单机特征工程](https://www.cnblogs.com/jasonfreak/p/5448385.html)
3. [经典比较篇之八：数据不正态怎么办？](https://zhuanlan.zhihu.com/p/26784184)
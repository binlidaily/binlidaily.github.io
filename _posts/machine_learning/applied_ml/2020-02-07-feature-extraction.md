---
layout: post
title: Feature Extraction
author: Bin Li
tags: [Machine Learning]
category: ""
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

而在 SKlearn 里面区别了标准化 (StandardScaler) 和归一化 (Normalizer) 等，要弄清楚这两者之间的[关系](http://benalexkeen.com/feature-scaling-with-scikit-learn/)。

## 1. 无量纲化

　　为了消除数据特征之间的量纲影响，我们需要对特征进行无量纲化处理，使得不同指标之间具有可比性。可以拿梯度下降为例来比较对数值型数据无量纲化处理的优势。

![Scan Jun 13, 2019 at 11.28 AM](/img/media/Scan Jun 13, 2019 at 11.28 AM.jpg)

　　可以从等值图上看出，没有归一化，在相同的学习速率下，$x_1$ 的更新速度会大于 $x_2$，即更多的迭代才能找到最优解；归一化后，两者更新速度变得一致，容易更快地通过梯度下降找到最优解。

　　当然，数据归一化也非万能，一般来讲，通过梯度下降法求解的模型通常需要归一化，像线性回归、逻辑回归、支持向量机、神经网络等。像决策树模型，以 C4.5 为例，决策树在节点分裂主要依据数据集 $D$ 关于特征 $x$ 的信息增益率，信息增益率跟特征是否归一化无关，所以归一化并不会改变样本在特征 $x$ 上的信息增益。

### 1.1 标准化缩放 (又称 Z 缩放)

　　标准化把特征转化为服从标准正态分布的形式，计算标准分数 (Standard Score, Z-score)，经过处理的数据符合标准正态分布，处理方法如下：

$$
x^\prime =\frac{x-\mu}{\sigma}
$$

　　其中 $\mu$ 为所有样本数据的均值，$\sigma$ 为所有样本数据的标准差。标准化的原理比较复杂，它表示的是原始值与均值之间差多少个标准差，是一个相对值，所以也有去除量纲的功效。同时，它还带来两个附加的好处：均值为0，标准差为1。

　　均值为 0 有什么好处呢？它可以使数据以 0 为中心左右分布，而数据以 0 为中心左右分布会带来很多便利。比如在去中心化的数据上做 SVD 分解等价于在原始数据上做PCA；机器学习中很多函数如 Sigmoid、Tanh、Softmax 等都以 0 为中心左右分布（不一定对称）。

　　而通过[公式变换](https://www.jianshu.com/p/540d56ef350f)可以知道每个变量（特征）的重要程度正比于这个变量在这个数据集上的方差。如果我们让每一维变量的标准差都为 1（即方差都为1），每维变量在计算距离的时候重要程度相同。

　　Sklearn 实现：
1. 使用 [sklearn.preprocessing.scale()](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.scale.html) 函数，可以直接将给定数据进行标准化。
2. 使用 [sklearn.preprocessing.StandardScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html) 类，使用该类的好处在于可以保存训练集中的参数（均值、方差）直接使用其对象转换测试集数据。


　　注意：
* 计算时对每个特征分别进行。将数据按特征（按列进行）减去其均值，并除以其方差。得到的结果是，对于每个特征来说所有数据都聚集在 0 附近，方差为 1。
* 如果个别特征或多或少看起来不是很像**标准正态分布(具有零均值和单位方差)**，那么它们的表现力可能会较差。
* 不免疫 outlier？
* 对目标变量为输入特征的光滑函数的模型，其输入特征的大小比较敏感，对特征进行标准化缩放比较有效。
* 对于稀疏数据，可以接受 scipy.sparse 的矩阵作为输入，同时指定参数with_mean=False 取消中心化（centering 是破坏数据稀疏性的原因），with_std=False 则不做 scaling 处理。
* 如果数值特征列中存在数值极大或极小的 outlier（通过EDA发现），可以使用 [sklearn.preprocessing.RobustScaler](http://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html) ，应该使用更稳健（robust）的统计数据：用中位数而不是算术平均数，用分位数（quantile）而不是方差。这种标准化方法有一个重要的参数：（分位数下限，分位数上限），最好通过EDA的数据可视化确定。免疫 outlier。

### 1.2 区间缩放 (Scaling)

　　最大最小值缩放和最大绝对值缩放两种缩放属于**区间缩放**，使用这种缩放的目的包括实现特征极小方差的鲁棒性以及在稀疏矩阵中保留零元素。

**1) 最大最小值缩放**

　　最大最小缩放是将特征缩放到给定的最小值和最大值之间，通常在零和一之间。

$$
{x}^\prime=\frac{x-x_{Min}}{x_{Max}-x_{Min}}
$$

　　Sklearn 实现：
1. 使用 [sklearn.preprocessing.minmax_scale](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.minmax_scale.html) 函数对指定数据。
2. 使用 [sklearn.preprocessing.MinMaxScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html) 类方便拓展。
    * 当然，在构造类对象的时候也可以直接指定最大最小值的范围：feature_range=(min, max)，此时应用的公式变为：

```python
X_std=(X-X.min(axis=0))/(X.max(axis=0)-X.min(axis=0))
X_scaled=X_std/(max-min)+min
```

　　注意：
* 这种归一化方法比较适用在数值比较集中的情况。
* 两个缺陷：
  * 当有新数据加入时，可能导致 max 和 min 发生变化，需要重新定义。
  * 如果 max 和 min 不稳定，很容易使得归一化结果不稳定，使得后续使用效果也不稳定。实际使用中可以用经验常量值来替代 max 和 min。

2) 最大绝对值缩放

　　在实际情况中，我们经常忽略特征的分布形状，直接经过去均值来对某个特征进行中心化，再通过除以非常量特征(non-constant features)的标准差进行缩放。而对稀疏数据进行中心化会破坏稀疏数据的结构，这样做没什么意义。但如果稀疏数据的特征跨越不同数量级的情况下也最好进行标准化，最大绝对值缩放就可以派上用场了。

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

3) 归一化（Normalization）

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

**2.5.4 带有异常值的缩放**

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

**2.5.5 稀疏数据的缩放**

中心化稀疏（矩阵）数据会破坏数据的稀疏结构，因此很少有一个比较明智的实现方式。但是缩放稀疏输入是有意义的，尤其是当几个特征在不同的量级范围时，最推荐的缩放方式是采用最大绝对值缩放，具体操作方式参考上述对应章节。

**2.5.6 对数缩放（有偏度的正态分布）**

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

**2.5.7 其他缩放待整理**

* 平方根缩放
* 反余切函数缩放



## References
1. [归一化和标准化的一些理解](https://www.jianshu.com/p/540d56ef350f)
2. [Tips-of-Feature-engineering](https://github.com/Pysamlam/Tips-of-Feature-engineering)
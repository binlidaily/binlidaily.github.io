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

　　数据预处理是对原始数据进行变换，使其满足模型训练的要求。这里总结处一下数据预处理的一般操作，方便自己回顾。一般来说数据预处理包括几点：
* 缺失值处理
* 异常值处理
* 标准化处理
* 平滑处理
* 采样
* 数据不平衡的处理


## 1. 数据导入
### 1.1 CSV 数据格式
```python
# 如果没有 keep_default_na=False，加载后空值处就是 NAN，且类似 coupon_id 等处的类型都是 float
# 判断是否是NAN的话是：off_train.date!=off_train.date结果是True即为NAN，否则是非空值
# 这里使用了keep_default_na=False，使coupon_id等字段的数据类型转化为object可以简单看作是字符串，空值变为null
# 这时候判断是否是空值便可用off_train.date=='null'
off_train = pd.read_csv(os.path.join(DataPath, 'ccf_offline_stage1_train.csv'), header=0, keep_default_na=False)
```

### 1.2 数据导入后的一般性处理
　　数据合并等一些常规操作如下：
``` python
# 数据预处理
# 1. 读取数据：
data_macro = pd.read_csv("macro.csv", parse_dates=['timestamp'], usecols=['timestamp'] + macro_cols)

# 2. 显示为object的属性：
data_train.dtypes[data_train.dtypes=='object']

# 3. 改变数据类型
data_train['material'] = data_train['material'].astype('object')

# 4. 概览数据
data_train.describe(include=['object'])

# 5. 合并两个表（上下）
data_all = pd.concat([data_train, data_test], ignore_index=True)

# 6. 合并两个表（左右）
data_all = pd.merge(data_all, data_macro, on='timestamp', how='left')

# 7. 提取Number， Object特征：
object_columns =  data_all.columns[data_all.dtypes == 'object']
number_columns = data_all.columns[data_all.dtypes != 'object']

# 8. 计算两个特征平均
sa_price = train_df.groupby('sub_area')[['work_share', 'price_doc']].mean()
```

　　分别处理连续数据和离散数据可以参考：

```python
# pip install sklearn-pandas
from sklearn_pandas import DataFrameMapper
mapper = DataFrameMapper(
  [(continuous_col, StandardScaler()) for continuous_col in continuous_cols] +
  [(categorical_col, LabelBinarizer()) for categorical_col in categorical_cols]
)
pipeline = Pipeline(
  [("mapper", mapper),
  ("estimator", estimator)]
)
pipeline.fit_transform(df, df["y"])
```

## 2. 缺失值
　　对缺失值的处理一般有三种：
1. 当缺失值很多时，这个特征/记录可以删除
2. 数据填充/插补：
    * 当缺失值比较少可以选择**众数**或者**平均值**。
    * 还可以通过机器学习的方法来填充缺失值，比如根据相似性进行填充 K 邻近。
3. 不做处理：
    * 当缺失值较多时，也可以把是否缺失做一个特征，树形算法可以直接处理缺失值。

### 2.1 查看数据缺失情况

```python
# 判断是否有缺失值数据 - isnull，notnull
# isnull：缺失值为True，非缺失值为False
# notnull：缺失值为False，非缺失值为True
```

### 2.2 删除缺失值

```python
# drop方法：可直接用于Series，Dataframe
# 注意inplace参数，默认False → 生成新的值
```

### 2.3 数据填充/插补
　　先看数据填充/替换的函数，后面插值基于这些函数：
```python
# 填充/替换缺失数据 - fillna、replace
s.fillna(value=None, method=None, axis=None, inplace=False, limit=None, downcast=None, **kwargs)
# value：填充值
# 注意inplace参数
# method参数：
# pad / ffill → 用之前的数据填充 
# backfill / bfill → 用之后的数据填充 

# df.replace(to_replace=None, value=None, inplace=False, limit=None, regex=False, method='pad', axis=None)
# to_replace → 被替换的值
# value → 替换值
```

　　再看插值的一些操作，主要的思路有：均值/中位数/众数插补、临近值插补、插值法。

```python
# （1）均值/中位数/众数插补
u = s.mean()     # 均值
me = s.median()  # 中位数
mod = s.mode()   # 众数
s.fillna(u, inplace = True)

# （2）临近值插补
s.fillna(method = 'ffill', inplace = True) # 用前值插补

# （3）插值法 —— 拉格朗日插值法
from scipy.interpolate import lagrange
x = [3, 6, 9]
y = [10, 8, 4]
print(lagrange(x, y))
print(type(lagrange(x, y)))
# 输出值为的是多项式的n个系数
# 这里输出3个值，分别为a0,a1,a2
# y = a0 * x**2 + a1 * x + a2 → y = -0.11111111 * x**2 + 0.33333333 * x + 10
print('插值10为：%.2f' % lagrange(x, y)(10))
```
## 3. 异常值处理
　　异常值（离群点）是指样本中的个别值，其数值明显偏离其余的观测值。接下来从异常值分析和处理两个角度分别进行说明。

### 3.1 异常值分析

　　异常值分析有两种方式：
1. $3\sigma$原则
2. 箱型图分析。


```python
# 异常值分析
# （1）3σ原则：如果数据服从正态分布，异常值被定义为一组测定值中与平均值的偏差超过3倍的值 → p(|x - μ| > 3σ) ≤ 0.003

data = pd.Series(np.random.randn(10000)*100)
# 创建数据

u = data.mean()  # 计算均值
std = data.std()  # 计算标准差
stats.kstest(data, 'norm', (u, std))
print('均值为：%.3f，标准差为：%.3f' % (u,std))
print('------')
# 正态性检验

fig = plt.figure(figsize = (10,6))
ax1 = fig.add_subplot(2,1,1)
data.plot(kind = 'kde',grid = True,style = '-k',title = '密度曲线')

# 绘制数据密度曲线

ax2 = fig.add_subplot(2,1,2)
error = data[np.abs(data - u) > 3*std]
data_c = data[np.abs(data - u) <= 3*std]
print('异常值共%i条' % len(error))
# 筛选出异常值error、剔除异常值之后的数据data_c

plt.scatter(data_c.index,data_c,color = 'k',marker='.',alpha = 0.3)
plt.scatter(error.index,error,color = 'r',marker='.',alpha = 0.5)
plt.xlim([-10,10010])
plt.grid()
# 图表表达
```
![](/img/media/15694186303676.jpg)


```python
# 异常值分析
# （2）箱型图分析

fig = plt.figure(figsize = (10,6))
ax1 = fig.add_subplot(2,1,1)
color = dict(boxes='DarkGreen', whiskers='DarkOrange', medians='DarkBlue', caps='Gray')
data.plot.box(vert=False, grid = True,color = color,ax = ax1,label = '样本数据')
# 箱型图看数据分布情况
# 以内限为界

s = data.describe()
print(s)
print('------')
# 基本统计量

q1 = s['25%']
q3 = s['75%']
iqr = q3 - q1
mi = q1 - 1.5*iqr
ma = q3 + 1.5*iqr
print('分位差为：%.3f，下限为：%.3f，上限为：%.3f' % (iqr,mi,ma))
print('------')
# 计算分位差

ax2 = fig.add_subplot(2,1,2)
error = data[(data < mi) | (data > ma)]
data_c = data[(data >= mi) & (data <= ma)]
print('异常值共%i条' % len(error))
# 筛选出异常值error、剔除异常值之后的数据data_c

plt.scatter(data_c.index,data_c,color = 'k',marker='.',alpha = 0.3)
plt.scatter(error.index,error,color = 'r',marker='.',alpha = 0.5)
plt.xlim([-10,10010])
plt.grid()
# 图表表达
```

![](/img/media/15694187863346.jpg)


### 3.2 异常值处理
　　异常值处理方法：
1. 删除 
2. 修正填补。


　　删除的方式可以有直接删去异常值，或者尝试将分布在最小值和最大值附近的离散点做一个截断：

```python
up_limit = np.percentile(train_df[col].values, 99.9) # 99.9%分位数
low_limit = np.percentile(train_df[col].values, 0.1) # 0.1%分位数
train_df[col][train_df[col] > up_limit] = up_limit
train_df[col][train_df[col] < low_limit] = low_limit
# train_df.loc[train_df[col] > up_limit, col] = up_limit
# train_df.loc[train_df[col] < low_limit, col] = low_limit
```

## 4. 数据归一化
　　数据中心化和标准化在回归分析中目的是取消由于量纲不同、自身变异或者数值相差较大所引起的误差。

```python
# 数据标准化
# （1）0-1标准化
# 将数据的最大最小值记录下来，并通过Max-Min作为基数（即Min=0，Max=1）进行数据的归一化处理
# x = (x - Min) / (Max - Min)

# （2）Z-score标准化
# Z分数（z-score）,是一个分数与平均数的差再除以标准差的过程 → z=(x-μ)/σ，其中x为某一具体分数，μ为平均数，σ为标准差
# Z值的量代表着原始分数和母体平均值之间的距离，是以标准差为单位计算。在原始分数低于平均值时Z则为负数，反之则为正数
# 数学意义：一个给定分数距离平均数多少个标准差?
# 在分类、聚类算法中，需要使用距离来度量相似性的时候，Z-score表现更好
```

## 5. 连续数据离散化
　　连续属性变换成分类属性，即连续属性离散化在数值的取值范围内设定若干个离散划分点，将取值范围划分为一些离散化的区间，最后用不同的符号或整数值代表每个子区间中的数据值。
```python
# （1）等宽法 → 将数据均匀划分成n等份，每份的间距相等
# cut方法

ages=[20,22,25,27,21,23,37,31,61,45,41,32]
# 有一组人员年龄数据，希望将这些数据划分为“18到25”,“26到35”,“36到60”,“60以上”几个面元

bins = [18,25,35,60,100]
cats = pd.cut(ages,bins)
```


```python
# （2）等频法 → 以相同数量的记录放进每个区间
# qcut方法

data = np.random.randn(1000)
s = pd.Series(data)
cats = pd.qcut(s,4)  # 按四分位数进行切割，可以试试 pd.qcut(data,10)
```

## 6. 特殊处理
### 6.1 有偏度的特征
1. 常见于数值类型的变量，最简单的方法是用`log(x+1)`或者`倒数`或者`指数exp`处理，使数据呈现正态分布

```python
train_df[col] = train_df[col].map(lambda x : p.log1p(x))
```
2. 应用 Box-Cox 转换

### 6.2 长尾型并不是偏度正态的数据特征
* 离散化数据，分区间处理，即分桶。


### 6.3 一般 bool 类型的组合
![](/img/media/15519285885784.jpg)


### 6.4 暴力特征
采用各种批量的组合特征。

### 6.5 如何判断数据是线性可分
　　对于低维（一维、二维、三维）我们还可以画出来看是否线性可分。如果是高维的话，可以先找到两个部分的凸包，看两个凸包是否相交。根据类别将数据分成 A、B 两个部分，然后用 [quickhull](https://en.wikipedia.org/wiki/Convex_hull_algorithms) 算法来获得数据的凸包，接着使用 [sweepline](http://people.csail.mit.edu/indyk/6.838-old/handouts/lec2.pdf) 算法判断凸包边界是否相交。这两个算法的时间复杂度都是 $O(n\log(n))$。

　　还有一种比较简单的方法是可以通过降维方法将数据降到可视化的二维来大概判断一下是否线性可分。








## References
1. [机器学习特征工程实用技巧大全](https://zhuanlan.zhihu.com/p/26444240)
2. [使用sklearn做单机特征工程](https://www.cnblogs.com/jasonfreak/p/5448385.html)
3. [经典比较篇之八：数据不正态怎么办？](https://zhuanlan.zhihu.com/p/26784184)
4. [Python 特征工程](https://coladrill.github.io/2018/03/08/Python%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B%E7%AF%87/)
5. [Determine whether the two classes are linearly separable (algorithmically in 2D)](https://stackoverflow.com/questions/9779179/determine-whether-the-two-classes-are-linearly-separable-algorithmically-in-2d)
6. [Feature preprocessing of both continuous and categorical variables (of integer type) with scikit-learn](https://stackoverflow.com/questions/43554821/feature-preprocessing-of-both-continuous-and-categorical-variables-of-integer-t)
7. [数据处理教程](https://zhuanlan.zhihu.com/p/83770495)
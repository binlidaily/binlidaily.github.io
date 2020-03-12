---
layout: post
title: Machine Learning Projects
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　这里系统整理一下做机器学习项目的流程。

{% include toc.html %}

## 1. 问题大局观
　　拿到数据和问题后要从大局观的视角看，首先构建问题，然后选择合适的衡量指标，最后检查假设：

1. 构造问题
    * 确定商业相关的目标是什么？
    * 思考提出的解决方案的实际用途是什么？
    * 现有的方案是什么样子的？
    * 应该构造成什么类型的问题？
        * 监督、无监督、强化学习？
        * 分类、回归？
        * 如果数据量很大，使用 batch learning 或者 online learning?
2. 选择一个性能指标
    * 性能指标跟商业目标是否匹配？
    * 能够达到商业目标的最小性能指标是什么？
    * 类似的问题有哪些？是否能够重用那些经验或者工具？
    * 如何去手动解决这个问题？
3. 检查假设
    * 列出所有假设
    * 尽量去验证假设

## 2. 获取数据
　　获取数据是在确定了商业目标之后的第一步。

1. 列出需要的数据，以及确定需要的量。
2. 查找和记录可以从哪些地方可以获取到数据。
3. 检查所需要的数据需要占用大多的存储空间。
4. 检查法律条文，看是否需要申请权限。
5. 获得访问权限。
6. 在有足够存储空间的前提下，创建工作空间。
7. 获取数据。
8. 在不改变数据的前提下，将数据转换为更好处理的格式。
9. 确保敏感信息已经被删去，或者脱敏。
10. 检查数据大小和数据的类型（时间序列，样本，地理等）
11. 单独采样出一个**测试集**。

　　纯做学院派是不行的，要多在实际的数据中摸爬滚打，才能攒出一些经验，拔高自己的视野。幸运的是，有很多数据可供我们学习使用：
1. 公开数据集
    * [UC Irvine Machine Learning Repository](http://archive.ics.uci.edu/ml/index.php)
    * [Kaggle datasets](https://www.kaggle.com/datasets)
    * [Amazon’s AWS datasets](https://registry.opendata.aws/)
2. Meta portals
    * http://dataportals.org/ 
    * http://opendatamonitor.eu/ 
    * http://quandl.com/
3. Other pages listing many popular open data repositories:
    * Wikipedia’s list of Machine Learning datasets 
    * Quora.com question 
    * Datasets subreddit

　　构造一个测试集用来离线快速测试自己的模型是非常重要的，而且先划分出训练、测试集后再去训练测试模型能避免 Data Snooping Bias。

```python
# 1. 自己实现划分测试集
## 但是由于有 random 的操作，每次运行结果不一样，可以设定随机种子防止每次结果不一
import numpy as np
# np.random.seed(42)
def split_train_test(data, test_ratio):
	shuffled_indices = np.random.permutation(len(data)) 
	test_set_size = int(len(data) * test_ratio) 
	test_indices = shuffled_indices[:test_set_size] 
	train_indices = shuffled_indices[test_set_size:] 
	return data.iloc[train_indices], data.iloc[test_indices]

train_set, test_set = split_train_test(housing, 0.2)

# 2. 自己实现使用 ID 来划分
## 第一种方式虽然能够设置随机种子，但当数据集更新后，结果依然是不一致的，这时可以用样本唯一 ID 来做为划分依据
## 此时能够保证即使数据集更新，测试集中不会出现之前在训练集里的样本
import hashlib 

def test_set_check(identifier, test_ratio, hash):
	return hash(np.int64(identifier)).digest()[-1] < 256 * test_ratio

def split_train_test_by_id(data, test_ratio, id_column, hash=hashlib.md5):
	ids = data[id_column] 
	in_test_set = ids.apply(lambda id_: test_set_check(id_, test_ratio, hash)) 
	return data.loc[~in_test_set], data.loc[in_test_set]

housing_with_id = housing.reset_index() # adds an `index` column 
train_set, test_set = split_train_test_by_id(housing_with_id, 0.2, "index")

housing_with_id["id"] = housing["longitude"] * 1000 + 
housing["latitude"] 
train_set, test_set = split_train_test_by_id(housing_with_id, 0.2, "id")

# 3. 使用 Sklearn 划分
from sklearn.model_selection import train_test_split

train_set, test_set = train_test_split(housing, test_size=0.2, random_state=42)
```

## 3. 探索数据
　　获取到数据后我们需要对数据进行深一步探索，理解数据：

1. 创建数据的拷贝，必要时向下采样得到方便管理的数据大小。
2. 创建 Jupyter 保存数据可视化探索的记录。
3. 仔细观察每个特征及其特点：
    * 特证名
    * 类型 (categorical, int/float, bounded/unbounded, text, structured, etc.)
    * 缺失值百分比
    * 噪声和噪声类型 (stochastic, outliers, rounding errors, etc.)
    * 是否对预测目标有帮助？
    * 特征分布类型 (Gaussian, uniform, logarithmic, etc.)
4. 对于监督学习，确定目标特征。
5. 对数据进行可视化探索。
6. 仔细分析特征之间的相关性。
7. 思考要如何手动解决问题。
8. 找到那些有帮助的数据转换。
9. 尽量多收集一些有用的数据。
10. 注意记录下那些有用的数据信息。

## 4. 准备数据
　　在为模型准备好数据之前，首先要注意几点：
* 要在数据拷贝上进行操作，保证原数据原样。
* 对所有的数据转换写成函数，这样做的好处是：
    * 当有新数据时能够很容易处理。
    * 基于重用的考虑，再以后的项目中也很好复用。
    * 为了更简洁的处理和准备测试数据集。
    * 如果解决方案是在线形式的，这样能更好地处理和准备新样本。
    * 如此能容易利用超参数增加数据准备的选择性。

1. 数据清洗
    * 修改或者删除异常点（可选）
    * 填充缺失值（0，平均值，中位数，众数等），或者丢弃该行（或该列）
2. 特征选择（可选）
    * 丢弃那些对目标没有贡献有用信息的特征。
3. 特征工程
    * 离散化连续特征
    * 分解特征（种类特征，日期/时间等）
    * 进行一些有效的特征变换（log(x), sqrt(x), x^2 等）
    * 聚合 (Aggregate) 统计量特征成新的有用特征
    * 特征选择需要运用特征有效性分析的相关技术，如相关系数、卡方检验、平均互信息、条件熵、后验概率、逻辑回归权重等方法。
4. 特征归一化
    * 归一化 (standardize) 或者正则化特征 (max-min)

## 5. 确定少数有效的模型
　　如果数据较大，需要选择相对较小的数据集在能够接收的时间内来训练不同的模型。尽可能地使得这些过程自动化。

1. 使用常用的参数很快尝试很多不同类型的原始模型（像 linear, naive Bayes, SVM, Random Forests, neural net 等）
2. 衡量和比较每个模型的性能
    * 对于每个模型，用 K 折交叉验证计算对应的平均数、标准差。
3. 分析每个算法中最重要的变量。
4. 分析模型产生错误的类型。
    * 哪些数据人类能够用来避免这些错误。
5. 要有一个快速的特征选择和特征工程的循环流程。
6. 要有一到两次上面五步的快速迭代。
7. 取性能最好的三到五个能够产生不同错误的模型。


## 6. 微调模型
　　在微调的过程中，最好使用尽可能多的数据，尤其是在微调快结束时，而且尽可能的使得这个过程自动化。
1. 使用交叉验证进行超参数的微调
    * 对选择数据转换与否用超参来实现，这样能够做到很好的切换。
    * 除非模型只有非常少的超参要调，不然倾向使用 random search 而非 grid search。如果训练时间过长，可以尝试贝叶斯优化方法（如 using Gaussian process priors, as described by Jasper Snoek, Hugo Larochelle, and Ryan Adams）
2. 尝试集成方法，结合效果较好的几个模型往往能得到更好的结果。
3. 当你对目前的效果比较满意了，就可以在测试集上检验一下泛化误差了。

## 7. 展示结果
1. 记录下你所做的内容。
2. 创建一个漂亮的 slides。
    * 首先确保你能强调问题的大局观
3. 解释为什么你的解决方案能够实现商业目标。
4. 当然不要忘记展示你在做的过程中发现的有意思的地方。
    * 描述一下哪些有用，哪些没用
    * 列出你的假设以及你系统的局限性
5. 确保你发现的内容通过很好理解的方式展现：一览无余的可视化，或者容易记住的陈述。

## 8. 模型发布
1. 让解决方案做好商业化准备（比如连接到产品数据输入，做一些单元测试等）
2. 写一些监视代码周期性检查模型的实时效果，如果效果下降及时报警。
    * 也要注意性能的慢速下降，模型可能随着数据的变化有下降趋势。
    * 衡量效果有时候需要人工的过程。
    * 同时要检测输入数据的质量（a malfunctioning sensor sending random values, or another team’s output becoming stale），这对在线学习模型尤为重要。
3. 阶段性在新数据上重新训练模型（尽可能使得这个任务自动化完成）


## References
1. 《Hands-On Machine Learning with Scikit-Learn and TensorFlow: Concepts, Tools, and Techniques to Build Intelligent Systems》
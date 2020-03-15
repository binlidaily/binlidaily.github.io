---
layout: post
title: Random Forest
subtitle: 随机森林
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　随机森林（Random Forest，RF）基于 Bagging 的想法，做了一定的改进，其基学习器是 CART (强学习器)，然而在选择划分特征的时候，RF 采用了随机的策略。不像之前的决策树在当前结点上遍历所有 $n$ 个样本特征中找到最优的划分属性，RF 会固定一个特征子集大小 $n_{sub}$，在当前结点样本的所有特征中随机选择 $n_{sub}$ 个特征，从其中选出最优的一个划分特征来进行特征划分。如此能够提高模型的泛化能力。显然，当 $n_{sub}=n$ 时，RF 的 CART 跟传统的保持一致。

　　一般来说，$n_{sub}=n$ 越小，模型就越健壮，当然此时对数据的拟合程度就会变差。即 $n_{sub}=n$ 越小，variance 越小，bias 越大。随机性使得偏差增大，但由于随机森林集成“平均”的特性，使得方差变小的程度大过了偏差增大的程度，总体来说效果还是好的。

 　　随机森林有四个部分需要掌握：
1. 随机选择样本（放回抽样）；
2. 随机选择特征；
3. 构建决策树；
4. 随机森林投票（平均）。 

## 1. Random Forest 算法流程
　　假设输入为样本集为

$$
D = \left\{ \left( x , y _ { 1 } \right) , \left( x _ { 2 } , y _ { 2 } \right) , \ldots \left( x _ { m } , y _ { m } \right) \right\}
$$

　　基学习器记作 $G(x)$，迭代次数为 $T$：

1. 对于 $t = 1,2 \ldots , T$：

    1. 对训练集进行第 $t$ 次随机采样，共采集 $m$ 次，得到包含 $m$ 个样本的采样集 $D_t$
    2. 用采样集 $D_t$ 训练第 $t$ 个基学习器 $G_t(x)$，在训练决策树划分结点的时候，在结点上所有的样本特征中随机选出一部分样本特征，在这些随机选择出来的样本特征中找出最优的划分特征来划分当前结点

2. 如果是分类算法预测，则 $T$ 个基学习器投出最多票数的类别或者类别之一为最终类别。如果是回归算法，$T$ 个弱学习器得到的回归结果进行算术平均得到的值为最终的模型输出。

在每一次 branching 时，做特征 Random 的两种方式：
1. Bagging + Random-Subspace CART
    * 每个结点做划分的时候都随机选择 $F$ 个属性作为候选属性。
2. Bagging + Random-Combination CART
    * 使用输入特征的随机线性组合，不是随机选择一个特征子集，而是设定一个组合特征大小 $L$
    * 随机选择 $L$ 个特征组合成一个新的特征，组合方式是随机从 $[-1, 1]$ 选取系数做线性加和
    * 一共产生 $F$ 个线性组合的新特征，然后在其中找到最佳划分
    * 此方法当只有少量特征可用，为了降低个体分类器之间的相关性，可用

　　之后就是对采样之后的数据使用完全分裂的方式建立出决策树，这样决策树的某一个叶子节点要么是无法继续分裂的，要么里面的所有样本的都是指向的同一个分类。一般很多的决策树算法都一个重要的步骤——剪枝，但是这里不这样干，由于之前的两个随机采样的过程保证了随机性，所以就算不剪枝，也不会出现over-fitting。

一般在选择特征子集的大小为 $\log_2n+1$，其中 $n$ 为样本特征总数。

$E_{oob}$：self-validation of bagging

　　除了一次性随机抽取部分特征用来构建一棵CART之外，还可以在CART每次branching的时候随机抽取一部分特征计算 Gini impurity 或均方误差来选择best split feature(RF作者使用的这种方法)。更进一步，在构建sub-space的时候，不仅可以使用feature selection，还可以使用feature transformation，每次 braching 随机选择一个变换矩阵将原始feature变换到低维空间。More randomness, more robust。

　　如何计算对应特征重要性？

　　可以利用基尼系数，计算所有利用了特征 $i$ 作为划分特征的结点，计算其划分前后基尼系数差值并累加起来，然后用这个加和除以在所有节点上使用对应特征划分结点时划分前后的基尼系数差值的累加和。具体可[参考](https://medium.com/@srnghn/the-mathematics-of-decision-trees-random-forest-and-feature-importance-in-scikit-learn-and-spark-f2861df67e3)。

$$
n i_{j}=w_{j} C_{j}-w_{l e f t(j)} C_{l e f t(j)}-w_{r i g h t(j)} C_{r i g h t(j)}
$$

![](/img/media/15651699533571.jpg)

$$
f i_{i}=\frac{\sum_{j : n o d e j s p l i t s o n f e a t u r e i} n i_{j}}{\sum_{k \in a l l} n o d e s} n i_{k}
$$


![](/img/media/15651699588815.jpg)

$$
f i_{i}=\frac{\sum_{j : n o d e j s p l i t s o n ~ f e a t u r e i} n i_{j}}{\sum_{k \in a l l ~ n o d e s} n i_{k}}
$$


$$
\text {norm fi}_{i}=\frac{f i_{i}}{\sum_{j \in \text {all features}} f i_{j}}
$$

## ExtraTree
ET或Extra-Trees（Extremely randomized trees，极端随机树）是由PierreGeurts等人于2006年提出。该算法与随机森林算法十分相似，都是由许多决策树构成。但该算法与随机森林有两点主要的区别：

1、随机森林应用的是Bagging模型，而ET是使用所有的训练样本得到每棵决策树，也就是每棵决策树应用的是相同的全部训练样本；

2、随机森林是在一个随机子集内得到最佳分叉属性，而ET是完全随机的得到分叉值，从而实现对决策树进行分叉的。

## 总结
　　由于 Bagging 的思想可以分布式地实现若干个基学习器的学习，Random Forest 的一大优势是能够高度并行化，在大数据时可大有作为。一般可以用随机森林跑出一个模型，然后**查看特征的重要性**。

随机森林的**优点**：
1. 训练可以高度并行化，在大数据时代的大样本训练环境下极具优势
2. 具有极高的准确率
3. 随机性的引入，使得随机森林不容易过拟合
4. 随机性的引入，使得随机森林有很好的抗噪声能力
5. 由于可以随机选择决策树划分结点的特征，这样在样本特征维度较高时，仍能保持高效的训练，不用做特征选择
6. 在训练后，可以给出各个特征对于输出结果的重要性
7. 由于采用了随机采样，训练出的模型方差小，泛化能力强
8. 相对于 Boosting 的 Adaboost 和 GBDT，RF 比较好实现
9. 对部分特征确实不敏感
10. 实践中，既能处理离散型数据，也能处理连续型数据，可以对输入数据不用做太多处理（能够处理 binary features, categorical features, numerical features）

随机森林的**缺点**：
1. 在某些噪声比较大的样本集上，容易陷入过拟合
2. 对于有不同取值的属性的数据，取值划分较多的属性会对随机森林产生更大的影响（偏向取值较多的特征，随机选的时候选中的概率比较高！），所以随机森林在这种数据上产出的属性权值是不可信的
3. 训练好的模型比较大，预测时较慢
4. 相比于单一决策树，它的随机性让我们难以对模型进行解释

## Q & A


## References
1. [Bagging与随机森林算法原理小结](https://www.cnblogs.com/pinard/p/6156009.html)
2. [RF、GBDT、XGBoost面试级整理](https://cloud.tencent.com/developer/article/1080189)

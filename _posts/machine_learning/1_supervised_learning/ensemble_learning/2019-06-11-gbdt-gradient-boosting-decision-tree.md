---
layout: post
title: Gradient Boosting Decision Tree
subtitle: 梯度提升决策树（GBDT）
author: Bin Li
tags: [Machine Learning, Ensemble Learning]
image: 
comments: true
published: true
---

{% include toc.html %}

　　之前我们介绍过 [Gradient Boosting](https://binlidaily.github.io/2018-12-05-gbm-gradient-boosting-machine/) 方法利用损失函数的负梯度（伪残差）作为拟合对象的方式，当其中的基函数采用决策树的话，就得到了梯度提升决策树 (Gradient Boosting Decision Tree, GBDT)。

<p align="center">
  <img width="" height="350" src="/img/media/15625834080342.jpg">
</p>

　　GBDT 的思想可以用一个通俗的例子解释，可以用打高尔夫球的例子形象解释，当然这也只限于回归任务，分类任务的话会退化为 Adaboost。接下来我们从回归和分类的任务上分别予以介绍。

## 1. GBDT 回归算法
　　当我们采用的基学习器是决策树时，那么梯度提升就具象到了梯度提升决策树。先还是从一些假设开始，数据集记作：

$$
D = \left\{ \left( x_1 , y _ { 1 } \right) , \left( x _ { 2 } , y _ { 2 } \right) , \ldots . \left( x _ { m } , y _ { m } \right) \right\}
$$

　　其中 $x_i \in \mathcal{X} \subseteq \mathcal{R}^n$，$\mathcal{X}$ 为输入空间，$y_i \in \mathcal{Y} \subseteq \mathcal{R}$，$\mathcal{Y}$ 为输出空间，损失函数为 $L(y, f(x))$，我们的目标是得到最终的回归树 $\hat { f } ( x )$。

　　1）首先初始化第一个集成学习器（同时是基学习器）：

$$
f _ { 0 } ( x )  = G _ { 0 } ( x ) =  \underset{ c }{ \arg \min }  \sum _ { i = 1 } ^ { m } L \left( y _ { i } , c \right)
$$

　　2）对于迭代轮数（基学习器个数） $t = 1,2 , \dots , M$：

　　　a）对每一个样本 $ i = 1,2 , \dots , m$，计算损失函数的负梯度：

$$
r_{t i}=-\left[\frac{\partial L\left(y_{i}, f\left(x_{i}\right)\right) )}{\partial f\left(x_{i}\right)}\right]_{f(x)=f_{t-1}}
$$

　　　b）对 $i=1,2, \dots m$，利用 $\left(x_{i}, r_{t i}\right)$ 拟合出一颗 CART 回归树，得到第 $t$ 颗回归树，其对应的叶子节点区域为 $R_{t j}$, $j=1,2, \dots, J$，其中 $J$ 为回归树 $t$ 的叶子节点的个数。

　　　c）对于 $J$ 个叶子节点区域 $j=1,2, \dots, J$，计算出最佳拟合值：

$$
c_{t j}=\underset{c}{\arg \min } \sum_{x_{i} \in R_{t j}} L\left(y_{i}, f_{t-1}\left(x_{i}\right)+c\right)
$$

　　　d）更新强学习器（集成学习器）：

$$
f_{t}(x)=f_{t-1}(x)+\sum_{j=1}^{J} c_{t j} I\left(x \in R_{t j}\right)
$$

　　3）得到强学习器 $f(x)$ 的表达式：

$$
\hat{f}(x)=\sum_{T} f(x)=f_{0}(x)+\sum_{t=1}^{T} \sum_{j=1}^{J} c_{t j} I\left(x \in R_{t j}\right)
$$


## 2. GBDT 分类算法
　　GBDT 分类算法跟回归算法在思想上是没有什么差别的，主要因为分类算法的输出结果不是连续值，类别值在一定程度上表示不了大小差距，很难从输出类别结果中去拟合输出误差。对于这样的问题，可以采用两种方法来解决：

1. 一个采用指数损失函数，这样 GBDT 就退化成了 Adaboost，能够解决分类的问题；
2. 使用类似于逻辑回归的**对数似然损失函数**，如此可以通过结果的概率值与真实概率值的差距当做残差来拟合；

### 2.1 GBDT 二分类算法
　　对于二元 GBDT，如果用类似于逻辑回归的对数似然损失函数，则损失函数为

$$
L ( y , f ( x ) ) = \log ( 1 + \exp ( - y f ( x ) ) )
$$

　　其中 $y \in \\{ - 1 , + 1 \\}$，则此时的负梯度误差为

$$
r_{t i}=-\left[\frac{\partial L\left(y, f\left(x_{i}\right)\right) )}{\partial f\left(x_{i}\right)}\right]_{f(x)=f_{t-1}(x)}=\frac{y_{i}} {1+\exp \left(y_{i} f\left(x_{i}\right)\right)}
$$

　　对于生成的决策树，各个叶子节点的最佳残差拟合值为

$$
c_{t j}=\underset{c}{ \arg \min } \sum_{x_{i} \in R_{t j}} \log \left(1+\exp \left(-y_{i}\left(f_{t-1}\left(x_{i}\right)+c\right)\right)\right)
$$

　　由于上式比较难优化，我们一般使用近似值代替：

$$
c_{t j}=\frac{\sum_{x_{i} \in R_{t j}} r_{t i}}{\sum_{x_{i} \in R_{i j}}\left|r_{t i}\right|\left(1-\left|r_{t i}\right|\right)}
$$

　　除了负梯度计算和叶子节点的最佳残差拟合的线性搜索，二元 GBDT 分类和 GBDT 回归算法过程相同。

### 2.2 GBDT 多分类算法
　　多元 GBDT 要比二元 GBDT 复杂一些，在于多元逻辑回归和二元逻辑回归的复杂度差别。假设类别数为 $K$，则对数似然损失函数为：

$$
L ( y , f ( x ) ) = - \sum _ { k = 1 } ^ { K } y _ { k } \log p _ { k } ( x )
$$

　　其中如果样本输出类别为 $k$，则 $y_k=1$。第 $k$ 类的概率 $p_k(x)$ 的表达式为：

$$
p _ { k } ( x ) = {\exp \left( f _ { k } ( x ) \right) \over \sum _ { l = 1 } ^ { K } \exp \left( f _ { l } ( x ) \right)}
$$

　　结合上两式，可以计算出第 $t$ 轮的第 $i$ 个样本对应类别 $l$ 的负梯度为

$$
r_{t i l}=-\left[\frac{\partial L\left(y_{i}, f\left(x_{i}\right)\right) )}{\partial f\left(x_{i}\right)}\right]_{f_{k}(x)=f_{l, t-1}(x)}=y_{i l}-p_{l, t-1}\left(x_{i}\right)
$$

　　观察上式可以看出，这里的误差就是样本 $i$ 对应类别 $l$ 的真实概率和 $t-1$ 轮预测概率的差值。

　　对于生成的决策树，各个叶子节点的最佳伪残差拟合值为

$$
c_{t j l}=\underset{c_{j l}}{\arg \min } \sum_{i=0}^{m} \sum_{k=1}^{K} L\left(y_{k}, f_{t-1, l}(x)+\sum_{j=0}^{J} c_{j l} I\left(x_{i} \in R_{t j l}\right)\right)
$$

　　由于上式比较难优化，我们一般使用近似值代替

$$
c_{t j l}=\frac{K-1}{K} \frac{x_{i} \in R_{t i l}}{\sum_{x_{i} \in R_{t i l}}\left|r_{t i l}\right|\left(1-\left|r_{t i l}\right|\right)}
$$

　　同样的，除了负梯度计算和叶子节点最佳伪残差拟合的线性搜索，多元 GBDT 分类和二元 GBDT 分类以及 GBDT 回归算法过程相同。

## 3. GBDT 常见损失函数
　　这里对 GBDT 常见损失函数做一个总结，对分类和回归任务分别整理。

### 3.1 分类任务的损失函数
　　对于分类算法，其损失函数一般有对数损失函数和指数损失函数两种:

　　1）如果是**指数损失**函数，则损失函数表达式为

$$
L(y, f(x))=\exp (-y f(x))
$$

　　其负梯度计算和叶子节点的最佳负梯度拟合可以参看 [Adaboost](https://binlidaily.github.io/2018-10-29-adaboost/)。

　　2）如果是**对数损失**函数，分为二元分类和多元分类两种，参看上两小节内容。

### 3.2 回归任务的损失函数

　　1）**均方差**，这个是最常见的回归损失函数：

$$
L(y, f(x))=(y-f(x))^{2}
$$

　　2）**绝对损失**，这个损失函数也很常见

$$
L(y, f(x))=|y-f(x)|
$$

　　对应的负梯度误差为：

$$
\operatorname{sign}\left(y_{i}-f\left(x_{i}\right)\right)
$$

　　3）**Huber 损失**，它是均方差和绝对损失的折中产物，对于远离中心的异常点，采用绝对损失，而中心附近的点采用均方差。这个界限一般用分位数点度量。损失函数如下：

$$
L(y, f(x))=\left\{\begin{array}{ll}{\frac{1}{2}(y-f(x))^{2}} & {|y-f(x)| \leq \delta} \\ {\delta\left(|y-f(x)|-\frac{\delta}{2}\right)} & {|y-f(x)|>\delta}\end{array}\right.
$$

　　对应的负梯度误差为：

$$
r\left(y_{i}, f\left(x_{i}\right)\right)=\left\{\begin{array}{ll}{y_{i}-f\left(x_{i}\right)} & {\left|y_{i}-f\left(x_{i}\right)\right| \leq \delta} \\ {\delta \cdot \text{sign}\left(y_{i}-f\left(x_{i}\right)\right)} & {\left|y_{i}-f\left(x_{i}\right)\right|>\delta}\end{array}\right.
$$

　　4）**分位数损失**，它对应的是分位数回归的损失函数，表达式为

$$
L(y, f(x))=\sum_{y \geq f(x)} \theta|y-f(x)|+\sum_{y<f(x)}(1-\theta)|y-f(x)|
$$

　　其中 $\theta$ 为分位数，需要我们在回归前指定。对应的负梯度误差为：

$$
r\left(y_{i}, f\left(x_{i}\right)\right)=\left\{\begin{array}{ll}{\theta} & {y_{i} \geq f\left(x_{i}\right)} \\ {\theta-1} & {y_{i}<f\left(x_{i}\right)}\end{array}\right.
$$

　　对于 Huber 损失和分位数损失，主要用于健壮回归，也就是减少异常点对损失函数的影响。


## 4. GBDT 的正则化
　　和 Adaboost 一样，我们也需要对 GBDT 进行正则化，防止过拟合。GBDT 的正则化主要有三种方式。

　　1）第一种是和 Adaboost 类似的正则化项，即**步长（learning rate）**。定义为 $\nu$，对于前面的弱学习器的迭代

$$
f_{k}(x)=f_{k-1}(x)+h_{k}(x)
$$

　　如果我们加上了正则化项，则有

$$
f_{k}(x)=f_{k-1}(x)+\nu h_{k}(x)
$$

　　其中 $\nu$ 的取值范围为 $0<\nu \leq 1$。对于同样的训练集学习效果，较小的 $\nu$ 意味着我们需要更多的弱学习器的迭代次数，通常我们可以用步长和迭代最大次数一起来决定算法的拟合效果。

　　2）第二种正则化的方式是通过**子采样**比例（subsample），取值为 $(0,1]$。注意这里的子采样和随机森林不一样，随机森林使用的是放回抽样，而这里是不放回抽样。如果取值为 $1$，则全部样本都使用，等于没有使用子采样。如果取值小于 $1$，则只有一部分样本会去做 GBDT 的决策树拟合。选择小于 $1$ 的比例可以减少方差，即防止过拟合，但是会增加样本拟合的偏差，因此取值不能太低，推荐在 $[0.5, 0.8]$ 之间。

　　使用了子采样的 GBDT 有时也称作随机梯度提升树 (Stochastic Gradient Boosting Tree, SGBT)。由于使用了子采样，程序可以通过采样分发到不同的任务去做 boosting 的迭代过程，最后形成新树，从而减少弱学习器难以并行学习的弱点。

　　3）第三种是对于基学习器即 CART 回归树进行**正则化剪枝**，可以参考之前对决策剪枝的[介绍](https://binlidaily.github.io/2018-09-11-decision-tree/#13-剪枝处理pruning)。

## 5. 工程应用
### 5.1 Parameter Tuning
　　调参的过程可以[参考](https://www.analyticsvidhya.com/blog/2016/03/complete-guide-parameter-tuning-xgboost-with-codes-python/)。

## 6. 总结
GBDT **优点**：
1. 可以灵活处理各种类型的数据，包括连续值和离散值。
2. 在相对少的调参时间情况下，预测的准确率也可以比较高。这个是相对 SVM 来说的。
3. 使用一些健壮的损失函数，对异常值的鲁棒性非常强。比如 Huber 损失函数和 Quantile 损失函数。

GBDT **缺点**：
1. 由于弱学习器之间存在依赖关系，难以并行训练数据。不过可以通过自采样的 SGBT 来达到部分并行。

* [ ] GBDT 需要看下如何做**预测**？直接采用加法模型的计算？是否有注意点？


## 7. 问答思考（Q & A）
### 7.1 比较 LR 和 GBDT，说说什么情景下 GBDT 不如 LR？
　　先说说 LR 和 GBDT 的区别：

- LR 是线性模型，可解释性强，很容易并行化，但学习能力有限，需要大量的人工特征工程
- GBDT 是非线性模型，具有天然的特征组合优势，特征表达能力强，但是树与树之间无法并行训练，而且树模型很容易过拟合；

　　当在**高维稀疏特征**的场景下，LR 的效果一般会比 GBDT 好！

　　先看一个例子：

> 　　假设一个二分类问题，label 为 0 和 1，特征有 100 维，如果有 1w 个样本，但其中只有 10 个正样本，而这些样本的第一个特征 $f_1$ 的值为全为 1，而其余 9990 条样本的 $f_1$ 特征都为 0(在高维稀疏的情况下这种情况很常见)。
>
>　　我们都知道在这种情况下，树模型很容易优化出一个使用 $f_1$ 特征作为重要分裂节点的树，因为这个结点直接能够将训练数据划分的很好，但是当测试的时候，却会发现效果很差，因为这个特征 $f_1$ 只是刚好偶然间跟 $y$ 拟合到了这个规律，这也是我们常说的过拟合。
>
>　　那么这种情况下，如果采用 LR 的话，应该也会出现类似过拟合的情况呀：$y = W_1\times f_1 + \dots + W_i\times f_i+\dots$，其中 $W_1$ 特别大以拟合这 10 个样本。

　　🤔那么这种情况下为什么树模型会过拟合，LR 就不会呢？

　　仔细想想发现，因为现在的模型普遍都会带着正则项，而 LR 等线性模型的正则项是对权重的惩罚，也就是 $W_1$ 一旦过大，惩罚就会很大，进一步压缩 $W_1$ 的值，使它不至于过大。但是，树模型则不一样，树模型的惩罚项通常为叶子节点数和深度等，而我们都知道，对于上面这种 case，树只需要一个节点就可以完美分割 9990 和 10 个样本，一个结点，最终产生的惩罚项极其之小。

　　这也就是为什么在高维稀疏特征的时候，线性模型会比非线性模型好的原因了：**带正则化的线性模型比较不容易对稀疏特征过拟合**。

###  7.2 RF 和 GBDT 的区别有哪些？哪个树可以更深？

　　相同点：
- 都是由多棵树组成，最终的结果都是由多棵树一起决定。

　　不同点：
- 集成学习：RF 属于 bagging 思想，而 GBDT 是 boosting 思想
- 偏差-方差权衡：RF 不断的降低模型的方差，而 GBDT 不断的降低模型的偏差
- 训练样本：RF 每次迭代的样本是从全部训练集中有放回抽样形成的，而 GBDT 每次使用全部样本
- 并行性：RF 的树可以并行生成，而 GBDT 只能顺序生成(需要等上一棵树完全生成)
- 最终结果：RF 最终是多棵树进行多数表决（回归问题是取平均），而 GBDT 是加权融合
- 数据敏感性：RF 对异常值不敏感，而 GBDT 对异常值比较敏感
- 泛化能力：RF 不易过拟合，而 GBDT 容易过拟合

　　对于 RF 和 GBDT 哪个树可以比较深，可以从以下几个方面思考：
* 对于机器学习来说，泛化误差可以理解为两部分，分别是偏差（bias）和方差（variance）；
    * 偏差指的是算法的期望预测与真实预测之间的偏差程度，反应了模型本身的拟合能力；
    * 方差度量了同等大小的训练集的变动导致学习性能的变化，刻画了数据扰动所导致的影响。
    * 当模型越复杂时，拟合的程度就越高，模型的训练偏差就越小；但此时如果换一组数据可能模型的变化就会很大，即模型的方差很大，所以模型过于复杂的时候会导致过拟合。
* 对于 RF 来说由于并行训练很多不同的分类器的目的就是降低这个方差（variance）。所以对于每个基学习器来说，目标就是如何降低这个偏差（bias），所以我们会采用深度很深甚至不剪枝的决策树。
* 而对于 GBDT 来说由于利用的是残差逼近的方式，即在上一轮的基础上更加拟合原数据，所以可以保证偏差（bias），所以对于每个基分类器来说，问题就在于如何选择 variance 更小的分类器，即更简单的分类器，所以我们选择了深度很浅的决策树。

　　当然，也可以直接从方差和偏差的分解，具体到均值和方差的计算角度来看，具体[参考](https://binlidaily.github.io/2019-02-08-ensemble-learning)。

## References
1. [图解GBDT的构造和预测过程](https://blog.csdn.net/songyunli1111/article/details/83688360)
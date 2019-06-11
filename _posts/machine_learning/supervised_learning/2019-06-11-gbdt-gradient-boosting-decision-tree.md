---
layout: post
title: Gradient Boosting Decision Tree
subtitle: 梯度提升决策树
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　之前我们介绍过 [Gradient Boosting](https://binlidaily.github.io/2018-12-05-gradient-boosting/) 方法利用损失函数的负梯度作为残差拟合的方式，如果其中的基函数采用决策树的话，就得到了梯度提升决策树 (Gradient Boosting Decision Tree, GBDT)。GBDT 但是跟传统的Boosting 方法 Adaboost 有较大的不同，Adaboost 是利用前一轮迭代弱学习器的误差率来更新训练集的权重，如此迭代到收敛。

　　而在 GBDT 的迭代中，如果前一轮迭代得到的强学习器是 $f_{t-1}(x)$，损失函数是 $L\left(y, f_{t-1}(x)\right)$，那么我们本轮迭代的目标是找到一个弱学习器 $h_{t}(x)$，使得本轮损失函数 $L\left(y, f_{t}(x)=L\left(y, f_{t-1}(x)+h_{t}(x)\right)\right.$ 最小，以及本轮的弱学习器要让样本损失尽可能的小。

　　GBDT 的思想可以用一个通俗的例子解释，假如有个人30岁，我们首先用20岁去拟合，发现损失有10岁，这时我们用6岁去拟合剩下的损失，发现差距还有4岁，第三轮我们用3岁拟合剩下的差距，差距就只有一岁了。如果我们的迭代轮数还没有完，可以继续迭代下面，每一轮迭代，拟合的岁数误差都会减小。

　　通过例子来看似乎很简单，但是有一个问题是，这个损失的拟合不是很好实施，损失函数各种各样，如果统一起来呢？这就是[Gradient Boosting](https://binlidaily.github.io/2018-12-05-gradient-boosting/) 方法利用损失函数的负梯度作为残差拟合的方式的厉害之处。接下来我们分回归和分类的任务分别介绍。



## 1. GBDT 回归算法
　　当我们采用的基学习器是决策树时，那么梯度提升就具象到了梯度提升决策树。那么还是从一些假设开始，数据集记作：

$$
T = \left\{ \left( x_1 , y _ { 1 } \right) , \left( x _ { 2 } , y _ { 2 } \right) , \ldots . \left( x _ { m } , y _ { m } \right) \right\}
$$

　　其中 $x_i \in \mathcal{X} \subseteq \mathcal{R}^n$，$\mathcal{X}$ 为输入空间，$y_i \in \mathcal{Y} \subseteq \mathcal{R}$，$\mathcal{Y}$ 为输出空间，损失函数为 $L(y, f(x))$，我们的目标是得到最终的回归树 $\hat { f } ( x )$。

　　1）首先初始化第一个弱学习器：

$$
f _ { 0 } ( x ) =  \underset{ c }{ \arg \min }  \sum _ { i = 1 } ^ { m } L \left( y _ { i } , c \right)
$$

　　2）对于迭代轮数（基学习器个数） $t = 1,2 , \dots , M$：
　　　a）对 $ i = 1,2 , \dots , m$，计算损失函数的负梯度：

$$
r_{t i}=-\left[\frac{\partial L\left(y_{i}, f\left(x_{i}\right)\right) )}{\partial f\left(x_{i}\right)}\right]_{f(x)=f_{t-1}}
$$

　　　b）对于 $i=1,2, \dots m$，利用 $\left(x_{i}, r_{t i}\right)$ 拟合出一颗 CART 回归树，得到第 $t$ 颗回归树，其对应的叶子节点区域为 $R_{t j}$, $j=1,2, \dots, J$，其中 $J$ 为回归树 $t$ 的叶子节点的个数。

　　　c）对于 $J$ 个叶子节点区域 $j=1,2, \dots, J$，计算出最佳拟合值：

$$
c_{t j}=\underset{c}{\arg \min } \sum_{x_{i} \in R_{t j}} L\left(y_{i}, f_{t-1}\left(x_{i}\right)+c\right)
$$

　　　d）更新强学习器：

$$
f_{t}(x)=f_{t-1}(x)+\sum_{j=1}^{J} c_{t j} I\left(x \in R_{t j}\right)
$$

　　3）得到强学习器 $f(x)$ 的表达式：

$$
f(x)=f_{T}(x)=f_{0}(x)+\sum_{t=1}^{T} \sum_{j=1}^{J} c_{t j} I\left(x \in R_{t j}\right)
$$


## 2. GBDT 分类算法
　　GBDT 分类算法跟回归算法在思想上是没有什么差别的，主要因为分类算法的输出结果不是连续值，类别值在一定程度上表示不了大小差距，于是很难从输出类别结果中去拟合输出误差。对于这样的问题，于是可以采用两种方法来解决:
1. 一个采用指数损失函数，这样 GBDT 就退化成了 Adaboost，能够解决分类的问题；
2. 使用类似于逻辑回归的对数似然损失函数，如此可以通过结果的概率值与真实概率值的差距当做残差来拟合；

### 2.1 GBDT 二分类算法
　　对于二元 GBDT，如果用类似于逻辑回归的对数似然损失函数，则损失函数为

$$
L ( y , f ( x ) ) = \log ( 1 + \exp ( - y f ( x ) ) )
$$

　　其中 $y \in \\{ - 1 , + 1 \\}$，则此时的负梯度误差为

$$
r_{t i}=-\left[\frac{\partial L\left(y, f\left(x_{i}\right)\right) )}{\partial f\left(x_{i}\right)}\right]_{f(x)=f_{t-1}(x)}=\frac{y_{i}} {1+\exp \left(y_{i} f\left(x_{i}\right)\right)}
$$

　　对于生成的决策树，我们各个叶子节点的最佳残差拟合值为

$$
c_{t j}=\underset{c}{ \arg \min } \sum_{x_{i} \in R_{t j}} \log \left(1+\exp \left(-y_{i}\left(f_{t-1}\left(x_{i}\right)+c\right)\right)\right)
$$

　　由于上式比较难优化，我们一般使用近似值代替：

$$
c_{t j}=\frac{\sum_{x_{i} \in R_{t j}} r_{t i}}{\sum_{x_{i} \in R_{i j}}\left|r_{t i}\right|\left(1-\left|r_{t i}\right|\right)}
$$

　　除了负梯度计算和叶子节点的最佳残差拟合的线性搜索，二元 GBDT 分类和 GBDT 回归算法过程相同。

### 2.2 GBDT 多分类算法
　　多元 GBDT 要比二元 GBDT 复杂一些，在于多元逻辑回归和二元逻辑回归的复杂度差别。假设类别数为 $K$，则此时我们的对数似然损失函数为：

$$
L ( y , f ( x ) ) = - \sum _ { k = 1 } ^ { K } y _ { k } \log p _ { k } ( x )
$$

　　其中如果样本输出类别为 $k$，则 $y_k=1$。第 $k$ 类的概率 $p_k(x)$ 的表达式为：

$$
p _ { k } ( x ) = {\exp \left( f _ { k } ( x ) \right) \over \sum _ { l = 1 } ^ { K } \exp \left( f _ { l } ( x ) \right)}
$$

　　集合上两式，我们可以计算出第 $t$ 轮的第 $i$ 个样本对应类别 $l$ 的负梯度误差为

$$
r_{t i l}=-\left[\frac{\partial L\left(y_{i}, f\left(x_{i}\right)\right) )}{\partial f\left(x_{i}\right)}\right]_{f_{k}(x)=f_{l, t-1}(x)}=y_{i l}-p_{l, t-1}\left(x_{i}\right)
$$

　　观察上面的式子可以看出，其实这里的误差就是样本 $i$ 对应的类别 $l$ 的真是概率和 $t-1$ 轮预测概率的差值。

　　对于生成的决策树，我们各个叶子节点的最佳残差拟合值为

$$
c_{t j l}=\underset{c_{j l}}{\arg \min } \sum_{i=0}^{m} \sum_{k=1}^{K} L\left(y_{k}, f_{t-1, l}(x)+\sum_{j=0}^{J} c_{j l} I\left(x_{i} \in R_{t j l}\right)\right)
$$

　　由于上式比较难优化，我们一般使用近似值代替

$$
c_{t j l}=\frac{K-1}{K} \frac{x_{i} \in R_{t i l}}{\sum_{x_{i} \in R_{t i l}}\left|r_{t i l}\right|\left(1-\left|r_{t i l}\right|\right)}
$$

　　同样的，除了负梯度计算和叶子节点的最佳残差拟合的线性搜索，多元 GBDT 分类和二元 GBDT 分类以及 GBDT 回归算法过程相同。

## 3. GBDT 常见损失函数
　　这里对 GBDT 常见损失函数做一个总结，对分类和回归任务分别整理。

### 3.1 分类任务的损失函数
　　对于分类算法，其损失函数一般有对数损失函数和指数损失函数两种:

1. 如果是指数损失函数，则损失函数表达式为

$$
L(y, f(x))=\exp (-y f(x))
$$

　　其负梯度计算和叶子节点的最佳负梯度拟合可以参看 [Adaboost](https://binlidaily.github.io/2018-10-29-adaboost/)。

{:start="2"}

1. 如果是对数损失函数，分为二元分类和多元分类两种，参看上两小节内容。

### 3.2 回归任务的损失函数

　　1. **均方差**，这个是最常见的回归损失函数了

$$
L(y, f(x))=(y-f(x))^{2}
$$

　　2. **绝对损失**，这个损失函数也很常见

$$
L(y, f(x))=|y-f(x)|
$$

　　对应的负梯度误差为：

$$
\operatorname{sign}\left(y_{i}-f\left(x_{i}\right)\right)
$$

　　3. **Huber 损失**，它是均方差和绝对损失的折衷产物，对于远离中心的异常点，采用绝对损失，而中心附近的点采用均方差。这个界限一般用分位数点度量。损失函数如下：

$$
L(y, f(x))=\left\{\begin{array}{ll}{\frac{1}{2}(y-f(x))^{2}} & {|y-f(x)| \leq \delta} \\ {\delta\left(|y-f(x)|-\frac{\delta}{2}\right)} & {|y-f(x)|>\delta}\end{array}\right.
$$

　　对应的负梯度误差为：

$$
r\left(y_{i}, f\left(x_{i}\right)\right)=\left\{\begin{array}{ll}{y_{i}-f\left(x_{i}\right)} & {\left|y_{i}-f\left(x_{i}\right)\right| \leq \delta} \\ {\delta s i g n\left(y_{i}-f\left(x_{i}\right)\right)} & {\left|y_{i}-f\left(x_{i}\right)\right|>\delta}\end{array}\right.
$$

　　4. **分位数损失**，它对应的是分位数回归的损失函数，表达式为

$$
L(y, f(x))=\sum_{y \geq f(x)} \theta|y-f(x)|+\sum_{y<f(x)}(1-\theta)|y-f(x)|
$$

　　其中 $\theta$ 为分位数，需要我们在回归前指定。对应的负梯度误差为：

$$
r\left(y_{i}, f\left(x_{i}\right)\right)=\left\{\begin{array}{ll}{\theta} & {y_{i} \geq f\left(x_{i}\right)} \\ {\theta-1} & {y_{i}<f\left(x_{i}\right)}\end{array}\right.
$$

　　对于 Huber 损失和分位数损失，主要用于健壮回归，也就是减少异常点对损失函数的影响。


## GBDT的正则化
　　和 Adaboost 一样，我们也需要对 GBDT 进行正则化，防止过拟合。GBDT 的正则化主要有三种方式。

　　1) 第一种是和 Adaboost 类似的正则化项，即步长(learning rate)。定义为 $\nu$,对于前面的弱学习器的迭代

$$
f_{k}(x)=f_{k-1}(x)+h_{k}(x)
$$

　　　　如果我们加上了正则化项，则有

$$
f_{k}(x)=f_{k-1}(x)+\nu h_{k}(x)
$$

　　$\nu$　的取值范围为 $0<\nu \leq 1$。对于同样的训练集学习效果，较小的 $\nu$ 意味着我们需要更多的弱学习器的迭代次数。通常我们用步长和迭代最大次数一起来决定算法的拟合效果。

　　2）第二种正则化的方式是通过子采样比例（subsample），取值为 (0,1]。注意这里的子采样和随机森林不一样，随机森林使用的是放回抽样，而这里是不放回抽样。如果取值为 1，则全部样本都使用，等于没有使用子采样。如果取值小于 1，则只有一部分样本会去做 GBDT 的决策树拟合。选择小于 1 的比例可以减少方差，即防止过拟合，但是会增加样本拟合的偏差，因此取值不能太低。推荐在 [0.5, 0.8]之间。

　　使用了子采样的 GBDT 有时也称作随机梯度提升树 (Stochastic Gradient Boosting Tree, SGBT)。由于使用了子采样，程序可以通过采样分发到不同的任务去做 boosting 的迭代过程，最后形成新树，从而减少弱学习器难以并行学习的弱点。

　　第三种是对于弱学习器即 CART 回归树进行正则化剪枝，可以参考之前对决策剪枝的[介绍](https://binlidaily.github.io/2018-09-11-decision-tree/#13-剪枝处理pruning)。

## Parameter Tuning
[参考](https://www.analyticsvidhya.com/blog/2016/03/complete-guide-parameter-tuning-xgboost-with-codes-python/) 调参的过程。

## 总结
GBDT **优点**：
1. 可以灵活处理各种类型的数据，包括连续值和离散值。
2. 在相对少的调参时间情况下，预测的准确率也可以比较高。这个是相对SVM来说的。
3. 使用一些健壮的损失函数，对异常值的鲁棒性非常强。比如 Huber损失函数和Quantile损失函数。

GBDT **缺点**：
1. 由于弱学习器之间存在依赖关系，难以并行训练数据。不过可以通过自采样的SGBT来达到部分并行。
---
layout: post
title:  Boosting Tree and Gradient Boosting
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

在之前我们整理过了 [Adaboost](https://binlidaily.github.io/2018-10-29-adaboost/) 算法的原理，当时还没有具体讨论改用什么样的基函数，本文就介绍以决策树作为基函数的提升方法，称为提升树（boosting tree）。一般的提升方法实际采用加法模型（即基函数的线性组合）与前向分布算法。对于分类问题决策树采用 CART 二叉分类树，回归问题即采用 CART 二叉回归树。我们采用一层的决策树，称之为决策树桩（Decision Stump）。则提升树模型可以表示为决策树的加法模型：

$$
f_K(x) = \sum_{k=1}^K T(x;\Theta_k)
$$

其中 $T(x;\Theta_k)$ 表示二叉决策树，$\Theta_k$ 表示决策树的参数，$K$ 表示二叉决策树的个数。

先捋清 Adaboost 和 Boosting Tree 的关系，Adaboost 是针对分类的监督算法， 当将 Adaboost 的基函数限定为二叉分类树，就得到了 Boosting Tree 的分类算法。在分类任务上可以说，Boosting Tree 算法是 Adaboost 的特例。然而 Adaboost 不处理回归问题，Boosting Tree 利用回归树能够处理回归问题。

## 提升树算法
决策树采用前向分布算法，首先确定初始提升树 $f_0(x)=0$，第 $k$ 步的模型是：

$$
f_k(x) = f_{k-1}(x) + T(x;\Theta)
$$

⁉️ 这里不需要权重？

其中 $f_{k-1}(x)$ 是当前模型，采用经验风险极小化来确定下一棵决策树的参数 $\Theta_m$：

$$
\hat{\Theta}_k = \arg  \min_{\Theta_x} \sum _{i=1} ^{M} L(y_i, f_{x-1}+T(x_i; \Theta_k))
$$

针对不同问题的提升树算法，主要区别在损失函数不同。决策树用的 0/1 损失，对于分类问题一般采用指数损失函数，而对于回归问题则采用平方误差损失函数。对于二分类问题，只需将 Adaboost 算法中的基函数限制为二类分类树即可，所以接下来着重展开提升树回归问题的介绍。

首先假设一些基本，数据集记作：

$$
T = \left\{ \left( x_1 , y _ { 1 } \right) , \left( x _ { 2 } , y _ { 2 } \right) , \ldots . \left( x _ { m } , y _ { m } \right) \right\}
$$

其中 $x_i \in \mathcal{X} \subseteq \mathcal{R}^n$，$\mathcal{X}$ 为输入空间，$y_i \in \mathcal{Y} \subseteq \mathcal{R}$，$\mathcal{Y}$ 为输出空间。在讨论[决策树](https://binlidaily.github.io/2018-09-11-decision-tree/)的时候讨论过这个问题，如果将输入空间 $\mathcal{X}$ 划分为 $J$ 个互不相交的区域 $R_1, R_2, \dots, R_J$，并且在每个区域上都输出一个常量 $c_j$，那么树可以表示为：

$$
T(x;\Theta) = \sum _{j=1} ^ J c_j I(x\in R_j)
$$

其中，参数 $\Theta=\{(R_1, c_1), (R_2, c_2), \dots, (R_J, c_J)\}$ 表示树的区域划分和各区域上的常数，$J$ 是回归树的复杂度即叶节点个数。

回归问题提升树使用以下前向分布算法：

$$
\begin{aligned}
f_0(x)&=0 \\
f_m(x)&=f_{m-1}(x)+T(x; \Theta_m), ~~ m=1,2,\dots,M \\
f_M(x)&=\sum_{m=1}^M T(x; \Theta_m)
\end{aligned}
$$

在前向分布算法的第 $m$ 步，给定当前模型 $f_{m-1}(x)$，需求解：

$$
\hat{\Theta}_m=\arg \min_{\Theta_m} \sum_{i=1}^N L(y_i, f_{m-1}(x)+T(x_i;\Theta_m))
$$

从而得到 $\hat{\Theta}_m$，即第 $m$ 棵树的参数。

当采用平方误差损失函数时，

$$
L(y, f(x))=(y-f(x))^2
$$

其损失变为：

$$
\begin{aligned}
L(y, f_{m-1}(x)+T(x;\Theta_m)) &= \left[y- f_{m-1}(x)-T(x; \Theta_m)\right]^2 \\
&= \left[ r- T(x; \Theta_m)\right] ^2
\end{aligned}
$$

其中有

$$
r=y-f_{m-1}(x)
$$

$r$ 便是当前模型需要拟合的数据残差（residual），该残差可以看成是前一个模型没有很好拟合的部分。残差越小，则当前模型需要拟合的结果越小（因为要损失 $L$ 最小，逼近零），即需要当前模型的几率就越低，那么说明模型已经慢慢训练好了。

于是训练当前回归树的流程就变成了：

1. 利用前面的模型结果，计算出残差 $r_{mi}$
2. 拟合残差 $r_{mi}$ 学习到当前的回归树，得到 $T(x;\Theta_m)$
3. 更新 $f_m(x)=f_{m-1}(x)+T(x; \Theta_m)$

迭代跑过了所有的回归树后就能得到最终的回归问题提升树：

$$f_M(x)=\sum_{m=1}^M T(x; \Theta_m)$$

## 梯度提升（Gradient Boosting）
提升树利用加法模型和前向分布算法实现学习的优化过程，且当损失函数是平方损失（回归）和指数损失（分类）时，每一步的优化是很简单的，但对一般损失函数（损失函数类别可参考[这篇介绍](https://binlidaily.github.io/2018-12-07-loss-functions/)）而言，往往每一步优化并不那么容易。针对这一问题，Freidman 提出了梯度提升算法，这是利用最速梯度下降的近似方法来实现的，关键是利用**损失函数的负梯度在当前模型的值**作为回归问题提升树算法中的残差的近似值，拟合一个回归树，其值如下：

$$- \left[ \frac { \partial L \left( y _ { i } , f \left( x _ { i } \right) \right) } { \partial f \left( x _ { i } \right) } \right] _ { f ( x ) = f _ { m - 1 } ( x ) }$$

wiki 上有伪代码的总结：
![-w732](/img/media/15443555046407.jpg)

另一个伪代码介绍:

![-w969](/img/media/15443556126300.jpg)


仔细的部分可以参考[原论文](https://statweb.stanford.edu/~jhf/ftp/trebst.pdf)，或者另一个[总结](http://www.cse.chalmers.se/~richajo/dit865/files/gb_explainer.pdf)。

## 梯度提升决策树（Gradient Boosting Decision Tree）
## GBDT 回归算法
当我们采用的基学习器是决策树时，那么梯度提升就具象到了梯度提升决策树。那么还是从一些假设开始，数据集记作：

$$
T = \left\{ \left( x_1 , y _ { 1 } \right) , \left( x _ { 2 } , y _ { 2 } \right) , \ldots . \left( x _ { m } , y _ { m } \right) \right\}
$$

其中 $x_i \in \mathcal{X} \subseteq \mathcal{R}^n$，$\mathcal{X}$ 为输入空间，$y_i \in \mathcal{Y} \subseteq \mathcal{R}$，$\mathcal{Y}$ 为输出空间，损失函数为 $L(y, f(x))$，我们的目标是得到最终的回归树 $\hat { f } ( x )$。

1）首先初始化第一个弱学习器：

$$
f _ { 0 } ( x ) =  { \arg \min_ { c } }  \sum _ { i = 1 } ^ { m } L \left( y _ { i } , c \right)
$$

2）对于 $m = 1,2 , \dots , M$：
a）对 $ i = 1,2 , \dots , N$，计算

$$
r _ { m i } = - \left[ \frac { \partial L \left( y _ { i } , f \left( x _ { i } \right) \right) ) } { \partial f \left( x _ { i } \right) } \right] _ { f ( x ) = f _ { m - 1 }(x) }
$$

以此作为残差的估计值，这个估计值作为训练当前学习器的训练样本的 label！并且从第一个弱学习器训练的时候，这个残差估计值是样本 label 的平均值！

⁉️ 为什么要用残差做 label？

At each stage ${\displaystyle m}$ , ${\displaystyle 1\leq m\leq M}$, of gradient boosting, it may be assumed that there is some imperfect model ${\displaystyle F_{m}}$ (at the outset, a very weak model that just predicts the mean y in the training set could be used). The gradient boosting algorithm improves on ${\displaystyle F_{m}}$ by constructing a new model that adds an estimator h to provide a better model: ${\displaystyle F_{m+1}(x)=F_{m}(x)+h(x)} $. To find ${\displaystyle h}$, the gradient boosting solution starts with the observation that a perfect h would imply

${\displaystyle F_{m+1}(x)=F_{m}(x)+h(x)=y}$ or, equivalently,

$${\displaystyle h(x)=y-F_{m}(x)} $$

Therefore, gradient boosting will fit h to the residual ${\displaystyle y-F_{m}(x)}$. 

b）对 $r_{mi }$ 拟合一个回归树，得到第 $m$ 棵树的叶结点区域 $R_{mj}$，$j = 1,2 , \dots , J$。

c）对 $j = 1,2 , \dots , J$，计算

$$
c _ { m j } = \arg \min _ { c } \sum _ { x _ { i } \in R _ { m j } } L \left( y _ { i } , f _ { m - 1 } \left( x _ { i } \right) + c \right)
$$

d）更新下一轮的学习器：

$$
f _ { m } ( x ) = f _ { m - 1 } ( x ) + \sum _ { j = 1 } ^ { J } c _ { m j } I \left( x \in R _ { m j } \right)
$$

3）最后得到回归树:

$$
\hat { f } ( x ) = f _ { M } ( x ) = \sum _ { m = 1 } ^ { M } \sum _ { j = 1 } ^ { J } c _ { m j } I \left( x \in R _ { m j } \right)
$$

### GBDT 分类算法
GBDT 分类算法跟回归算法在思想上是没有什么差别的，主要因为分类算法的输出结果不是连续值，类别值在一定程度上表示不了大小差距，于是很难从输出类别结果中去拟合输出误差。

对于这样的问题，于是可以采用两种方法来解决:
1) 一个采用指数损失函数，这样 GBDT 就退化成了 Adaboost，能够解决分类的问题；
2) 使用类似于逻辑回归的对数似然损失函数，如此可以通过结果的概率值与真实概率值的差距当做残差来拟合；

#### GBDT 二分类算法
对于二元 GBDT，如果用类似于逻辑回归的对数似然损失函数，则损失函数为

$$
L ( y , f ( x ) ) = \log ( 1 + \exp ( - y f ( x ) ) )
$$

其中 $y \in \{ - 1 , + 1 \}$，则此时的负梯度误差为

$$
r _ { m i } = - \left[ \frac { \partial L \left( y _ { i } , f \left( x _ { i } \right) \right) ) } { \partial f \left( x _ { i } \right) } \right] _ { f ( x ) = f _ { m - 1 }(x) } = {y_i \over {  1 + \exp (  y_i f ( x_i ) ) }}
$$

对于生成的决策树，我们各个叶子节点的最佳残差拟合值为

$$
c _ { m j } =  { \arg \min_{c} } \sum_ { x _ { i } \in R _ { m j } } \log \left( 1 + \exp \left( - y _ { i } \left( f _ { m - 1 } \left( x _ { i } \right) + c \right) \right) \right)
$$

由于上式比较难优化，我们一般使用近似值代替

$$
c _ { m j } = {\sum _ { x _ { i } \in R _ { m j } } r _ { m i } \over \sum _ { x _ { i } \in R _ { m j } } \left| r _ { m i } \right| \left( 1 - \left| r _ { m i } \right| \right)}
$$

除了负梯度计算和叶子节点的最佳残差拟合的线性搜索，二元 GBDT 分类和 GBDT 回归算法过程相同。

#### GBDT 多分类算法
多元 GBDT 要比二元 GBDT 复杂一些，在于多元逻辑回归和二元逻辑回归的复杂度差别。假设类别数为 $K$，则此时我们的对数似然损失函数为：

$$
L ( y , f ( x ) ) = - \sum _ { k = 1 } ^ { K } y _ { k } \log p _ { k } ( x )
$$

其中如果样本输出类别为 $k$，则 $y_k=1$。第 $k$ 类的概率 $p_k(x)$ 的表达式为：

$$
p _ { k } ( x ) = {\exp \left( f _ { k } ( x ) \right) \over \sum _ { l = 1 } ^ { K } \exp \left( f _ { l } ( x ) \right)}
$$

集合上两式，我们可以计算出第 $m$ 轮的第 $i$ 个样本对应类别 $l$ 的负梯度误差为

$$
r _ { m i l } = - \left[ \frac { \partial L \left( y _ { i } , f \left( x _ { i } \right) \right) ) } { \partial f \left( x _ { i } \right) } \right] _ { f ( x ) = f _ { l, m - 1 }(x) } = y_{il}−p_{l,m−1}(x_i)
$$

观察上面的式子可以看出，其实这里的误差就是样本 $i$ 对应的类别 $l$ 的真是概率和 $m-1$ 轮预测概率的差值。

对于生成的决策树，我们各个叶子节点的最佳残差拟合值为

$$
c _ { m j l } =  { \arg \min _ { c _ { j l } }}  \sum _ { i = 0 } ^ { N } \sum _ { k = 1 } ^ { K } L \left( y _ { k } , f _ { m - 1 , l } ( x ) + \sum _ { j = 0 } ^ { J } c _ { j l } I \left( x _ { i } \in R _ { m j } \right) \right)
$$

由于上式比较难优化，我们一般使用近似值代替

$$
c _ { m i l } = \frac { K - 1 } { K } \frac { \sum _ { x _ { i } \in R _ { m i l } } r _ { m i l } } { \sum _ { x _ { i } \in R _ { m i l } } \left| r _ { m i l } \right| \left( 1 - \left| r _ { m i l } \right| \right) }
$$

同样的，除了负梯度计算和叶子节点的最佳残差拟合的线性搜索，多元 GBDT 分类和二元 GBDT 分类以及 GBDT 回归算法过程相同。


## GBDT的正则化
可参考博文。GBDT 模型常用的库有 XGBoost，LightGBM和 CatBoost 等。

## Parameter Tuning
[参考](https://www.analyticsvidhya.com/blog/2016/03/complete-guide-parameter-tuning-xgboost-with-codes-python/)。

## References
1. [Gradient Boosting from scratch](https://medium.com/mlreview/gradient-boosting-from-scratch-1e317ae4587d)
2. [梯度提升树(GBDT)原理小结](https://www.cnblogs.com/pinard/p/6140514.html)
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

　　2）对于迭代轮数 $t = 1,2 , \dots , M$：
　　　a）对 $ i = 1,2 , \dots , m$，计算损失函数的负梯度：

$$
r_{t i}=-\left[\frac{\partial L\left(y_{i}, f\left(x_{i}\right)\right) )}{\partial f\left(x_{i}\right)}\right]_{f(x)=f_{t-1}}
$$

　　　b）对于 $i=1,2, \dots m$，利用 $\left(x_{i}, r_{t i}\right)$ 拟合出一颗 CART 回归树，得到第 $t$ 颗回归树，其对应的叶子节点区域为 $R_{t j}$, $j=1,2, \dots, J$，其中 $J$ 为回归树 $t$ 的叶子节点的个数。


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

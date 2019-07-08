---
layout: post
title: Gradient Boosting
subtitle: 梯度提升算法
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　[提升树](https://binlidaily.github.io/2019-06-10-boosting-tree/)利用加法模型和前向分布算法实现学习的优化过程，且当损失函数是平方损失 (回归) 和指数损失 (分类) 时，每一步的优化是很简单的，但对一般损失函数 (损失函数类别可参考[这篇介绍](https://binlidaily.github.io/2018-12-07-loss-functions/)) 而言，往往每一步优化并不那么容易。为了可以扩展到更复杂的损失函数中，Freidman 提出了梯度提升算法 (Gradient Boosting)，这是利用最速梯度下降的近似方法来实现的，关键是利用**损失函数的负梯度在当前模型的值**作为回归问题提升树算法中的残差的近似值，拟合一个回归树。

　　先看一般情况，我们能通过一阶泰勒展开证明负梯度方向是下降最快的方向。对于函数 $f$:

$$
f\left(\theta_{k+1}\right) \approx f\left(\theta_{k}\right)+\frac{\partial f\left(\theta_{k}\right)}{\partial \theta_{k}}\left(\theta_{k+1}-\theta_{k}\right)
$$

　　则优化函数 $f$ 更新参数时有：

$$
\theta_{k+1}=\theta_{k+1}-\eta \frac{\partial f\left(\theta_{k}\right)}{\partial \theta_{k}}
$$

　　在梯度提升算法中，对损失函数展开：

$$
L\left(y, F_{m}(x)\right) \approx L\left(y, F_{m-1}(x)\right)+\frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}\left(F_{m}(x)-F_{m-1}(x)\right)
$$

　　因为梯度提升算法是加法模型，所以:

$$
L\left(y, F_{m}(x)\right) \approx L\left(y, F_{m-1}(x)\right)+\frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)} T_{m}(x)
$$

　　采用梯度下降优化 $L\left(y, F_{m}(x)\right)$ 时有：

$$
F_{m}(x)=F_{m-1}(x)-\eta \frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}
$$

　　那么就能得到求当前弱学习器的公式：

$$
T_{m}(x)=-\eta \frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}
$$

　　注意这里还有一个 $\eta$，据此可知当前的弱学习器学习的是至此函数值的负梯度的近似值，最开始被提出来时定义的值如下：

$$- \left[ \frac { \partial L \left( y _ { i } , f \left( x _ { i } \right) \right) } { \partial f \left( x _ { i } \right) } \right] _ { f ( x ) = f _ { m - 1 } ( x ) }$$

　　完成的优化过程是：

$$
\begin{array}{c}{F_{1}(x)=F_{0}(x)-\eta \frac{\partial L\left(y, F_{0}(x)\right)}{\partial F_{0}(x)}, \quad \text{即 }  T_{1}(x)=-\eta \frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}} \\ {\cdots} \\ {F_{M}(x)=F_{M-1}(x)-\eta \frac{\partial L\left(y, F_{M-1}(x)\right)}{\partial F_{M-1}(x)}, \quad \text{即 } T_{M}(x)=-\eta \frac{\partial L\left(y, F_{M-1}(x)\right)}{\partial F_{M-1}(x)}}\end{array}
$$

　　等号两边累加，得到：

$$
F(x)=F_{M}(x)=F_{0}(x)+\eta \sum_{m=0}^{M-1}-\frac{\partial L\left(y, F_{m}(x)\right)}{\partial F_{m}(x)}=\sum_{m=0}^{M} T_{m}(x)
$$

　　不同的函数对应的不同负梯度如下：

<p align="center">
  <img width="500" height="" src="/img/media/15602347070035.jpg">
</p>

　　无论损失函数是什么形式，每个弱学习器拟合的都是负梯度。准确的说，不是用负梯度代替残差，而是当损失函数是均方损失时，负梯度刚好是残差，残差只是特例。

　　那么梯度提升算法的思路如下：

<p align="center">
  <img width="450" height="" src="/img/media/15602352595888.jpg">
</p>


　　详细的部分可以参考[原论文](/assets/trebst.pdf)，如果我们用决策树作为基函数来实现梯度提升算法的话就得到了闻名遐迩的 [GBDT](https://binlidaily.github.io/2019-06-11-gbdt-gradient-boosting-decision-tree/)。


## References
1. [Gradient Boosting from scratch](https://medium.com/mlreview/gradient-boosting-from-scratch-1e317ae4587d)
2. [梯度提升树(GBDT)原理小结](https://www.cnblogs.com/pinard/p/6140514.html)
3. [Greedy Function Approximation: A Gradient Boosting Machine](https://statweb.stanford.edu/~jhf/ftp/trebst.pdf)
4. [gbdt的残差为什么用负梯度代替？ - 奥奥奥奥噢利的回答 - 知乎](https://www.zhihu.com/question/63560633/answer/581670747)
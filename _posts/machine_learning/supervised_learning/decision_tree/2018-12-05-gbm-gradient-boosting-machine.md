---
layout: post
title: Gradient Boosting Machine
subtitle: 梯度提升算法
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

　　[提升树](https://binlidaily.github.io/2019-06-10-boosting-tree/)利用加法模型和前向分布算法实现学习的优化过程，且当损失函数是平方损失 (回归) 和指数损失 (分类) 时，每一步的优化是很简单的，但对一般损失函数 (损失函数类别可参考[这篇介绍](https://binlidaily.github.io/2018-12-07-loss-functions/)) 而言，往往每一步优化并不那么容易。

　　为了可以扩展到更复杂的损失函数中，Freidman 提出了梯度提升算法 (Gradient Boosting)，这是利用最速梯度下降的近似方法来实现的，关键是利用**损失函数的负梯度在当前模型的值**作为回归问题提升树算法中的残差的近似值，拟合一个回归树。

　　Adaboost 这种提升树我们可以从 Gradient Descent 角度来进行推导，得到目标如下：

$$
\min _{\eta} \min _{h} \frac{1}{N} \sum_{n=1}^{N} \exp \left(-y_{n}\left(\sum_{\tau=1}^{t-1} \alpha_{\tau} g_{\tau}\left(\mathbf{x}_{n}\right)+\eta h\left(\mathbf{x}_{n}\right)\right)\right)
$$

　　这个是针对二分类问题，而且限定了指数损失函数。如果我们想用不同的损失函数 (err)，顺着这样的思路是否可用？这个时候优化目标可以写成:

$$
\min _{\beta} \min _{h} \frac{1}{N} \sum_{i=1}^{N} \operatorname{L}\left(\sum_{k=1}^{m-1} \alpha_{k} f_{k}\left(\mathbf{x}_{i}\right)+\beta h\left(\mathbf{x}_{i}\right), y_{i}\right)
$$

　　按照梯度下降的思想，上式中的 $h(x_i)$ 是下一步前进的方向，$\eta$ 是步进长度，我们的目标就是求解这两个量。接下来，我们看如何求解 Regression 的 Gradient Boosting 问题，表达式如下：

$$
\min _{\beta} \min _{h} \frac{1}{N} \sum_{i=1}^{N} \operatorname{L}\left(\sum_{k=1}^{m-1} \underbrace{\alpha_{k} g_{k}\left(\mathbf{x}_{i}\right)}_{s_i}+\beta h\left(\mathbf{x}_{i}\right), y_{i}\right) \text { with err }(s, y)=(s-y)^{2}
$$

　　我们记 $s_i=\sum_{k=1}^{m-1} \alpha_{k} g_{k}\left(\mathbf{x}_{i}\right)
$，Regression 采用均方误差 MSE，那么根据梯度下降的思想，我们将上式进行一阶泰勒展开，先只关注对 $h$ 的优化，写成梯度的形式如下：


$$
\begin{aligned} \min _{h}  &\frac{1}{N} \sum_{i=1}^{N} \operatorname{L}\left(\sum_{k=1}^{m-1} \alpha_{k} g_{k}\left(\mathbf{x}_{i}\right)+\beta h\left(\mathbf{x}_{i}\right), y_{i}\right)\\ 
& \stackrel{\text {}}{\approx} \min _{h} \frac{1}{N} \sum_{i=1}^{N} \underbrace{\operatorname{L}\left(\sum_{k=1}^{m-1} \alpha_{k} g_{k}\left(\mathbf{x}_{i}\right), y_{i}\right)}_{\text { constant }}+\frac{1}{N} \sum_{i=1}^{N} \beta h\left(\mathbf{x}_{i}\right)\left.\frac{\partial \operatorname{L}\left(s, y_{i}\right)}{\partial s}\right|_{s=s_{i}} \\ &=\min _{h} \text { constants }+\frac{\beta}{N} \sum_{i=1}^{N} h\left(\mathbf{x}_{i}\right) \cdot 2\left(s_{i}-y_{i}\right) \end{aligned}
$$
　　我们知道常数对我们最小化的优化过程没有影响，所以可以忽略。要是上式最小化，我们先考虑方向 $h(x_n)$，只要其是梯度 $2\left(s_{n}-y_{n}\right)$ 的反方向即可，即 $h(x_n) = 2\left(s_{n}-y_{n}\right)$，因为是要最小化，所以尽量要使得结果为负数。


$$
\begin{array}{l}{\underset{h}{\min}  \quad \text { constants }+\frac{\eta}{N} \sum_{n=1}^{N}\left(2 h\left(\mathbf{x}_{n}\right)\left(s_{n}-y_{n}\right)+\left(h\left(\mathbf{x}_{n}\right)\right)^{2}\right)} \\ {\quad=\text { constants }+\frac{\eta}{N} \sum_{n=1}^{N}\left(\text { constant }+\left(h\left(\mathbf{x}_{n}\right)-\left(y_{n}-s_{n}\right)\right)^{2}\right)}\end{array}
$$
　　实际上 $h(x_n)$ 的大小并不重要，因为有步长 $\eta$ 来调节。我们上面的最小化问题中需要对 $h(x_n)$ 的大小做些限制。限制 $h(x_n)$ 的一种简单做法是把的大小当 $h(x_n)$成一个惩罚项 $(h^2(x_n))$ 添加到上面的最小化问题中，这种做法与regularization类似。如下图所示，经过推导和整理，忽略常数项，我们得到最关心的式子是：


$$
\min_h \sum_{n=1}^{N}\left(\left(h\left(x_{n}\right)-\left(y_{n}-s_{n}\right)\right)^{2}\right)
$$


　　此时问题就变成了在训练集 $\\{\mathbf{x}_n, y_n-s_n\\}$ 上损失函数为均方差的回归问题。

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

$$
-\left[ \frac { \partial L \left( y _ { i } , f \left( x _ { i } \right) \right) } { \partial f \left( x _ { i } \right) } \right] _ { f ( x ) = f _ { m - 1 } ( x ) }
$$

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
  <img width="500" height="" src="/img/media/15625774976201.jpg">
</p>


　　详细的部分可以参考[原论文](/assets/trebst.pdf)，如果我们用决策树作为基函数来实现梯度提升算法的话就得到了闻名遐迩的 [GBDT](https://binlidaily.github.io/2019-06-11-gbdt-gradient-boosting-decision-tree/)。

　　rho 跟 beta 的关系？！$\beta$ 是各个弱学习器的权重（从加法模型的角度考虑），这个是放在每一次找最优当前弱学习器参数的时候，而 $rho$ 对的是找最佳路径的步长。

## References
1. [Gradient Boosting from scratch](https://medium.com/mlreview/gradient-boosting-from-scratch-1e317ae4587d)
2. [梯度提升树(GBDT)原理小结](https://www.cnblogs.com/pinard/p/6140514.html)
3. [Greedy Function Approximation: A Gradient Boosting Machine](https://statweb.stanford.edu/~jhf/ftp/trebst.pdf)
4. [gbdt的残差为什么用负梯度代替？ - 奥奥奥奥噢利的回答 - 知乎](https://www.zhihu.com/question/63560633/answer/581670747)
5. [SIGAI Gradient Boosting](/assets/gradient_boosting.pdf)
6. [理解AdaBoost算法](https://mp.weixin.qq.com/s?__biz=MzU4MjQ3MDkwNA==&mid=2247486478&idx=1&sn=8557d1ffbd2bc11027e642cc0a36f8ef&chksm=fdb69199cac1188ff006b7c4bdfcd17f15f521b759081813627be3b5d13715d7c41fccec3a3f&scene=21#wechat_redirect)
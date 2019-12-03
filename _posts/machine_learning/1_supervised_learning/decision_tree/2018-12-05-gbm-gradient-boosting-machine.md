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

　　先看一般情况，我们能通过一阶泰勒展开证明负梯度方向是下降最快的方向。对于函数 $f$:

$$
f\left(\theta_{k+1}\right) \approx f\left(\theta_{k}\right)+\frac{\partial f\left(\theta_{k}\right)}{\partial \theta_{k}}\left(\theta_{k+1}-\theta_{k}\right)
$$

　　则优化函数 $f$ 更新参数时有：

$$
\theta_{k+1}=\theta_{k}-\eta \frac{\partial f\left(\theta_{k}\right)}{\partial \theta_{k}}
$$

　　在梯度提升算法中，对损失函数展开：

$$
L\left(y, F_{m}(x)\right) \approx L\left(y, F_{m-1}(x)\right)+\frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}\left(F_{m}(x)-F_{m-1}(x)\right)
$$

　　采用**梯度下降**优化 $L\left(y, F_{m}(x)\right)$ 时有：

$$
\begin{aligned}
F_{m}(x)&=F_{m-1}(x)-\eta \frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}\\
&=F_{m-1}(x)+\eta (-\frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)})
\end{aligned}
$$

　　而梯度提升算法作为分布加法模型的特性有：

$$
F_{m}(x)=F_{m-1}(x) + \beta h(x)
$$

　　对比上面两个式子，很容易得到：

$$
\beta h_{m}(x)=- \eta \frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}
$$

$$
\frac{\beta}{\eta } h_{m}(x) = - \frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)} 
$$

　　设 $\alpha=\frac{\beta}{\eta }$，$g_m(x)=\frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)} $，则有 $\alpha h_{m}(x)= -g_m(x)$，通过上式可以看出梯度提升算法每一轮就是用损失函数对当前强学习器的负梯度来拟合当前轮的 $\alpha h_{m}(x)$（称为伪残差，当损失函数取最小二乘时为真正意义上的残差），那么我们可以用负梯度的方式来求解当前弱学习器的参数。

　　当然，还有另一种比较好解释的方式解释为什么要用负梯度方向来拟合当前函数：

<p align="center">
  <img width="650" height="" src="/img/media/15634305217481.jpg">
</p>

　　为了简化问题，我们将这个求解过程分两个步骤：
1. 先求到当前学习器的优化方向，即 $h(x)$ 只是一个优化方向，可以不考虑其大小:

　　1) 可以直接将 $\alpha$ 设为 1，去计算：

$$
h_{m}=\arg \min _{h} \sum_{i=1}^{N}\left[\left(-g_{m}\left(x_{i}\right)\right)-h\left(x_{i}\right)\right]^{2}
$$

　　2) 也可以带上参数，但是这个参数在优化时并不是很重要：

$$
\mathbf{\theta}_{m}=\arg \min _{\mathbf{\theta}, \alpha} \sum_{i=1}^{N}\left[-g_{m}\left(\mathbf{x}_{i}\right)-\alpha h\left(\mathbf{x}_{i} ; \mathbf{\theta}\right)\right]^{2}
$$

{:start="2"}

2. 确定方向了，再利用**线性搜索**找到合适的步长。

$$
\beta_{m}=\arg \min _{\beta} \sum_{i=1}^{N} L\left(y_{i}, F_{m-1}\left(\mathbf{x}_{i}\right)+\beta h\left(\mathbf{x}_{i}\right)\right)
$$

　　我们看到这两步中都求到了有关 $h(x)$ 的参数，但是最终步长要由线性搜索得到，不能一步得到的原因是在第一步中的参数 $\alpha$ 与 $\beta$ 有差距？

　　从 Sklearn 的实现中可以看到，每次弱学习器的拟合过程都是直接拿负梯度作为预测结果，且最后每个弱学习器的权重（或者按照其称呼为步长）是一个超参，认为设定的。可以这样理解，因为那个弱学习器前面的参数是对这个向量每个方向上都乘以一个相同的这个实数值，而不是每个维度上不一样（即它不是一个向量），所以它对弱学习器的拟合过程没有特别大的影响；如果我们这样想，在弱学习器拟合的时候确实是拟合完整的 $\alpha h(x)$，只是前面的那个 $\alpha$ 我们没有将其单独分离出来，那么如果你非要将其分离出来，那么我们可以通过线性搜索的方式将 $\alpha$ 单独分离出来！

　　那么，最后完成的优化过程是：

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


**分清楚梯度下降的步长和加法模型加权平均的权重是不是同一个东西？**

　　分两步训练，一个是训练弱学习器，第二个是在全局的损失函数训练加入了当前弱学习器后的强学习器的部分，找到当前学习器的权重。

## References
1. [Gradient Boosting from scratch](https://medium.com/mlreview/gradient-boosting-from-scratch-1e317ae4587d)
2. [梯度提升树(GBDT)原理小结](https://www.cnblogs.com/pinard/p/6140514.html)
3. [Greedy Function Approximation: A Gradient Boosting Machine](/assets/trebst.pdf)
4. [gbdt的残差为什么用负梯度代替？ - 奥奥奥奥噢利的回答 - 知乎](https://www.zhihu.com/question/63560633/answer/581670747)
5. [SIGAI Gradient Boosting](/assets/gradient_boosting.pdf)
6. [理解AdaBoost算法](https://mp.weixin.qq.com/s?__biz=MzU4MjQ3MDkwNA==&mid=2247486478&idx=1&sn=8557d1ffbd2bc11027e642cc0a36f8ef&chksm=fdb69199cac1188ff006b7c4bdfcd17f15f521b759081813627be3b5d13715d7c41fccec3a3f&scene=21#wechat_redirect)
7. [Boosting Algorithm: GBM](https://towardsdatascience.com/boosting-algorithm-gbm-97737c63daa3)
8. [**Gradient boosting performs gradient descent**](https://explained.ai/gradient-boosting/descent.html#sec:3.2.3)
9. [GBDT Slides](/assets/gbdt.pdf)
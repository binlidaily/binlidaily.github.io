---
layout: post
title: Gradient Boosting Machine
subtitle: 梯度提升算法（GBM）
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

　　[提升树](https://binlidaily.github.io/2019-06-10-boosting-tree/)利用加法模型和前向分布算法实现学习的优化过程，当损失函数是平方损失 (回归) 和指数损失 (分类) 时，每一步的优化是很简单的，但对一般损失函数 (损失函数类别可参考[这篇介绍](https://binlidaily.github.io/2018-12-07-loss-functions/)) 而言，往往每一步优化并不那么容易。

　　为了可以扩展到更复杂的损失函数中，Freidman 提出了梯度提升算法 (Gradient Boosting)，这是利用最速梯度下降的近似方法来实现的，关键是利用**损失函数的负梯度在当前模型的值**作为回归问题提升树算法中的残差的近似值，拟合一个回归树。

　　本文尝试从多个方面解读梯度提升算法为什么要采用损失函数的负梯度作为当前基学习器的学习目标。


## 1. 梯度提升算法（Gradient Boosting Machine, GBM）
　　GBM 要解决的问题是想要通过最小化以下损失函数求解最优模型：

$$
F^{*}=\underset{F}{\arg \min } \sum_{i=0}^{N} L\left(y_{i}, F\left(x\right)\right)
$$

　　因为 $F(x)$ 是加法模型，由很多个基学习器组合而成，求解上述的最优模型其实是一个 NP 难问题，于是采用贪心法，迭代求解局部的最优解。接下来我们尝试从两个方向解读一下为什么 GBM 学习对象（即 label）的是当前集成学习器损失函数的负梯度方向。

### 1.1 泰勒展开式的方式解读
　　我们先回顾一下一阶泰勒展开式，由此展开证明负梯度方向是下降最快的方向。在参数空间中，对于函数 $f$ 在参数 $\theta_k$ 处进行一阶泰勒展开:

$$
f\left(\theta_{k+1}\right) \approx f\left(\theta_{k}\right)+\frac{\partial f\left(\theta_{k}\right)}{\partial \theta_{k}}\left(\theta_{k+1}-\theta_{k}\right)
$$

　　优化函数 $f$ 更新参数 $\theta_k$ 时满足加法模型形式，可以采用**最速梯度下降**的方式取负梯度，有：

$$
\theta_{k+1}=\theta_{k}-\eta \frac{\partial f\left(\theta_{k}\right)}{\partial \theta_{k}}
$$

　　受此启发，在梯度提升算法中，我们可以拓展到函数空间，对损失函数 $L$ 在当前基学习器 $F_{m-1}$ 处展开：

$$
L\left(y, F_{m}(x)\right) \approx L\left(y, F_{m-1}(x)\right)+\frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}\left(F_{m}(x)-F_{m-1}(x)\right)
$$

　　做一点变形：

$$
L\left(y, F_{m}(x)\right) - L\left(y, F_{m-1}(x)\right) \approx \frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}\left(F_{m}(x)-F_{m-1}(x)\right)
$$

　　在优化时要求左边的 $L\left(y, F_{m}(x)\right) - L\left(y, F_{m-1}(x)\right) < 0$，对应的右边的部分也要小于零，记 $g_m(x)=\frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)} $，那么可以直接取：

$$
F_{m}(x)-F_{m-1}(x) = -\frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)} = -g_m(x)
$$

　　再结合梯度提升算法作为分布加法模型的特性有：

$$
F_{m}(x)=F_{m-1}(x) + \beta h(x)
$$

　　可以得到：

$$
\beta h(x) = -g_m(x)
$$

　　即当前轮基学习器的学习目标就是当前集成学习器损失函数的负梯度 $-g_m(x)$，对于基学习器前面的权重（或称步长）$\beta$ 可以通过线性搜索来找，所以索性像 SKlean 中直接设为 1。

　　对于先拟合方向再拟合步长的可行性，我们可以这样理解，弱学习器前面的参数是对这个向量每个方向上都乘以一个相同的这个实数值，而不是每个维度上不一样（它不是一个向量），所以它对弱学习器的拟合过程没有特别大的影响；

　　如果我们这样想，那么在弱学习器拟合的时候确实是在拟合完整的 $\beta h(x)$，只是前面的那个 $\beta$ 我们没有将其单独分离出来，那么如果你非要将其分离出来，那么我们可以通过线性搜索的方式将 $\beta$ 单独分离出来！

### 1.2 最速梯度优化方式解读
　　当然也可以采用最速梯度下降优化损失函数 $L\left(y, F_{m}(x)\right)$，将待求的模型看做为参数，可以得到以下式子：

$$
\begin{aligned}
F_{m}(x)&=F_{m-1}(x)-\eta \frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}\\
&=F_{m-1}(x)+\eta (-\frac{\partial L\left(y, F_{m-1}(x)\right)}{\partial F_{m-1}(x)}) \\
&=F_{m-1}(x) + \eta(-g_m(x))
\end{aligned}
$$

　　结合梯度提升算法作为分布加法模型的特性有：

$$
F_{m}(x)=F_{m-1}(x) + \beta h(x)
$$

　　对比上面两个式子，有：

$$
\beta h_{m}(x) \approx \eta (-g_m(x))
$$

　　这里约等于是沿用一阶泰勒展开的表达，可以将其看成等式。等式左边的 $\beta$ 可以看成在加法模型时每个基学习器的权重，右边的 $\eta (-g_m(x))$ 则是表示最速梯度下降算法中的步长和方向。

　　其中 $\beta$ 和 $\eta$ 在每轮计算中都是一个实数，而 $h_{m}(x)$ 和 $-g_m(x)$ 是关于 $x$ 不同取值时组合而成的方向（一个向量）。这个等式说明等式两边的向量部分成比例关系），而在优化时我可以先不考虑这个比例大小，当前基学习器在优化时先拟合向量（方向）$-g_m(x)$，然后再通过线性搜索找到这个比例（步长）。

## 2. GBM 优化
　　GBM 的二阶段优化，首先利用优化当前基学习器的损失函数去拟合**方向** $-g_m(x)$ ，例如采用平方误差：

$$
h_{m}=\arg \min _{h, \beta} \sum_{i=1}^{N}\left[\left(-g_{m}\left(x_{i}\right)\right)-\beta h\left(x_{i}\right)\right]^{2}
$$

　　在优化的时候可以先不考虑式子中的 $\beta$，当这一部分确定了方向，接下来就要去拟合步长了，可以采用线性搜索：

$$
\beta_{m}=\arg \min _{\beta} \sum_{i=1}^{N} L\left(y_{i}, F_{m-1}\left(\mathbf{x}_{i}\right)+\beta h\left(\mathbf{x}_{i}\right)\right)
$$


　　从 Sklearn 的实现中可以看到，每次弱学习器的拟合过程都是直接拿负梯度作为预测结果，且最后每个弱学习器的权重（或者按照其称呼为步长）是一个超参，人为设定的。

　　不同的函数对应的不同负梯度如下：

<p align="center">
<img src="/img/media/15602347070035.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">常用损失函数导数</em>
</p>

　　无论损失函数是什么形式，每个弱学习器拟合的都是负梯度。准确的说，不是用负梯度代替残差，而是当损失函数是均方损失时，负梯度刚好是残差，残差只是特例。

　　梯度提升算法的思路如下：

<p align="center">
  <img width="500" height="" src="/img/media/15625774976201.jpg">
</p>

　　详细的部分可以参考[原论文](/assets/papers/gbm-Freidman-1999.pdf)，如果我们用决策树作为基函数来实现梯度提升算法的话就得到了闻名遐迩的 [GBDT](https://binlidaily.github.io/2019-06-11-gbdt-gradient-boosting-decision-tree/)。

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


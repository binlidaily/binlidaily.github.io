---
layout: post
title: Gradient Descent
subtitle: 梯度下降法
author: "Bin Li"
tags: [Machine Learning]
category: "Optimization"
comments: true
published: true
---

　　梯度下降法一般是用来迭代求解最优值的一阶优化方法，是求解无约束优化问题最简单、最经典的方式之一。其计算目标函数的偏导，取偏导为零，即当前位置的切线方向去更新对应的变量，形成新的目标函数形式，迭代进行此过程，直到满足终止条件。

　　我们这里以求线性回归的最优值为例，下图是有关房间的面积大小与其售价的关系数据 $(x_i,y_i)$，我们利用这些数据来训练出一个线性回归模型，以此来预测房价。

<p align="center">
  <img width="500" height="" src="/img/media/15245586264489.jpg">
</p>

　　我们先假设用以下的数学形式表示线性回归模型：

$$h(\boldsymbol{x}) = \boldsymbol{w}\boldsymbol{x}+b$$

　　OK，我们现在知道了模型的形式是这样，那么现在的问题是要如何找到这里的两个参数 $\boldsymbol{w}$ 和 $b$ 了。当然要求解最优的参数，我们可以利用的只有已知的数据了，于是，我们想到要模型能够最大限度地拟合现有数据，于是我们可以用简单的平方误差（Sum of Squared Errors）来衡量我们模型的好坏。

$$J(w,b)={1\over2}\Sigma_{i=1}^m((wx_i+b)-y_i)^2$$

　　通过上面式子可以看出，接下来只要找到能够使得这个 SSE 最小的模型 $(w, b)$ 就好了。然而，我们一开始是不知道 $(w, b)$ 的值的，于是 Gradien Decent 的想法就是，我们先随便初始化一个 $(w_0,b_0)$，然后通过找到一定的更新策略，一步一步在最小化SSE的目标下，更新 $(w,b)$。我们可以对这两个变量求导：

$$\begin{aligned}{\partial \over{\partial w}}J(w,b)& =\Sigma_{i=1}^m((wx_i+b)-y_i)\cdot {\partial \over{\partial w}}((wx_i+b)-y_i) \\ &= \Sigma_{i=1}^m((wx_i+b)-y_i)  x_i\end{aligned}$$

$$\begin{aligned}{\partial \over{\partial b}}J(w,b)& =\Sigma_{i=1}^m((wx_i+b)-y_i)\cdot {\partial \over{\partial b}}((wx_i+b)-y_i) \\ &= \Sigma_{i=1}^m((wx_i+b)-y_i) \end{aligned}$$

　　于是我们可以用下面的式子更新 $(w,b)$：

$$w=w-\alpha {\partial \over{\partial w}}J(w,b) $$

$$b=b-\alpha {\partial \over{\partial b}}J(w,b) $$

　　其中的 $\alpha$ 是学习率，不能太大也不能太小，太大会导致不能收敛，太小会导致收敛太慢。**所以如何调整这个$\alpha$？**我在实验的时候发现，$\alpha$ 设置的稍微大一些，计算出来的 $(w,b)$ 就会非常大，很明显是有问题的。要设到 0.0001 的时候才能正常跑，那么在实际使用的时候我们的到底要注意哪些调参技巧呢？回头再做补充了。

直到满足终止条件，梯度下降的终止条件一般有这样几种：

* `最大迭代次数`：设定一个最大迭代次数，超过就终止迭代。
* `绝对误差`：当函数值变化接近于零，就停止迭代。
* `相对误差`：当函数值变化小于一个阈值，就停止迭代。

<p align="center">
  <img width="" height="" src="/img/media/gradient_descent_example.gif">
</p>

### 梯度下降原理
　　考虑无约束优化问题 $\text{min}_x f(x)$，其中 $f(x)$ 为连续可微函数。如果能构造一个序列 $x^0, x^1, x^2, \dots$ 满足如下不等式：

$$
f\left(\boldsymbol{x}^{t+1}\right) \leq f\left(\boldsymbol{x}^{t}\right), \quad t=0,1,2, \ldots
$$

　　那么不断执行梯度下降的更新过程就能收敛到局部极小值。首先回顾一下泰勒展开式：

$$
f(x)=f\left(x_{0}\right)+\frac{f^{\prime}\left(x_{0}\right)}{1 !}\left(x-x_{0}\right)+\frac{f^{\prime \prime}\left(x_{0}\right)}{2 !}\left(x-x_{0}\right)^{2}+\frac{f^{\prime \prime \prime}\left(x_{0}\right)}{3 !}\left(x-x_{0}\right)^{3}+\ldots
$$

　　我们换元 $x=x+\Delta x$，$x_0=x$ 代入上面的式子：

$$
f(x+\Delta x)=f\left( x \right)+\frac{f^{\prime}\left( x \right)}{1 !}\left(x+\Delta x- x \right)+\frac{f^{\prime \prime}\left( x \right)}{2 !}\left(x+\Delta x- x \right)^{2}+\frac{f^{\prime \prime \prime}\left( x \right)}{3 !}\left(x+\Delta x- x \right)^{3}+\ldots
$$

　　这里采用泰勒一阶展开，即只取右式的前两项：

$$
f(\boldsymbol{x}+\Delta \boldsymbol{x}) \simeq f(\boldsymbol{x})+\Delta \boldsymbol{x}^{\mathrm{T}} \nabla \boldsymbol{f}(\boldsymbol{x})
$$

　　记住要满足 $f(\boldsymbol{x}+\Delta \boldsymbol{x})\leq f(\boldsymbol{x})$，那么只要保证 $\Delta \boldsymbol{x}^{\mathrm{T}} \nabla \boldsymbol{f}(\boldsymbol{x})$ 横小于等于零不就👌了，拍一下脑袋，令 $\Delta \boldsymbol{x} = - \nabla \boldsymbol{f}(\boldsymbol{x})$，这下就肯定横小于等于零了吧！🐂🍺

$$
\Delta \boldsymbol{x}=-\gamma \nabla f(\boldsymbol{x})
$$

　　一般还设一个步长 $\gamma$ 来控制 $\Delta \boldsymbol{x}$ 不要太激动步子快太大劈到叉，或者步子太小扯到蛋。那么如何从一个初始的 $\boldsymbol{x_0}$ 走到局部最小值的点 $\boldsymbol{x^*}$ 呢？这就是梯度下降的每次更新公式了，从 $\boldsymbol{x_0}$ 每次挪动 $\Delta \boldsymbol{x}$ 直到收敛。

$$
\boldsymbol{x_{i+1}}=\boldsymbol{x_{i}}-\gamma \nabla f(\boldsymbol{x_i})
$$

### 批量梯度下降
　　在日常使用时绝大多数情况下都是利用梯度下降找寻最优参数，于是这里改写成求参数 $\theta$ 的形式，假设样本个数为 $M$，样本 $x^{(i)}_j$ 的特征个数为 $n$，即 $j\in [1, n]$，损失函数为 $J(\theta)$。梯度下降求解参数的过程可写成（为了统一，这里步长用 $\alpha$ 代替）：

> Repeat until convergence{
> 
> $$\theta_j := \theta_j - \alpha \frac{\partial}{\theta_j}J(\theta)~~\text{(for every j)}$$
> 
> }

　　在求 $n$ 个特征分量 $j$ 对应的参数时可以同步进行，亦即在实现时可以用向量代替。因为每次更新都要用到所有的样本，所以被称为批量梯度下降 (Batch Gradient Descent)。

**优点**:
* 全量数据确定优化方向更加准确
* 由于不同权重的梯度值差距很大，因此选择一个全局的学习率很难。利用全量数据的优势就在于能够使用 Rprop 只基于梯度符号并且针对性单独更新各权值。

**缺点**:
* 用全量数据势必存在速度比较慢的问题
* 没有办法保证优化到全局最优解，除非损失函数是凸函数

### 随机梯度下降法
　　当像利用深度学习算法训练模型，需要的数据量已经大到利用全量数据进行优化不太可行了。为了提高训练速度，随机梯度下降法（stochastic gradient descent, also incremental gradient descent）就被提了出来。SGD 每一轮优化的时候只对随机采样的特定大小 $m$ 的数据集合进行优化：

> Repeat until convergence{
> 
> 　　for i=1 to m, {
> 
> $$\theta_j := \theta_j - \alpha \frac{\partial}{\theta_j}J(\theta)~~\text{(for every j)}$$
> 
> 　　}
> 
> }

### mini 梯度下降法

### 注意点
- 如何判断终止条件？
- 如何选择学习率？
- 与 Method of steepest descent 的区别
- 容易在具体些伪代码的时候弄不清楚对于一个具体的样本 i 来说该怎么安排


## Stochastic Gradient Descent
以上的 Gradient Descent 方法可以看成是用一部分数据来求解 gradient，为了提高计算速度，我们可以使用 Stochastic Gradient Descent，

## References
1. [关于梯度下降法和牛顿法的数学推导](https://imlogm.github.io/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/gradientDescent/)
2. [梯度下降、随机梯度下降与批梯度下降算法之间的比较](https://zhuanlan.zhihu.com/p/37714263)
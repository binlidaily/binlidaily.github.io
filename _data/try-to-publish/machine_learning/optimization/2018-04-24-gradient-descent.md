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

{% include toc.html %}

　　梯度下降法一般是用来迭代求解最优值的一阶优化方法，是求解无约束优化问题最简单、最经典的方式之一。其计算目标函数的偏导，取偏导为零，即当前位置的切线方向去更新对应的变量，形成新的目标函数形式，迭代进行此过程，直到满足终止条件。


## 0. 引入梯度下降法

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

## 1. 梯度下降法原理
　　考虑无约束优化问题：

$$
\text{min}_x f(x)
$$

　　其中 $f(x)$ 为连续可微函数，如果能构造一个序列 $x^0, x^1, x^2, \dots$ 满足如下不等式：

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

　　采用泰勒一阶展开，即只取右式的前两项：

$$
f(\boldsymbol{x}+\Delta \boldsymbol{x}) \simeq f(\boldsymbol{x})+\Delta \boldsymbol{x}^{\mathrm{T}} \nabla \boldsymbol{f}(\boldsymbol{x})
$$

　　记住要满足 $f(\boldsymbol{x}+\Delta \boldsymbol{x})\leq f(\boldsymbol{x})$，那么只要保证 $\Delta \boldsymbol{x}^{\mathrm{T}} \nabla \boldsymbol{f}(\boldsymbol{x})$ 横小于等于零不就👌了，拍一下脑袋，令 $\Delta \boldsymbol{x} = - \nabla \boldsymbol{f}(\boldsymbol{x})$，这下就肯定横小于等于零了吧！🐂🍺

$$
\Delta \boldsymbol{x}=-\gamma \nabla f(\boldsymbol{x})
$$

　　一般还设一个步长 $\gamma$ 来控制 $\Delta \boldsymbol{x}$ 不要太激动步子快太大劈到叉，或者步子太小累成🐶。

　　🤔那么如何从一个初始的 $\boldsymbol{x_0}$ 走到局部最小值的点 $\boldsymbol{x^*}$ 呢？

　　这就是梯度下降的每次更新公式了，从 $\boldsymbol{x_0}$ 开始每次挪动 $\Delta \boldsymbol{x}$ 直到收敛：

$$
\boldsymbol{x_{i+1}}=\boldsymbol{x_{i}}-\gamma \nabla f(\boldsymbol{x_i})
$$

　　目前考虑的是一维的情况，多维情况下可以对应的拓展。

## 2. 梯度负方向的由来
　　我们先回顾一下泰勒公式如下：

$$
\begin{aligned} f(x)_{\text {Taglor}} &=\sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n !} \times(x-a)^{n} \\ &=f(a)+\frac{f^{\prime}(a)}{1 !}(x-a)+\frac{f^{(2)}(a)}{2 !}(x-a)^{2}+\cdots+\frac{f^{(n)}(a)}{n !}(x-a)^{n}+R_{n}(x) \end{aligned}
$$


　　那么泰勒一阶展开得到：

$$
f(\theta) \approx f\left(\theta_{0}\right)+\left(\theta-\theta_{0}\right) \cdot \nabla f\left(\theta_{0}\right)
$$

　　图解如下：

<p align="center">
  <img width="450" height="" src="/img/media/15625677142639.jpg">
</p>

　　我们看上式中 $\theta-\theta_0$ 是微小矢量，其大小其实就是所谓的步长 $\eta$，类比于下山过程中每次前进的一小步，我们将 $\theta-\theta_0$ 的单位向量用 $v$ 表示，可以得到：

$$
\theta-\theta_{0}=\eta v
$$

　　值得注意的是 $\theta-\theta_0$ 不能太大，一阶泰勒近似就不成立了，不然线性近似也就不够准确了。那么，替换之后的 $f(\theta)$ 表达式为：

$$
f(\theta) \approx f\left(\theta_{0}\right)+\eta v \cdot \nabla f\left(\theta_{0}\right)
$$

　　我们做局部下降的目的是希望每次更新 $\theta$ 都能是得函数值 $f(\theta)$ 降低。也就是说我们希望 $f(\theta)<f(\theta_0)$，则：

$$
f(\theta)-f\left(\theta_{0}\right) \approx \eta v \cdot \nabla f\left(\theta_{0}\right)<0
$$

　　而 $\eta$ 一般来说取正数，是个标量可以忽略：

$$
v \cdot \nabla f\left(\theta_{0}\right)<0
$$

　　我们希望更新的函数值降低尽量多，那么也就是说要 $v \cdot \nabla f\left(\theta_{0}\right)$ 尽可能负到最大程度，通过两个向量的乘积操作，我们很明显知道要 $v$ 和 $\nabla f\left(\theta_{0}\right)$ 方向相反才能达到负最大值。

$$
A \cdot B=\|A\| \cdot\|B\| \cdot \cos (\alpha)
$$

　　确定 $v$ 和 $\nabla f\left(\theta_{0}\right)$ 反向后，我们有：

$$
v=-\frac{\nabla f\left(\theta_{0}\right)}{\left\|\nabla f\left(\theta_{0}\right)\right\|}
$$

　　$v$ 是单位向量，所以要单位化，这里求出来的 $v$ 就可以认为是最优解，于是代回定义式子 $\theta-\theta_{0}=\eta v$ 中有：

$$
\theta=\theta_{0}-\eta \frac{\nabla f\left(\theta_{0}\right)}{\left\|\nabla f\left(\theta_{0}\right)\right\|}
$$

　　$\vert\vert \nabla f\left(\theta_{0}\right)\vert\vert$ 是标量，可将其归入到因子 $\eta$ 中，化简有：

$$
\theta=\theta_{0}-\eta \nabla f\left(\theta_{0}\right)
$$

　　即为梯度下降算法中参数 $\theta$ 的更新表达式，其具体优化过程是:

$$
\begin{array}{c}{\theta_{1}=\theta_{0}-\eta \frac{\partial f\left(\theta_{0}\right)}{\partial \theta_{0}}} \\ {\theta_{2}=\theta_{1}-\eta \frac{\partial f\left(\theta_{1}\right)}{\partial \theta_{1}}} \\ {\cdots} \\ {\theta_{M}=\theta_{M-1}-\eta \frac{\partial f\left(\theta_{M-1}\right)}{\partial \theta_{M}-1}}\end{array}
$$

　　等号两边相加，得到最终的优化结果：

$$
\theta_{M}=\theta_{0}+\eta \sum_{m=0}^{M-1}-\frac{\partial f\left(\theta_{m}\right)}{\partial \theta_{m}}
$$

　　这里是参数空间中优化，每次迭代得到参数的增量，这个增量就是负梯度呈上学习率。

## 3. 梯度下降法
　　梯度下降法是优化中很常见的寻找最优解的迭代近似方法，一般从每轮使用的数据样本集大小分成不同的模式。

### 3.1 批量梯度下降（Batch Gradient Descent, BGD）
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
* 容易并行实现

**缺点**:
* 用全量数据势必存在速度比较慢的问题
* 没有办法保证优化到全局最优解，除非损失函数是凸函数

### 3.2 随机梯度下降量（Stochastic Gradient Descent, SGD）
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

**优点**：
* 速度较批梯度下降更新速度大大提高
* 能够在线学习，有了新数据，直接加进来即可。

**缺点**：
* 在某个随机数据集上损失最小，不一定在全量也是。所以随机梯度下降的问题是可能无法达到全局最优。

### 3.3 Mini-Batch 梯度下降法
　　综合考虑 BGD 和 SGD 的优缺点，有一个这种的方案那就是 Mini-Batch 梯度下降。MBGD 将全量的数据分成 $k$ 个 batch，每次训练一个 batch 的数据，循环 $k$ 训练这个 batch 大小为 $m$ 的数据。

> Repeat until convergence{
> 
> 　　for i=1 to k, {
> 
> $$\theta_j := \theta_j - \alpha \frac{1}{m} \sum_{l=1}^{m} \frac{\partial}{\theta_j}J(\theta)~~\text{(for every j)}$$
> 
> 　　}
> 
> }

**优点**：
* 效果更接近 BGD，速度较之快。

**缺点**：
* 无法达到全局最优
* 新加入一个问题：batch size 要怎么选到合适的

## 4. 总结
### 4.1 注意点
- 如何判断终止条件？
- 如何选择学习率？
- 与 Method of steepest descent 的区别
- 容易在具体些伪代码的时候弄不清楚对于一个具体的样本 i 来说该怎么安排

　　梯度下降法的总结
1. 为什么需要学习率？
    * 保证泰勒展开在 $x$ 的邻域内进行，从而可以忽略高次项。
2. 只要没有到达驻点，每次迭代函数值一定能下降，前提是学习率设置合理。
3. 迭代终止的判定规则。达到最大迭代次数，或者梯度充分接近于 0。
4. 只能保证找到梯度为 0 的点，不能保证找到极小值点，更不能保证找到全局极小值点。


## References
1. [关于梯度下降法和牛顿法的数学推导](https://imlogm.github.io/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/gradientDescent/)
2. [梯度下降、随机梯度下降与批梯度下降算法之间的比较](https://zhuanlan.zhihu.com/p/37714263)
3. [为什么梯度反方向是函数值局部下降最快的方向？ - 忆臻的文章 - 知乎](https://zhuanlan.zhihu.com/p/24913912)
2. [为什么梯度的负方向是局部下降最快的方向？ - 忆臻的文章 - 知乎](https://zhuanlan.zhihu.com/p/33260455)
3. [为什么局部下降最快的方向就是梯度的负方向？](https://blog.csdn.net/red_stone1/article/details/80212814)
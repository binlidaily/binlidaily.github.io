---
layout: post
title: Regression
tags: [Machine Learning]
comments: true
published: true
---

线性回归作为一种非常常见的离散值预测模型，却是非常基础且重要的算法，后续的很多机器学习的算法都是在此基础上做的，例如逻辑回归。本文会梳理多个版本的回归算法，从最基本的回归算法，到线性回归算法，再到岭回归。

## 线性回归算法
最基本的线性回归算法想法比较简单，就是拟合一个函数，预测对应的值。我们将样本 plot 出来发现，数据可能呈现正相关的分布，那么我们可以通过一个最简单的线性模型来拟合。

那么，我们如何从一堆数据里求出回归方程呢，即找到回归系数呢？直观的想法是我们能够拟合出一条直线，使得所有点在其 $x$ 的取值下，对应的 $y$ 值跟拟合出来的直线在相同 $x$ 下的取值尽可能接近。这里的点到线段的距离和 SVM 的还不一样，SVM 为了衡量 margin 和超平面的距离，将这种点到面的距离就采用实际的垂直距离。

![](/img/media/15470889554836.jpg)


我们就需要通过一种迭代训练的方式，从一组随机的系数开始，慢慢找到最优的系数。这里说的最优的系数，就从能够是我们预测出来的值与真实值的差距最小的系数；这种误差我们为了避免简单的加减误差会因为正误差和负误差会相互抵消，我们用平方误差来衡量。

$${1\over{2}}\Sigma_{i=1}^m (y_i-x_iw)^2$$

前面的$1\over2$是为了求导时能够与系数消掉，我们用矩阵的形式表示能够得到：

$${1\over 2}(y-Xw)^T(y-Xw)$$

对应的我们求偏导，首先我们新定义一个向量$v$作为中间变量：

$$v=y-Xw$$

然后我们利用 Frobenius inner product 表示上面的式子：

$$f={1\over 2}v:v$$

接着求解函数$f$的微分（differential）$df$：

$$
\begin{aligned}
df &= {1\over2}*2v:dv \\
&= -v:Xdw \\
&= -X^Tv:dw
\end{aligned}
$$

再求对应的梯度（gradient）：

$$
\begin{aligned}
{\partial f}\over {\partial w} &=  -X^Tv \\
&= -X^T(y-Xw)
\end{aligned}
$$

于是，我们对$w$求导有$-X^T(y-Xw)$，令其为零，解出$w$的最优解：

$$-X^T(y-Xw) = -X^Ty+X^TXw = 0$$

则有当$X^TX$满秩状态下的闭试解：

$$\hat{w} = (X^TX)^{-1}X^Ty$$

当然还会出现$X^TX$不满秩的情况，此时可以解出多个$\hat{w}$都能是得均方误差最小化，那具体选择哪一个作为输出，可能就依赖学习算法的偏好决定了。对于$X^TX$不满秩的情况，比较常见的做法是引入正则化（regularization）项，具体在后面介绍。

对于线性回归的求解办法也是规规矩矩的几个步骤：

* 初始化权重
* 计算并更新权重
    * 通过 Gradient Descent
    * 通过 Projection Matrix
* 没有达到最大迭代次数或者SSE变化很小时则继续迭代，否则退出

![-w568](/img/media/15319044453260.jpg)

如上两个数据，会得到完全一样的模型结果，显然模型在这两个数据集上效果是不一样的，那么我们要如何判断这些模型的好坏呢？有一种方法是可以利用预测值$\hat{y}$序列和真实值$y$序列的**相关系数**来衡量。

线性回归有一个问题就是可能出现欠拟合的现象，因为线性回归是具有最小均方误差的**无偏估计**，那么如果出现欠拟合就不能得到最好的预测效果。如果允许引入一些偏差就能降低预测的均方误差，其中一个办法就是局部加权线性回归（Locally Weighted Linear Regression, LWLR）。

无偏估计，也就是说只要你采用这种方法进行估算，估算的结果的期望值（你可以近似理解为很多次估算结果的平均数）既不会大于真实的平均数，也不会小于之。换句话说：你这种估算方法没有系统上的偏差，而产生误差的原因只有一个：随机因素（也就是你的手气好坏造成的）。

[那么为什么有偏效果就更好？](https://www.matongxue.com/madocs/808.html)
![](/img/media/15320525983645.jpg)

如上图所示，有时候会出现这种情况，那么在这种情况下有偏但有效性好（这种情况就是欠拟合的情况），还是可取的。一般情况下，无偏是比有偏好的。

对于一个机器学习算法，值得注意的几个点：
* decision function
* cost function
* parameter solutions


![](/img/media/15345930275439.jpg)


## 局部加权线性回归（Locally Weighted Linear Regression, LWLR）
![](/img/media/15346068354911.jpg)

局部加权线性回归相较于普通的线性回归，区别在于计算 cost function 时引入了权重。

$$\sum _ { i } {1\over 2}w(x_i, x_0) \left( y_i - x_i  w \right) ^ { 2 }$$

计算权重的时候用如下的公式：
$$w(x, x_0) = \exp \left( - \frac { \left( x - x_0 \right) ^ { 2 } } { 2 \tau ^ { 2 } } \right)$$

其中$\tau$是我们人为设的权重，用来控制权重随距离下降的速率。样本越接近的地方，权重就越小，上式就有这样的效果。

我们可以参考OLS的方式来求解LWLR，首先用矩阵的形式来表示：
$${1\over 2} (W(y - Xw))^T(W(y - Xw))$$

其中的$W$是一个对角矩阵，因为$y - Xw$是大小为nx1的向量，W与之相乘之后不能改变大小，于是必须是方阵，然而只能一个数跟对应下标的数值相乘，于是又必须是一个只有对角线上有值的方阵。

对于求偏导，我们利用换元法来计算：

$$v=W(y-Xw)$$

类似之前的做法，我们有：

$$f={1\over 2}v:v$$

$$
\begin{aligned}
df &= {1\over2}*2v:dv \\
&= -v:Xdw \\
&= -X^Tv:dw
\end{aligned}
$$

$$
\begin{aligned}
{\partial f}\over{\partial w} &=  -X^Tv \\
&= -X^TW(y-Xw)
\end{aligned}
$$

接着我们令偏导为零，$-X^TW(y-Xw)=0$，则：

$$\hat{w} = (X^TWX)^{-1}X^TWy$$

## 多项式回归算法 Polynomial regression
多项式要在线性回归的基础上对训练数据做对应的拓展，可以想象成就是线性回归，不过在线性回归之前，我们将输入数据X做了一下多项式的变换。

例如，假设我们的输入数据X是下面这样：

![](/img/media/15310163561755.jpg)

对于一般的线性回归，我们只要找到对应的参数就可以完成设定了，这里没有将bias的1加进去。

$$y=a_1x$$

那么，如果多项式回归我们设定的阶数是3的话，在进行线性回归代入前，我们将X转化成多项式形式：

![](/img/media/15310186312398.jpg)

那么最后的形式就是：

$$y=\alpha_1x+\alpha_2x^2+\alpha_3x^3$$

**需要弄清楚的几个概念**：
* [ ] 随机变量
* [ ] non-parametric algorithm vs parametric learning algorithm

### Parametric algorithms 参数方法
参数方法指的是那些有固定且有限的参数的模型，只需要存储这些参数即可不需要存储数据，因为我们在预测是不需要利用训练数据。

## Shrinking coefficients to understanding our data 缩减系数
**为什么会提出lasso或者ridge回归？**
当数据的特征比样本点还多的时候，X矩阵就可能不满秩了，那么在计算矩阵的逆的时候就会出错。为了解决这个问题，统计学家就引入了岭回归（ridge regression），即我们要介绍的第一种缩减方法。接着我们会介绍效果更好但是计算也更复杂的lasso regression。最后我们会介绍一种叫做向前逐步回归（forward stagewise regression），效果跟lasso相当，但是其计算相对较少。

通过学习，认识到好像上述原因并不是最核心的。我们不难发现，当OLS中的系数如果过大，那么决策函数的结果可能会爆炸，对较大方差的情况非常敏感。为了控制方差过大，我们就需要对系数进行正则化。那么就会想到如下的一种约束方式：

$$
\begin{aligned}
minimize~ & {1\over{2}}\Sigma_{i=1}^m (y_i-x_iw)^2 \\
s.t.~ & \Sigma_{j=1}^p w_j^2 < \lambda
\end{aligned}
$$

对应了ridge regression 或者：
$$
\begin{aligned}
minimize~ & {1\over{2}}\Sigma_{i=1}^m (y_i-x_iw)^2 \\
s.t.~ & \Sigma_{j=1}^p |w_j| < \lambda
\end{aligned}
$$
对应了lasso regression。

### Ridge regression
简单来说，岭回归就是在$X^TX$上加了一个$\lambda I$从而使得矩阵非奇异，那么回归系数就变成了：
$$\hat{w}=(X^TX+\lambda I)^{-1}X^Ty$$

其实，这就对应在目标函数上加了一个 L1 norm:
$${1\over{2}}\Sigma_{i=1}^m (y_i-x_iw)^2+\lambda ||w||^2$$
以上的形式可以通过对w求导化简得到回归系数的式子。

岭回归最先用在处理特征数多于样本数的情况，现在也用在估计中加入偏差，从而得到更好的估计。这里通过引进$\lambda$来限制所有$w$之和，通过引入该惩罚项，能够减少不重要的参数，这个技术在统计学中叫做缩减（shrinkage）。

### Lasso regression
依据上述添加约束的介绍，Lasso regression的公式就是在OLS的基础上加上 L1 norm：
$${1\over{2}}\Sigma_{i=1}^m (y_i-x_iw)^2+\lambda \Sigma_{j=1}^p |w_j|$$

Lasso regression在训练之前要对数据进行标准化，这个是什么原因？

- [ ] 注意中心化和去中心化的思路和目的。

## References
[机器学习算法实践-标准与局部加权线性回归](http://pytlab.org/2017/10/24/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E7%AE%97%E6%B3%95%E5%AE%9E%E8%B7%B5-%E6%A0%87%E5%87%86%E4%B8%8E%E5%B1%80%E9%83%A8%E5%8A%A0%E6%9D%83%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92/)







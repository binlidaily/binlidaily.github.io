---
layout: post
title: Regularization
subtitle: 正则化
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　正则化在机器学习中非常的重要，其是模型选择的典型方法。正则化不能提高模型在数据集上的效果，但是能提高泛化能力，**解决过拟合问题**。

　　可以先了解一下 L1 和 L2 范数的[形式](https://binlidaily.github.io/2019-05-29-norm)，L1 和 L2 范数不光可以用来做正则化还能当损失函数，用 L1 范数的就是最小绝对偏差 (Least Absolute Deviation，LAD)，用 L2 范数就是最小二乘误差 (Least Squares Error, LSE)。

事实上如果从贝叶斯的观点，所有的正则化都是来自于对参数分布的先验。

## 1. L1 正则化
　　L1 范数为：

$$
\|w\|_{1}=\left|w_{1}\right|+\left|w_{2}\right|+\ldots+\left|w_{n}\right|
$$

　　L1 正则项如下所示，其中 L0 代表原始的不加正则项的损失函数，L 代表加了正则项以后的损失函数：

$$
L=L_{0}+\lambda\|w\|_{1}=L_{0}+\lambda \sum_{w}|w|
$$

　　将上式对参数 $w$ 求导如下

$$
\frac{\partial L}{\partial w}=\frac{\partial L_{0}}{\partial w}+\lambda \operatorname{sign}(w)
$$

　　上式中 $\operatorname{sign}(w)$ 表示 $w$ 的符号, 当 $w>0$ 时, $\operatorname{sign}(w)=1$, 当 $w<0$ 时, $\operatorname{sign}(w)=−1$, 因为在原点时不可导, 我们特意规定，当 $w=0$ 时，$\operatorname{sign}(w)=0$，相当于去掉了正则项。

　　权重 $w$ 的更新表达式可如下表示:

$$
w \rightarrow w^{\prime}=w-\eta \frac{\partial L_{0}}{\partial w}-\eta \lambda \operatorname{sign} (w)
$$

　　L1 正则化可以产生稀疏权重矩阵，即产生一个稀疏模型，也可以用于**特征选择**。L1 正则化在一定程度上也可以防止过拟合。


　　L1 的**优点**: 
* 能够获得更加**稀疏**的模型，可以看成做了一定的特征选择。对异常值更不敏感。

　　L1 的**缺点**: 
* 加入 L1 后会使得目标函数**在原点不可导**，需要做特殊处理

### 1.1 Laplace 先验导出 L1 正则化
　　不同的先验会引导线性回归得到不同的正则化，正态分布先验得到 L2 正则，Laplace 先验得到 L1 正则。


　　假设零均值的 Laplace 先验，则最大化后验概率估计可得到参数：

$$
\begin{align*}
&\arg \max _{\beta} \log P(y | \beta)+\log P(\beta)\\
&= \arg\max_{\bf \beta} \Big[ \log \prod_{i=1}^{n} \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{(y_i- (\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2}{2\sigma^2}}
 + \log \prod_{j=0}^{p} \frac{1}{2b}e^{-\frac{|\beta_j|}{2b}} \Big] \\
&= \arg\max_{\bf \beta} \Big[- \sum_{i=1}^{n} {\frac{(y_i- (\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2}{2\sigma^2}}
 - \sum_{j=0}^{p} {\frac{|\beta_j|}{2b}} \Big]\\
&= \arg\min_{\bf \beta} \frac{1}{2\sigma^2} \big[ \sum_{i=1}^{n} (y_i-(\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2
 + \frac{\sigma^2}{b} \sum_{j=0}^{p} |\beta_j| \big] \\
&= \arg\min_{\bf \beta} \big[ \sum_{i=1}^{n} (y_i-(\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2 + \lambda \sum_{j=0}^{p} |\beta_j| \big]
\end{align*}
$$


### L1 正则化使模型参数稀疏

　　为什么 L1 和 L2 分别对应拉普拉斯先验和高斯先验？可以[参考](https://www.zhihu.com/question/23536142/answer/90135994)。

## 2. L2 正则化
　　L2 范数为:

$$
\|w\|_{1}=\sqrt{w_{1}^{2}+w_{2}^{2}+\ldots+w_{n}^{2}}
$$

　　L2 正则项如下所示, 其中 L0 代表原始的不加正则项的损失函数, L 代表加了正则项以后的损失函数：

$$
L=L_{0}+\lambda\|w\|_{2}^{2}=L_{0}+\lambda \sum_{w} w^{2}
$$

　　将上式对参数 $w$ 求导如下:

$$
\frac{\partial L}{\partial w}=\frac{\partial L_{0}}{\partial w}+2 \lambda w
$$

　　则, 权重 $w$ 的更新表达式可如下表示:

$$
w \rightarrow w^{\prime}=w-\eta \frac{\partial L_{0}}{\partial w}-\eta 2 \lambda w
$$

　　由于 $\eta, \lambda, m$ 三个值都是正的, 因此, 加上 L2 正则化以后, 权重整体减小了, 这也是”权重衰减”的由来。


　　L2 正则化可以防止模型过拟合。L2 对大数和 outlier 更敏感！

　　过拟合的时候，拟合函数的系数往往非常大，为什么？如下图所示，过拟合，就是拟合函数需要顾忌每一个点，最终形成的拟合函数波动很大。在某些很小的区间里，函数值的变化很剧烈。这就意味着函数在某些小区间里的导数值（绝对值）非常大，由于自变量值可大可小，所以只有系数足够大，才能保证导数值很大。

<p align="center">
  <img width="" height="" src="/img/media/15592896875283.jpg">
</p>


　　而正则化是通过约束参数的范数使其不要太大，所以可以在一定程度上减少过拟合情况。


　　L2 的优点: 
* 在任意位置都可导, **优化求解过程比较方便**, 而且更加稳定。

　　L2 的缺点: 
* 无法获得真正的稀疏模型。对大数或者说异常值更敏感。

### 2.1 正态分布先验导出 L2 正则化
　　对于线性回归，我们可以从极大似然估计[博客](http://binlidaily.github.io/2019-05-09-mle-maximum-likelihood-estimation)里看到其 $p(y\vert \theta)$ 的计算，然后这里我们采用正态分布的先验，即每个参数 $\beta_i$ 都是服从零均值单位方差 $\tau$ 的正态分布，那么最大后验概率的计算求解参数的式子可以写成：

$$
\begin{align*}
&\arg \max _{\beta} \log P(y | \beta)+\log P(\beta)\\
 &=\arg\max_{\bf \beta} \Big[ \log \prod_{i=1}^{n} \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{(y_i- (\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2}{2\sigma^2}}
 + \log \prod_{j=0}^{p} \frac{1}{\tau\sqrt{2\pi}}e^{-\frac{\beta_j^2}{2\tau^2}} \Big] \\
&= \arg\max_{\bf \beta} \Big[- \sum_{i=1}^{n} {\frac{(y_i- (\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2}{2\sigma^2}}
 - \sum_{j=0}^{p} {\frac{\beta_j^2}{2\tau^2}} \Big]\\
&= \arg\min_{\bf \beta} \frac{1}{2\sigma^2} \big[ \sum_{i=1}^{n} (y_i-(\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2
 + \frac{\sigma^2}{\tau^2} \sum_{j=0}^{p} \beta_j^2 \big] \\
&= \arg\min_{\bf \beta} \big[ \sum_{i=1}^{n} (y_i-(\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2 + \lambda \sum_{j=0}^{p} \beta_j^2 \big]
\end{align*}
$$

　　可见，从参数服从正态分布可以推导到 L2 正则。

## 3. L1 和 L2 正则比较
　　二者共同的特点都是能够防止过拟合问题。

　　二者区别有：
1. L1 相对于 L2 能够产生更加稀疏的模型
2. L2 相比于 L1 对于异常值更敏感(因为平方的原因, L2 对于大数的乘法比对小数的惩罚大)
3. L1 和 L2 梯度下降速度不同: 前者梯度恒定, 并且接接近于 0 的时候会很快将参数更新成0, 后者在接近于0 时, 权重的更新速度放缓, 使得不那么容易更新为0 (这也解释了为什么 L1 具有稀疏性)
4. 二者解空间性状不同

　　从统计概率的角度来看，L1 正则对应 Laplace 先验分布，L2 正则对应高斯先验分布（**证明**？）。

<p align="center">
  <img width="400" height="" src="/img/media/15621430078296.jpg">
</p>

　　在实际应用过程中, 大部分情况下都是 L2 正则的效果更好, 因此推荐优先使用 L2 正则。


### 3.1 为什么权重矩阵稀疏可以防止过拟合?
　　可以从两个方面来解释：
* 特征选择(Feature Selection)：稀疏性可以实现特征的自动选择, 可以在进行预测时减少无用信息的干扰
* 可解释性(Interpretability)：较稀疏的模型表示最终的预测结果只与个别关键特征有关, 这符合实际生活中的历史经验

### 3.2 为何权重参数 $w$ 减小就可以防止过拟合?
　　直观解释是：更小的权值 $w$，从某种意义上说，表示网络的复杂度更低，对数据的拟合刚刚好（这个法则也叫做奥卡姆剃刀），而在实际应用中，也验证了这一点，L2正则化的效果往往好于未经正则化的效果

　　“数学一点”的解释是：过拟合的时候，拟合函数的系数往往非常大，为什么？过拟合，就是拟合函数需要顾忌每一个点，最终形成的拟合函数波动很大。在某些很小的区间里，函数值的变化很剧烈。这就意味着函数在某些小区间里的导数值（绝对值）非常大，由于自变量值可大可小，所以只有系数足够大，才能保证导数值很大. 而正则化是通过约束参数的范数使其不要太大，所以可以在一定程度上减少过拟合情况。

### 3.3 L0 范式和 L1 范式都能实现稀疏, 为什么不选择用 L0 而要用 L1?
　　L0 范数是指向量中非零元素的个数，常用 L1 原因有：
1. 因为 L0 范数很难优化求解（NP难问题）
2. L1 范数是 L0 范数的最优凸近似，而且它比 L0 范数要容易优化求解

### 3.4 L1 和 L2 的选择标准？
　　这个问题没有理论上的定论：在神经网络中我们一般选择 L2 正则化，这样收敛更快一些。传统机器学习以线性回归为例，使用 L2 正则化的岭回归和和使用 L1 正则化的 LASSO 回归都有应用。如果使用L2正则化，则正则化项的梯度值为 $w$；如果是L1正则化，则正则化项的梯度值为 $sgn(w)$。一般认为，L1 正则化的结果更为稀疏。可以证明，两种正则化项都是凸函数。

## References
1. [机器学习中正则化项L1和L2的直观理解](https://blog.csdn.net/jinping_shi/article/details/52433975)
2. [机器学习中使用正则化来防止过拟合是什么原理？](https://www.zhihu.com/question/20700829)
3. [正则化为什么能防止过拟合](https://www.cnblogs.com/alexanderkun/p/6922428.html)
4. [L1 Norms versus L2 Norms](https://www.kaggle.com/residentmario/l1-norms-versus-l2-norms)
5. [L1 正则化及其推导](https://www.cnblogs.com/heguanyou/p/7582578.html)
6. [Laplace（拉普拉斯）先验与L1正则化](https://www.cnblogs.com/heguanyou/p/7688344.html)
7. [**A Probabilistic Interpretation of Regularization**](http://bjlkeng.github.io/posts/probabilistic-interpretation-of-regularization/)
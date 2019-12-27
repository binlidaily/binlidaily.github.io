---
layout: post
title: Logistic Regression
subtitle: 逻辑斯特回归
author: Bin
tags: [Machine Learning, Classification]
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

{% include toc.html %}

　　逻辑斯特回归（或对数几率回归，Logistic Regression, LR）是机器学习中的一种**分类**模型，由于算法的简单高效，在实际运用中非常的广泛。

　　就线性模型来说，我们在现实生活中四种需求：

1. 预测实数：线性回归（Linear Regression）
2. 预测正负二分类：线性分类（Linear Classification）
3. 预测多分类：多个二分类组合（One Vs All）
4. 预测概率：逻辑斯特回归（Logistic Regression）

## 1. 创造 LR 的思维路径
### 1.1 从需求入手
　　这里我们想要实现预测的二分类结果是概率形式，于是我们就要尝试找到一种变换，将之前的线性模型（$h(x)=wx$）结果转换到 $[0,1]$ 内。幸运的是，伟大的数学就有这样的函数了，那就是 [logistic function](https://en.wikipedia.org/wiki/Logistic_function)：

$$
f(x)=\frac{L}{1+e^{-k\left(x-x_{0}\right)}}
$$

　　其中：

1. $e$ 是自然对数。
2. $x_0$ 是该 S 型曲线的重点 $x$ 坐标，像 sigmoid 函数 $x_0=0$
3. $L$ 是曲线的最大值
4. $k$ 是 logistic 曲线增长率

　　Sigmoid 函数就是特殊的 logistic function，其中 $x_0 = 0$，$k=1$，$L=1$。

$$
\sigma(s)=\frac{1}{1+e^{-s}}=\frac{e^{s}}{1+e^{s}} 
$$

　　原来结果范围在 $[-\infty, +\infty]$ 压缩到了 $[0, 1]$，我们再把之前的线性结果带进去看最终的**决策函数**：

$$
h(\mathbf{x})=\sigma\left(\mathbf{w}^{\mathrm{T}} \mathbf{x}\right)=\frac{1}{1+e^{-\mathbf{w}^{\mathrm{T}}\mathbf{x}}}
$$

　　这边是从需求角度引入了 LR 的决策函数，当然我们还能从广义线性模型的角度来引入这个结果。

### 1.2 广义线性模型导出 LR
　　然而从上面的直观理解，虽然输出的结果是在 [0, 1] 上，很难将输出结果跟概率值直接对应上。可以参考 GLM 的具体[介绍](https://binlidaily.github.io/2019-11-27-glm-generalized_linear_model)。

## 2. 构建 LR 模型
　　到此我们知道了 LR 的决策函数，接下来我们就要构建非常重要的损失函数了。然后尝试去求解最优值，会用到求导和梯度下降的通用方法。

### 2.1 极大似然估计构造交叉熵损失函数
　　我们先假设数据类标用的是 $\{0, 1\}$ 表示，对于二分类的对应结果概率为：

$$
{P(y = 1| x; \mathrm{w}) = g(\mathrm{w}^Tx)}={1\over{1+e^{-{\mathrm{w}^Tx}}}}=p
$$

$$
{P(y = 0| x; \mathrm{w}) = 1 - g(\mathrm{w}^Tx)}={e^{-{\mathrm{w}^Tx}}\over{1+e^{-{\mathrm{w}^Tx}}}}=1-p
$$

　　当 $P(y=1 \vert x)>0.5$，则预测的结果 $y^*=1$。可以看特定的情况选择不同的阈值。如果对正例的判别准确性要求高一些，可以调大阈值。对正例的召回率要求高，则可以减小阈值。

　　上面的两个式子可以写成:

$$
P(y|{x};\mathrm{w})=\left\{ \begin{aligned} p, y=1 \\ 1-p,y=0 \end{aligned} \right.
$$

　　在进一步可以合并到一个式子中，这里其实是因为逻辑回归假设样本符合**伯努利分布**，于是有下式:

$$P(y_i|{x}_i;\mathrm{w}) = p^{y_i}(1-p)^{1-{y_i}}$$

　　如果是 $y \in \\{1，-1\\}$ 就要注意下指数的写法。

　　接下来就可以走极大似然估计的套路了，选择 $m$ 个训练集，最大化概率连乘，然后套上对数并加上负号，变成最小化交叉熵损失函数。

$$
\begin{aligned} L(\mathrm{w}) &=p({y} | X ; \mathrm{w}) \\ 
&=\prod_{i=1}^{m} p\left(y_{i} | x_{i} ; \mathrm{w}\right) \\ 
&=\prod_{i=1}^{m}\left(h_{\mathrm{w}}\left(x_{i}\right)\right)^{y_{i}}\left(1-h_{\mathrm{w}}\left(x_{i}\right)\right)^{1-y_{i}} \\
&=\prod_{i=1}^{m}p_i^{y_{i}}\left(1-p_i\right)^{1-y_{i}}
\end{aligned}
$$

　　加单调的对数，最大化似然：

$$
\begin{aligned} L^\prime(\mathrm{w}) &=\log L(\mathrm{w}) \\ 
&=\sum_{i=1}^{m} y_{i} \log h\left(x_{i}\right)+\left(1-y_{i}\right) \log \left(1-h\left(x_{i}\right)\right) \\
&=\sum_{i=1}^{m} y_{i} \log p_i+\left(1-y_{i}\right) \log \left(1-p_i\right)
\end{aligned}
$$

　　加上负号，最小化**交叉熵损失函数**：

$$
\ell(\mathrm{w}) = -\sum_{i=1}^{m} y_{i} \log p_i+\left(1-y_{i}\right) \log \left(1-p_i\right)
$$

### 2.2 优化求导更新参数
　　对于特定样本 $j$，计算损失函数对 $w$ 的偏导如下：

$$
\begin{aligned}
\frac{\partial}{\partial \mathrm{w}_{j}} \ell(\mathrm{w}) &=\left(y \frac{1}{g\left(\mathrm{w}^{T} x\right)}-(1-y) \frac{1}{1-g\left(\mathrm{w}^{T} x\right)}\right) \frac{\partial}{\partial \mathrm{w}_{j}} g\left(\mathrm{w}^{T} x\right) \\ &=\left(y \frac{1}{g\left(\mathrm{w}^{T} x\right)}-(1-y) \frac{1}{1-g\left(\mathrm{w}^{T} x\right)}\right) g\left(\mathrm{w}^{T} x\right)\left(1-g\left(\mathrm{w}^{T} x\right)\right) \frac{\partial}{\partial \mathrm{w}_{j}} \mathrm{w}^{T} x \\ &=\left(y\left(1-g\left(\mathrm{w}^{T} x\right)\right)-(1-y) g\left(\mathrm{w}^{T} x\right)\right) x_{j} \\ &=\left(y-h_{\mathrm{w}}(x)\right) x_{j} \end{aligned}
$$

　　接着利用梯度下降法就可以进行模型参数更新优化。

## 3. 正则化
　　正则化主要用来避免模型的参数 $w$ 过大，导致模型过拟合。

$$
\hat{w} = \text{argmin}_{w} ~ - {1\over{m}}\sum_{i=1}^m\left( y \ln p + \left(1 - y \right)\ln \left(1 - p \right) \right) + \lambda \Phi (w)
$$


### 3.1 $L^2$ 正则化
　　$L^2$ 正则采用平方 $L^2$ 范数，$\Phi (w) = \frac{1}{2} w^Tw$。$L^2$ 正则可以防止过拟合，且要实现核逻辑斯特回归需要 $L^2$ 正则。$L^2$ 正则化会有权重衰减的现象。

　　$L^2$ 正则化的逻辑回归参数更新：

$$
\theta_{j} :=\theta_{j}\left(1-\alpha \frac{\lambda}{m}\right)-\alpha \frac{1}{m} \sum_{i=1}^{m}\left(h_{\theta}\left(x^{(i)}\right)-y^{(i)}\right) x_{j}^{(i)}
$$

### 3.2 $L^1$ 正则化
　　$L^1$ 正则采用 $L^1$ 范数，$\Phi (w) = \frac{1}{m}\vert w \vert$，即权值的绝对值之和。

　　$L^1$ 正则化的逻辑回归参数更新：

$$
\theta_{j} :=\theta_{j}-\alpha \left( \left( \frac{1}{m} \sum_{i=1}^{m}\left(h_{\theta}\left(x^{(i)}\right)-y^{(i)}\right) x_{j}^{(i)} \right) + \frac{\lambda}{m}\text{sgn}(w)\right)
$$

　　其中

$$
\operatorname{sgn}(x) :=\left\{\begin{array}{ll}{-1} & {\text { if } x<0} \\ {0} & {\text { if } x=0} \\ {1} & {\text { if } x>0}\end{array}\right.
$$

## 4. 拓展与实践
　　LR 其实还可以引入核函数称为核逻辑回归（Kernel Logistic Regression）:

$$
\min _{\boldsymbol{\beta}} \frac{\lambda}{N} \sum_{n=1}^{N} \sum_{m=1}^{N} \beta_{n} \beta_{m} K\left(\mathbf{x}_{n}, \mathbf{x}_{m}\right)+\frac{1}{N} \sum_{n=1}^{N} \log \left(1+\exp \left(-y_{n} \sum_{m=1}^{N} \beta_{m} K\left(\mathbf{x}_{m}, \mathbf{x}_{n}\right)\right)\right)
$$

　　LR 能否进行并行化？

### 4.1 工具介绍
　　业界对逻辑回归的研究热点主要是在`稀疏性`、`准确性`和`大规模计算`上。逻辑回归的优化版本有 BFGS，LBFGS，共轭梯度法，信赖域法；针对在线学习遇到的稀疏性和准确性问题，谷歌和伯克利分校提出了稀疏性比较好的 FOBOS 算法，微软提出了 RDA 算法。谷歌综合了精度比较好的 RDA 和稀疏性比较好的 FOBOS 提出了 FTRL，但在 $L_1$ 范数或者非光滑的正则项下，FTRL 效果会更好。

LibLinear 是基于信赖域实现的，Spark MLlib 里的逻辑回归是基于 LBFGS 的。
* LibLinear
* Sklearn
* Spark MLlib
* **FTRL**


### 4.2 对特征的要求和处理
　　需要先将特征离散化为一些列的 0, 1 后再交给 LR，对此总结这样离散化的好处：
1. 系数向量内积乘法运算速度快，计算结果方便存储，容易扩展。
2. 离散化后的特征对异常数据有很强的鲁棒性，排除异常大数干扰。
    * 比如一个特征是年龄 >30 是 1，否则 0。如果特征没有离散化，一个异常数据“年龄300岁”会给模型造成很大的干扰。
3. LR 属于广义线性模型，表达能力有限。单变量 One-Hot 后离散化为多个特征列，而每个特征列（变量）都有单独的权重，这相当于模型引入了非线性，提高了表达能力。
4. 离散化后可以进行特征交叉，由 $M+N$ 个变量变为 $M*N$ 个变量，进一步**引入非线性**，进一步提升表达能力。
5. 特征离散化后，模型会更稳定。
    * 比如如果对用户年龄离散化，20-30 作为一个区间，不会因为一个用户年龄长了一岁就变成一个完全不同的人。当然处于区间相邻处的样本会刚好相反，所以怎么划分区间是门学问。
6. 特征离散化以后，起到了简化了逻辑回归模型的作用，降低了模型过拟合的风险。

  总结一下就是三个方面的优势：
* 使计算简单
* 简化了模型
* 增强了模型泛化能力，不易受噪声影响

　　李沐指出，模型是使用离散特征还是连续特征，其实是一个“海量离散特征+简单模型” 同 “少量连续特征+复杂模型”的权衡。既可以离散化用线性模型，也可以用连续特征加深度学习。就看是喜欢折腾特征还是折腾模型了。通常来说，前者容易，而且可以n个人一起并行做，有成功经验；后者目前看很赞，能走多远还须拭目以待。

* 为什么 LR 需要归一化或者取对数？
    * 归一化：可以提高收敛速度，提高收敛的精度；

## 5. 总结
* 核心思想
    * 本质上也是线性模型，简单来看，可以看成是线性回归套了一个 Sigmoid 函数
    * 假设因变量服从伯努利分布，能够计算出决策函数为 Sigmoid 函数
* 决策函数
    * 线性计算：$$h(\mathbf{x})=\sigma\left(\mathbf{w}^{\mathrm{T}} \mathbf{x}\right)=\frac{1}{1+e^{-\mathbf{w}^{\mathrm{T}}\mathbf{x}}}$$
* 损失函数
    * 交叉熵损失：$$\ell(\mathrm{w}) = -\sum_{i=1}^{m} y_{i} \log p_i+\left(1-y_{i}\right) \log \left(1-p_i\right)$$
* 优化算法
    * 梯度下降：
        1. 输入 $X$, $y$, 初始化权重 $w_0$
        2. 计算损失函数对参数 $w$ 的偏导并迭代更新
        3. 达到最大迭代次数，或者损失降低到一定程度退出
* 优点：
    * 分类时计算量小，速度很快，存储资源低，而且容易并行；易于理解和实现
    * 直接对分类可能性进行建模，无需事先假设数据分布，避免了假设分布不准确所带来的问题
    * 不仅预测类别，而且是近似概率预测
    * 对率函数是任何阶可导的凸函数，有很好的数学性质
* 缺点：
    * 只能处理二分类问题，且必须线性可分，当然为了能实现多分类，也有对应的多项逻辑斯特回归模型。
    * 模型表达能力弱，容易欠拟合，一般准确率不太高，所以需要大量的特征组合和离散的工作来增加特征的表达性

## 6. Q&A
　　待整理！



## References

1. [美团点评](https://tech.meituan.com/intro_to_logistic_regression.html)
2. [Logistic Regression](http://ufldl.stanford.edu/tutorial/supervised/LogisticRegression/)
3. [Softmax 回归](http://deeplearning.stanford.edu/wiki/index.php/Softmax%E5%9B%9E%E5%BD%92)
4. [Code for Logistic Regression](https://github.com/perborgen/LogisticRegression.git)
5. [How To Implement Logistic Regression With Stochastic Gradient Descent From Scratch With Python](https://machinelearningmastery.com/implement-logistic-regression-stochastic-gradient-descent-scratch-python/)
6. [Logistic Regression](https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/pdfs/40%20LogisticRegression.pdf)
7. [Logistic Regression CMU Slides](https://www.stat.cmu.edu/~cshalizi/uADA/12/lectures/ch12.pdf)
8. [机器学习技法笔记(7)-Kernel LR(核逻辑回归)](https://shomy.top/2017/03/07/kernel-lr/)
9. [Why is the error function minimized in logistic regression convex?](http://mathgotchas.blogspot.com/2011/10/why-is-error-function-minimized-in.html)
10. [从广义线性模型(GLM)理解逻辑回归](https://www.jianshu.com/p/9c61629a1e7d)
11. [公式推导](/assets/GenDiscr_LR_9-20-2012.pdf)
12. [Regularization for Logistic Regression: L1, L2, Gauss or Laplace?](https://www.knime.com/blog/regularization-for-logistic-regression-l1-l2-gauss-or-laplace)
13. [sklearn LR](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html#sklearn.linear_model.LogisticRegression)






---
layout: post
title: Logistic Regression
subtitle: 逻辑斯特回归
author: Bin
tags: [Machine Learning]
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

{% include toc.html %}

　　逻辑斯特回归（或对数几率回归，Logistic Regression, LR）是机器学习中的一种**分类**模型，由于算法的简单高效，在实际运用中非常的广泛。

## 实际运用场景
　　实际工作中，我们可能需要一些分类任务或者预测概率的任务，例如会遇到如下问题：

1. 预测用户是否会点击特定的商品
2. 判断用户的性别
3. 预测用户是否会购买给定的品类
4. 判断一条评论是正面的还是负面的
5. 同样在预测概率的时候，LR 也是将为常用的

　　这些问题都可以看成分类问题，准确地说是二分类问题。我们可以拿到数据集的特征和标签，就得到一组训练数据：

$$D = (x^1, y^1),~(x^2, y^2),~...,~(x^N, y^N)​$$

　　其中 $x^i$ 是一个 $m$ 维的向量，$x^i = [x_1^i, x_2^i, ..., x_m^i]$，$y$ 在 $\{0，1\}$ 中取值。至于如何去衡量一个分类器的好坏，我们可以用分类率这样的指标：${Err }= {1\over{N}}1[y^*]=y$。也可以通过准确率，召回率，AUC 等指标来衡量。

## 引入 Logistic Regression
### Sigmoid Function
　　在此之前我们有线性回归这样的模型来做回归，但是在前面的那些实际场合下，我们需要分类结果而非连续的实数结果。考虑到线性回归模型的简单高效，在处理大数据量问题上有其好处。我们看是否有可能在其基础上做一个拓展使之能够做分类问题，从简单的二分类开始。于是想到在线性回归的基础上我们再套上一个可以将实数映射到 $\{0，1\}​$ 两种结果上的函数，于是我们就想到了 Sigmoid 函数，形式如下：

$${g(x) }= {1\over{1+e^{-x}}}​$$

　　从式子上可以看出，当 $x$ 接近与无穷大时，分母会接近于 $1$，则整体结果接近与 $1$；当 $x$ 接近于无穷小时，分母接近于无穷大，则整体结果接近于 $0$。这样就可以做二分类问题了。当然，也可以将结果当成概率来看待，概率值大于 $0.5$ 的认为是 $1$ ，小于 $0.5$ 的认为是 $0$.

<p align="center">
    <img width="445" length="" src="/img/media/15068430849483.jpg">
</p>


### Logistic Regression 决策函数
　　线性回归模型 ($f(x) = \Theta^Tx$) 不能做分类任务，那么在其上面套一个单调可微的的 Sigmoid function，我们得到了可以做分类任务的逻辑回归，使得线性回归的预测值对应到了分类任务的类标 $y$ 上。那为什么要用 Sigmoid 函数？我们可以从广义线性模型的角度去[推导](http://cs229.stanford.edu/notes/cs229-notes1.pdf)，也可以从朴素贝叶斯的方向去理解。

先做一些假设：
1. 假设所有的 $x_i$ 和 $y$ 条件独立；
2. 模型 $P\left(x_i \vert y=y_k\right)$ 符合高斯分布 $\mathrm{N}\left(\mu_{\mathrm{ik}}, \sigma_{\mathrm{i}}\right)$，注意这里两个类别服从均值不同，方差相同的高斯分布；
3. 模型 $P(y)$ 符合伯努利分布 $\text{Bernoulli}(\pi)$。

$$
\begin{aligned} P(y=0 | x) &=\frac{P(y=0) P(x | y=0)}{P(y=0) P(x | y=0)+P(y=1) P(x | y=1)} \\ &=\frac{1}{1+\frac{P(y=1) P(x | y=1)}{P(y=0) P(x | y=0)}} \\ &=\frac{1}{1+\exp \left(\ln \frac{P(y=1) P(x | y=1)}{P(y=0) P(x | y=0)}\right)} \\ &=\frac{1}{1+\exp \left(\left(\ln \frac{1-\pi}{\pi}\right)+\sum_{i} \ln \frac{P\left(x_{i} | y=1\right)}{P\left(x_{i} | y=0\right)}\right)} \end{aligned}
$$

　　通过假设我们知道：

$$
P\left(x | y_{k}\right)=\frac{1}{\sigma_{i k} \sqrt{2 \pi}} e^{\frac{-\left(x-\mu_{i k}\right)^{2}}{2 \sigma_{i k}^{2}}}
$$

　　而上式：

$$
\sum_{i} \ln \frac{P\left(X_{i} | Y=1\right)}{P\left(X_{i} | Y=0\right)} = \sum_{i}\left(\frac{\mu_{i 1}-\mu_{i 0}}{\sigma_{i}^{2}} X_{i}+\frac{\mu_{i 0}^{2}-\mu_{i 1}^{2} )}{2 \sigma_{i}^{2}}\right)
$$

　　其中令 $w_i = \frac{\mu_{i 1}-\mu_{i 0}}{\sigma_{i}^{2}}$，其他的常数项为 $w_0$，那么就能得到逻辑回归的决策函数：

$$
P(y=0 | x)=\frac{1}{1+\exp \left(w_{0}+\sum_{i=1}^{n} w_{i} x_{i}\right)} 
$$

　　对应**预测正类的决策函数**为：

$$
P(y=1 | x)=\frac{\exp \left(w_{0}+\sum_{i} w_{i} x_{i}\right)}{1+\exp \left(w_{0}+\sum_{i} w_{i} x_{i}\right)} = \frac{1}{1+\exp \left(-\left(w_{0}+\sum_{i} w_{i} x_{i}\right)\right)}
$$

　　那么

$$
\frac{P(y=1 | x)}{P(y=0 | x)}=\exp \left(w_{0}+\sum_{i} w_{i} x_{i}\right) 
$$

　　两边加上对数：

$$
\ln \frac{P(y=1 | x)}{P(y=0 | x)}=w_{0}+\sum_{i} w_{i} x_{i} = \Theta^Tx
$$

　　这里就是用线性回归模型的预测结果去逼近真实类标的对数几率，故称该模型为对数几率回归 (logistic regression / logit regression)。所以本质上 LR 模型还是一个线性模型, 我们称之为广义线性模型。

　　由此显然可以得到（除了以上推导，也可以直接如此假设，因为这里是二分类，非此即彼）：

$${P(y = 1| x; \Theta) = g(\Theta^Tx)}={1\over{1+e^{-{\Theta^Tx}}}}=p$$

$${P(y = 0| x; \Theta) = 1- g(\Theta^Tx)}={e^{-{\Theta^Tx}}\over{1+e^{-{\Theta^Tx}}}}=1-p$$

　　当 $P(y=1 \vert x)>0.5$，则预测的结果 $y^*=1$。当然这个选定的阈值也不一定就必须是 $0.5$，可以看特定的情况选择不同的阈值。如果对正例的判别准确性要求高一些，可以选择阈值大一些。对正例的召回率要求高，则可以选择阈值小一些。

　　上面的两个式子可以写成:

$$P(y|{x};\Theta)=\left\{ \begin{aligned} p, y=1 \\ 1-p,y=0 \end{aligned} \right.$$

　　在进一步可以合并到一个式子中，这里其实是因为逻辑回归假设样本符合**伯努利分布**，于是有下式:

$$P(y_i|{x}_i;\Theta) = p^{y_i}(1-p)^{1-{y_i}}$$

　　注意最后的转换是将 $y \in \{0，1\}​$ 的两种情况放到一起变成了一个式子，如果分情况来说的话就很麻烦了，这一转换从形式上来将应该是等价的。这两个部分在 $y​$ 取 $0​$ 或者 $1​$ 时，只会留下一个起作用的部分，另外的部分为 $1​$ ，对乘积没有影响，这种转换实在是很机智啊！🙃 如果是 $y \in \{1，-1\}​$ 就要注意下指数的写法。

### 求解 Logistic Regression 模型
　　对于一般的机器学习模型，都有一个训练目标函数，可以是最小化损失函数。这里我们就想着怎么从已知的决策函数入手，构成对应的损失函数。从决策函数中可以看出，其实我们还有一个很重要的参数尚且不知道，那就是 $\Theta$。如何去求得这个 $\Theta$ 呢？

　　可以利用统计学里面常用的方法——**最大似然估计**法来估计参数，即找到一组参数，使得在这组参数下，我们的数据的似然度（概率）最大（解释是在给定独立同分布的数据时，能够是得似然度或者说似然函数值最大的参数就是最有可能出现的参数）。那么逻辑回归问题的似然度（概率）可以表示成如下形式，我们将结果以 $0/1$ 的两种情况结合表达：

$$L(\Theta)=P(D|\Theta)=\prod{P(y|x,\Theta)}=\prod{p^{y_i}(1-p)^{1-{y_i}}}$$

　　然而这样有指数的式子不太好计算，我们可以将这个似然度取对数，这样的就变成了对数似然度：

$$l(\Theta)=\sum{y\ln{p}+(1-y)\ln{(1-p)}}$$

　　从上面的式子可以看出，最大化对数似然度也就是最小化所有样本点的 log 损失（加上一个负号），于是我们可以定义逻辑回归的平均 log 损失作为模型训练的目标函数（最小化）：

$$J(\Theta)=-{1\over{N}}l(\Theta)=-{1\over{N}}\sum{y\ln{p}+(1-y)\ln{(1-p)}}$$

　　那么模型训练的目标，最大化对数似然度和最小化平均 log 损失是等价的。这最后的损失函数仍是凸函数，但是没有解析解。

　　OK，至此我们有了目标函数且是凸优化类型，接下来就要求解优化问题了，一般迭代地采用梯度下降法。如下的基本步骤：

* 选择下降方向（梯度的反方向，$-\nabla J(\Theta)$）
* 选择步长，更新参数 $\Theta^i = \Theta^{i-1}+\alpha^i(-\nabla J(\Theta^{i-1}))$
* 重复以上两步直到满足终止条件


<p align="center">
  <img width="350" height="" src="/img/media/15068489255584.jpg">
</p>


　　在计算时，对平均 log 损失函数求导，来求得梯度：

$${\partial J\over{\partial \Theta}}=-{1\over n}\sum(y_i-y_i^*)x_i+\lambda\Theta$$

　　求导过程如下：

![](/img/media/1731507971179_.pic_hd.jpg)

　　这里值得注意的是有的习惯在参数 $\Theta$ 上加一个下标 $j$，这是因为加和的部分结果是一个实数，而 $x_i$ 是一个向量，所以需要区分，加上下标 $j$ 表示是分量。

　　那么这里其实是有一个问题的，既然这里是凸函数，我不能直接领偏导为 0 计算解析解嘛？

　　沿着梯度负方向选择一个较小的步长可以保证损失函数是减小的，另一方面，逻辑回归的损失函数凸函数（加入正则项后是严格凸函数？），可以保证我们找到的局部最优值同时是全局最优。此外，常用的凸优化的方法都可以用于求解该问题。例如共轭梯度下降，牛顿法，LBFGS等。这样就代码实现逻辑斯特回归了。
![-w1178](/img/media/15679093644896.jpg)
![-w1175](/img/media/15679096286162.jpg)
![-w1187](/img/media/15679101913791.jpg)
![-w1178](/img/media/15679102894621.jpg)
![-w1194](/img/media/15679104523904.jpg)
![-w1173](/img/media/15679105397954.jpg)
![-w1197](/img/media/15679116485740.jpg)

## 正则化
　　正则化主要用来避免模型的参数 $w$ 过大，导致模型过拟合。

$$
\hat{w} = \text{argmin}_{w} ~ - {1\over{m}}\sum_{i=1}^m\left( y \ln p + \left(1 - y \right)\ln \left(1 - p \right) \right) + \lambda \Phi (w)
$$


### $L^2$ 正则化
　　$L^2$ 正则采用平方 $L^2$ 范数，$\Phi (w) = \frac{1}{2} w^Tw$。$L^2$ 正则可以防止过拟合，且要实现核逻辑斯特回归需要 $L^2$ 正则。$L^2$ 正则化会有权重衰减的现象。

　　$L^2$ 正则化的逻辑回归参数更新：

$$
\theta_{j} :=\theta_{j}\left(1-\alpha \frac{\lambda}{m}\right)-\alpha \frac{1}{m} \sum_{i=1}^{m}\left(h_{\theta}\left(x^{(i)}\right)-y^{(i)}\right) x_{j}^{(i)}
$$

### $L^1$ 正则化
　　$L^1$ 正则采用 $L^1$ 范数，$\Phi (w) = \frac{1}{m}\vert w \vert$，即权值的绝对值之和。

　　$L^1$ 正则化的逻辑回归参数更新：

$$
\theta_{j} :=\theta_{j}-\alpha \left( \left( \frac{1}{m} \sum_{i=1}^{m}\left(h_{\theta}\left(x^{(i)}\right)-y^{(i)}\right) x_{j}^{(i)} \right) + \frac{\lambda}{m}\text{sgn}(w)\right)
$$

　　其中

$$
\operatorname{sgn}(x) :=\left\{\begin{array}{ll}{-1} & {\text { if } x<0} \\ {0} & {\text { if } x=0} \\ {1} & {\text { if } x>0}\end{array}\right.
$$

### 伪代码实现
通过梯度下降的方式求解过程：

$1.~ 输入$ $X$, $y$, $初始化权重$ $w_0$

$2.~ 计算损失函数对参数$ $w$ $的偏导并迭代更新$

$3.~ 达到最大迭代次数，或者损失降低到一定程度退出$

## Logistic Regression 优缺点
**优点**：
* 分类时计算量小，速度很快，存储资源低，而且容易并行；易于理解和实现
* 直接对分类可能性进行建模，无需事先假设数据分布，避免了假设分布不准确所带来的问题
* 不仅预测类别，而且是近似概率预测
* 对率函数是任何阶可导的凸函数，有很好的数学性质

**缺点**：
* 只能处理二分类问题，且必须线性可分，当然为了能实现多分类，也有对应的多项逻辑斯特回归模型。
* 模型表达能力弱，容易欠拟合，一般准确率不太高，所以需要大量的特征组合和离散的工作来增加特征的表达性

在李宏毅视频当中还提到了一个 LR 的局限，我们参看下面的例子。

　　LR 跟一层神经网络的区别在于，LR 只能做二分类，神经元可以做多分类。

## 工业界应用实例
　　本文开始部分提到了几个在实际中遇到的问题，这里以预测用户对品类的购买偏好为例，介绍一下美团是如何用逻辑回归解决工作中问题的。该问题可以转换为预测用户在未来某个时间段是否会购买某个品类，如果把会购买标记为1，不会购买标记为0，就转换为一个二分类问题。我们用到的特征包括用户在美团的浏览，购买等历史信息，见下表：
　　
<div align="center">
<div class="datatable-begin"></div>

类别 | 特征 
:-------: | :--------: 
用户 | 购买频次，浏览频次，时间，地理位置 ... 
品类 | 销量，购买用户，浏览用户 ... 
交叉 | 购买频次，浏览频次，购买间隔 ... 

<div class="datatable-end"></div>
</div>

　　其中提取的特征的时间跨度为30天，标签为2天。生成的训练数据大约在7000万量级（美团一个月有过行为的用户），我们人工把相似的小品类聚合起来，最后有18个较为典型的品类集合。如果用户在给定的时间内购买某一品类集合，就作为正例。有了训练数据后，使用 Spark 版的 LR 算法对每个品类训练一个二分类模型，迭代次数设为100次的话模型训练需要40分钟左右，平均每个模型2分钟，测试集上的AUC也大多在0.8以上。训练好的模型会保存下来，用于预测在各个品类上的购买概率。预测的结果则会用于推荐等场景。

　　由于不同品类之间正负例分布不同，有些品类正负例分布很不均衡，我们还尝试了不同的采样方法，最终目标是提高下单率等线上指标。经过一些参数调优，品类偏好特征为推荐和排序带来了超过1%的下单率提升。

　　此外，由于LR模型的简单高效，易于实现，可以为后续模型优化提供一个不错的baseline，我们在排序等服务中也使用了LR模型。

## 工具介绍
　　业界对逻辑回归的研究热点主要是在`稀疏性`、`准确性`和`大规模计算`上。逻辑回归的优化版本有 BFGS，LBFGS，共轭梯度法，信赖域法；针对在线学习遇到的稀疏性和准确性问题，谷歌和伯克利分校提出了稀疏性比较好的 FOBOS 算法，微软提出了 RDA 算法。谷歌综合了精度比较好的 RDA 和稀疏性比较好的 FOBOS 提出了 FTRL，但在 $L_1$ 范数或者非光滑的正则项下，FTRL 效果会更好。

LibLinear 是基于信赖域实现的，Spark MLlib 里的逻辑回归是基于 LBFGS 的。
* LibLinear
* Sklearn
* Spark MLlib
* **FTRL**

SKlearn 中 [LR](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html)：

> **solver** : str, {‘newton-cg’, ‘lbfgs’, ‘liblinear’, ‘sag’, ‘saga’}, default: ‘liblinear’.
> Algorithm to use in the optimization problem.

> * For small datasets, ‘liblinear’ is a good choice, whereas ‘sag’ and ‘saga’ are faster for large ones.
* For multiclass problems, only ‘newton-cg’, ‘sag’, ‘saga’ and ‘lbfgs’ handle multinomial loss; ‘liblinear’ is limited to one-versus-rest schemes.
* ‘newton-cg’, ‘lbfgs’ and ‘sag’ only handle L2 penalty, whereas ‘liblinear’ and ‘saga’ handle L1 penalty.

> Note that ‘sag’ and ‘saga’ fast convergence is only guaranteed on features with approximately the same scale. You can preprocess the data with a scaler from sklearn.preprocessing.

> **multi_class** : str, {‘ovr’, ‘multinomial’, ‘auto’}, default: ‘ovr’

> If the option chosen is ‘ovr’, then a binary problem is fit for each label. For ‘multinomial’ the loss minimised is the multinomial loss fit across the entire probability distribution, even when the data is binary. ‘multinomial’ is unavailable when solver=’liblinear’. ‘auto’ selects ‘ovr’ if the data is binary, or if solver=’liblinear’, and otherwise selects ‘multinomial’.

### 对特征的要求和处理
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

### 拓展
　　LR 其实还可以引入核函数称为核逻辑回归（Kernel Logistic Regression）:

$$
\min _{\boldsymbol{\beta}} \frac{\lambda}{N} \sum_{n=1}^{N} \sum_{m=1}^{N} \beta_{n} \beta_{m} K\left(\mathbf{x}_{n}, \mathbf{x}_{m}\right)+\frac{1}{N} \sum_{n=1}^{N} \log \left(1+\exp \left(-y_{n} \sum_{m=1}^{N} \beta_{m} K\left(\mathbf{x}_{m}, \mathbf{x}_{n}\right)\right)\right)
$$

　　LR 能否进行并行化？

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






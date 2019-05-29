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
　　线性回归模型 ($f(x) = \Theta^Tx$) 不能做分类任务，那么在其上面套一个单调可微的的 Sigmoid function，我们得到了可以做分类任务的逻辑回归，使得线性回归的预测值对应到了分类任务的类标 $y$ 上。

$$
y = {1\over {1+e^{-\Theta^Tx}}}
$$

<p align="center">
    <img width="245" length="" src="/img/media/IMG_4618.jpg">
</p>

　　如果将 $y$ 视为样本 x 作为正例的可能性，那么 1-y 就是其相反的可能性，两者的比值 $1\over{1-y}$ 称为几率 (odds)，反映了 x 作为正例的相对可能性。对几率取对数就得到了对数几率 (log odds, 亦称 logit)，即：

$$\ln {y\over{1-y}}$$

　　那么上面变换得到的公式：

$$\ln {y\over{1-y}} = \Theta^Tx$$

　　就是用线性回归模型的预测结果去逼近真是类标的对数几率，故称该模型为对数几率回归 (logistic regression / logit regression)。

![](/img/media/15573644907231.jpg)

　　接下来我们进一步转换上面的式子，我们将上式的 $y$ 看成类的后验概率估计 $p(y=1\vert x)$，则可以改写成下式：



$$\ln {p(y=1 \vert x)\over{p(y=0 \vert x)}} = \Theta^Tx$$

　　由此显然可以得到：

$${P(y = 1| x; \Theta) = g(\Theta^Tx)}={1\over{1+e^{-{\Theta^Tx}}}}=p$$

$${P(y = 0| x; \Theta) = 1- g(\Theta^Tx)}={e^{-{\Theta^Tx}}\over{1+e^{-{\Theta^Tx}}}}=1-p$$

　　当 $P(y=1 \vert x)>0.5$，则预测的结果 $y^*=1$。当然这个选定的阈值也不一定就必须是 $0.5$，可以看特定的情况选择不同的阈值。如果对正例的判别准确性要求高一些，可以选择阈值大一些。对正例的召回率要求高，则可以选择阈值小一些。

　　上面的两个式子可以写成:

$$P(y|{x};\Theta)=\left\{ \begin{aligned} p, y=1 \\ 1-p,y=0 \end{aligned} \right.$$

　　在进一步可以合并到一个式子中:

$$P(y_i|{x}_i;\Theta) = p^{y_i}(1-p)^{1-{y_i}}$$

　　注意最后的转换是将 $y \in \{0，1\}​$ 的两种情况放到一起变成了一个式子，如果分情况来说的话就很麻烦了，这一转换从形式上来将应该是等价的。这两个部分在 $y​$ 取 $0​$ 或者 $1​$ 时，只会留下一个起作用的部分，另外的部分为 $1​$ ，对乘积没有影响，这种转换实在是很机智啊！🙃

### 求解 Logistic Regression 模型
　　对于一般的机器学习模型，都有一个训练目标函数，可以是最小化损失函数。这里我们就想着怎么从已知的决策函数入手，构成对应的损失函数。从决策函数中可以看出，其实我们还有一个很重要的参数尚且不知道，那就是 $\Theta$。如何去求得这个 $\Theta$ 呢？可以利用统计学里面常用的方法——最大似然估计法来估计参数，即找到一组参数，使得在这组参数下，我们的数据的似然度（概率）最大（解释是在给定独立同分布的数据时，能够是得似然度或者说似然函数值最大的参数就是最有可能出现的参数）。那么逻辑回归问题的似然度（概率）可以表示成如下形式，我们将结果以 $0/1$ 的两种情况结合表达：

$$L(\Theta)=P(D|\Theta)=\prod{P(y|x,\Theta)}=\prod{p^{y_i}(1-p)^{1-{y_i}}}$$

　　然而这样有指数的式子不太好计算，我们可以将这个似然度取对数，这样的就变成了对数似然度：

$$l(\Theta)=\sum{y\ln{p}+(1-y)\ln{(1-p)}}$$

　　从上面的式子可以看出，最大化对数似然度也就是最小化所有样本点的 log 损失（加上一个负号），于是我们可以定义逻辑回归的平均 log 损失作为模型训练的目标函数（最小化）：

$$J(\Theta)=-{1\over{N}}l(\Theta)=-{1\over{N}}\sum{y\ln{p}+(1-y)\ln{(1-p)}}$$

　　那么模型训练的目标，最大化对数似然度和最小化平均 log 损失是等价的。

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

　　沿着梯度负方向选择一个较小的步长可以保证损失函数是减小的，另一方面，逻辑回归的损失函数凸函数（加入正则项后是严格凸函数？），可以保证我们找到的局部最优值同时是全局最优。此外，常用的凸优化的方法都可以用于求解该问题。例如共轭梯度下降，牛顿法，LBFGS等。这样就代码实现逻辑斯特回归了。



## Logistic Regression 优缺点
**优点**：
* 分类时计算量小，速度很快，存储资源低，而且容易并行；易于理解和实现
* 直接对分类可能性进行建模，无需事先假设数据分布，避免了假设分布不准确所带来的问题
* 不仅预测类别，而且是近似概率预测
* 对率函数是任何阶可导的凸函数，有很好的数学性质

**缺点**：
* 只能处理二分类问题，且必须线性可分，当然为了能实现多分类，也有对应的多项逻辑斯特回归模型。
* 模型表达能力弱，容易欠拟合，一般准确率不太高，所以需要大量的特征组合和离散的工作来增加特征的表达性

在李宏毅视频当中还提到了一个LR的局限，我们参看下面的例子。

## 应用
　　本文开始部分提到了几个在实际中遇到的问题，这里以预测用户对品类的购买偏好为例，介绍一下美团是如何用逻辑回归解决工作中问题的。该问题可以转换为预测用户在未来某个时间段是否会购买某个品类，如果把会购买标记为1，不会购买标记为0，就转换为一个二分类问题。我们用到的特征包括用户在美团的浏览，购买等历史信息，见下表：

| 类别 | 特征 |
| --- | --- |
| 用户 | 购买频次，浏览频次，时间，地理位置 ... |
| 品类 | 销量，购买用户，浏览用户 ... |
| 交叉 | 购买频次，浏览频次，购买间隔 ... |


　　其中提取的特征的时间跨度为30天，标签为2天。生成的训练数据大约在7000万量级（美团一个月有过行为的用户），我们人工把相似的小品类聚合起来，最后有18个较为典型的品类集合。如果用户在给定的时间内购买某一品类集合，就作为正例。有了训练数据后，使用Spark版的LR算法对每个品类训练一个二分类模型，迭代次数设为100次的话模型训练需要40分钟左右，平均每个模型2分钟，测试集上的AUC也大多在0.8以上。训练好的模型会保存下来，用于预测在各个品类上的购买概率。预测的结果则会用于推荐等场景。

　　由于不同品类之间正负例分布不同，有些品类正负例分布很不均衡，我们还尝试了不同的采样方法，最终目标是提高下单率等线上指标。经过一些参数调优，品类偏好特征为推荐和排序带来了超过1%的下单率提升。

　　此外，由于LR模型的简单高效，易于实现，可以为后续模型优化提供一个不错的baseline，我们在排序等服务中也使用了LR模型。可以参考我实现的 [LR 模型](https://github.com/binlidaily/ml-analysis/blob/master/Logistic%20Regression/logistic_regression.py)。

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




## References

1. [美团点评](https://tech.meituan.com/intro_to_logistic_regression.html)
2. [Logistic Regression](http://ufldl.stanford.edu/tutorial/supervised/LogisticRegression/)
3. [Softmax 回归](http://deeplearning.stanford.edu/wiki/index.php/Softmax%E5%9B%9E%E5%BD%92)
4. [Code for Logistic Regression](https://github.com/perborgen/LogisticRegression.git)
5. [How To Implement Logistic Regression With Stochastic Gradient Descent From Scratch With Python](https://machinelearningmastery.com/implement-logistic-regression-stochastic-gradient-descent-scratch-python/)
6. [Logistic Regression](https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/pdfs/40%20LogisticRegression.pdf)
7. [Logistic Regression CMU Slides](https://www.stat.cmu.edu/~cshalizi/uADA/12/lectures/ch12.pdf)






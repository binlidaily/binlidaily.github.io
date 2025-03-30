---
layout: post
title: Factorization Machines
subtitle: 因子分解机
author: Bin Li
tags: [Machine Learning, Recommender System]
image: 
comments: true
published: true
---

　　在最早使用机器学习预估 CTR 的时候，主要是由人工提取特征，然后使用二分类的逻辑回归来做最后预测。普通的线性模型，我们都是将各个特征独立考虑的，并没有考虑到特征与特征之间的相互关系。

　　实际上，特征之间可能具有一定的关联。以新闻推荐为例，一般男性用户看军事新闻多，而女性用户喜欢情感类新闻，那么可以看出性别与新闻的频道有一定的关联性，如果能找出这类的特征，是非常有意义的。

　　那如果我们拓展开想，如果两两特征可能有关联，是不是也有可能是多个特征有关联？接下来我们从二阶拓展到多阶展开。

## 1. 二阶情况
### 1.1 决策函数
　　二阶交叉的话，我们可以在决策函数上加上二阶的计算：

$$
\tilde{y}(x)=w_{0}+\sum_{i=1}^{n} w_{i} x_{i}+\sum_{i=1}^{n} \sum_{j=i+1}^{n} w_{i j} x_{i} x_{j}
$$

　　其中， $n$ 代表样本的特征数量，$x_i$ 是第 $i$ 个特征的值， $w_0$ 、$w_i$、$w_{ij}$ 是模型参数，只有当 $x_i$ 与 $x_j$ 都不为 $0$ 时，交叉才有意义。

　　在数据稀疏的情况下，满足交叉项不为 $0$ 的样本将非常少，当训练样本不足时，很容易导致参数 $w_{ij}$ 训练不充分而不准确，最终影响模型的效果。

　　有一个解决方法是交叉项参数的训练问题可以用矩阵分解来近似解决：

$$
\tilde{y}(x)=w_{0}+\sum_{i=1}^{n} w_{i} x_{i}+\sum_{i=1}^{n} \sum_{j=i+1}^{n}<v_{i}, v_{j}>x_{i} x_{j}
$$

　　计算决策函数的时间复杂度为 $O(kn^2)$，公式中 $<v_i, v_j>$ 表示两个 $k$ 维向量的内积：

$$
<v_{i}, v_{j}>=\sum_{f=1}^{k} v_{i, f} v_{j, f}
$$

　　决策函数需要计算的参数有：

$$
w_{0} \in \mathbb{R}, \quad \boldsymbol{w} \in \mathbb{R}^{n}, \boldsymbol{V} \in \mathbb{R}^{n \times k}
$$

　　对于二阶项的正定矩阵 $W$，只要 $k$ 足够大，就能满足 $W=VV^T$。然而在数据系数情况下，可以选择较小的 $k$，因为数据信息不够。限制 $k$ 的大小在一定程度上提高了模型的泛化能力，这里其实是 FM 施加的限制，要求二次项参数矩阵是低秩的。

　　那么可以将之前的决策函数进行变换：

$$
\begin{aligned} & \sum_{i=1}^{n} \sum_{j=i+1}^{n}<v_{i}, v_{j}>x_{i} x_{j} \\ &=\frac{1}{2} \sum_{i=1}^{n} \sum_{j=1}^{n}<v_{i}, v_{j}>x_{i} x_{j}-\frac{1}{2} \sum_{i=1}^{n}<v_{i}, v_{i}>x_{i} x_{i} \\ &=\frac{1}{2}\left(\sum_{i=1}^{n} \sum_{j=1}^{n} \sum_{f=1}^{k} v_{i, f} v_{j, f} x_{i} x_{j}-\sum_{i=1}^{n} \sum_{f=1}^{k} v_{i, f} v_{i, f} x_{i} x_{i}\right) \\ &=\frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{i=1}^{n} v_{i, f} x_{i}\right)\left(\sum_{j=1}^{n} v_{j, f} x_{j}\right)-\sum_{i=1}^{n} v_{i, f}^{2} x_{i}^{2}\right) \\ &=\frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{i=1}^{n} v_{i, f} x_{i}\right)^{2}-\sum_{i=1}^{n} v_{i, f}^{2} x_{i}^{2}\right) \end{aligned}
$$

　　此时计算的时间复杂度降到了 $O(kn)$。


### 1.2 模型训练
　　FM 的训练和逻辑回归差不多，最后的决策函数可以套上一个 Sigmoid 函数，还可以加上 L2 正则项防止过拟合，损失函数可以针对不同的任务来选择对应的损失函数来优化。

* Regression：$\hat{y}(x)$ 可以直接用作预测，并且最小平方误差来优化。
* Binary classification： $\hat{y}(x)$，作为目标函数并且使用 hinge loss 或者 logit loss 来优化。
* Ranking：向量 $x$ 通过 $\hat{y}(x)$ 的分数排序，并且通过 pairwise 的分类损失来优化成对的样本 $(x^{(a)}, x^{(b)})$

　　在优化的时候在链式法则的基础上，我们这里只看最后对公式中三个参数的求导计算：

$$
\frac{\partial}{\partial \theta} \hat{y}(x)=\left\{\begin{array}{ll}1, & \text { if } \theta \text { is } w_{0} \\ x_{i}, & \text { if } \theta \text { is } w_{i} \\ x_{i} \sum_{j=1}^{n} v_{j, f} x_{j}-v_{i, f} x_{i}^{2}, & \text { if } \theta \text { is } v_{i, f}\end{array}\right.
$$

　　其中 $\sum_{j=1}^{n} v_{j, f} x_{j}$ 只跟 $f$ 有关，与 $i$ 无关，所以可以提前计算出来，那么每一次梯度更新可以在常数时间复杂度内完成，故 FM 参数训练的时间复杂度也是 $O(kn)$。所以，FM 可以在线性时间内训练和预测，是一种非常高效的模型。

## 2. 多阶情况
　　将二阶推向 $d$ 阶，我们先记 $l$ $(1\le l \le d)$ 个特征向量之间的关系，每一个 $l$ 值对应一级特征分量相互关系，整体计算公式如下：

$$
\widehat{y}(\mathrm{x}):=w_{0}+\sum_{i=1}^{n} w_{i} x_{i}+\sum_{l=2}^{d}\left[\sum_{i_{1}=1}^{n-(l-1) n-(l-2)} \sum_{i_{2}=i_{1}+1} \cdots \sum_{i_{l}=i_{l-1}+1}^{n}\left(\prod_{j=1}^{l} x_{i_{j}}\right)\left(\sum_{k=1}^{k_{l}} \prod_{j=1}^{l} v_{i_{j} k}^{(l)}\right)\right]
$$

　　第 $l$ $(l\ge 2)$ 级关系的参数来自矩阵：

$$
\mathbf{V}^{(l)} \in \mathbb{R}^{n \times k_{l}}, \quad k_{l} \in \mathbb{N}^{+}
$$

　　可知，上述决策函数的计算复杂度为 $O(k_d n^d)$。

　　以 $d = 3$ 为例，上式第三项展开之后得到：

$$
\sum_{i_{1}=1}^{n-1} \sum_{i_{2}=i_{1}+1}^{n}\left(x_{i_{1}} x_{i_{2}}\right)\left(\sum_{k=1}^{k_{2}} v_{i_{1} k}^{(2)} v_{i_{2} k}^{(2)}\right)+\sum_{i_{1}=1}^{n-2} \sum_{i_{2}=i_{1}+1}^{n-1} \sum_{i_{3}=i_{2}+1}^{n}\left(x_{i_{1}} x_{i_{2}} x_{i_{3}}\right)\left(\sum_{k=1}^{k_{3}} v_{i_{1} k}^{(3)} v_{i_{2} k}^{(3)} v_{i_{3} k}^{(3)}\right)
$$

## 3. 学习方法
　　FM 的学习方法主要包括以下三种：
* 随机梯度下降法（Stochastic Gradient Descent, SGD)； 
* 交替最小二乘法（Alternating Least- Squares, ALS）；
* 马尔可夫链蒙特卡罗法（Markov Chain Monte Carlo, MCMC)。

### 3.1 Multi-linearity
　　如果把决策函数中的所有参数都写在一起，定义如下：

$$
\Theta=\left(w_{0}, w_{1}, w_{2}, \cdots, w_{n}, v_{11}, v_{12}, \cdots, v_{n k}\right)^{\top}
$$

　　那么对于任意的 $\theta \in \Theta$，存在两个与 $\theta$ 的取值无关的函数 $g_{\theta}(x)$ 和 $h_{\theta}(x)$，使得下式成立：

$$
\widehat{y}(\mathbf{x})=g_{\theta}(\mathbf{x})+\theta h_{\theta}(\mathbf{x})
$$

　1） 当 $\theta = w_0$ 时，

$$
\widehat{y}(\mathbf{x})=\color{#F00}{\sum_{i=1}^{n} w_{i} x_{i}+\sum_{i=1}^{n-1} \sum_{j=i+1}^{n}\left(\mathrm{v}_{i}^{\top} \mathbf{v}_{j}\right) x_{i} x_{j}}+w_{0} \cdot \color{#00F}{1}
$$

　　其中红色的部分为 $g_{\theta}(x)$，蓝色部分为 $h_{\theta}(x)$，下同。

　2） 当 $\theta = w_l$ $(l = 1, 2, \dots, n)$ 时

$$
\widehat{y}(\mathbf{x})=\color{#F00}{w_{0}+\sum_{i=1 \atop i \neq l}^{n} w_{i} x_{i}+\sum_{i=1}^{n-1} \sum_{j=i+1}^{n}\left(\mathbf{v}_{i}^{\top} \mathbf{v}_{j}\right) x_{i} x_{j}}+w_{l} \cdot \color{#00F}{x_{l}}
$$

　3）当 $\theta=v_{lm}$ 时

$$
\widehat{y}(\mathbf{x})=\color{#F00}{w_{0}+\sum_{i=1}^{n} w_{i} x_{i}+\sum_{i=1}^{n-1} \sum_{j=i+1}^{n}\left(\sum_{s=1 \atop {i s \neq l m \atop j s \neq l m}} v_{i s} v_{j s}\right) x_{i} x_{j}}+v_{l m} \cdot \color{#00F}{x_{l} \sum_{i \neq l} v_{i m} x_{i}}
$$

　　从上面三个式子可以看出，$g_{\theta}(x)$ 的表达式比较复杂，而 $h_{\theta}(x)$ 的表达式相对简单，因此事迹推导时，通常只计算 $h_{\theta}(x)$，而 $g_{\theta}(x)$ 可以利用 $\widehat{y}(\mathbf{x}) - \theta h_{\theta}(x)$ 来计算。

## 4. 总结
　　FM 算法计算速度快。不需要人工提特征。

## 5. Q & A
### 5.1 为什么要考虑特征之间的关联信息？
　　大量的研究和实际数据分析结果表明：某些特征之间的关联信息（相关度）对事件结果的的发生会产生很大的影响。从实际业务线的广告点击数据分析来看，也正式了这样的结论。

### 5.2 如何表达特征之间的关联？
　　表示特征之间的关联，最直接的方法的是构造组合特征。样本中特征之间的关联信息在one-hot 编码和浅层学习模型（如LR、SVM）是做不到的。目前工业界主要有两种手段得到组合特征：
* 人工特征工程（数据分析＋人工构造）；
* 通过模型做组合特征的学习（深度学习方法、FM/FFM方法）

　　多项式模型是包含特征组合的最直观的模型。在多项式模型中，特征 $ x_i $ 和 $ x_j $ 的组合采用 $ x_ix_j $ 表示，即 $ x_i $ 和 $ x_j $ 都非零时，组合特征 $ x_ix_j $ 才有意义。


## References
1. [从FM推演各深度学习CTR预估模型（附代码）](https://blog.csdn.net/han_xiaoyang/article/details/81031961)
2. [Paper](/assets/papers/FM-Factorization-Machines.pdf)
3. [训练](http://bourneli.github.io/ml/fm/2017/07/02/fm-remove-combine-features-by-yourself.html)
4. [**刘建平**](https://www.cnblogs.com/pinard/p/6370127.html)
5. [一文看懂Factorization Machine模型的各种变式](https://zhuanlan.zhihu.com/p/52877868)
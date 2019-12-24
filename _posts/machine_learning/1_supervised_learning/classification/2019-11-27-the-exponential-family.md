---
layout: post
title: The Exponential Family
subtitle: 指数分布簇
author: Bin
tags: [Machine Learning]
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

　　我们看到过的很多分布，例如正态分布，$t$ 分布，伯努利分布等，其实可以将它们看成更宽泛的指数分布簇（Exponential Family）的一个类别。指数分布簇其实就是一个特定形式下的概率分布的参数集合，即一种指数分布簇下形式相同，当参数不同时，最终呈现的概率分布也随之不同。

## 1. 指数分布簇
　　如果一个分布写成如下的形式，我们就说这一类分布是在同一个指数分布簇中。

$$
p(y ; \eta)=b(y) \exp \left(\eta^{T} T(y)-a(\eta)\right)
$$

　　其中：
* $\eta$ 是分布的自然参数（natural parameter, or canonical parameter），也就是说跟分布有关
* $T(y)$ 是充分统计量（sufficient statistic），知道了充分统计量，就可以不用样本来获取信息了，因为都包含在充分统计量里了，比如正态分布的充分统计量分别是均值和方差。
* $a(\eta)$ 是 log partition function
* $e^{-a(\eta)}$ 本质上是正则化参数，使得分布 $p(y ; \eta)$ 在 $y$ 上概率加和为 1。

　　特定选择的 $T$, $a$ 和 $b$ 就决定了一个参数为 $\eta$ 的分布簇（family or set），当我们改变 $\eta$ 的值，我们就得到了这个簇下的不同分布结果。

　　其实，大多数的概率分布都属于指数分布族：
* 伯努利分布（Bernoulli）：对 0、1 问题进行建模；
* 二项分布（Multinomial）：对 K 个离散结果的事件建模；
* 泊松分布（Poisson）：对计数过程进行建模，比如网站访问量的计数问题，放射性衰变的数目，商店顾客数量等问题；
* 伽马分布（gamma）与指数分布（exponential）：对有间隔的正数进行建模，比如公交车的到站时间问题；
* β 分布：对小数建模；
* Dirichlet 分布：对概率分布进建模；
* Wishart 分布：协方差矩阵的分布；
* 高斯分布（Gaussian）

　　那么这里就提供了一种求解符合某种特定概率分布的模型参数的方式，我们将特定概率分布的概率分布函数转换成对应的指数分布簇形式，然后按照指数分布簇的参数便可对应求出原概率模型的参数。

## Q&A
* 怎么想到用指数分布簇来表示各种分布？


## References
1. 《Chapter 9 of CS229 Notes》
2. [从广义线性模型(GLM)理解逻辑回归](https://fighterhit.oschina.io/2017/12/24/machine_learning_notes/%E4%BB%8E%E5%B9%BF%E4%B9%89%E7%BA%BF%E6%80%A7%E6%A8%A1%E5%9E%8B%E7%90%86%E8%A7%A3%E9%80%BB%E8%BE%91%E5%9B%9E%E5%BD%92/)
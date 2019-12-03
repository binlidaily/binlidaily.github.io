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

　　我们看到过的很多分布，例如正态分布，$t$ 分布，伯努利分布等，其实可以看成更宽泛的指数分布簇（Exponential Family）的一个类别。指数分布簇其实就是一个特定形式下的概率分布的参数集合，一类指数分布簇下形式相同，但是参数不同，最终呈现的概率分布也随之不同。

　　如果一个分布写成如下的形式，我们就说这一类分布是在一个指数分布簇中。

$$
p(y ; \eta)=b(y) \exp \left(\eta^{T} T(y)-a(\eta)\right)
$$

　　其中：
* $\eta$ 是分布的自然参数（natural parameter, or canonical parameter）
* $T(y)$ 是充分统计量（sufficient statistic），干嘛用的？！
* $a(\eta)$ 是 log partition function
* $e^{-a(\eta)}$ 本质上是正则化参数，使得分布 $p(y ; \eta)$ 在 $y$ 上概率加和为 1。

　　特定选择的 $T$, $a$ 和 $b$ 就决定了一个参数为 $\eta$ 分布的簇（family or set），当我们改变 $\eta$ 的值，我们就得到了这个簇下的不同分布结果。

## 1. The Bernoulli distribution
　　这里我们采用均值为 $\phi$ 伯努利分布 $\text{Bernoulli}(\phi)$ 作为例子加以说明如何写成指数分布簇的形式，首先假设分布的 $y\in\{0, 1\}$，那么我们有：

$$
\begin{aligned} p(y=1;\phi) &=\phi \\ p(y=0;\phi) &=1-\phi \end{aligned}
$$

　　根据伯努利分布的 pmf 有：

$$
\begin{aligned} p(y ; \phi) &=\phi^{y}(1-\phi)^{1-y} \\ &=\exp (y \log \phi+(1-y) \log (1-\phi)) \\ &=\exp \left(\left(\log \left(\frac{\phi}{1-\phi}\right)\right) y+\log (1-\phi)\right) \end{aligned}
$$

　　对照指数分布簇的形式，可以得到自然参数：

$$
\log \left(\frac{\phi}{1-\phi}\right)
$$

　　如果我们反转求自然参数 $\eta$ 的过程（即逆函数），反过来求其中的参数 $\phi$：

$$
\phi =  \frac{1}{1-e^{-\eta}}
$$

　　除此之外还有以下的对应关系：

$$
\begin{aligned} T(y) &=y \\ a(\eta) &=-\log (1-\phi) \\ &=\log \left(1+e^{\eta}\right) \\ b(y) &=1 \end{aligned}
$$

　　可见伯努利分布是指数分布簇的一类。

## Q&A
* 怎么想到用指数分布簇来表示各种分布？


## References
1. 《Chapter 9 of CS229 Notes》
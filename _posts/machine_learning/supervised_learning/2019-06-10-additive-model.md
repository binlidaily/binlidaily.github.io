---
layout: post
title: Additive Model
subtitle: 加法模型
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published:  true
---

　　加法模型 (Additive Model) 是一种非参数和参数方法折中组合的一种算法。当 $X \in \mathbb{R}^{p}$ $X=\left(X_{1}, \ldots X_{p}\right)$，$Y$ 是输出结果。

　　对于参数方法的多维线性模型有：

$$
Y=\beta_{0}+\beta_{1} X_{1}+\ldots+\beta_{p} X_{p}+\varepsilon
$$

　　对于非参数方法的多维模型有：

$$
Y=r\left(X_{1}, \dots X_{p}\right)+\varepsilon
$$

　　在单维数据上采用非参数方法更有优势 ([更多的考虑](/assets/addmodels.pdf) bias 而非 variance)，但是在多维数据上，非参数方法的 variance 会是一个问题，测试错误会与维度成指数级别增长，也就是维度灾难；而参数方法在维度增长时测试错误只是呈线性级别增长，那么加法模型就考虑是否可以将这二者结合起来。

　　我们在参数方法的线性模型中的每一项 $X_{i} \beta_{i}$ 替换成单变量的非参数方法 $r_{i}\left(X_{i}\right)$，这样就结合了二者的优势，提出了加法模型：



![-w798](/img/media/15440883649982.jpg)

假定有数据集 $\left(x_{i}, y_{i}\right) \in \mathbb{R}^{p} \times \mathbb{R}$，$i=1, \dots n$。
## References
1. [Additive model](https://en.wikipedia.org/wiki/Additive_model)
2. [Additive Models](http://www.stat.cmu.edu/~ryantibs/advmethods/notes/addmodels.pdf)
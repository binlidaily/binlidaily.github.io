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

　　加法模型 (Additive Model) 是一种非参数和参数方法折中组合的一种算法。

## Additive Model
　　当 $X \in \mathbb{R}^{p}$ $X=\left(X_{1}, \ldots X_{p}\right)$，$Y$ 是输出结果。

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

$$
Y=\beta_{0}+r_{1}\left(X_{1}\right)+\ldots+r_{p}\left(X_{p}\right)+\varepsilon
$$

　　这个方法比纯非参数模型更加简单，因为限制 $r$ 被分解成了很多单变量回归函数的。如果对函数 $r_{1}, \ldots r_{p}$ 不加限制的话，那么上式就不是可[辨识](https://en.wikipedia.org/wiki/Identifiability)的，那么就可以假设❓：


　　采用加法模型的**好处**在于我们只需要依赖单变量平滑就可以解决问题了，而且加法模型折中之后比纯费参数模型拥有更低的 variance，比纯参数模型拥有更低的 bias。

　　加法模型主要**缺点**也正源于我们只依赖单变量解决问题，而错失了潜在的变量之间的关系。有一定的补救办法是，如果采用线性模型，那么我们可以认为加入一些变量交叉项如 $r_{i j}\left(X_{i}, X_{j}\right)$ 和 $r_{i j k}\left(X_{i}, X_{j}, X_{k}\right)$。

### Backfitting
　　假定有数据集 $\left(x_{i}, y_{i}\right) \in \mathbb{R}^{p} \times \mathbb{R}$，$i=1, \dots n$，每个 $x_{i}=\left(x_{i 1}, \dots x_{i p}\right) \in \mathbb{R}^{p}$，则加法模型就变成了：

$$
y_{i}=\beta_{0}+r_{1}\left(x_{i 1}\right)+\ldots+r_{p}\left(x_{i p}\right)+\epsilon_{i}, \quad i=1, \ldots n
$$

　　这基于相同的可辨识假设 $\mathbb{E}\left(y_{i}\right)=\beta_{0}$，$\mathbb{E}\left(r_{j}\left(x_{i j}\right)\right)=0$，其中 $j=1, \dots p$。

　　接下来介绍 backfitting 方法求解上式，我们先假设：

$$
\hat{\beta}_{0}=\overline{y}=\frac{1}{n} \sum_{i=1}^{n} y_{i}
$$

　　然后循环地利用单变量平滑来估算每一个 $r_{1}, \ldots r_{p}$，直至收敛。
<p align="center">
  <img width="" height="" src="/img/media/15601662849912.jpg">
</p>

　　[文献](/assets/additive_model_ch08.pdf)中如下两个伪代码的说明：
<p align="center">
  <img width="500" height="" src="/img/media/15601665437548.jpg">
</p>

<p align="center">
  <img width="500" height="" src="/img/media/15601658450829.jpg">
</p>



## Generalized Additive Model

![-w798](/img/media/15440883649982.jpg)


## References
1. [Additive model](https://en.wikipedia.org/wiki/Additive_model)
2. [Additive Models](http://www.stat.cmu.edu/~ryantibs/advmethods/notes/addmodels.pdf)
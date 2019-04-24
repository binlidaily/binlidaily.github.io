---
layout: post
title: Activation Functions
subtitle: 激活函数
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　激活函数（Activation Function）在神经网络和深度学习中起着很重要的作用，主要引入一些非线性的成分，使得模型的学习能力更强。Bengio 教授将[激活函数定义](https://arxiv.org/pdf/1603.00391v3.pdf)为：激活函数是映射 $h$: $\mathrm{R} \rightarrow \mathrm{R}$，且几乎处处可导。


## 1. 激活函数的饱和
### 1.1 软饱和
　　激活函数要求在定义域内处处可导，当如果只有在极限条件下偏导数才等于 $0$ 的函数称之为软饱和。当激活函数 $f^{\prime}(x)$ 满足下式时称为左侧软饱和：

$$
\lim _{n \rightarrow-\infty} f^{\prime}(x)=0
$$

　　当激活函数 $f^{\prime}(x)$ 满足下式时称为右侧软饱和：

$$
\lim _{n \rightarrow+\infty} f^{\prime}(x)=0
$$

　　同时满足左饱和和右饱和的为软饱和。

### 1.2 硬饱和
　　不用到达极限条件，只需要以一个常数 $C$ 作为临界就能达到偏导数为 $0$ 的称为硬饱和。对于任意的 $x$ 满足下式的函数被称为左侧硬饱和：

$$
f^{\prime}(x)=0, \text{当} |x|<c, c \text{为常数}
$$

　　对于任意的 $x$ 满足下式的函数被称为右侧硬饱和：

$$
f^{\prime}(x)=0, \text{当} |x|>c, c \text{为常数}
$$


## Sigmoid
　　Sigmoid 是一个 $S$ 型的激活函数，缺点是可能会导致不饱和。

<p align="center">
<img src="/img/media/15560939318918.jpg" width="520">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">Sigmoid 函数和求导结果</em>
</p>







## References
1. [神经网络激活函数汇总（Sigmoid、tanh、ReLU、LeakyReLU、pReLU、ELU、maxout）](https://blog.csdn.net/edogawachia/article/details/80043673)
2. [深度学习系列（8）：激活函数](https://plushunter.github.io/2017/05/12/深度学习系列（8）：激活函数/)
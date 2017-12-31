---
layout: post
title: "Random Features for Large-Scale Kernel Machines"
author: "Bin Li"
categories: "Machine Learning"
meta: "Springfield"
comments: true
---

最近要在组会上汇报一篇这篇文章，于是就做了更多了解。 Random Features for Large-Scale Kernel Machines 是 2007 年的 NIPS 文章，在 2017 年的时候这篇文章获得的 Test-of-time Award，作为解决大规模 Kernel Machines 的算法，可见其有效性，我们将详细做一介绍。

<!--more-->




## Key words
shift-invariant kernel

## Abstract

* 如何利用了快速的线性方法在低维的特征空间？

## Introduction
解决什么问题？
核矩阵是一个问题，$Q_{ij}$

- 什么是 Random Feature?

提出结合线性和非线性的方法。

**定义 Kernel Function**
Kernel trick 是为了避免拿线性学习算法去映射非线性的函数或者决策边界。

由 randomized algorithms for approximating kernel matrices 受到启发，已经成功地通过映射数据到一个相对低维的randomized feature space，而转换对于任何核函数的training和evaluation到对线性machine的操作。

* Random projection, margins, kernels, and feature-selection
* Sampling techniques for kernel methods

核函数的特性：

$$k(x,y)=<\phi(x), \phi(y)>$$

这篇文章想找到一个更加容易理解的映射，利用一个随机化的矩阵映射z将输入映射到低维欧几里得内积空间上。

$$k(x,y)=<\phi(x), \phi(y)>\approx z(x)\prime z(y)$$

z 是低维的。

shift-invariant kernel，平移不变核是什么？
> Let $x,y∈ℝ$ where $y=x−t$. Translation-invariant (or shift-invariant) kernel $κ(⋅,⋅)$ is defined as $κ(x,y)=κ(x,x−t)=κ(t)$.
> 其实就是这样的公式：$κ(x,y)=κ(x-y)$
为什么要满足这个东西？

为什么设置两个实验：

* 一个是smooth
* 另一个非smooth

![](/images/media/15144604725009.jpg)


## Related Work

## Algorithms
### Random Fourier Features
调和分析

Fourier bases

basis function：可以把它想象成基向量，任何的函数都可以有基函数的线性组合形成。

利用算法1可以求解那个接近的式子，那么问题来了，如何去求解D？

如何体现这里的smooth？用的是Fourier？

### Ramdom Binning Features






## Addition
sklearn 里面有 [kernel approximation](https://github.com/scikit-learn/scikit-learn/blob/master/sklearn/kernel_approximation.py) 的应用。

----

## The Understanding of the paper

![](/images/media/15142117647699.jpg)

![](/images/media/15145090094145.jpg)

![](/images/media/15145091469265.jpg)

![](/images/media/15145096856315.jpg)

![](/images/media/15145152048882.jpg)

![](/images/media/15145161499742.jpg)
![](/images/media/15145200804210.jpg)
![](/images/media/15145203289366.jpg)

![](/images/media/15145203057590.jpg)


![](/images/media/15145103285063.jpg)

![](/images/media/15145104134270.jpg)

![](/images/media/15145105547817.jpg)


![](/images/media/15145235336412.jpg)


![](/images/media/15145229581530.jpg)
![](/images/media/15145241371207.jpg)


![](/images/media/15145238467219.jpg)


grid up your input space, lay down a random grid, pick the pitch of the grid

in each bin of the grid, a sign

inner product, 1 if there are in the same bin

hat transfe


![](/images/media/15145105880619.jpg)


What is random feature?
映射函数z(·)可以看成是

----

# PPT
## Introduction
### Background
![](/images/media/15144718498039.jpg)

![](/images/media/15144721110768.jpg)


![](/images/media/15144721233406.jpg)


![](/images/media/15144721395399.jpg)

RBF
![](/images/media/15144804742032.jpg)



![](/images/media/15144811528834.jpg)

找到能使loss最小的f(x;a)，这里累加了高斯核的基函数

![](/images/media/15144812965651.jpg)

对于高斯核的基函数，我们想用不急于数据的random function的加和来逼近。

![](/images/media/15144813697492.jpg)

其中线性组合的线性组合还是线性组合，把z和a的乘积继承b，这样的话就降低了需要选择的参数。

为什么有效？
* 快？
* 准？

有何拓展？

更加有效地评估，![](/images/media/15144824631369.jpg) ，O(D + d)




RBF Kernel: 
$$K(z) = e^{-\gamma ||z^2||_2 } $$ 

For which the sampling distribution p is gaussian too: 
$$ w \sim \mathcal{N}\left(0,\sqrt{2\gamma}I_d\right) $$

![](/images/media/15145214560842.jpg)


![](/images/media/15145218809495.jpg)



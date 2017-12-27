---
layout: post
title: "Random Features for Large-Scale Kernel Machines"
author: "Bin Li"
categories: "Machine Learning"
meta: "Springfield"
comments: true
---


## Introduction
解决什么问题？
核矩阵是一个问题，$Q_{ij}$

- [ ] 什么是 Random Feature?

提出结合线性和非线性的方法。

由 randomized algorithms for approximating kernel matrices 受到启发。

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

## Related Work

## Random Fourier Features
调和分析

## Addition
sklearn 里面有 [kernel approximation](https://github.com/scikit-learn/scikit-learn/blob/master/sklearn/kernel_approximation.py) 的应用。

----

## The Understanding of the paper

![](/media/15142117647699.jpg)


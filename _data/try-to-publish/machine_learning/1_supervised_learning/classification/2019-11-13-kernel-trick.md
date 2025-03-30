---
layout: post
title: Kernel Method
subtitle: 核方法
author: Bin Li
toc: true
tags: [Machine Learning]
bigimg: 
comments: true
published: true
---

　　核函数、核技巧在一些线性不可分的情况下比较常见，本文做一个总结。

## 1. 核映射
　　核本质上就是一个映射函数（mapping function），从给定的数据输入空间，映射到（通常是更高纬度的）特征空间。


## 2. 核技巧
　　设定有一个核 $K$，以及两个在原始数据空间的点 $P_1$, $P_2$，核 $K$ 将两个点分别映射到特征空间后的点为 $\phi(P_1)$，$\phi(P_2)$。一般使用到核函数的场合是会出现两个映射后的点有内积计算 $<\phi(P_1), \phi(P_2)>$。

　　如果我们假定 $S$ 为转换后特征空间的相似度函数（Similarity function），那么有：

$$
S(P_1, P _2)=<\phi(P_ 1), \phi(P_ 2)>
$$

　　核技巧的本质就是通过定义并计算相似度函数 $S$，实现在不需要知道映射函数 $K$ 具体是什么的情况下，计算内积结果。值得注意的是，一般将相似度函数 $S$ 用 $K$ 代替，并标识为**核函数**。

　　这样的好处是减少了映射到高维空间后内积的计算复杂度。



## References
1. [What is the kernel trick?](https://www.quora.com/What-is-the-kernel-trick)
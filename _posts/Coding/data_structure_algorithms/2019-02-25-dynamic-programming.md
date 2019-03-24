---
layout: post
title: Dynamic Programming
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

动规（Dynamic Programming，DP）有点儿像分而治之（divide and conquer）算法那样把问题分成若干的子问题来解决，区别是动规不像分而治之算法那那样子问题都是独立解决的，而是子问题的结果要被记录下来用在类似的或者有重复部分的子问题处理上。

动规一般用在一些能够分解成子问题的问题上，目的是重用这些子问题的结果来达到优化的目的。所以可以总结出几点：
1. 原问题能够转化成有重复部分（有关系）的子问题加以解决。
2. 一个最优的解可以是结合所有子问题最优解而得到。
3. 动规是需要用到 Memoization（记忆化）的。

## References
1. [Data Structures - Dynamic Programming](https://www.tutorialspoint.com/data_structures_algorithms/dynamic_programming.htm)
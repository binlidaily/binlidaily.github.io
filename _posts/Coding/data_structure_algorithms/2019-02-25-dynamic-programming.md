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
　　在介绍动态规划之前，先了解一下分之策略：分之策略是将原问题分解为若干个规模较小但类似于原问题的子问题（Divide），“递归”的求解这些子问题（Conquer），然后再合并这些子问题的解来建立原问题的解。

　　动态规划（Dynamic Programming，DP）有点儿像分而治之（divide and conquer）算法那样，也是将一个原问题分解为若干个规模较小的子问题，递归的求解这些子问题，然后合并子问题的解得到原问题的解。

　　区别在于这些子问题会有重叠，一个子问题在求解后，可能会再次求解，于是我们想到将这些子问题的解存储起来，当下次再次求解这个子问题时，直接拿过来用便是。也就是说，动态规划所解决的问题是分治策略所解决问题的一个子集，只是这个子集更适合用动态规划来解决从而得到更小的运行时间。

　　动规一般用在一些能够分解成子问题的问题上，目的是重用这些子问题的结果来达到优化的目的。所以可以总结出两点关键：
1. 动态规划视图只解决每个子问题一次，**不重复**
2. 一旦某个给定子问题已经算出结果，则将其存储**记忆化**

　　动态规划中包含三个重要的概念：
1. 最优子结构
2. 边界
3. 状态转移公式

　　一般来说分两种实现方法：
1. 自顶向下的备忘录方式，用递归实现
2. 自底向上的方式，用迭代实现


## References
1. [Data Structures - Dynamic Programming](https://www.tutorialspoint.com/data_structures_algorithms/dynamic_programming.htm)
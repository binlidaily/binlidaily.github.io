---
layout: post
title: Interview Questions
subtitle:
author: Bin Li
tags: [Machine Learning, Work]
image: 
comments: true
published: true
---

　　记录一下面试的内容吧，以前一直不想记，发现没有这样的整理过程，以后遇到问过的题目还是不能很好的应对，所以还是走出这一步吧，只要走了，强迫症地我就自动走上笔记完善之路了。

## 今日头条
### 1. 数据分析岗位
一面
* 流程：自我介绍
* 算法：决策树
* 编程：sql 语句，找到最大的

二面
* 流程：自我介绍，机器学习算法问一些
* 算法：
    * LightGBM 为什么快？
* 编程：
    * 给你一个正整数，找到最小的平方和等于这个数的最小组合，比如 $1^2+2^2=5$，$1^2+1^2+1^2+1^2+1^2=5$，我们选第一种，最少数目的组合。
    * Hash 表怎么实现？

三面
* 流程：上来拿着简历就问一些比较核心的问题
* 算法：
    * SVM 训练为什么慢？底层用什么实现的？
    * XGBoost 介绍一下，原理都没说清楚。
    * 随机森林介绍下；如何更新权重？
    * Adaboost 介绍下；损失函数是什么？

## 360
### 1. 机器学习/深度学习研发工程师
一面
* 流程：了解情况，为什么离职？为什么想做算法？
* 算法：
    * 如何判断一个数据集是否能够线性可分？比如说就用 SVM 的话，如果只用线性模型，会发现什么现象才能觉察到线性不可分？
    * PCA 的思想是什么？

二面
* 流程：了解情况，TensorFlow 熟练程度怎么样？
* 算法：问的少。
* 代码：
    * 写树的深度遍历。如果不用递归实现呢？
    * 递归有什么缺点？
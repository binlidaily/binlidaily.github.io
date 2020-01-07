---
layout: post
title: Hash Table
subtitle: 哈希表
author: Bin Li
tags: [Data Structures]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

## 哈希函数
介绍哈希函数

哈希函数又叫散列函数，哈希函数的输入城可以是非常大的范围，但是输出城是固定范围。假设为 s。哈希函数的性质

1、典型的哈希函数都拥有无限的输入值域。2、输入值相同时，返回值一样。

3、输入值不同时，返回值可能一样，也可能不一样。4、不同输入值得到的哈希值，整体均匀的分布在输出域 s 上。（重要）

1~3 点性质是哈希函数的基础，第 4 点是评价一个哈希函数优劣的关键

比如“aaa1"、“aaa2"、“aaa3”，虽然相似，但计算出的哈希值差异巨大。
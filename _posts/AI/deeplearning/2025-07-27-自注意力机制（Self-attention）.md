---
layout: post
title: 自注意力机制（Self-attention）
subtitle: 大模型基石
tags: [深度学习]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

# 简介

在Seq2Seq问题中，一般采用Encoder-Decoder的架构来解决多输入到多输出学习，但学习效果受限于中间被压缩的Context Vector大小。那么能不能一口气直接看整个序列呢？聪明的大脑提出了今天的主角——Self-attention，不光能看全序列、提取信息相关性，甚至还能并行，TA不伟大谁伟大？！🐂🍺

# 思路

一股脑看所有信息太杂乱，直观想法是挑重点看！如何找到重点？这就像高考时做英语完形填空一样，很多生词导致看不懂，那就联系上下文，找到关键词。Self-attention就类似这样的过程，去找到上下文中和当前空缺相关性最高的提供信息，然后再填写相应的词。

当前要填的空为Query，上下文每个生词为Key，上下文对应的信息为Value。

那么，抽离成两个重点：
1. 找上下文的相关性：当前空为Q，找与上下文K的相关性Attention Scores(${{QK^T}}$)。
2. 选合适的结果：基于Attention Scores算出概率分布，在对上下文的表征V提取信息。

核心公式是：
$$
Attention=Softmax({{QK^T}\over{d_k}})V
$$

# 算法过程

## 1、Embedding输入数据

先保证输入数据做好Tokenization，变成Token Embedding方便后续计算。

## 2、构建QKV向量

假设输入为 $X={X_1,X_2,...,X_n}$，对应记录QKV成参数形式：

$$
Q=matmul(X,W_Q)
$$

$$
K=matmul(X,W_K)
$$

$$
V=matmul(X,W_V)
$$

## 3、计算Attention Matrix（${QK^T}$）

如何找两个向量间的相似性？点乘准没错。

$$
Attention\ Matrix=matmul(K^T, Q)
$$

## 4、归一化Scores成概率值（相关性）

点乘结果不好衡量，需归一化为分数，这里用softmax：

$$
Attention\ Scores=Softmax({{QK^T}\over{d_k}})
$$

除一个$d_k$主要是为了防止数值太大，训练时会有问题。

## 5、Attend提取信息

有的得分后，就可以在原本的V中提取信息了：

$$
Attention=Softmax({{QK^T}\over{d_k}})V
$$
---
layout: post
title: "Attention 入门"
author: "Bin Li"
tags: "DL"
category: "AI"
comments: true
published: true
---

## 什么是 Attention
聚焦在某一局部的机制。

聚焦，中心是“高像素的”，周边是“低像素的”。

![](/images/media/15223269611625.jpg)


## NMT 提出 Attention Mechanism 
在 Seq2Seq 上加了注意力机制。

我们知道基础的Seq2Seq模型主要包含了两个组件—— Encoder与Deocoder。Encoder对输入进行“编码”，将其转换为一个固定大小的Context Vector并传递给Decoder，Decoder接受向量后对其进行“解码”后得到输出。

### Attention 解决什么问题
之前翻译系统的一个比较麻烦的问题，传统的翻译需要花很多功夫做特征工程，如n-gram等。而以前基于Seq2Seq的又必须要设定在一定长度向量上，在效果上没有那么好。

NMT 利用能得到更高level的文本意义，翻译效果会更好；且实现和训练模型比较方便。

- [ ] 问题NMT用RNN编码成向量时也是有固定长度的嘛？

但是用RNN会有一个问题，就是RNN它不太能记住离当前step比较远的数据特征，用LSTM对长文本的效果会相对好一些，但是在实践中仍有一些问题。比如将编码器的数据颠倒顺序给解码器或者将输入序列输入两次能得到较好的记忆效果。

但是像有的语言，比如日语，最后的单词能用来很好的预测首个单词，这样的情况下颠倒并非一个很好的措施，那么可以用 Attention Mechanism。

用 Attention Mechanism 不用学习所有的原句子了，可以只关注原句的不同部分就可以了，而且还能让模型根据输入序列和到目前为止拥有的信息去学习具体要关注（attend）什么。

![](/images/media/15223344880250.png)

- [ ] 什么是一个input state？




Attention 的一个好处是可以提供解释和可视化训练模型在干啥。

![库](/images/media/15223344797783.png)


![](/images/media/15223277862279.png)

### Attention 的损失函数
看计算公式，我们需要计算很多attention value。

但是人类Attention机智是强调focus的部分，而弱化周边的部分。

## Attention-based LSTM for Text Classification



[Attention Mechanism 学习笔记1](http://tobiaslee.top/2017/08/15/Attention-Mechanism-%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/)

[Attention-based LSTM for Text Classification](http://tobiaslee.top/2017/08/29/Attention-based-LSTM-for-Text-Classification/)

[Attention and Memory in Deep Learning and NLP](http://www.wildml.com/2016/01/attention-and-memory-in-deep-learning-and-nlp/)

[What is 'attention' in the context of deep learning?](https://www.quora.com/What-is-attention-in-the-context-of-deep-learning)



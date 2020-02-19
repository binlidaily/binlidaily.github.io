---
layout: post
title: "Attention 入门"
author: "Bin Li"
tags: [Deep Learning]
category: "AI"
comments: true
published: false
---

## What is Attention?
聚焦中心是“高像素的”，周边是“低像素的”。


![](/img/media/15223269611625.jpg)


## [History of Attention](http://www.cnblogs.com/robert-dlut/p/5952032.html)
Image -> context.

![](/img/media/15223438819617.jpg)


## Recurrent Models of Visual Attention
模拟人类看东西的方式，我们并非将目光放在整张图像上，尽管有时候会从总体上对目标进行把握，但是也是将目光按照某种次序（例如，从上倒下，从左到右等等）在图像上进行扫描，然后从一个区域转移到另一个区域。这么一个一个的区域，就是定义的part，或者说是 glimpse。然后将这些区域的信息结合起来用于整体的判断和感受。



![](/img/media/15223764790847.jpg)

* $l$: location
* $f_g(*)$: glimpse network
* $f_h(*)$: core network
* $f_l(*)$: location network
* $g_t$: glimpse representation

![](/img/media/15223781827819.jpg)

![](/img/media/15223783065834.jpg)



## Attention Mechanism for Context
最基础的Seq2Seq模型包含了三个部分，即Encoder、Decoder以及连接两者的中间状态向量。

### 第一种 [Seq2Seq](https://zhuanlan.zhihu.com/p/27766645)
![](/img/media/15223793249780.jpg)

$$ h _ { < t > } = f \left( h _ { < t - 1} ,y _ { t - 1} ,c \right) $$

$$ P \left( y _ { t } | y _ { t - 1} ,y _ { t - 2} ,\dots ,y _ { 1} ,c \right) = g \left( h _ { < t > } ,y _ { t - 1} ,c \right) $$

### 第二种 Seq2Seq
Google 机器翻译团队使用了encoder-decoder模型的变体，其模型结构如下


![](/img/media/15223799433781.jpg)

Tricks:

1. 句子反过来输进去效果会得到提升
2. 重复输入两遍效果也比较好

没能解决的问题：

1. 信息的有损压缩
2. RNN的时间维度过大

![](/img/media/15223800052716.jpg)



### Neural Machine Translation (NMT)
之前翻译系统的一个比较麻烦的问题，传统的翻译需要花很多功夫做特征工程，如n-gram等。而以前基于Seq2Seq的又必须要设定在一定长度向量上，在效果上没有那么好。

![](/img/media/15223955747695.png)

思考：

* 如何将 Attention 聚焦的思想引入到文本当中？


[**Neural Machine Translation** by Jointly Learning to Align and Translate](https://arxiv.org/pdf/1409.0473.pdf)



<!--NMT 利用能得到更高level的文本意义，翻译效果会更好；且实现和训练模型比较方便。

- [ ] 问题NMT用RNN编码成向量时也是有固定长度的嘛？

但是用RNN会有一个问题，就是RNN它不太能记住离当前step比较远的数据特征，用LSTM对长文本的效果会相对好一些，但是在实践中仍有一些问题。比如将编码器的数据颠倒顺序给解码器或者将输入序列输入两次能得到较好的记忆效果。

但是像有的语言，比如日语，最后的单词能用来很好的预测首个单词，这样的情况下颠倒并非一个很好的措施，那么可以用 Attention Mechanism。

用 Attention Mechanism 不用学习所有的原句子了，可以只关注原句的不同部分就可以了，而且还能让模型根据输入序列和到目前为止拥有的信息去学习具体要关注（attend）什么。-->

![](/img/media/15223959325227.jpg)

<!--![](/img/media/15223875094655.jpg)-->

$$ p \left( y _ { i } | y _ { 1} ,\ldots ,y _ { i - 1} ,\mathbf { x } \right) = g \left( y _ { i - 1} ,s _ { i } ,c _ { i } \right) $$

$$ s _ { i } = f \left( s_{ i - 1},y _ { i -1} ,c _ { i } \right) $$

$$ c _ { i } = \sum _ { j = 1} ^ { T _ { x } } \alpha _ { i j } h _ { j } $$

$$ \alpha _ { i j } = \frac { \exp \left( e _ { i j } \right) } { \sum _ { k = 1} ^ { T _ { x } } \exp \left( e _ { i k } \right) } $$

$$ e _ { i j } = a \left( s _ { i - 1} ,h _ { j } \right) = v _ { a } ^ { T } \tanh \left( W _ { a } s _ { i - 1} + U _ { a } h _ { j } \right) $$


Attention 的一个好处是可以提供解释和可视化训练模型在干啥。

![](/images/media/15223966165822.jpg)









<!--
### Attention 的损失函数
看计算公式，我们需要计算很多attention value。

但是人类Attention机智是强调focus的部分，而弱化周边的部分。

## Attention-based LSTM for Text Classification

-->
## References
1. [注意力机制（Attention Mechanism）在自然语言处理中的应用](http://www.cnblogs.com/robert-dlut/p/5952032.html)
2. [Attention Mechanism 学习笔记1](http://tobiaslee.top/2017/08/15/Attention-Mechanism-%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/)
3. [Attention-based LSTM for Text Classification](http://tobiaslee.top/2017/08/29/Attention-based-LSTM-for-Text-Classification/)
4. [sequence to sequence model小记](https://zhuanlan.zhihu.com/p/27766645)
5. [Nlp中的attention mechanism](https://zhuanlan.zhihu.com/p/27766967)
6. [Attention and Memory in Deep Learning and NLP](http://www.wildml.com/2016/01/attention-and-memory-in-deep-learning-and-nlp/)
7. [What is 'attention' in the context of deep learning?](https://www.quora.com/What-is-attention-in-the-context-of-deep-learning)



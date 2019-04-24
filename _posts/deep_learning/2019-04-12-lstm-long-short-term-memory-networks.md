---
layout: post
title: Long Short Term Memory networks
subtitle: 长短期记忆网络
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　因为传统的 RNN [很难](http://ai.dinfo.unifi.it/paolo//ps/tnn-94-gradient.pdf)学到离着当前时刻较远的状态信息，于是提出了长短期记忆网络（Long Short Term Memory networks, LSTMs），其是一种 [RNN](https://binlidaily.github.io/2019-04-12-rnn-recurrent-neural-network/) 的变种，传统的 RNN 结构如下：

<p align="center">
<img src="/img/media/15560880253740.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;"> 传统 RNN 结构</em>
</p>

<p align="center">
<img src="/img/media/15560881084865.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;"> LSTM 单元结构</em>
</p>

<p align="center">
<img src="/img/media/15560881125115.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">符号解释</em>
</p>

## LSTM 的核心想法
　　首先看最上面的一条直通线，只有一些线性计算，特征信息很容易通过这条通道往后传。

<p align="center">
<img src="/img/media/15560884718235.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM 单元结构最上面通道</em>
</p>

　　LSTM 能够移除或增加信息到单元结构，其由所谓的门（Gates）来精心调控，门由 Sigmoid 单元层和一个逐元素乘法操作组成。LSTM 的有三种门：遗忘门（Forget Gate Layer），输入门（Input Gate Layer）和。

<p align="center">
<img src="/img/media/15560886697329.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM  门结构</em>
</p>

　　遗忘门 $f_t$ 决定在单元结构中哪些信息我们需要舍弃，遗忘门的输出结果在 $[0, 1]$ 之间，描述信息量被放行程度，为 $0$ 说明不让信息通过及舍弃，为 $1$ 说明让所以信息通过即保留。

<p align="center">
<img src="/img/media/15560895593631.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM  遗忘门结构</em>
</p>

　　接下来讨论 LSTM 单元结构如何决定哪些信息需要存储下来，这份两个部分来进行，一是利用输入门 $i_t$ 来控制决定更新哪些值以及更新的程度，二是利用激活层（tanh layer）来创建一个候选值的向量 $\tilde{C}_{t}$，将其加到当前的状态中。接下来就可以利用这两个方面来更新单元结构的状态。

<p align="center">
<img src="/img/media/15560902892125.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM  输入门结构</em>
</p>

　　接下来更新单元结构的状态，从旧状态 $C_{t-1}$ 更新到新状态 $C_{t}$。观察下图中的 $C_{t}$ 公式，我们通过遗忘门 $f_t$ 来控制当前状态要不要保留，用输入门 $i_t$ 和候选状态 $\tilde{C}_{t}$ 来更新当前状态。

<p align="center">
<img src="/img/media/15560906327659.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM  输入门更新单元结构状态</em>
</p>

　　最后，我们就要确定要输出那些信息，输出基于当前单元结构的状态。这一部分结合了上一个单元的输入信息和更新后的当前单元结构状态信息，上一单元的输入信息先经过 Sigmoid 函数（遗忘门），决定当前状态哪些部分会被输出，当前单元结果的状态信息则经过 tanh 激活函数，然后将这两方面信息通过逐元素相乘的形式结合就得到了输出门（Output Gate Layer）。

![](/img/media/15560918552000.jpg)



## References
1. [tensorflow笔记：多层LSTM代码分析](https://blog.csdn.net/u014595019/article/details/52759104)
2. [Simple LSTM](http://nicodjimenez.github.io/2014/08/08/lstm.html)
3. [Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)
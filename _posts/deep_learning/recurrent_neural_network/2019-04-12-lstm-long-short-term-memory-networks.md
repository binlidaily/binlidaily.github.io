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
<img src="/img/media/15560880253740.jpg" width="520">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;"> 传统 RNN 结构</em>
</p>

<p align="center">
<img src="/img/media/15560881084865.jpg" width="520">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;"> LSTM 单元结构</em>
</p>

<p align="center">
<img src="/img/media/15560881125115.jpg" width="520">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">符号解释</em>
</p>

## 1. LSTM 的核心想法
　　LSTM 的单元结构如下图所示，其有两个状态向量 $\bf{h}_t$ 和 $\bf{c}_t$（“c” stands for cell）。我们可以将 $\bf{h}_t$ 看做是短期状态（short-term state），$\bf{c}_t$ 是长期状态（long-term state）。

<p align="center">
<img src="/img/media/15833298604217.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM 单元结构</em>
</p>

　　LSTM 的网络主要想法是能够学习到哪些内容要存储到长期记忆，哪些内容需要遗忘（丢弃），以及从短期记忆和输入数据中读取到哪些内容。如何去做这些控制移除还是添加信息到单元结构中呢？LSTM 采用不同的门（Gates）来精心调控。

<p align="center">
<img src="/img/media/15560886697329.jpg" width="100">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM  门结构</em>
</p>

　　LSTM 的有三种门，门由 Sigmoid 单元层（也用 logistic activation 表示）和一个逐元素乘法操作组成：
1. 输入门（Input Gate）
    * 由 $\bf{i}_t$ 控制，控制最主要的输入 $\bf{g}_t$ 的哪些部分可以被加入到长期记忆状态 $\bf{c}_t$ 中
2. 遗忘门（Forget Gate）
    * 由 $\bf{f}_t$ 控制，控制单元中哪些长期记忆状态需要 $\bf{c}_t$ 被清除
3. 输出门（Output gate）
    * 由 $\bf{o}_t$ 控制，控制单元中哪些长期记忆状态 $\bf{c}_t$ 应该被读取和输入到当前时间步 $\bf{h}_t$ 和输出 $\bf{y}_t$ 中

　　这三个门的开关都是利用短期记忆状态 $\bf{h}_t$ 和输入数据 $\bf{x}_t$ 通过模型训练学习到的。接下来我们展开看 LSTM 单元结构是怎么学习和训练的。

　　首先，我们看 LSTM 单元最上面的一条直通线，只有一些线性计算，特征信息很容易通过这条通道往后传，这个就是长期记忆 $\bf{c}_t$ 可以长期传下去的原因。

<p align="center">
<img src="/img/media/15560884718235.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM 单元结构最上面通道</em>
</p>

　　当然长期记忆状态不可能也不应该一直有效，所以可以看到最上面直线有一个为遗忘门预留的 ❎ 按位乘操作。

<p align="center">
<img src="/img/media/15560895593631.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM  遗忘门结构</em>
</p>

　　遗忘门 $f_t$ 决定在单元结构中哪些信息我们需要舍弃，遗忘门因为有一个 Sigmoid 激活函数，其输出结果在 $[0, 1]$ 之间，描述信息量被放行程度，为 $0$ 说明不让信息通过及舍弃，为 $1$ 说明让所以信息通过即保留。

　　接下来讨论 LSTM 单元结构最主要的部分，输入信息环节，如何决定哪些信息需要存储下来，这份两个部分来进行：

1. 根据短期记忆状态 $\bf{h}_t$ 和输入数据 $\bf{x}_t$ 利用激活层（tanh layer）创建一个候选值的向量 $\tilde{C}_t$（这个也就是上面图中的 $\bf{g}_t$），将其预备更新到当前的状态中
2. 利用输入门 $i_t$ 来控制决定更新哪些输入内容以及更新的程度

<p align="center">
<img src="/img/media/15560902892125.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM  输入门结构</em>
</p>

　　如果信息被放行，就可以被整合到长期记忆状态 $\bf{c}_t$ 中继续往后传播了。接下来看下是如何由遗忘门和输入门控制更新单元结构长期记忆的状态，即从旧状态 $\bf{c}_{t-1}$ 更新到新状态 $\bf{c}_t$。

　　观察下图中的 $\bf{c}_t$ 公式，我们通过遗忘门 $f_t$ 来控制当前状态要不要保留，用输入门 $i_t$ 和候选状态 $\tilde{C}_t$ 来更新当前状态。

<p align="center">
<img src="/img/media/15560906327659.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">LSTM  输入门更新单元结构状态</em>
</p>

　　最后，LSTM 就要确定哪些状态需要输出到当前时间步，这一部分需要结合了上一个单元输入进来的短期记忆状态信息和更新后的当前单元结构状态信息。

　　上一单元输入进来的短期记忆状态信息先经过 Sigmoid 函数（输出门）控制决定当前状态哪些部分会被输出，当前单元结果的状态信息则经过 tanh 激活函数，然后将这两方面信息通过逐元素相乘的形式结合就得到了输出结果，即当前单元的短期记忆状态信息 $\bf{h}_t$。

![](/img/media/15560918552000.jpg)


## 2. LSTM 的变种
　　前一节我们介绍了最基本的 LSTM 的版本，为了对应的优化，其实 LSTM 有了很多的变种，接下来依次介绍。

### 2.1 Peephole connections
　　这个做法是让三个控制门也直接读入长期记忆状态信息 $\bf{c}_t$：

![](/img/media/15833869607281.jpg)

　　这个 Peephole connections 的操作使得每次在控制三个门的状态时，需要考虑长期记忆状态信息，猜想这种设计的好处是，对以往信息比较看重的任务可能会有更好的结果。

### 2.2 Coupled forget and input gates
　　另外一个变种是，我们将遗忘门和输入门一起考虑：

![](/img/media/15833872821677.jpg)

　　这样的好处是可以综合考虑该丢失和输入哪些信息，我们只有当决定要输入信息的时候才考虑遗忘一些信息，同样的，也只有当决定遗忘一些长期的信息后才考虑输入一些新的信息。

### 2.3 Gated Recurrent Unit, GRU
　　GRU 是一个简化版的 LSTM，其效果还是比较好的。

<p align="center">
<img src="/img/media/15833913214081.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">GRU 单元结构状态</em>
</p>

![](/img/media/15833912057711.jpg)

　　从上面的单元结构我们可以看出来 GRU 的特点：
* 长期记忆状态和短期记忆状态被整合到了一个状态 $\bf{h}_t$
* GRU 有一个旧状态“过滤门” $\bf{r}_t$，来控制上一个时间步的状态 $\bf{h}_{t-1}$ 的信息需要决定保留多少输入给当前单元结构
* 将普通 LSTM 的输入门和遗忘门利用上一小节介绍的 Coupled forget and input gates 方式组合成一个新的“更新门” $\bf{z}_t$

## References
1. [tensorflow笔记：多层LSTM代码分析](https://blog.csdn.net/u014595019/article/details/52759104)
2. [Simple LSTM](http://nicodjimenez.github.io/2014/08/08/lstm.html)
3. [Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)
4. 《机器学习实战》
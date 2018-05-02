---
layout: post
title: "Machine Learning by Hung-yi Lee"
author: "Bin Li"
tags: ""
category: ""
comments: true
published: false
---

## ML Lecture 0-1: Introduction of Machine Learning

* Supervised Learning
* Unsupervised Learning
* Semi-Supervised Learning

![](/images/media/15252473988428.jpg)


Reiforcement Learning 是数据不够的情况下才开始用的，能用 Supervised Learning 的就用之。

## ML Lecture 1: Regression - Case Study
![](/images/media/15252493832068.jpg)

两个偏导数放一起就是 gradient。

![](/images/media/15252498956436.jpg)

用线性回归可能不是很好，那么可以加上二次，甚至多次的结果。
![](/images/media/15252499405450.jpg)

![](/images/media/15252499722591.jpg)


![](/images/media/15252500118688.jpg)


我们可以看到，用到4次的时候，结果已经更差了，所以就没有必要再往高了拟合了。

![](/images/media/15252500726292.jpg)

我们整合在一起看，这里我们用了更加复杂的模型，那么我们的training error是会降低，但是testing error反而会更差了，很明显已经过拟合了。

![](/images/media/15252501773723.jpg)

![](/images/media/15252504969044.jpg)

当增加了数据之后，画图看出来，这个数据跟输入数据种类很有关系，于是我们可以重新设计模型。

![](/images/media/15252505867914.jpg)


![](/images/media/15252507117560.jpg)


![](/images/media/15252507386892.jpg)

那么，现在我们想还能不能继续优化模型呢？那么我们想，是不是CP值跟重量，HP等有关系。
![](/images/media/15252509031213.jpg)

我们不知道具体哪些有影响，可以全部加进去试试看。

![](/images/media/15252509156209.jpg)

注意我们还要对$y^\prime$做另外的处理，很明显，结果太复杂已经过拟合了。那我们可以用正则化。

![](/images/media/15252511178724.jpg)

前面的最小化loss比较好理解，后面加上正则项要最小化，可以理解成是越小的参数，函数越平滑。看红色增加的部分，参数值越小，我们对变化越不敏感，那么就越平滑。如果越平滑，那么对噪声数据也越不敏感。正则化的时候不用考虑bias，因为对函数平滑没有影响。

![](/images/media/15252515526552.jpg)


当然，函数太平滑也不好，那么，我们就需要自己手调步长。

![](/images/media/15252520793570.jpg)



---
layout: post
title: "Machine Learning by Hung-yi Lee"
author: "Bin Li"
tags: [Open Courses, Machine Learning]
category: ""
comments: true
published: false
---

## ML Lecture 0-1: Introduction of Machine Learning

* Supervised Learning
* Unsupervised Learning
* Semi-Supervised Learning

![](/img/media/15252473988428.jpg)

Reiforcement Learning 是数据不够的情况下才开始用的，能用 Supervised Learning 的就用之。

## ML Lecture 1: Regression - Case Study
![](/img/media/15252493832068.jpg)

两个偏导数放一起就是 gradient。

![](/img/media/15252498956436.jpg)

用线性回归可能不是很好，那么可以加上二次，甚至多次的结果。
![](/img/media/15252499405450.jpg)

![](/img/media/15252499722591.jpg)


![](/img/media/15252500118688.jpg)


我们可以看到，用到4次的时候，结果已经更差了，所以就没有必要再往高了拟合了。

![](/img/media/15252500726292.jpg)

我们整合在一起看，这里我们用了更加复杂的模型，那么我们的training error是会降低，但是testing error反而会更差了，很明显已经过拟合了。

![](/img/media/15252501773723.jpg)

![](/img/media/15252504969044.jpg)

当增加了数据之后，画图看出来，这个数据跟输入数据种类很有关系，于是我们可以重新设计模型。

![](/img/media/15252505867914.jpg)


![](/img/media/15252507117560.jpg)


![](/img/media/15252507386892.jpg)


那么，现在我们想还能不能继续优化模型呢？那么我们想，是不是CP值跟重量，HP等有关系。
![](/img/media/15252509031213.jpg)

我们不知道具体哪些有影响，可以全部加进去试试看。

![](/img/media/15252509156209.jpg)

注意我们还要对$y^\prime$做另外的处理，很明显，结果太复杂已经过拟合了。那我们可以用正则化。

![](/img/media/15252511178724.jpg)

前面的最小化loss比较好理解，后面加上正则项要最小化，可以理解成是越小的参数，函数越平滑。看红色增加的部分，参数值越小，我们对变化越不敏感，那么就越平滑。如果越平滑，那么对噪声数据也越不敏感。正则化的时候不用考虑bias，因为对函数平滑没有影响。

![](/img/media/15252515526552.jpg)


当然，函数太平滑也不好，那么，我们就需要自己手调步长。

![](/img/media/15252520793570.jpg)


## ML Lecture 2: Where does the error come from?
error的来源：

* bias
* variance

![](/img/media/15272561637417.jpg)

![](/img/media/15272563254066.jpg)


![](/img/media/15272564742013.jpg)


错误由两个部分组成：

* bias
* variance

bias说的是我准不准，variance说的是我稳不稳？

 ![](/img/media/15273485658415.jpg)

比较简单的model受data的影响会比较小。

![](/img/media/15273489653566.jpg)

提高bias

* 重新设计模型，更复杂能够学习更好特征

提高variance

* 提高更多数据
* 正则化
    * 曲线变平滑
    * 有可能伤害 bias


## ML Lecture 3-1: Gradient Descent
Adaptive Learning Rates
刚开始较大，然后降低

![](/img/media/15273923279361.jpg)

当gradient越大，step不一定越大，当有多个参数的时候就会出现这样的现象。

![](/img/media/15273929673843.jpg)


![](/img/media/15273932598941.jpg)

![](/img/media/15273943260021.jpg)


## ML Lecture 4: Classification
![](/img/media/15277591843873.jpg)


解释贝叶斯分类方法的想法：
![](/img/media/15277594957550.jpg)


![](/img/media/15277596081702.jpg)

Generative model
可以计算某一个x的出现概率，这样就可以用这个方式来generate x。

### 最大似然估计
我们可以假设我们现有的训练数据是从高斯分布采样的到的，但是我们不知道具体是哪一个参数下的高斯分布采样的到的这些样本，因为有的参数下采样出这些样本的概率比较小，但是也是有可能采样出来的，所以我们要找到有着最大概率采样出这些样本点的高斯分布。

![](/img/media/15278416166883.jpg)

![](/img/media/15278421734761.jpg)

![](/img/media/15278438018566.jpg)


参数比较多，可能会过拟合。

![](/img/media/15278450875857.jpg)


![](/img/media/15278569617339.jpg)

![](/img/media/15278570950577.jpg)

![](/img/media/15278574044738.jpg)

![](/img/media/15278575208729.jpg)

如果使得sigma取一样的话:
![](/img/media/15278581170877.jpg)


## ML Lecture 5: Logistic Regression
![](/img/media/15279256232100.jpg)

![](/img/media/15279260914273.jpg)

![](/img/media/15279265737927.jpg)

cross entropy 看这两个有多接近。

![](/img/media/15279266972834.jpg)

![](/img/media/15279268440387.jpg)

![](/img/media/15279268883072.jpg)

![](/img/media/15279270125693.jpg)

![](/img/media/15279270654580.jpg)

为什么LR中不用square error呢？

![](/img/media/15279275497969.jpg)

label是0和1时，结果都会是零。

![](/img/media/15279277758660.jpg)

在远处，cross entropy会陡，更新会很快。

判定与生成
![](/img/media/15279279989042.jpg)

probability distribution在判定性没有假设，生成型中有假设。所以相同数据下，同种模型，有不同结果。

![](/img/media/15279280795499.jpg)

![](/img/media/15279283097050.jpg)

![](/img/media/15279285801877.jpg)

![](/img/media/15279295747375.jpg)

![](/img/media/15279298201205.jpg)

如果多类的话，最好用这种方式来记录，不然如果用类1，类2，类3分别用1，2，3来表示话，这样就会有一个问题，这样就好像在说1跟2比较近，1根3比较远。

![](/img/media/15279299010439.jpg)


![](/img/media/15279299253358.jpg)

可以用Feature transformation来做。

![](/img/media/15279301052621.jpg)

如何自动找这种transformation

![](/img/media/15279301849111.jpg)

为什么有效？先看下例子：

![](/img/media/15279302903846.jpg)

![](/img/media/15279303117024.jpg)

右下角坐标画反了。

![](/img/media/15279304178218.jpg)

## ML Lecture 6: Brief Introduction of Deep Learning

![](/img/media/15279976766850.jpg)

![](/img/media/15280071727954.jpg)

![](/img/media/15280076137726.jpg)

![](/img/media/15280076338087.jpg)


![](/img/media/15280076636683.jpg)

![](/img/media/15280077719733.jpg)

![](/img/media/15280078580041.jpg)


--

## ML Lecture 12: Semi-supervised
Semi-supervised learning
* Transductive learning
* Inductive learning
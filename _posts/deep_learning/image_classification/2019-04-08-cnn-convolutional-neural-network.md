---
layout: post
title: Convolutional Neural Network
subtitle: 卷积神经网络
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　卷积神经网络（Vanilla Neural Networks / Convolutional Neural Network, CNN）采用三种基本概念：局部感受野（Local Receptive Fields），共享权重（Shared Weights）和池化（Pooling）。三个重要网络层的作用：卷积层负责提取特征，采样层负责特征选择，全连接层负责分类。

　　局部感受野就是利用卷积框提取特征的局部。每一个局部位置对应同一隐层的一个神经元（计算操作）。

　　共享权重说的是同一层的同一个特征映射用的是同一组权值和偏置。

　　使⽤卷积层的平移不变性似乎很可能减少全连接模型中达到同样性能的参数数量，使得训练更快，有助于建设深度网络。


## 1. Convolutional Layers
* 输入图片大小 W×W
* Filter大小 F×F
* 步长 S
* padding的像素数 P

$$N = \left\lfloor(W − F + 2P )/S+1 \right \rfloor$$

　　这里加的 1 是表示原地的自己，比如说序列 $[1, 9]$ 一共多少个数的计算方法是 $9 - 1 + 1$，要记得 1 或者 9 那个数算上。


## 2. Pooling Layers


## Fully Connected Layer
　　全连接层（Fully Connected Layer, FC）是由许多神经元组成的平铺结构，其根据得到的特征进行分类。

　　如何从卷积层后激活函数的输出转到全连接层？可以把它理解成用相同大小的卷积核进行卷积计算输出到一个神经元，FC 层有多少个神经元就用多少个这样的卷积核进行操作。

　　例如我们要把 3x3x5 的输出，转换成 1x4096 的形式。

<p align="center">
<img src="/img/media/15559854607020.jpg" width="">
</p>

　　可以理解成如下采用的 3x3x5 的 filter 去卷积激活函数的输出：

<p align="center">
<img src="/img/media/15559855009136.jpg" width="">
</p>

　　因为有 4096 个神经元，这里可以看成用一个 3x3x5x4096 的卷积层去卷积激活函数的输出。这一层的卷积很是重要，用来把特征的 representation 整合到一起，输出为一个值。这样的好处是能够大大减少特征位置对分类带来的影响。如下面的例子：

<p align="center">
<img src="/img/media/15559882225191.jpg" width="">
</p>

　　从上图可以看出喵喵不管在什么位置，输出的结果都是相同的，而对于机械化的算法来说特征值相同，如果特征值位置不同，那么可能分类的结果也不一样。那么通过全连接层的卷积核操作就能够把 Feature Map 整合成一个值，判断是否有喵喵存在（值大说明存在）。所以，全连接层的作用是**分类**。值得注意的是因为全连接层将空间结构特征忽略了，所以其不适合在方位上找 Pattern 的任务，比如 Detection 和 Segmentation。

　　那么这里我们会问一个问题，为什么有的网络是连续两层全连接层的平铺结果？

　　这里可以联系到泰勒公式，即用多项式函数去拟合光滑函数。我们这里用许多神经元去拟合数据分布，但是因为如果只有一层全连接层，有时候没有办法解决非线性的问题（激活函数可以在一定程度上可以实现非线性），如果多层就能解决。

　　全连接层之前的作用是提取特征，那么到了全连接层我们只要得到如下特征就能判断图片中是否有喵喵：

<p align="center">
<img src="/img/media/15559912454297.jpg" width="">
</p>

　　我们先看下输出层前面的一个全连接层的特征情况：

<p align="center">
<img src="/img/media/15559915410132.jpg" width="">
</p>

　　从图中可以看到，红色的神经元被激活了，也就是对应的特诊刚被找到了，而同一层中的其他没有被激活的神经元说明要么喵喵的特征不明显，要么没找到。当在输出层把这些特征组合到一起时，就能判断是喵喵了。至此，我们如果再继续往前看一层全连接层，我们看如何得到在当前全连接层被激活的喵喵的头部特征。

<p align="center">
<img src="/img/media/15559917593770.jpg" width="">
</p>

　　通过前面的卷积层、下采样层，可以得到喵喵头部的局部特征：

<p align="center">
<img src="/img/media/15559918008969.jpg" width="">
</p>

　　虽然不是很严谨的一个例子，但是也可以说明这样的问题，有的时候单层全连接层效果并不是很好，如果这里只拿一层全连接层直接连到输出层效果可能就不好。但是在实际操作中似乎也只好用尝试的办法来选择到底要用几层全连接层。

## Activation Function
　　激活函数（Activation Function）的优势：
* 提高模型鲁棒性，非线性表达能力
* 缓解梯度消失问题
* 将特征图映射到新的特征空间从而有利于训练
* 加速模型收敛等

什么情況下使用**微调**？

* 你要使用的数据集和预训练模型的数据集相似，如果不太相似，比如你用的预训练的参数是自然景物的图片，你却要做人脸的识别，效果可能就没有那么好了，因为人脸的特征和自然景物的特征提取是不同的，所以相应的参数训练后也是不同的。
* 自己搭建成者使用的 CNN 模型正确率太低。
* 数据集相似，但数据集数量太少。
* 计算资源太少。

## References
1. [5.3. 多输入通道和多输出通道](https://zh.d2l.ai/chapter_convolutional-neural-networks/channels.html)
2. [Convolutional Neural Networks (CNNs / ConvNets)](http://cs231n.github.io/convolutional-networks/)
3. [CNN 入门讲解：什么是全连接层（Fully Connected Layer）?](https://zhuanlan.zhihu.com/p/33841176)
4. [CNN入门讲解：什么是采样层（pooling）](https://zhuanlan.zhihu.com/p/32299939)
5. [CNN 入门讲解：什么是卷积（Convolution）?](https://zhuanlan.zhihu.com/p/30994790)
6. [如何通俗地理解卷积？](https://www.matongxue.com/madocs/32.html)
7. [Understanding Convolutions](http://colah.github.io/posts/2014-07-Understanding-Convolutions/#fnref2)
8. [最容易理解的对卷积(convolution)的解释](https://blog.csdn.net/bitcarmanlee/article/details/54729807)
9. [如何通俗易懂地解释卷积？ - palet的回答 - 知乎](https://www.zhihu.com/question/22298352/answer/637156871)
10. [如何通俗易懂地解释卷积？ - 张俊博的回答 - 知乎](https://www.zhihu.com/question/22298352/answer/34267457)
11. [如何理解空洞卷积（dilated convolution）？ - 刘诗昆的回答 - 知乎](https://www.zhihu.com/question/54149221/answer/323880412)
12. [Understanding max-pooling and loss of information](https://stats.stackexchange.com/questions/245365/understanding-max-pooling-and-loss-of-information)

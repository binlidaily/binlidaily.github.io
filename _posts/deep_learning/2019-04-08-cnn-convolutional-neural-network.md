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

　　卷积神经网络（Convolutional Neural Network, CNN）采用三种基本概念：局部感受野（Local Receptive Fields），共享权重（Shared Weights）和池化（Pooling）。三个重要网络层的作用：卷积层负责提取特征，采样层负责特征选择，全连接层负责分类

　　局部感受野就是利用卷积框提取特征的局部。每一个局部位置对应同一隐层的一个神经元（计算操作）。

　　共享权重说的是同一层的同一个特征映射用的是同一组权值和偏置。

　　使⽤卷积层的平移不变性似乎很可能减少全连接模型中达到同样性能的参数数量，使得训练更快，有助于建设深度网络。

## Convolutional Layers
　　卷积层主要进行卷积计算从而进行特征提取。

<p align="center">
<img src="/img/media/15547073032659.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">卷积计算过程</em>
</p>

## Pooling Layers
　　混合层/采样层/池化层（Pooling layers）紧跟在卷积层后，用来简化卷积层输出信息。对特征图（Feature Map）进行特征选择，去除多余特征，重构新的特征图。

　　池化层可以在一定程度上提高空间不变形，例如平移不变性，尺度不变形和形变不变形。平移不变性（Translation Invariant）就是图像经过一个小小的平移之后，依然产生相同的池化特征，当然这个平移是要在池化矩阵的范围内。好处就是不管在要检测的特征出现在图像的任何位置，池化后的结果都能保持一致。

　　具体作用为：
1. 特征不变性
    * 使模型更关注包含一定的自由度，能容忍特征微小的位移
2. 特征降维
    * 降采样使后续操作的计算量得到减少
3. 一定程度防止过拟合

### Max Pooling
　　选择区域内值最大的，认为其最能代表给定特征。我们可以把 Max Pooling 看作一种某个给定特征在图像区域中被发现的方式，其忽略特征的确切位置。直观上看，只是判断一个特征有没有，并不需要知道其确切位置，这样可以减少特征数量和参数数目。

CNN特征提取的误差主要来自两个方面：

1. 邻域大小受限造成的估计值方差增大
    * 平均池化能有效减少该误差，更多的保留图像的背景信息；
    * 均匀采样的方差只有总体方差的 $\frac{1}{N}$；
    * 但如果模型中杂波方差较大（也即第二个误差明显），最后输出类别的概率分布将出现明显的混叠，导致分类准确率下降
2. 卷积层参数误差造成估计值均值偏移
    * 最大池化能有效减少该误差，更多的保留图像纹理信息；
    * 最大值采样的方差为总体方差的 $\frac{1}{\sqrt{\log (N)}}$（推导过程参见论文），受第一种误差影响较大；

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

## References
1. [5.3. 多输入通道和多输出通道](https://zh.d2l.ai/chapter_convolutional-neural-networks/channels.html)
2. [Convolutional Neural Networks (CNNs / ConvNets)](http://cs231n.github.io/convolutional-networks/)
3. [CNN 入门讲解：什么是全连接层（Fully Connected Layer）?](https://zhuanlan.zhihu.com/p/33841176)
4. [CNN入门讲解：什么是采样层（pooling）](https://zhuanlan.zhihu.com/p/32299939)
5. [CNN 入门讲解：什么是卷积（Convolution）?](https://zhuanlan.zhihu.com/p/30994790)
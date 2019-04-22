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

<p align="center">
<img src="/img/media/15547073032659.jpg" width="">
</p>

　　卷积神经网络（Convolutional Neural Network, CNN）采用三种基本概念：局部感受野（Local Receptive Fields），共享权重（Shared Weights）和混合（Pooling）。

　　局部感受野就是利用卷积框提取特征的局部。每一个局部位置对应同一隐层的一个神经元（计算操作）。

　　共享权重说的是同一层的同一个特征映射用的是同一组权值和偏置。

　　使⽤卷积层的平移不变性似乎很可能减少全连接模型中达到同样性能的参数数量，使得训练更快，有助于建设深度网络。

　　混合层（Pooling layers）跟进在卷积层后，用来简化卷积层输出信息。

　　我们可以把最⼤值混合看作⼀种⽹络询问是否有⼀个给定的特征在⼀个图像区域中的哪个地 ⽅被发现的⽅式。然后它扔掉确切的位置信息。直观上，⼀旦⼀个特征被发现，它的确切位置 并不如它相对于其它特征的⼤概位置重要。⼀个很⼤的好处是，这样可以有很多被更少地混合 的特征，所以这有助于减少在以后的层所需的参数的数⽬。

## References
1. [5.3. 多输入通道和多输出通道](https://zh.d2l.ai/chapter_convolutional-neural-networks/channels.html)
2. [Convolutional Neural Networks (CNNs / ConvNets)](http://cs231n.github.io/convolutional-networks/)
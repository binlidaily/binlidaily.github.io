---
layout: post
title: Convolutional Layer
subtitle: 卷积层
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---


　　将卷积层之前我们先了解一下什么是卷积，卷积是对两个实变函数的数学运算，我们称 $(f*g)(n)$ 为 $f$、$g$ 的卷积。其连续定义为：

$$
(f * g)(n)=\int_{-\infty}^{\infty} f(\tau) g(n-\tau) d \tau
$$

　　对应的离散定义为：

$$
(f * g)(n)=\sum_{\tau=-\infty}^{\infty} f(\tau) g(n-\tau)
$$

　　先对 g 函数进行翻转，相当于在数轴上把g函数从右边褶到左边去，也就是卷积的“卷”的由来。然后再把g函数平移到n，在这个位置对两个函数的对应点相乘，然后相加，这个过程是卷积的“积”的过程。

$$
(f * g)\left(c_{1}, c_{2}\right)=\sum_{a_{1}+b_{1}=c_{1}} f\left(a_{1}, a_{2}\right) \cdot g\left(b_{1}, b_{2}\right)
$$

$$
(f * g)\left(c_{1}, c_{2}\right)=\sum_{a_{1}, a_{2}} f\left(a_{1}, a_{2}\right) \cdot g\left(c_{1}-a_{1}, c_{2}-a_{2}\right)
$$

$$
(f * g)\left(x, y\right)=\sum_{a_{1}, a_{2}} f\left(a_{1}, a_{2}\right) \cdot g\left(x-a_{1}, y-a_{2}\right)
$$

　　不管连续定义还是离散定义都有一个特征：

<p align="center">
<img src="/img/media/15649932452765.jpg" width="">
</p>



　　我们令 $x=\tau$，$y=n-\tau$，那么 $x+y=n$ 就是 $n$ 取不同值的一堆直线。
![](/img/media/15650112051251.jpg)


![](/img/media/15650111981321.jpg)

![](/img/media/15650112140134.jpg)

![](/img/media/15650112232722.jpg)


　　卷积的重要的物理意义是：一个函数（如：单位响应）在另一个函数（如：输入信号）上的**加权叠加**。

　　对卷积这个名词的理解：所谓两个函数的卷积，本质上就是先将一个函数翻转，然后进行滑动叠加。在连续情况下，叠加指的是对两个函数的乘积求积分，在离散情况下就是加权求和，为简单起见就统一称为叠加。

卷积的“卷”，指的的函数的翻转，从 g(t) 变成 g(-t) 的这个过程；同时，“卷”还有滑动的意味在里面（吸取了网友李文清的建议）。如果把卷积翻译为“褶积”，那么这个“褶”字就只有翻转的含义了。

卷积的“积”，指的是积分/加权求和。

对卷积的意义的理解：
1. 从“积”的过程可以看到，我们得到的叠加值，是个全局的概念。以信号分析为例，卷积的结果是不仅跟当前时刻输入信号的响应值有关，也跟过去所有时刻输入信号的响应都有关系，考虑了对过去的所有输入的效果的累积。在图像处理的中，卷积处理的结果，其实就是把每个像素周边的，甚至是整个图像的像素都考虑进来，对当前像素进行某种加权处理。所以说，“积”是全局概念，或者说是一种“混合”，把两个函数在时间或者空间上进行混合。
2. 那为什么要进行“卷”？直接相乘不好吗？我的理解，进行“卷”（翻转）的目的其实是施加一种约束，它指定了在“积”的时候以什么为参照。在信号分析的场景，它指定了在哪个特定时间点的前后进行“积”，在空间分析的场景，它指定了在哪个位置的周边进行累积处理。


　　卷积层主要进行卷积计算从而进行特征提取，通过使用输入数据中的小方块来学习图像特征，卷积保留了像素间的空间关系。卷积操作有三个重要思想，分别是**稀疏交互**、**参数共享**和**等变表示**。

<p align="center">
<img src="/img/media/15547073032659.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">卷积计算过程</em>
</p>

怎么做[前向后向传播](https://zhuanlan.zhihu.com/p/41392664)？


对于图像而言，离散卷积的计算过程是模板翻转，然后在原图像上滑动模板，把对应位置上的元素相乘后加起来，得到最终的结果。如果不考虑翻转，这个滑动-相乘-叠加的过程就是相关操作。事实上我也一直用相关来理解卷积。在时域内可以从两个角度来理解这样做的含义。

一种是滤波，比如最简单的高斯模板，就是把模板内像素乘以不同的权值然后加起来作为模板的中心像素值，如果模板取值全为1，就是滑动平均；如果模板取值为高斯，就是加权滑动平均，权重是中间高，四周低，在频率上理解就是低通滤波器；如果模板取值为一些边缘检测的模板，结果就是模板左边的像素减右边的像素，或者右边的减左边的，得到的就是图像梯度，方向不同代表不同方向的边缘；

另一种理解是投影，因为当前模板内部图像和模板的相乘累加操作就是图像局部patch和模板的内积操作，如果把patch和模板拉直，拉直的向量看成是向量空间中的向量，那么这个过程就是patch向模板方向上的投影，一幅图像和一个模板卷积，得到的结果就是图像各个patch在这个方向上的response map或者feature map；如果这样的模板有一组，我们可以把这一组看成一组基，得到的一组feature map就是原图像在这组基上的投影。常见的如用一组Garbor滤波器提取图像的特征，以及卷积神经网络中的第一层，图像在各个卷积核上的投影。


tensorflow中的卷积，严格上来说是cross-correlation，而不是卷积。因为在计算的过程中，没有对filter进行翻转，而严格的卷积计算是需要对filter进行翻转的

然而 Deep CNN 对于其他任务还有一些致命性的缺陷。较为著名的是 up-sampling 和 pooling layer 的设计。这个在 Hinton 的演讲里也一直提到过。主要问题有：

1. Up-sampling / pooling layer (e.g. bilinear interpolation) is deterministic. (a.k.a. not learnable)
2. 内部数据结构丢失；空间层级化信息丢失。
3. 小物体信息无法重建 (假设有四个pooling layer 则 任何小于 2^4 = 16 pixel 的物体信息将理论上无法重建。)

## References
5. [CNN 入门讲解：什么是卷积（Convolution）?](https://zhuanlan.zhihu.com/p/30994790)
6. [如何通俗地理解卷积？](https://www.matongxue.com/madocs/32.html)
7. [Understanding Convolutions](http://colah.github.io/posts/2014-07-Understanding-Convolutions/#fnref2)
8. [最容易理解的对卷积(convolution)的解释](https://blog.csdn.net/bitcarmanlee/article/details/54729807)
9. [如何通俗易懂地解释卷积？ - palet的回答 - 知乎](https://www.zhihu.com/question/22298352/answer/637156871)
10. [如何通俗易懂地解释卷积？ - 张俊博的回答 - 知乎](https://www.zhihu.com/question/22298352/answer/34267457)
11. [如何理解空洞卷积（dilated convolution）？ - 刘诗昆的回答 - 知乎](https://www.zhihu.com/question/54149221/answer/323880412)
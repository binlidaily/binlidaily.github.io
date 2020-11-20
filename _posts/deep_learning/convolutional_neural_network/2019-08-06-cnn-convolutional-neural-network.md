---
layout: post
title: Convolutional Neural Network
subtitle: 卷积层
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

{% include toc.html %}


## 1. 卷积概念
　　卷积神经网络学得到是局部的、平移不变的特征。


## 2. 卷积层
　　一副图像在经过卷积操作后得到结果称为特征映射/特征图（Feature Map）。

　　将卷积层之前我们先了解一下什么是卷积，卷积是对两个实变函数的数学运算，我们称 $(f*g)(n)$ 为 $f$、$g$ 的卷积。其连续定义为：

$$
(f * g)(n)=\int_{-\infty}^{\infty} f(\tau) g(n-\tau) d \tau
$$

　　对应的离散定义为：

$$
(f * g)(n)=\sum_{\tau=-\infty}^{\infty} f(\tau) g(n-\tau)
$$

　　先对 $g$ 函数进行翻转，相当于在数轴上把g函数从右边褶到左边去，也就是卷积的“卷”的由来。然后再把g函数平移到n，在这个位置对两个函数的对应点相乘，然后相加，这个过程是卷积的“积”的过程。

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


　　卷积神经网络（Vanilla Neural Networks / Convolutional Neural Network, CNN）采用三种基本概念：局部感受野（Local Receptive Fields），共享权重（Shared Weights）和池化（Pooling）。三个重要网络层的作用：卷积层负责提取特征，采样层负责特征选择，全连接层负责分类。

　　局部感受野就是利用卷积框提取特征的局部。每一个局部位置对应同一隐层的一个神经元（计算操作）。

　　共享权重说的是同一层的同一个特征映射用的是同一组权值和偏置。

　　使⽤卷积层的平移不变性似乎很可能减少全连接模型中达到同样性能的参数数量，使得训练更快，有助于建设深度网络。

## 知识点总结
### Image preprocessing
#### 为什么要引 入Image mean subtraction？
If your data is stationary (i.e., the statistics for each data dimension follow the same distribution), then you might want to consider subtracting the mean-value for each example (computed per-example).

Example: In images, this normalization has the property of removing the average brightness (intensity) of the data point. In many cases, we are not interested in the illumination conditions of the image, but more so in the content; removing the average pixel value per data point makes sense here. Note: While this method is generally used for images, one might want to take more care when applying this to color images. In particular, the stationarity property does not generally apply across pixels in different color channels.

也就是说当光线亮度变化不是很有重要的话，通过将去平均值可以减少光线的影响，然而需要注意的是如果是有颜色的数据需要注意，稳态特性不能再不同颜色通道交叉使用。

#### Why convert to grayscale from color?
对于一些边界检测等算法，不需要RGB特征，所以可以将图片灰度化，这样能减少到三通道的三分之一的计算量，很值。

#### Why normalize data before training?
　　一般在训练模型之前都要对数据进行标准化，用下面的式子使得所有数据具有 zero mean, unit variance（零均值，单位方差）。

$$X_{norm}={X-X_{min}\over{X_{man}-X_{min}}}$$

　　灰度图的$X_{min}$就是0，$X_{max}$是255，$X_{norm}$则介于0到1之间。标准化的好处有两点：
* 有的特征数据比较大，这样会使得小数值的特征很难再特征中起到作用
* 许多学习算法对标准化之后的数据能达到比较好的效果

### TensorFlow
#### 为什么在写代码时要加入tf.name_scope？
主要考虑的是变量共享，通过tf.name_scope定义了一个共享变量的scope，[详见](https://stackoverflow.com/questions/42708989/why-do-we-use-tf-name-scope)。

#### tf.truncated_normal 干嘛用?
Outputs random values from a truncated normal distribution.

The generated values follow a normal distribution with specified mean and standard deviation, except that values whose magnitude is more than 2 standard deviations from the mean are dropped and re-picked.

## 涉及的工具库总结
### python 库
#### [glob](https://docs.python.org/2/library/glob.html)
Unix style pathname pattern expansion，主要是用来匹配路径名的一个库。

####  tf.nn.avg_pool, tf.nn.max_pool, tf.nn.conv2d 中`strides`的四个参数各表示什么？
If the input tensor has 4 dimensions:  [batch, height, width, channels], then the convolution operates on a 2D window on the height, width dimensions.

`strides` determines how much the window shifts by in each of the dimensions. The typical use sets the first (the batch) and last (the depth) stride to 1.

具体可[参考](https://stackoverflow.com/questions/34642595/tensorflow-strides-argument)。

#### [batch, height, width, channel] size 要怎么算？
```python
# conv1
with tf.name_scope('conv1_1') as scope:
    kernel = weight_variable([3, 3, 3, 64])
    biases = bias_variable([64])
    output_conv1_1 = tf.nn.relu(conv2d(x, kernel) + biases, name=scope)

with tf.name_scope('conv1_2') as scope:
    kernel = weight_variable([3, 3, 64, 64])
    biases = bias_variable([64])
    output_conv1_2 = tf.nn.relu(conv2d(output_conv1_1, kernel) + biases, name=scope)
```
　　如上面代码片段，第一层的卷积层和第二层的width大小变化了，输入的大小是[3, 3, 3, 64]，conv_layer的设置是[1, 1, 1, 1]。


## 1. Convolutional Layers
* 输入图片大小 W×W
* Filter大小 F×F
* 步长 S
* padding的像素数 P

$$
N = \left\lfloor(W − F + 2P )/S+1 \right \rfloor
$$

　　这里加的 1 是表示原地的自己，比如说序列 $[1, 9]$ 一共多少个数的计算方法是 $9 - 1 + 1$，要记得 1 或者 9 那个数算上。


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
3. [CNN入门讲解：什么是采样层（pooling）](https://zhuanlan.zhihu.com/p/32299939)
4. [CNN 入门讲解：什么是卷积（Convolution）?](https://zhuanlan.zhihu.com/p/30994790)
5. [如何通俗地理解卷积？](https://www.matongxue.com/madocs/32.html)
6. [Understanding Convolutions](http://colah.github.io/posts/2014-07-Understanding-Convolutions/#fnref2)
7. [最容易理解的对卷积(convolution)的解释](https://blog.csdn.net/bitcarmanlee/article/details/54729807)
8. [如何通俗易懂地解释卷积？ - palet的回答 - 知乎](https://www.zhihu.com/question/22298352/answer/637156871)
9. [如何通俗易懂地解释卷积？ - 张俊博的回答 - 知乎](https://www.zhihu.com/question/22298352/answer/34267457)
10. [如何理解空洞卷积（dilated convolution）？ - 刘诗昆的回答 - 知乎](https://www.zhihu.com/question/54149221/answer/323880412)
11. [Understanding max-pooling and loss of information](https://stats.stackexchange.com/questions/245365/understanding-max-pooling-and-loss-of-information)
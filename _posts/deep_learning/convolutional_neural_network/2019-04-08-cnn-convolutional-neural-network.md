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

$$N = \left\lfloor(W − F + 2P )/S+1 \right \rfloor$$

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

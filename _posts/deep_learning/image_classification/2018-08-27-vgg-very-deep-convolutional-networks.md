---
layout: post
title: Very Deep Convolutional Networks
author: Bin Li
tags: [Deep Learning, Image Classification]
image: 
comments: true
published: true
---

特点：
1. 卷积层均采用相同的卷积核参数
2. 池化层均采用相同的池化核参数
3. 模型是由若干卷积层和池化层堆叠（stack）的方式构成，比较容易形成较深的网络结构（在2014年，16层已经被认为很深了）


<p align="center">
<img src="/img/media/15847104015793.jpg" width="450">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">5x5 等价于两个 3x3</em>
</p>



## 总结
VGG 优点：
1. VGG 的结构非常简洁，整个网络都使用了同样大小的卷积核尺寸（3x3）和最大池化尺寸（2x2）
2. 几个小滤波器（3x3）卷积层的组合比一个大滤波器（5x5或7x7）卷积层好
3. 验证了通过不断加深网络结构可以提升性能

VGG 缺点：
1. VGG耗费更多计算资源，并且使用了更多的参数，导致更多的内存占用（140M）。其中绝大多数的参数都是来自于第一个全连接层。并且单纯的增加神经网络的深度，会给训练带来困难，会出现梯度消失、不收敛等问题。

## References
1. [Tensorflow VGG16 and VGG19](https://github.com/machrisaa/tensorflow-vgg)
2. [tensorflow-vgg16-train-and-test](https://github.com/ppplinday/tensorflow-vgg16-train-and-test)
3. [TensorFlow VGG-16 pre-trained model](https://github.com/ry/tensorflow-vgg16)
4. [Data Preprocessing in UFLDL Tutorial](http://ufldl.stanford.edu/wiki/index.php/Data_Preprocessing)
5. [Image Processing Tips Example Code](https://github.com/kharikri/Image-Processing-Tips/blob/master/Image%20Processing%20Tips%20Example%20Code.ipynb)
6. [Re-implementation of VGG Network in tensorflow](https://github.com/huyng/tensorflow-vgg)
7. ✳️ [An easy implement of VGG19 with tensorflow, which has a detailed explanation.](https://github.com/hjptriplebee/VGG19_with_tensorflow)
8. [conversation of caffe vgg16 model to tensorflow](https://github.com/ry/tensorflow-vgg16)
9. ✳️ [Implementing VGG13 for MNIST dataset in TensorFlow](https://medium.com/@amir_hf8/implementing-vgg13-for-mnist-dataset-in-tensorflow-abc1460e2b93)
10. [利用卷积神经网络(VGG19)实现火灾分类(附tensorflow代码及训练集)](http://www.cnblogs.com/vipyoumay/p/7884472.html)
11. [A TensorFlow implementation of VGG networks for image classification](https://github.com/conan7882/VGG-cifar-tf)
12. [Very Deep Convolutional Networks for Large-Scale Image Recognition](https://arxiv.org/abs/1409.1556)
13. [Implementing VGG13 for MNIST dataset in TensorFlow](https://medium.com/@amir_hf8/implementing-vgg13-for-mnist-dataset-in-tensorflow-abc1460e2b93)
14. [VGG16学习笔记](http://deanhan.com/2018/07/26/vgg16/)
15. [深度学习VGG模型核心拆解](https://cloud.tencent.com/developer/article/1039763)
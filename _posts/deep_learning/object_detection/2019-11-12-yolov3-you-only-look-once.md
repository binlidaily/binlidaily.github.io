---
layout: post
title: You Only Look Once
subtitle: v3
author: Bin Li
tags: [Deep Learning, Object Detection]
comments: true
published: true
---

　　YOLOv3 在 YOLOv2 的基础上进一步做了优化，使之成为目标检测界非常重要的算法，也是目前业界最常用的目标检测算法之一。

## 1. YOLOv3 的改进
　　YOLOv3 在分类预测、边框检测和损失函数，以及网络结构上都做了优化。

### 1.1 分类预测
　　采用多类标（multi label）分类，一个对象的 label 可能同时是行人和孩子，所以累加的概率结果不一定是 1 了。在计算概率的时候，不在采用 softmax，而是采用了独立的 logistic 分类器去计算输入内容属于特定类的可能性。而且在训练的时候，对于类的预测，采用了二元交叉熵损失。

### 1.2 边界框检测和损失函数计算
　　YOLOv3 采用逻辑回归计算每个边界框的框置信度，并且还修改了计算损失函数的方式。如果先验框（锚框）与 Ground Truth 真实对象的重叠程度大于其他先验框，则其框置信度应为 1。对于重叠程度大于预定义阈值（默认值为0.5）的其他先验框，则损失为0。每个 Ground Truth 物体仅与一个边界框相关联。如果一个先验框没有关联物体，则不会导致分类和定位丢失，而只会产生置信度损失。 我们使用tx和ty（而不是bx和by）来计算损失。YOLOv3 使用 $t_x$ 和 $t_y$ 而非 $b_x$ 和 $b_y$ 来计算损失。


### 1.3 特征金字塔网络（Feature Pyramid Networks）
　　YOLOv3 对于每一个位置预测三个结果，每一个预测结果包括一个边界框，一个物体，和 $80$ 个类预测概率，也就是 $N\times N \times [3 \times (4+1+80)]$ 个预测值。

　　YOLOv3 在三个不同的尺度下进行预测：
1. 在最后一层的 feature map 上进行一次预测
2. 在往前两层的位置，先用 2 上采样，YOLOv3 用该位置上更高分辨率的 feature map 和上采样的 feature map 进行 element-wise 的加和。
3. 重复一遍第 2 步，得到的特征图层会有更高 level 的结构（语义 semantic）信息以及对于物体定位来说更好的空间信息。

　　为了决定先验框个数，YOLOv3 也是采用 k-means 聚类。结果预选了 9 个簇，即 9 个先验框，被分成 3 个组，对应分到上面 3 个尺度下。

![The-framework-of-YOLOv3-neural-network-for-ship-detection](/img/media/The-framework-of-YOLOv3-neural-network-for-ship-detection.jpg)

![](/img/media/15828111582496.jpg)



### 1.4 特征提取器（Feature Extractor）
　　用的新的 53 层的 Darknet-53 来提取特征，代替了原来在 YOLOv1 和 YOLOv2 中的 Darknet-19 层结构。

![](/img/media/15735592302030.jpg)

　　Darknet-53 主要主要由 $3\times3$ 和 $1\times1$ 卷积层组成，并采用了类似 ResNet 中的 shortcut 连接做加和。 与 ResNet-152 相比，Darknet-53 具有更少的 BFLOP（十亿浮点运算），但以 2 倍的速度实现了相同的分类精度。真是 Dark！


## 性能
![](/img/media/15735602763567.jpg)

　　YOLOv3 在速度上还是很喜人的。


## References
1. [YOLOv1 Paper](/assets/YOLOv1.pdf)
2. [YOLOv2 Paper](/assets/YOLOv2.pdf)
3. [YOLOv3 Paper](/assets/YOLOv3.pdf)
4. [Yolov3 Keras 版本从零到壹跑模型](https://blog.csdn.net/qq_39622065/article/details/86174142)
5. [Real-time Object Detection with YOLO, YOLOv2 and now YOLOv3](https://medium.com/@jonathan_hui/real-time-object-detection-with-yolo-yolov2-28b1b93e2088)
6. [What’s new in YOLO v3?](https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b)
7. [A Closer Look at YOLOv3](https://www.cyberailab.com/post/a-closer-look-at-yolov3)
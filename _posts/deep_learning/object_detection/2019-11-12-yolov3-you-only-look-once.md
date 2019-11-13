---
layout: post
title: You Only Look Once
subtitle: v3
author: Bin Li
tags: [Deep Learning, Object Detection]
comments: true
published: true
---

　　YOLOv3 进一步做了优化。

## 1. YOLOv3 的改进
### 1.1 分类预测
　　采用多类标分类，一个对象的 label 可能同时是行人和孩子，所以累加的概率结果不一定是 1 了。在计算概率的时候，不在采用 softmax，而是采用了独立的 logistic 分类器去计算输入内容属于特定类的可能性。

### 1.2 边界框检测和损失函数计算
　　YOLOv3 采用逻辑回归计算每个边界框的 objectness score。对于损失函数计算也对应做了修改。

### 1.3 特征金字塔网络（Feature Pyramid Networks）
　　YOLOv3 对于每一个位置预测三个结果，每一个预测结果包括一个边界框，一个物体，和 80 个类预测概率，也就是 $N\times N \times [3 \times (4+1+80)]$ 个预测值。

　　YOLOv3 在三个不同的尺度下进行预测：
1. 在最后一层的特征图上进行预测
2. 往前两层的位置，用 2 上采样。YOLOv3 然后用一个更高分辨率的特征图和上采样的特征图进行 element-wise 的加和。
3. 重复一遍第 2 步，得到的特征图层会有更高 level 的结构（语义 semantic）信息以及对于物体定位来说更好的空间信息。

　　为了决定先验框，YOLOv3 也是采用 k-means 聚类。预选了 9 个簇即 9 个先验框，被分成 3 个组，对应分到上面 3 个尺度下。

### 1.4 特征提取器（Feature Extractor）
　　用的新的 53 层的 Darknet-53 来提取特征：

![](/img/media/15735592302030.jpg)

## 性能
![](/img/media/15735602763567.jpg)

　　YOLOv3 在速度上还是很喜人的。






## References
1. [YOLOv1 Paper](/assets/YOLOv1.pdf)
2. [YOLOv2 Paper](/assets/YOLOv2.pdf)
3. [YOLOv3 Paper](/assets/YOLOv3.pdf)
4. [Yolov3 Keras 版本从零到壹跑模型](https://blog.csdn.net/qq_39622065/article/details/86174142)
6. [Real-time Object Detection with YOLO, YOLOv2 and now YOLOv3](https://medium.com/@jonathan_hui/real-time-object-detection-with-yolo-yolov2-28b1b93e2088)


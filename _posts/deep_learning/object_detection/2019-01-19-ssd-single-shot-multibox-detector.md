---
layout: post
title: Single Shot Multibox Detector
subtitle:
author: Bin Li
tags: [Machine Learning, Object Detection]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　Single Shot MultiBox Detector (SSD)，是 Wei Liu 在 ECCV 2016 上提出的一种目标检测算法，截至目前是主要的检测框架之一，相比 Faster RCNN 有明显的速度优势，相比 YOLO 又有明显的 mAP 优势（不过已经被 CVPR 2017 的 YOLO9000 超越）。

![总结](/img/media/15541000730952.jpg)

SSD 具有以下特点：

* 从 YOLO 中继承了将 Detection 转化为 Regression 的思路，一次完成目标定位与分类 (classification+bounding box regression，One Stage)。
* 基于 Faster RCNN 中的 Anchor，提出了相似的 Prior Box。
* 加入基于特征金字塔（Pyramidal Feature Hierarchy）的检测方式，即在不同感受野的 feature map 上预测目标。

注意：

* **SSD 使用感受野小的 feature map 检测小目标，使用感受野大的feature map检测更大目标**。

![](/img/media/15541023500828.jpg)

　　SSD 的网络结构是在 VGG 的基础之上搭建的，从不同的卷积层提取出 feature map 直接连接到损失输出层。不同大小的每一个 feature map 被分成 mxn 个 cell，每个 cell 有默认 k 个 default boxes，最后的 predic box 与default box 有 4 个 offset，并为每个 predict box 计算 c 个类的值。最后产生了 $(c+4)kmn$ 个值。


![](/img/media/15614581132951.jpg)


## 训练目标
![](/img/media/15614598322939.jpg)

真实边界框相对锚框的偏移量，简称偏移量（offset）

smooth L1 loss and cross entropy loss can be used for regression and classification. Regression outputs are offset with anchor box locations using the following formulae

```
t_{x} = (x - x_{a})/w_{a}
t_{y} = (y - y_{a})/h_{a}
t_{w} = log(w/ w_a)
t_{h} = log(h/ h_a)
```

x, y , w, h are the ground truth box center co-ordinates, width and height. x_a, y_a, h_a and w_a and anchor boxes center cooridinates, width and height.

### 1. 不同尺度的特征图来检测

SSD 提取了不同尺度的特征图来做检测，大尺度特征图（较靠前的特征图）可以用来检测小物体（如上图所示，因为粒度比较小，先验框框到的范围比较小），而小尺度特征图（较靠后的特征图）用来检测大物体；

### 2. 采用卷积进行检测
![](/img/media/15614635540499.jpg)

![](/img/media/15547121194752.jpg)

SSD 直接采用卷积对不同的特征图来进行提取检测结果。对于形状为 $m\times n \times p$ 的特征图，只需要采用 $3\times 3 \times p$ 这样比较小的卷积核得到检测值。

### 3. 设置先验框
![](/img/media/15547129370535.jpg)

cell 有特定大小的像素矩阵组成。

SSD 对背景也做了处理，所以在设定类别数时要加 1。

每一个 feature map 的 default box 的尺寸大小是不同的。

## Q&A

* 为什么要有图片大小限制？300x300？那么对于图片超过这个规格的怎么处理？
* 每一个 feature map 需要同时做分类和回归？
* 非最大化抑制是什么？


## References
1. [SSD: Single Shot MultiBox Detector](https://arxiv.org/abs/1512.02325)
2. [SSD 手写代码](https://github.com/xiaohu2015/DeepLearning_tutorials/tree/master/ObjectDetections/SSD)
3. [目标检测 - SSD原理与实现](https://zhuanlan.zhihu.com/p/33544892)
4. [SSD 目标检测](https://zhuanlan.zhihu.com/p/31427288)
5. [目标检测：SSD](https://zhuanlan.zhihu.com/p/42159963)
6. [Object Detection](https://handong1587.github.io/deep_learning/2015/10/09/object-detection.html)
7. [论文阅读：SSD: Single Shot MultiBox Detector](https://blog.csdn.net/u010167269/article/details/52563573)
8. [SSD 论文](/assets/SSD-Single-Shot-MultiBox-Detector.pdf)
9. [SSD深入理解](http://shartoo.github.io/SSD_detail/)
10. [R-CNN & Fast R-CNN & Faster R-CNN](http://cs.unc.edu/~zhenni/blog/notes/R-CNN.html)
11. [SSD object detection: Single Shot MultiBox Detector for real-time processing](https://medium.com/@jonathan_hui/ssd-object-detection-single-shot-multibox-detector-for-real-time-processing-9bd8deac0e06)
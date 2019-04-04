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
    
SSD，全称 Single Shot MultiBox Detector，是 Wei Liu 在 ECCV 2016 上提出的一种目标检测算法，截至目前是主要的检测框架之一，相比 Faster RCNN 有明显的速度优势，相比 YOLO 又有明显的 mAP 优势（不过已经被CVPR 2017 的 YOLO9000 超越）。

![总结](/img/media/15541000730952.jpg)

SSD 具有以下特点：

* 从 YOLO 中继承了将 Detection 转化为 Regression 的思路，一次完成目标定位与分类 (classification+bounding box regression，One Stage)。
* 基于 Faster RCNN 中的 Anchor，提出了相似的 Prior Box。
* 加入基于特征金字塔（Pyramidal Feature Hierarchy）的检测方式，即在不同感受野的 feature map 上预测目标。

注意：

* **SSD使用感受野小的feature map检测小目标，使用感受野大的feature map检测更大目标**。

![](/img/media/15541023500828.jpg)



## References
1. [SSD: Single Shot MultiBox Detector](https://arxiv.org/abs/1512.02325)
2. [SSD 手写代码](https://github.com/xiaohu2015/DeepLearning_tutorials/tree/master/ObjectDetections/SSD)
3. [目标检测|SSD原理与实现](https://zhuanlan.zhihu.com/p/33544892)
4. [SSD 目标检测](https://zhuanlan.zhihu.com/p/31427288)
5. [目标检测：SSD](https://zhuanlan.zhihu.com/p/42159963)
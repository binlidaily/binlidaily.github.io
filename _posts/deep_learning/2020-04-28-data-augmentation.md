---
layout: post
title: Data Augmentation
subtitle: 数据增强
author: Bin Li
tags: [Deep Learning]
comments: true
published: true
---

　　数据增强的意义是提高训练数据的多样性，使得模型能够在不同环境条件下都有较高的鲁棒性。

具体操作有：
* 光度变形（Photometric Distortions）
    * 随机亮度（Random Brightness）
    * 随机对比度，色调和饱和度（Random Contrast, Hue, Saturation）
    * 随机光噪声（Random Lighting Noise）
* 几何变形（Geometric Distortions）
    * 随机扩展（Random Expand）
    * 随机缩放（Random Scaling）
    * 随机裁剪（Random Cropping）
    * 随机翻转（Random Mirror/Flipping）
    * 随机旋转（Random Rotating）

　　以上数据增强的方法都是逐像素（pixel-wise）级别的调整，调整区域的原始像素信息都被完整保留。

　　另外的一些数据增强的办法是尝试模拟增加一些遮挡情况。
![-w868](/img/media/15880509258623.jpg)


# References
1. [SSD中的数据增强细节](https://nicehuster.github.io/2019/05/11/ssd-dataaug/)
---
layout: post
title: Meter Reading Recognition
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

本文记录一下做仪表识别的一些尝试过程，刚开始用过最基础的识别指针和圆，但是效果不鲁棒，于是尝试使用目标检测的方法来做。

## 计算机几何学方式（检测线段和圆）

## 计算机视觉-目标检测的方法
### SSD
TensorFlow 版本在 Github 上有[实现版本](https://github.com/balancap/SSD-Tensorflow)，具体的实践记录[在此](https://binlidaily.github.io/2018-09-29-single-shot-multibox-detector/)。

### RCNN
因为 SSD 的效果不是很好，尝试使用一下 RCNN，github 上也有 TensorFlow [版本](https://github.com/endernewton/tf-faster-rcnn)。

## References
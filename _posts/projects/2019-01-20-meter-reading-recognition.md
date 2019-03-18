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
目前有现成的一些项目用来测试一下，比如 Intel 就提供了一个开源的给予 OpenCV 的[项目](https://github.com/intel-iot-devkit/python-cv-samples/tree/master/examples/analog-gauge-reader)，尝试之后发现用在当前的项目效果较差，因为二值化之后图片基本上看不见了，无法做下一步的识别线段和圆的操作。

## 计算机视觉-目标检测的方法
### SSD
TensorFlow 版本在 Github 上有[实现版本](https://github.com/balancap/SSD-Tensorflow)，具体的实践记录[在此](https://binlidaily.github.io/2018-09-29-single-shot-multibox-detector/)，理论学习记录。

### RCNN
因为 SSD 的效果不是很好，尝试使用一下 RCNN，github 上也有 TensorFlow [版本](https://github.com/endernewton/tf-faster-rcnn)。

## References
1. [Analog Gauge Reader](https://github.com/intel-iot-devkit/python-cv-samples/tree/master/examples/analog-gauge-reader)
2. [Deep Gauge](https://github.com/oci-labs/deep-gauge)
3. [SSD TensorFlow](https://binlidaily.github.io/2018-09-29-single-shot-multibox-detector/)
4. [A water meter reader](https://github.com/yamaton/water-meter-reading)
5. [Water meter reader - Convert analog dials into a digital value](https://github.com/zagor/watermeter)
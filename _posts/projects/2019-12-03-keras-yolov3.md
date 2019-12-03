---
layout: post
title: Keras YOLOv3
subtitle:
author: Bin Li
tags: [Computer Vision]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　实践版本的 YOLOv3 采用 [Keras 版本](https://github.com/qqwweee/keras-yolo3) 。

`VOCdevkit/VOC2007/` 文件夹结构：
* Annotations/
* ImageSets/（放划分后的文件索引，txt 文件）
    * Main/
        * train.txt ...
* JPEGImages/（放 jpg 图片文件）
* SegmentationClass/
* SegmentationObject/



## References
1. [keras-yolo3](https://github.com/qqwweee/keras-yolo3)
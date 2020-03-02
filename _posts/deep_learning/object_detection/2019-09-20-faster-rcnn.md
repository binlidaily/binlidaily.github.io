---
layout: post
title: Faster RCNN
subtitle: 
author: "Bin Li"
tags: [Deep Learning]
comments: true
published: true
---

　　Faster RCNN 是 Fast RCNN 的优化版本，二者主要的不同在于感兴趣区域的生成方法，Fast RCNN 使用的是选择性搜索，而 Faster RCNN 用的是 Region Proposal网络（RPN）。RPN 将图像特征映射作为输入，生成一系列 object proposals，每个都带有相应的分数。

![](/img/media/15829570707913.jpg)


　　下面是Faster RCNN工作的大致过程：
1. 输入图像到卷积网络中，生成该图像的特征映射。
2. 在特征映射上应用Region Proposal Network，返回object proposals和相应分数。
3. 应用Rol池化层，将所有proposals修正到同样尺寸。
4. 最后，将proposals传递到完全连接层，生成目标物体的边界框。

　　那么Region Proposal Network具体是如何工作的呢？首先，将CNN中得来的特征映射输入到Faster RCNN中，然后将其传递到Region Proposal Network中。RPN会在这些特征映射上使用一个滑动窗口，每个窗口会生成具有不同形状和尺寸的k个anchor box：

![](/img/media/15829572428574.jpg)

　　Anchor boxes是固定尺寸的边界框，它们有不同的形状和大小。对每个anchor，RPN都会预测两点：
1. 首先是anchor就是目标物体的概率（不考虑类别）
2. 第二个就是anchor经过调整能更合适目标物体的边界框回归量

　　现在我们有了不同形状、尺寸的边界框，将它们传递到Rol池化层中。经过RPN的处理，proposals可能没有所述的类别。我们可以对每个proposal进行切割，让它们都含有目标物体。这就是Rol池化层的作用。它为每个anchor提取固定尺寸的特征映射：

![](/img/media/15829573528867.jpg)

　　之后，这些特征映射会传递到完全连接层，对目标进行分类并预测边界框。

## 总结
　　目前为止，我们所讨论的所有目标检测算法都用区域来辨别目标物体。网络并非一次性浏览所有图像，而是关注图像的多个部分。这就会出现两个问题：

* 算法需要让图像经过多个步骤才能提取出所有目标
* 由于有多个步骤嵌套，系统的表现常常取决于前面步骤的表现水平


## References
1. [Pytorch Code](https://github.com/rbgirshick/py-faster-rcnn)
2. [What do we learn from region based object detectors (Faster R-CNN, R-FCN, FPN)?](https://medium.com/@jonathan_hui/what-do-we-learn-from-region-based-object-detectors-faster-r-cnn-r-fcn-fpn-7e354377a7c9)
3. [Understanding Feature Pyramid Networks for object detection (FPN)](https://medium.com/@jonathan_hui/understanding-feature-pyramid-networks-for-object-detection-fpn-45b227b9106c)
4. [基础目标检测算法介绍（一）：CNN、RCNN、Fast RCNN和Faster RCNN](https://zhuanlan.zhihu.com/p/46963225)
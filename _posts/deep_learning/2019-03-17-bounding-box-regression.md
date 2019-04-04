---
layout: post
title: Bounding Box Regression
subtitle:
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

在目标检测任务一个重要的任务是如何得到一个框得很合适的 Bounding Box？我们这里介绍一种叫做 Bounding Box Regression 的方法。首先我们给出这样的一幅图：

![image-20190318212853845](/img/media/image-20190318212853845.png)

* 黄色框 T 表示真实框(Ground Truth)
* 白色框 P 表示边界框(Bounding Box)
* 红色框 G 表示 P 经过边框回归后得到的预测框

所谓边框回归就是指边界框 P 经过调整成为预测框的过程。

每个边框的 location 为 $(x, y , w, h)$ 分别表示为中心坐标以及宽、高，P，T，G三个框分别表示为： $p=(b^{x},b^{y},b^{w},b^{h}) $、$ t=(t^{x},t^{y},t^{w},t^{h})$ 、 $g=(g^{x},g^{y},g^{w},g^{h})$ ,边框回归也就是要找到一个函数使得 $f(p)=g$。

P 如何变成 G？以此为例，让 P 尺度扩张然后再往左移动（尺度缩放和平移操作），首先看尺度缩放，当然不能随便同比例缩放宽和高，可以利用下面的扩张方法，为什么要用 log 需要看回论文！🤔：
$$
\Delta w=log({t^{w}\over{b^{w}}})
$$

$$
\Delta h=log({t^{h}\over{b^{h}}})
$$


$\Delta w$ 和 $\Delta h$ 就是扩张比例，即 $g^{w}=b^{w}\Delta w$ 和 $g^{h}=b^{h}\Delta h$ ，这样 P 就经过尺度缩放变成了 G 相同大小。接下来进行平移：
$$
\Delta x={(t^{x}-b^{x})\over{b^{w}}}
$$

$$
\Delta y={(t^{y}-b^{y})\over{b^{h}}}
$$
$\Delta x​$ 和 $\Delta y​$  就是平移尺度，即 $g^{x}=b^{x}+\Delta x​$ 和 $g^{y}=b^{y}+\Delta y​$ ，经过这两步 P 就成为了 G。

在这里 $(\Delta x,\Delta y,\Delta w,\Delta h)$ 就是想要获得真实的预测框应该做的一次性操作，这个是相当于分类结果中的类标 $y$，因为我们知道真实框的位置，自然一下就知道该怎么缩放和平移。但是在做回归去找预测框的时候就只能一点一点的缩放和平移，我们假设这个一点一点缩放和平移的操作函数是 $h(p)$，那么我们想最后 $h(p)$ 的结果和 $(\Delta x,\Delta y,\Delta w,\Delta h)​$ 应该是尽可能一致的，于是我们就能得到如下的损失函数：
$$
J(p)=\sum_{i}^{N}{}((\Delta x,\Delta y,\Delta w,\Delta h)-h(p))^{2}
$$
当选择了一定的回归操作函数就可以利用梯度下降来求得结果了。

## IOU(Intersection over Union) 交并比

![n1AZj](/img/media/n1AZj.png)

IOU 用于测量真实和预测之间的相关度，相关度越高，该值越高。

## References

1. [目标检测：SSD](https://zhuanlan.zhihu.com/p/42159963)
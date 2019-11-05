---
layout: post
title: You Only Look Once
subtitle: 
author: Bin Li
tags: [Deep Learning]
comments: true
published: true
---

　　每一个 grid cell 只检测一个物体。导致一些位置比较靠近目标物检测时会漏检。

![-w1234](/img/media/15711246361131.jpg)


## Loss Function
　　整体的损失函数是这样，看起来非常恐怖，但是拆解看下来还是挺大胆的。
$$
\begin{aligned} \lambda_{\text {cord }} \sum_{i=0}^{S} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {doj }}\left[\left(x_{i}-\hat{x}_{i}\right)^{2}+\left(y_{i}-\hat{y}_{i}\right)^{2}\right] \\+\lambda_{\text {coord }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left[(\sqrt{w_{i}}-\sqrt{\hat{w}_{i}})^{2}+(\sqrt{h_{i}}-\sqrt{\hat{h}_{i}})^{2}\right] \\+\sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left(C_{i}-\hat{C}_{i}\right)^{2} \\+\lambda_{\text {noobj }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {Hoobj }}\left(C_{i}-\hat{C}_{i}\right)^{2} \\+\sum_{i=0}^{S^{2}} \mathbb{1}_{i}^{\text {doj }} \sum_{c \in \text { classes }}\left(p_{i}(c)-\hat{p}_{i}(c)\right)^{2} \end{aligned}
$$

### 1 Localization Loss 
　　定位损失用来衡量预测的预测框的位置的大小，这里只考虑负责检测对应物体的框的损失。

$$
\begin{array}{l}{\lambda_{\text {coord }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left[\left(x_{i}-\hat{x}_{i}\right)^{2}+\left(y_{i}-\hat{y}_{i}\right)^{2}\right]} \\ {\quad+\lambda_{\text {coord }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left[(\sqrt{w_{i}}-\sqrt{\hat{w}_{i}})^{2}+(\sqrt{h_{i}}-\sqrt{\hat{h}_{i}})^{2}\right]}\end{array}
$$

　　其中：
* 如果在第 i 个 cell 里面的第 j 个 boundary box 是用来检测对应物体的，那么有 $\mathbb{1} = 1$，否则为 $\mathbb{1} = 0$。
* $\lambda_{\text {coord}}$ 可以用来调节 boundary box coordinates 误差的关注度。

## References
1. [Paper](/asstes/YOLO-v1-You Only Look Once.pdf)
2. [Yolov3 Keras版本训练详细教程](https://blog.csdn.net/qq_39622065/article/details/86174142)
3. [目标检测算法之YOLO](https://zhuanlan.zhihu.com/p/38125721)
4. [Understanding YOLO](https://hackernoon.com/understanding-yolo-f5a74bbc7967)
5. [Real-time Object Detection with YOLO, YOLOv2 and now YOLOv3](https://medium.com/@jonathan_hui/real-time-object-detection-with-yolo-yolov2-28b1b93e2088)
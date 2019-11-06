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

<p align="center">
<img src="/img/media/15541000730952.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">各目标检测算法比较图</em>
</p>

SSD 具有以下特点：

* 从 YOLO 中继承了将 Detection 转化为 Regression 的思路，一次完成目标定位与分类 (classification+bounding box regression，One Stage)。
* 基于 Faster RCNN 中的 Anchor，提出了相似的 Prior Box。
* 加入基于特征金字塔（Pyramidal Feature Hierarchy）的检测方式，即在不同感受野的 feature map 上预测目标。
* 直接利用卷积进行检测

注意：

* **SSD 使用感受野小的 feature map 检测小目标，使用感受野大的feature map检测更大目标**。


<p align="center">
<img src="/img/media/15698355858687.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">SSD 和 YOLO 网络结构</em>
</p>

## 1. SSD 的提升点
### 1.1 采用多尺度特征图
　　如上图的网络结构，SSD 采用网络层中不同尺度的特征图，即能够在不同感受野的特征图上预测目标（定位和分类）。而 SSD 对于每一层特征图的每一个位置都采用了固定先验框的方式，那么在浅层的特征图中就能检测到相对较小的物体，深层的特征图检测相对较大的物体。

![](/img/media/15541023500828.jpg)


### 1.2 直接采用卷积进行定位和分类
![](/img/media/15614581132951.jpg)

　　SSD 的网络结构是在 VGG 的基础之上搭建的，从不同的卷积层提取出 feature map 直接连接到损失输出层。不同大小的每一个 feature map 被分成 $m\times n$ 个 cell，每个 cell 有默认 $k$ 个 default boxes，最后的 predict box 与default box 有 4 个 offset，并为每个 predict box 计算 $c$ 个类的值。最后产生了 $(c+4)kmn$ 个值。


```python
def ssd_multibox_layer(inputs,
                       num_classes,
                       sizes,
                       ratios=[1],
                       normalization=-1,
                       bn_normalization=False):
    """Construct a multibox layer, return a class and localization predictions.
    """
    net = inputs
    if normalization > 0:
        net = custom_layers.l2_normalization(net, scaling=True)
    # Number of anchors.
    num_anchors = len(sizes) + len(ratios)

    # Location.
    num_loc_pred = num_anchors * 4
    loc_pred = slim.conv2d(net, num_loc_pred, [3, 3], activation_fn=None,
                           scope='conv_loc')
    loc_pred = custom_layers.channel_to_last(loc_pred)
    loc_pred = tf.reshape(loc_pred,
                          tensor_shape(loc_pred, 4)[:-1]+[num_anchors, 4])
    # Class prediction.
    num_cls_pred = num_anchors * num_classes
    cls_pred = slim.conv2d(net, num_cls_pred, [3, 3], activation_fn=None,
                           scope='conv_cls')
    cls_pred = custom_layers.channel_to_last(cls_pred)
    cls_pred = tf.reshape(cls_pred,
                          tensor_shape(cls_pred, 4)[:-1]+[num_anchors, num_classes])
    return cls_pred, loc_pred
```
　　注意一下最后分类和回归的返回结果是一个三维的 Tensor，比如输出分类 cls_pred 结果大小为 `(batch, height, width, n_boxes*n_classes)`，reshape 之后为 `(batch, height*width*n_boxes, n_classes)`；类似的，对应位置 reshape 后的回归结果大小为 `(batch, height*width*n_boxes, 4)`。其实还有一个 Prior box 的结果大小为 `(batch, height*width*n_boxes, 8)`，这里 8 是因为除了 Prior box 的 4 个数值的初始坐标，还有对应的偏置（4 个 offsets）。

　　那么最后的结果是 `(batch, height*width*n_boxes, n_classes + 4 + 8)`，每一行的结果就是正好分类概率加上定位坐标和 Prior box 信息，这样就可以找配对得到 Pos 和 Neg，然后计算 Loss，对应的训练。

### 1.3 固定默认先验框
　　SSD 在不同的特征图中设定了不同的特征图个数，具体可以看网络结构图中有说明每层特征图对应的先验框个数。这样就大大提高了寻找先验框的效率，进而加速的训练过程。

<p align="center">
<img src="/img/media/15547129370535.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">SSD 默认先验框</em>
</p>


## 2. 训练目标
　　SSD 的训练目标函数参考了 [MultiBox](/assets/Multibox.pdf) 的形式，分成两个部分：

$$
L(x, c, l, g)=\frac{1}{N}\left(L_{c o n f}(x, c)+\alpha L_{l o c}(x, l, g)\right)
$$

　　其中：
* $x_{i j}^{p}=\\{1, 0\\}$ 表示类别为 $p$ 的第 $i$ 个先验框与第 $j$ 个真实框匹配指示结果，$\sum_{i} x_{i j}^{p} \geq 1$。
* $c$ 在这里为 classification 过程中卷积计算的结果，在 MultiBox 中这个为预测得分。
* $l$ 在这里为 localization 过程中卷积计算的结果，即定位的 offsets，位置信息。
* $g$ 为 ground truth，真实框的 offsets。

　　对 loss 的两个部分分开看，首先看框回归的部分：

$$
\begin{aligned} L_{l o c}(x, l, g)=\sum_{i \in P o s}^{N} \sum_{m \in\{c x, c y, w, h\}} & x_{i j}^{k} \text { smooth }_{\mathrm{L} 1}\left(l_{i}^{m}-\hat{g}_{j}^{m}\right) \\ \hat{g}_{j}^{c x}=\left(g_{j}^{c x}-d_{i}^{c x}\right) / d_{i}^{w} & \quad \hat{g}_{j}^{c y}=\left(g_{j}^{c y}-d_{i}^{c y}\right) / d_{i}^{h} \\ \hat{g}_{j}^{w}=\log \left(\frac{g_{j}^{w}}{d_{i}^{w}}\right) & \quad \hat{g}_{j}^{h}=\log \left(\frac{g_{j}^{h}}{d_{i}^{h}}\right) \end{aligned}
$$

　　主要采用了 Smooth L1 loss，相比于 MultiBox 的 L2 Loss，对异常值不敏感，且梯度变化较缓，训练时不会出现极速跌宕的情况。其中 $d$ 是默认先验框的 offsets。

　　loss 的第二部分是分类：

$$
L_{c o n f}(x, c)=-\sum_{i \in P o s}^{N} x_{i j}^{p} \log \left(\hat{c}_{i}^{p}\right)-\sum_{i \in N e g} \log \left(\hat{c}_{i}^{0}\right) \quad \text { where } \quad \hat{c}_{i}^{p}=\frac{\exp \left(c_{i}^{p}\right)}{\sum_{p} \exp \left(c_{i}^{p}\right)}
$$

　　跟 MultiBox 一样采用了交叉熵作为 loss，不同点是，不像 MultiBox 中 $c_i$ 直接采用预测得分，因为 SSD 直接将分类引入了，所以 SSD 采用了 Softmax Loss 来计算多类别的置信度（或者说得分）。其中上标 $0$ 表示背景。

## 3. SSD 论文一些其他的发现
1. 更多的默认框能够得到更好的效果，在速度上会有较大的影响。
2. MultiBox 应用在多个层上能得到更好的检测效果，因为提取到不同像素下的特征。
3. 80% 的训练时间在 VGG 上，所以如果基网络还有提升的空间。
4. SSD confuses objects with similar categories (e.g. animals). This is probably because locations are shared for multiple classes. ？？
5. SSD-500 (the highest resolution variant using 512x512 input images) achieves best mAP on Pascal VOC2007 at 76.8%, but at the expense of speed, where its frame rate drops to 22 fps. SSD-300 is thus a much better trade-off with 74.3 mAP at 59 fps.
6. SSD 在小物体上效果较差，因为他们可能在所有的 Feature Maps 中都没有出现。增大图片的像素在一定程度上能够缓解这个问题，但是不能完全解决。

## Q&A

* 为什么要有图片大小限制？300x300？那么对于图片超过这个规格的怎么处理？
* 每一个 feature map 需要同时做分类和回归？
* 非最大化抑制是什么？
* SSD 为什么用 L1 loss 计算 Location Loss？
* 为什么正负比例特别大，而用上了 Hard Negative Mining。


## References
1. [SSD 论文](/assets/SSD-Single-Shot-MultiBox-Detector.pdf)
2. [SSD 手写代码](https://github.com/xiaohu2015/DeepLearning_tutorials/tree/master/ObjectDetections/SSD)
3. [目标检测 - SSD原理与实现](https://zhuanlan.zhihu.com/p/33544892)
4. [SSD 目标检测](https://zhuanlan.zhihu.com/p/31427288)
5. [目标检测：SSD](https://zhuanlan.zhihu.com/p/42159963)
6. [Object Detection](https://handong1587.github.io/deep_learning/2015/10/09/object-detection.html)
7. [论文阅读：SSD: Single Shot MultiBox Detector](https://blog.csdn.net/u010167269/article/details/52563573)
8. [SSD深入理解](http://shartoo.github.io/SSD_detail/)
9. [R-CNN & Fast R-CNN & Faster R-CNN](http://cs.unc.edu/~zhenni/blog/notes/R-CNN.html)
10. [SSD object detection: Single Shot MultiBox Detector for real-time processing](https://medium.com/@jonathan_hui/ssd-object-detection-single-shot-multibox-detector-for-real-time-processing-9bd8deac0e06)
11. [Understanding SSD MultiBox — Real-Time Object Detection In Deep Learning](https://towardsdatascience.com/understanding-ssd-multibox-real-time-object-detection-in-deep-learning-495ef744fab)
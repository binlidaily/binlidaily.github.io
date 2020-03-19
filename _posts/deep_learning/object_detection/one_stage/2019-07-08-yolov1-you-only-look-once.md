---
layout: post
title: You Only Look Once
subtitle: YOLOv1
author: Bin Li
tags: [Deep Learning, Object Detection]
comments: true
published: true
---

　　YOLO 应该是目前 One-Stage 算法中非常常用的一个目标检测算法，YOLO 想通过卷积层一股脑把该预测的（定位和类别）都计算出来，然后将对应的部分择出来计算 loss，迭代更新权重。

{% include toc.html %}

　　YOLO 过程比较简单：
1. 将图片重新划分成 $S \times S$ 个 cell 的网格
2. 在图片上运行卷积网络进行模型训练
3. 最后通过模型的置信度阈值选择结果

## 1. 图片划分
　　首先将图片分成 $S\times S$ 个 cell，每个 cell 预测固定个数个 boundary boxes（边界框）。

<p align="center">
<img src="/img/media/15846048143021.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">将图片重新划分成 S x S 个 cell 的网格</em>
</p>

　　对于每一个网格单元（grid cell）：

* 每一个网格单元预测 $B$ 个边界框，每个边界框有一个框置信度（box confidence score）
    * 框置信度表示当前边界框有多大可能含有一个物体以及当前边界框有多准，不为 0 就是表示含有，值越大表示越准
* 每一个网格单元只检测一个物体，虽然每个网格单元会预测很多个边界框
    * 怎么做到只要一个？是否是同框置信度来筛选？
* 每一个网格单元预测 $C$ 个类条件概率（conditional class probabilities），即检测到的物体属于某一个特定类的概率。


## 2. 模型训练
### 2.1 网络结构
　　论文中是针对 PASCAL VOC 数据集，YOLO 采用 $7 \times 7$ 的网格划分方法。YOLO 的网络结构如下图所示：

<p align="center">
<img src="/img/media/15711246361131.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">YOLOv1 网络结构</em>
</p>

　　YOLO 有 24 个卷积层和 2 个全连接层：
1. 一些卷积层使用 $1\times 1$ 的卷积层去减少特征图的深度（channel 的个数）。
2. 最后一个卷积层的输出张量大小为 $(7, 7, 1024)$，接着张量就被拉平，第一层全连接层为 $4096$ 个神经元，第二层全连接层大小为 $7 \times 7 \times 30 =1470$
3. 最后结果的 $7 \times 7 \times 30 =1470$ 表示：
    1. 每一个网格单元计算出了 $2$ 个边界框（边界框大小坐标信息，加一个框置信度，box confidence score）
    2. 对应的类条件概率（conditional class probability，即检测到的物体属于一个特定类的概率，一个 20 个类，检测物体分别属于这 20 类的概率）
    3. 即一个 cell 的结果是 $5\times 2 +20=30$ 个值，然后算上 $7\times 7$ 个 cell 共 $1470$ 个值
    4. 这些值是在最后拉平的一串数中按照顺序排列

### 2.2 Loss Function
　　模型整体的损失函数是这样，看起来非常恐怖，但是拆解看下来还是挺大胆的。

$$
\begin{aligned} \lambda_{\text {cord }} \sum_{i=0}^{S} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {doj }}\left[\left(x_{i}-\hat{x}_{i}\right)^{2}+\left(y_{i}-\hat{y}_{i}\right)^{2}\right] \\+\lambda_{\text {coord }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left[(\sqrt{w_{i}}-\sqrt{\hat{w}_{i}})^{2}+(\sqrt{h_{i}}-\sqrt{\hat{h}_{i}})^{2}\right] \\+\sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left(C_{i}-\hat{C}_{i}\right)^{2} \\+\lambda_{\text {noobj }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {Hoobj }}\left(C_{i}-\hat{C}_{i}\right)^{2} \\+\sum_{i=0}^{S^{2}} \mathbb{1}_{i}^{\text {doj }} \sum_{c \in \text { classes }}\left(p_{i}(c)-\hat{p}_{i}(c)\right)^{2} \end{aligned}
$$

　　在计算 loss 的时候，有很多分值和概率项容易混淆，这里列举出来：

$$
\begin{aligned} \text { box confidence score } & \equiv P_{r}(\text {object}) \cdot \operatorname{IoU} \\ \text { conditional class probability } & \equiv P_{r}\left(\text {class}_{i} | \text {object}\right) \\ \text { class confidence score } & \equiv P_{r}\left(\text {class}_{i}\right) \cdot \operatorname{IoU} \\ &=\text { box confidence score } \times \text { conditional class probability } \end{aligned}
$$

　　其中：
* $P_{r}(\text {object})$ 表示一个框包含一个物体的概率，对于训练集来说，可以通过坐标容易知道物体在不在框中，在就为 1，不在就为 0
* $IoU$ 就是预测框（卷积结果的坐标框部分值）和真实框的 $IoU$ 值
* $P_r\left(\text {class}_i \mid \text {object}\right)$ 表示如果存在一个物体，那么这个物体属于第 $i$ 类的概率，这在每个 cell 中都能直接得到
* $P_r\left(\text {class}_i\right)$ 表示类置信度，即物体属于某一个类的概率，可以通过框置信度和类条件概率算出来。

### 2.2.1 Localization Loss 
　　定位损失用来衡量预测边界框的位置和大小，值得注意的是，计算定位损失时只考虑负责检测对应物体的边界框损失。YOLO 只关注真正例，所以在计算损失前，会选择与 Ground Truth 有着最大的 IoU 的边界框作为真正例去与待检物体匹配，计算对应损失。

$$
\begin{array}{l}{\lambda_{\text {coord }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left[\left(x_{i}-\hat{x}_{i}\right)^{2}+\left(y_{i}-\hat{y}_{i}\right)^{2}\right]} \\ {\quad+\lambda_{\text {coord }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {obj }}\left[(\sqrt{w_{i}}-\sqrt{\hat{w}_{i}})^{2}+(\sqrt{h_{i}}-\sqrt{\hat{h}_{i}})^{2}\right]}\end{array}
$$

　　其中：
* 如果在第 $i$ 个 cell 里面的第 $j$ 个 boundary box 是用来检测对应物体的，那么有 $\mathbb{1} = 1$，否则为 $\mathbb{1} = 0$。
* $\lambda_{\text {coord}}$ 可以用来调节对边界框坐标预测误差的关注度。

　　另外，这里计算宽和高的时候先要进行算术平方根，因为 $w$ 和 $h$ 开放后，对于相同的差距（比如都是两个像素的差距），大物体和小物体得到的不同的损失。如果对于相同的像素误差，大小物体的损失都一样，这样不是很合理！

## 2.2.2 Confidence Loss

　　第二个部分的损失是框的置信度损失，就是来衡量这个框有没有效果。置信度损失分成两个部分，如果一个物体在边界框中被检测到，那么对应的置信度损失计算如下：

$$
\sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\mathrm{obj}}\left(C_{i}-\hat{C}_{i}\right)^{2}
$$

　　其中：
* $\hat{C}_i$ 表示在网格单元 $i$ 中对应真实边界框计算得到的框置信度（ box confidence score）
* $C_i$ 的计算参考上面的公式，物体如果在边界框中，那么就主要看 $\text{IoU}$

　　如果一个物体在边界框中没有被检测到，那么对应的置信度损失计算如下：

$$
\lambda_{\text {noobj }} \sum_{i=0}^{S^{2}} \sum_{j=0}^{B} \mathbb{1}_{i j}^{\text {noobj }}\left(C_{i}-\hat{C}_{i}\right)^{2}
$$

　　多数时候是一个检测框中没有检测到任何物体，导致负样本比较多，也就是训练模型时检测背景的情况远多过检测物体的。为了弥补这个问题，我们可以在这个部分乘以一个比较小的权重，$\lambda_{\text {noobj }}=0.5$。当真实情况是边界框中没有物体时，对应的 $\hat{C}_i$ 就是 0。

　　那么为什么要加入一个置信度损失呢？🤔

　　因为定位和预测分类概率时没有保证检测到的结果里一定包含物体的，那么没有检测到物体怎么办？不应该给予对应的损失嘛？所以这里的置信度损失就有必要了，置信度损失有两个部分，一个是如果检测到有物体，对应物体置信度损失。如果没有物体，对应背景的置信度损失。

### 2.2.3 Classification loss
　　如果物体没有被检测到便无分类损失，如果物体被检测到，对应的分类损失计算如下：

$$
\sum_{i=0}^{S^{2}} \mathbb{1}_{i}^{\mathrm{obj}} \sum_{c \in \text { classes }}\left(p_{i}(c)-\hat{p}_{i}(c)\right)^{2}
$$

　　其中：
* $\hat{p}_i(c)$ 表示 $c$ 类物体在网格单元 $i$ 中的 Ground Truth 类条件概率，要么是 0 要么就是 1
* $p_i(c)$ 的计算可以参考前面的公式，通过框置信度和类条件概率计算。

### 2.3 Model Training and Testing
　　YOLO 会出现重复检测的情况，为了改进这个问题，可以使用非极大抑制（Non-Maximal Suppression）。因为检测的框少，回归和分类又是同时进行的，所以 YOLO 很快。

　　另外 YOLO 在训练的时候需要两个阶段：
1. 训练分类器：先训练一个像 VGG16 一样的**分类**网络，具体操作是在前 20 个卷积层后接一个平均池化层和一个全连接层，然后在 ImageNet 上训练一周，达到比较好的分类效果。
2. 训练目标检测器：将第一步多加的池化层和全连接层换成 4 个卷积层和两个连续的全连接层，再根据新定义的损失函数重新训练出一个**目标检测**网络。
    * 值得注意的是，因为目标检测需要更精细的特征，这部分将输入数据从 $224\times224$ 的尺寸增加到了 $448\times448$。

　　YOLO 预测的结果如下：

<p align="center">
<img src="/img/media/15734642555639.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">YOLO 预测示意图</em>
</p>


　　每一个预测得到的边界框有 5 个值：$(x, y, w, h)$ 和一个框置信度，其中边界框宽高用原始图片的高宽进行标准化，所以边界框四个值都是在 $[0, 1]$ 内。

## 3. YOLO v1 总结
　　**缺点**：
* 每一个 grid cell 只检测一个物体（2 隔框 1 一个类）。导致一些位置比较靠近目标物检测时会漏检。例如左下角的 9 个撒旦只能检测到 5 个。

<p align="center">
<img src="/img/media/15734640117638.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">YOLOv1 漏检示意图</em>
</p>


　　**优点**：
* 速度快，能够实时处理
* 定位和分类同时进行，能够端对端地训练
* YOLO 泛化能力更强，它从自然图片转换到艺术图片上的识别效果比其他算法好
* 对比于基于 Region proposal 的方法（只能基于特定的区域做分类），YOLO 能够在预测阶段访问整张图片，结果是 YOLO 能够得到在背景区域得到更小的假正率
* YOLO 在每一个网格单元只预测一个物体，会增加空间多样性

## References
1. [YOLOv1 Paper](/assets/papers/YOLOv1.pdf)
2. [YOLOv2 Paper](/assets/papers/YOLOv2.pdf)
3. [YOLOv3 Paper](/assets/papers/YOLOv3.pdf)
4. [Yolov3 Keras 版本从零到壹跑模型](https://blog.csdn.net/qq_39622065/article/details/86174142)
5. [Understanding YOLO](https://hackernoon.com/understanding-yolo-f5a74bbc7967)
6. [Real-time Object Detection with YOLO, YOLOv2 and now YOLOv3](https://medium.com/@jonathan_hui/real-time-object-detection-with-yolo-yolov2-28b1b93e2088)
7. [目标检测-YOLO原理与实现](https://zhuanlan.zhihu.com/p/32525231)
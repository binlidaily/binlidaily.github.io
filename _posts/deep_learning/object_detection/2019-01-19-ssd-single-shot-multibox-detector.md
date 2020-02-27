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

### 1.1 固定默认先验框
　　SSD 在不同的特征图中设定了不同的特征图个数，具体可以看网络结构图中有说明每层特征图对应的先验框个数。这样就大大提高了寻找先验框的效率，进而加速的训练过程。

<p align="center">
<img src="/img/media/15547129370535.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">SSD 默认先验框</em>
</p>

　　对于每一个 cell 都会有对应该层先验框个数个先验结果作为训练的初始值。

　　那么 default box 的 scale（大小）和 aspect ratio（横纵比）要怎么定呢？假设我们用 m 个 feature maps 做预测，那么对于每个 featuer map 而言其 default box 的 scale 是按以下公式计算的： 

$$
s_{k}=s_{\min }+\frac{s_{\max }-s_{\min }}{m-1}(k-1), \quad k \in[1, m]
$$

　　
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

　　因为负类锚框数目可能远多于其他，我们可以只保留其中的一些。而且是保留那些目前预测最不确信它是负类的，就是对类0预测值排序，选取数值最小的那一些困难的负类锚框。

　　用卷积而不用全连接的好处是，这样可以同时在feature map 中提出分类和回归的特征。


### 1.3 采用多尺度特征图
　　如之前的网络结构，SSD 采用网络层中不同尺度的特征图，即能够在不同感受野的特征图上预测目标（定位和分类）。而 SSD 对于每一层特征图的每一个位置都采用了固定先验框的方式，那么在浅层的特征图中就能检测到相对较小的物体，深层的特征图检测相对较大的物体。

![](/img/media/15541023500828.jpg)


3.3 Matching Strategy

       这一步是说训练需要的default box如何与GT框匹配的问题。MultiBox中用的是best jaccard overlap来配对，jaccard overlap跟IOU的概念类似，都是交集比上并集。MultiBox中采用jaccard overlap最大值的default box与GT（Ground Truth）配对。SSD中只要jaccard overlap大于0.5的default box都可以看做是正样本，因此一个GT可以与多个default box配对。当然，小于0.5的default box就看做是负例了。

3.4 Hard Negative Mining

经过上述的Matching Strategy可能产生多个与GT匹配的正样例的和数量更多的负例。负样例的数目远远多于正样例的数目，使正负样例数目不平衡，导致训练难以收敛。解决方法是：选取负样例的default box，将他们的得分从大大小进行排序，选取的得分最高的前几个负样例的default box，最终使正负样例比例为1：3。



## 2. 训练目标
　　在训练模型时，我们需要在模型的前向计算过程中生成多尺度的锚框 anchors，并为每个锚框预测类别 cls_preds 和偏移量 bbox_preds。之后，我们根据标签信息 Y 为生成的每个锚框标注类别 cls_labels 和偏移量 bbox_labels。最后，我们根据类别和偏移量的预测和标注值计算损失函数。

　　对于每一个输出 feature map 的层，先会用不同权重的 3x3 卷积，stride=1 的方式分别卷积出分类的结果和回归结果。每个结果长宽大小和 feature map 一值，但是通道数会不同，分类的通道数是 $k*(c+1)$，回归的通道数是 $k*4$。

　　由于不同输出层下的尺度大小是不一样的，但是通道数和 batch size 是一样的，我们可以按照这两个维度，reshape 一下张量，使得在 flatten 后的结果中，分类是按照 batch 为大单位，里面以第一个输出层的第一个位置的一个先验框的分类概率值，接下来是 1、1、2，再是 1、1、3 这样的方式排列。回归结果同理，不过是连续四个值一起。

　　这个是预测结果的形式，那么我们怎么知道预测的框和类别准不准呢？我们可以将真实的标注框信息作为模板，刷一遍我们的预测值，这样我们就可以通过计算 IoU 来找到正类和负类（背景），以及预测框与真实框偏移量（box_target），以及每个预测框的每一个坐标是否保留的掩码（box_mask），还有每一个预测框的真是类别序号（cls_target，背景是0），得出这三个量，我们就可以在根据预测的分类和回归结果来计算分类和回归损失了。

![](/img/media/15827216993894.jpg)

　　值得注意的是真是的 label 是包含真实类标和框值，共 5 个数。

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

$$
\begin{array}{l}{\qquad L_{1}(x)=|x| ; \frac{d L_{1}(x)}{d x}=\left\{\begin{array}{ll}{1} & {\text { if } x \geq 0} \\ {-1} & {\text { otherwise }}\end{array}\right.} \\ {\qquad L_{1}(x)=x^{2} ; \frac{d L_{2}(x)}{d x}=2 x} \\ {\text { smooth }_{L_{1}}(x)=\left\{\begin{array}{ll}{0.5 x^{2}} & {\text { if }|x|<1} \\ {|x|-0.5} & {\text { otherwise }}\end{array} ; \frac{d s \text { mooth }_{L_{1}}}{d x}=\left\{\begin{array}{ll}{x} & {\text { if }|x|<1} \\ {|x|-0.5} & {\text { otherwise }}\end{array}\right.\right.}\end{array}
$$

　　loss 的第二部分是分类：

$$
L_{c o n f}(x, c)=-\sum_{i \in P o s}^{N} x_{i j}^{p} \log \left(\hat{c}_{i}^{p}\right)-\sum_{i \in N e g} \log \left(\hat{c}_{i}^{0}\right) \quad \text { where } \quad \hat{c}_{i}^{p}=\frac{\exp \left(c_{i}^{p}\right)}{\sum_{p} \exp \left(c_{i}^{p}\right)}
$$

　　跟 MultiBox 一样采用了**交叉熵**作为 loss，不同点是，不像 MultiBox 中 $c_i$ 直接采用预测得分，因为 SSD 直接将分类引入了，所以 SSD 采用了 Softmax Loss 来计算多类别的置信度（或者说得分）。其中上标 $0$ 表示背景。

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
12. [9.7. 单发多框检测（SSD）](https://zh.gluon.ai/chapter_computer-vision/ssd.html)
13. [『MXNet』第十弹_物体检测SSD](https://www.cnblogs.com/hellcat/p/9108647.html)
14. [](https://www.cnblogs.com/xuanyuyt/p/7222867.html)
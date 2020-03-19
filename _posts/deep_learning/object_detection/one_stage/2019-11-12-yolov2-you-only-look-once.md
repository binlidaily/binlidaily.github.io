---
layout: post
title: You Only Look Once
subtitle: YOLOv2
author: Bin Li
tags: [Deep Learning, Object Detection]
comments: true
published: true
---

　　相比一些基于 Region 的目标检测算法，YOLOv1 的定位误差和召回率都比较低，于是光头胡子哥提出了 YOLOv2 来进行优化，较大程度提高了准确度并且运行更快。

{% include toc.html %}

## 1. YOLOv2 的改进
　　YOLOv2 优化包括了网络结构的优化，引入先验框，多尺度特征等，从而大幅度提高了效果。

### 1.1 Batch Normalization
　　在卷积层增加了 Batch Normalization 处理，这样就免去了 Dropout，同样能有防止过拟合作用，在收敛速度上有了提高，且使得 mAP 提高了 2%。

### 1.2 High-resolution classifier
　　YOLOv1 在训练的时候分了两个阶段，首先用前 20 层的卷积层预训练分类器，此时的输入数据规模是 $224\times 224$，接着换成 $448\times 448$ 进一步训练检测器。

　　YOLOv2 先用 $224\times 224$ 来预训练分类器，然后用 $448\times 448$ 的数据用少量 epoch 再 fine tune 一下分类器，这样使得分类器部分也提前适应一下更高像素的输入，并且得到了 mAP 4% 的提升。

### 1.3 卷积层引入锚框（Anchor Boxes）
　　YOLOv1 会为每一个网格单元生成固定个数个边界框，这些边界框的初始化是随机产生的，这样在用梯度下降算法更新参数时会非常不稳定，因为这些生成的边界框时好时坏。在训练初期，预测就会因为到底要用多大的边界框大小而花很久去统一结果。

<p align="center">
<img src="/img/media/15735422035405.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">YOLOv2 引入锚框</em>
</p>


　　然而在现实情况是，边界框并不是随意的，例如车的边界框比例一般比较类似，行人的边界框比例大概是 $0.41$ 等。

　　所以我们需要一个靠谱的边界框初始化，首先跟 SSD 一样，YOLOv2 在一个 cell 位置上选定多个不同大小、不同尺寸的初始化边界框会在模型训练初期更稳定一些，只要一个 match 就算赢。

　　YOLOv2 创建了如下形状的 5 个锚框（Anchor boxes，锚框也叫先验框，这篇论文就叫 priors）：

<p align="center">
<img src="/img/media/15735431212020.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">每个网格单元预设 5 个锚框</em>
</p>

　　那么我们初始化边界框的操作，就可以直接对上面锚框的偏置（offsets）预测就可以了，如果我们对这些偏置加以限制，就能维持预测的边界框的多样性，从而使得模型在训练初期时更加稳定。

　　结果是引入锚框使得 mAP 从 69.5 降到了 69.2，降了一点点，但是召回率从 81% 猛增到了 88%。也就是说，虽然有了一点点准确率上的降低，但是召回率提高了不少，说明模型还有蛮多空间可以提升！

### 1.4 对网络结构的改进
　　YOLOv2 对网络结构做了如下调整：
1. 删去网络结果最后的全连接层部分
2. 改变了输入图片大小，从 $448\times 448$ 改到的 $416\times 416$。
3. 删去了一个池化层，使得输出尺寸从 $7\times 7$ 改到的 $13\times 13$
4. 为了得到 $7\times 7 \times 125$ 的输出结果，我们将最后的卷积层换成 $3\times3$ 大小.

　　删去了负责预测边界框的全连接层部分，直接用卷积层得到的锚框来预测边界框。

<p align="center">
<img src="/img/media/15735436809035.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">修改后的网络结构示意图</em>
</p>

　　改变了输入图片大小，从 $448\times 448$ 改到的 $416\times 416$，变成了奇数，在做网格划分时，中心点归属更明确。

<p align="center">
<img src="/img/media/15735445215854.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">修改图片大小后中心点归属更好找</em>
</p>

　　YOLOv2 预测分类信息从网格单元的层面改变到了边界框的层面，一个预测包括：
1. 边界框定位信息的 4 个值，1 个框置信度的值和 20 个分类概率的值，一共 25 个值。
2. 一个网格单元有 5 个锚框，对应预测 5 个边界框，即一个网格单元应有 $25\times 5=125$ 个参数值。跟 YOLOv1 一样，对于物体的预测，也是预测边界框与 Ground Truth 的 IoU 值。

<p align="center">
<img src="/img/media/15735443506055.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">YOLOv2 一个 cell 5 个预测框</em>
</p>

　　为了得到 $7\times 7 \times 125$ 的输出结果，我们将最后的卷积层换成 $3\times3$ 输出 $7\times 7 \times 1024$ 的结果。然后使用最后的 $1\times1$ 卷积层将其转换成 $7\times 7 \times 125$。

<p align="center">
<img src="/img/media/15735441224421.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">YOLOv2 预测示意图</em>
</p>



### 1.5 维度聚类
　　对于具体的锚框个数，YOLOv2 采用 K-means 来选择，同时也能知道每个锚框的形状。因为图片不像一般的数值，不能使用传统的距离计算公式，这里采用 IoU 作为距离衡量标准。

$$
d(\text { box }, \text { centroid })=1-\mathrm{IOU}(\text { box }, \text { centroid })
$$

<p align="center">
<img src="/img/media/15735460555746.jpg" width="360">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">聚类示意图</em>
</p>


　　通过聚类得到的中心点，可以用来确定锚框的形状。

<p align="center">
<img src="/img/media/15735460719691.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">YOLOv2 聚类确定锚框</em>
</p>


　　从上图左子图可以看到，经过多次训练后，我们选择了 5 个 clusters，也就是选择了 5 个锚框。右子图紫色的部分是在 COCO 数据集上的锚框中心结果，黑边框的是 VOC2007 的，可以看到两个数据集在通用的锚框上，大小和形状都相近，说明锚框不应该随机设置，有一定的多样性会比较好。

### 1.6 直接预测定位
　　YOLOv2 预测 5 个参数 $(t_x, t_y, t_w, t_h, t_o)$ 并使用 Sigmoid 函数去限制其可能的偏置范围。

$$
\begin{aligned} b_{x} &=\sigma\left(t_{x}\right)+c_{x} \\ b_{y} &=\sigma\left(t_{y}\right)+c_{y} \\ b_{w} &=p_{w} e^{t_{w}} \\ b_{h} &=p_{h} e^{t_{h}} \\ \operatorname{Pr}(\text {object}) * I O U(b, \text { object}) &=\sigma\left(t_{o}\right) \end{aligned}
$$

　　其中：
* $t_x, t_y, t_w, t_h$ 是 YOLOv2 的预测结果
* $c_{x}, c_{y}$ 是锚框左上角所在网格单元的左上角坐标
* $p_{w}, p_{h}$ 是锚框的宽和高
* $c_{x}, c_{y}, p_{w}, p_{h}$ 已经被图片的宽和高归一化了
* $b_{x}, b_{x}, b_{w}, b_{h}$ 是预测的边界框坐标信息
* $\sigma\left(t_{o}\right)$ 是框置信度

　　下图对各个参数间的关系做了可视化，其中蓝色的框是预测的边界框，虚线框是锚框。

<p align="center">
<img src="/img/media/15735477427656.jpg" width="450">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">YOLOv2 参数关系示意图</em>
</p>


　　使用 k-means 维度聚类和这里提到的直接预测定位，mAP 提高了 5%。

### 1.7 细粒度特征（Fine-Grained Features）
　　卷积层会降低空间维度，像素也会逐层降低，为了能够检测小物体，YOLOv2 采用了一种叫做 passthrough 的方法，它 reshape 了 $26 \times 26 \times 512 $ 的层到 $13 \times 13 \times 2048 $，然后将其 concatenate 到 $13 \times 13 \times 1024$ 输出层上，最后在合并结果的 $13 \times 13 \times 3072 $ 的层上使用卷积计算得到预测结果。

<p align="center">
<img src="/img/media/15735489232678.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">YOLOv2 细粒度特征拼接</em>
</p>


### 1.8 多尺度训练
　　因为 YOLOv2 删去了全连接层，所以其可以处理不同大小的图片。如果输入的宽和高都变成 2 倍，那么预测结果就变成了 4 倍。每 10 个 batches，YOLOv2 就会随机在 $\\{ 320, 352, ..., 608 \\}$ 中选择一个 32 的倍数作为图片输入大小。这样就相当于做了 data augmentation，并强迫网络能够学习对于不同输入大小尺寸的图片都能预测得到较好的结果。

　　这样的做法还有一个好处，就是对于一些像素比较低的图片来做训练，这对一些没有很强计算力的场景比较有效。

　　可见 YOLOv2 的多尺度是从输入图片尺寸大小的方式进行的，而非 SSD 的金字塔 feature map 结构的多尺度。

## 2. 训练
　　YOLOv2 的训练分两个阶段，第一阶段训练分类器，首先还是用 YOLOv1 的结构，使用 $224\times 224$ 的图片训练，接着换成 $448\times 448$ 进行调整，使得分类效果达到比较好的程度。

　　第二阶段是训练检测器，此时就要删除后面的全连接层，用卷积层代替，去对应预测最终的全部结果。

## 3. 提高分类能力
　　用来做目标检测的数据集类别较少，用来训练分类的数据集类别较多，为了使 YOLO 能够检测更多类别，YOLOv2 采用了混合来自检测和分类的数据集。

　　为了能够串起这些类别，新创了一个叫做 WordTree 的数据结构来存储不同类别之间的关系。

<p align="center">
<img src="/img/media/15735571498520.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">WordTree 结构示意图</em>
</p>

　　待整理！

## 总结
优点

缺点

## References
1. [YOLOv1 Paper](/assets/papers/YOLOv1.pdf)
2. [YOLOv2 Paper](/assets/papers/YOLOv2.pdf)
3. [YOLOv3 Paper](/assets/papers/YOLOv3.pdf)
4. [Real-time Object Detection with YOLO, YOLOv2 and now YOLOv3](https://medium.com/@jonathan_hui/real-time-object-detection-with-yolo-yolov2-28b1b93e2088)
5. [目标检测-YOLOv2原理与实现(附YOLOv3)](https://zhuanlan.zhihu.com/p/35325884)
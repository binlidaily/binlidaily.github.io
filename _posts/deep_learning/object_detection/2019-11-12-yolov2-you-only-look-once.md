---
layout: post
title: You Only Look Once
subtitle: v2
author: Bin Li
tags: [Deep Learning, Object Detection]
comments: true
published: true
---

　　相比一些基于 region 的目标检测算法，YOLOv1 的定位误差和召回率都比较低，于是提出了 YOLOv2 来进行优化，较大程度提高了准确度并且运行更快。

## 1. YOLOv2 的改进
### 1.1 Batch Normalization
　　在卷积层增加了 Batch Normalization 处理，这样就免去了 Dropout 的使用，使得 mAP 提高了 2%。

### 1.2 High-resolution classifier
　　YOLOv1 在训练的时候分了两个阶段，首先用前 20 层的卷积层预训练分类器，此时的输入数据规模是 $224\times 224$，接着换成 $448\times 448$ 进一步训练检测器。

　　YOLOv2 先用 $224\times 224$ 来预训练分类器，然后用 $448\times 448$ 的数据减少 epoch 重新调整分类器。这样就使得整个检测过程更加简单，并且得到了 mAP 4% 的提升。


### 1.3 卷积层引入锚框（Anchor Boxes）
　　YOLOv1 会为每一个网格单元生成固定个数个边界框，这些边界框的初始化是随机产生的，这样在用梯度下降算法更新参数时会非常不稳定，因为这些生成的边界框有时好有时不好。在训练初期，预测就会因为到底要用多大的边界框大小而花很久去统一结果。

![](/img/media/15735422035405.jpg)

　　然而在现实使用汇总，边界框并不是随意的。例如车的边界框一般比较类似，行人的边界框比例大概是 0.41 等。

　　我们需要一个靠谱的边界框初始化，一个常见的做法是采用多个不同大小的初始化会在模型训练初期更稳定一些。

![](/img/media/15735424813791.jpg)

　　YOLOv2 创建了如下形状的 5 个锚框（anchor boxes，锚框也叫先验框，这篇论文就叫 priors）：

![](/img/media/15735431212020.jpg)

　　那么我们初始化边界框就可以直接预测对上面锚框的偏置（offsets）就可以了，如果我们对这些偏置加以限制，就能维持预测的边界框的多样性，从而使得模型在训练初期时更加稳定。

　　结果是引入锚框使得 mAP 从 69.5 降到了 69.2，降了一点点，但是召回率从 81% 猛增到了 88%。也就是说，虽然有了一点点准确率上的降低，但是

### 1.4 对网络结构的改进

* 删去负责预测边界框的全连接层部分
![](/img/media/15735436809035.jpg)

* YOLOv2 预测分类信息从网格单元的层面改变到了边界框的层面，一个预测包括：边界框定位信息的 4 个值，1 个框置信度的值和 20 个分类概率的值，及一个预测 25 个值。一个网格单元有 5 个锚框，对应预测 5 个边界框，即一个网格单元预有 $25\times 5=125$ 个参数值。跟 YOLOv1 一样，对于物体的预测，也是预测边界框与 Ground Truth 的 IoU 值。
![](/img/media/15735441224421.jpg)

* 为了得到 $7\times 7 \times 125$ 的输出结果，我们将最后的卷积层换成 $3\times3$ 输出 $7\times 7 \times 1024$ 的结果。然后使用最后的 $1\times1$ 卷积层将其转换成 $7\times 7 \times 125$.

![](/img/media/15735443506055.jpg)


* 改变了输入图片大小，从 $448\times 448$ 改到的 $416\times 416$，变成了奇数，在做网格划分时，中心点归属更明确。

![](/img/media/15735445215854.jpg)

* 删去了一个池化层，使得输出尺寸从 $7\times 7$ 改到的 $13\times 13$

### 1.5 维度聚类
　　使用 k-means 来选择到底应该选择多少个锚框，同时也能知道每个锚框的形状。因为图片不像一般的数值，不能使用传统的距离计算公式，这里采用 IoU 作为距离衡量标准。

![](/img/media/15735460555746.jpg)

　　通过聚类得到的中心点，可以据此得到锚框的形状？


![](/img/media/15735460719691.jpg)

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

![](/img/media/15735477427656.jpg)

　　上图对各个参数间的关系做了可视化，其中蓝色的框是预测的边界框，虚线框是锚框。

　　使用 k-means 维度聚类和这里提到的直接预测定位，mAP 提高了 5%。

### 1.7 细粒度特征（Fine-Grained Features）
　　卷积层会降低空间维度，像素也会逐层降低，为了能够检测小物体，YOLOv2 采用了一种叫做 passthrough 的方法，它 reshape 了 $26 \times 26 \times 512 $ 的层到 $13 \times 13 \times 2048 $，然后将其 concatenate 到 $13 \times 13 \times 1024$ 输出层上，最后在这个  $13 \times 13 \times 3072 $ 的层上使用卷积计算得到预测结果。

![](/img/media/15735489232678.jpg)

### 1.8 多尺度训练
　　因为 YOLOv2 删去了全连接层，其可以处理不同大小的图片。如果输入的宽和高都变成 2 倍，那么预测结果就变成了 4 倍。每 10 个 batches，YOLOv2 就会随机选择其他的图片大小作为输出预测结果。这样就相当于做了 data augmentation，并强迫网络能够学习对于不同输入大小尺寸的图片都能预测得到较好的结果。

　　这样的做法还有一个好处，就是对于一些像素比较低的图片来做训练，这对一些没有很强计算力的场景比较有效。

## 2. 训练
　　训练分两个阶段，第一阶段训练分类器，首先还是用 YOLOv1 的结构，使用 $224\times 224$ 的图片训练，接着换成 $448\times 448$ 进行调整，使得分类效果达到比较好的程度。

　　第二阶段是训练检测器，此时就要删除后面的全列阶层，用卷积层代替，去对应预测最终的全部结果。对于第一阶段的分类结果，我想在第二阶段的时候也会对应进行调整的。

## 3. 提高分类能力
　　用来检测的数据集类别较少，用来训练分类的数据集类别较多，为了使 YOLO 能够检测更多类别，YOLOv2 采用了混合来自检测和分类的数据集。

![](/img/media/15735571498520.jpg)


## References
1. [YOLOv1 Paper](/assets/YOLOv1.pdf)
2. [YOLOv2 Paper](/assets/YOLOv2.pdf)
3. [YOLOv3 Paper](/assets/YOLOv3.pdf)
4. [Real-time Object Detection with YOLO, YOLOv2 and now YOLOv3](https://medium.com/@jonathan_hui/real-time-object-detection-with-yolo-yolov2-28b1b93e2088)
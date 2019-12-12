---
layout: post
title: Keras YOLOv3
subtitle: 工具库使用
author: Bin Li
tags: [Computer Vision]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　实践版本的 YOLOv3 采用 [Keras 版本](https://github.com/qqwweee/keras-yolo3) 。

## 1. 数据准备
　　图片标注采用的是 LabelImg，Macbook 版本安装时出现如下问题：

```shell
ModuleNotFoundError: No module named 'libs.resources'
# 运行如下命令即可
pyrcc5 -o libs/resources.py resources.qrc
```

　　数据标好后，按照 VOC 的数据格式安排，例如 `VOCdevkit/VOC2007/` 文件夹结构如下：
* Annotations/ （放标注的 xml 文件）
* ImageSets/（放划分后的文件索引，txt 文件）
    * Main/
        * train.txt ...
* JPEGImages/（放 jpg 图片文件）
* SegmentationClass/
* SegmentationObject/

　　编写脚本按照上面格式调整好各个部分。

## 2. 项目内容修改
### 2.1 修改要检测的类别
　　有两处要改
1. 修改 voc_annotation.py 里面的 classes，改成自己需要的类。
2. 修改 model_data/voc_classes.txt 为需要的类

### 2.3 修改 yolo.cfg
　　以 yolo 为关键词搜索，找到 `[yolo]` 上下有如下三个部分需要修改：
1. filter：3 *（5+len（classes）
2. classes：你要训练的类别数（要加上背景的 1）
3. random：原来是 1，显存小改为 0


## 问题解决
### 出现 val_loss 计算为 nan
* 降低学习率（无效）
* 降低 batch size（无效）
* 尝试可能小物体导致分母为 0

```python
def yolo_loss(args, anchors, num_classes, ignore_thresh=.2, print_loss=False):
...
raw_true_wh = K.log(y_true[l][..., 2:4] / anchors[anchor_mask[l]] * input_shape[::-1] + 1e-10)
raw_true_wh = K.switch(object_mask, raw_true_wh, K.zeros_like(raw_true_wh)) # avoid log(0)=-inf
```

* 不要预训练，把 create_model 的参数 load_pretrained 改成False。（可行）

　　如果识别的内容与之前预训练模型有较大出入，还是不要用预训练模型。

## References
1. [keras-yolo3](https://github.com/qqwweee/keras-yolo3)
2. [Yolov3 Keras 版本从零到壹跑模型](https://blog.csdn.net/qq_39622065/article/details/86174142)
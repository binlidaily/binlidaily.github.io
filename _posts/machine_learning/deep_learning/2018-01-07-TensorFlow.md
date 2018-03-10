---
layout: post
title: "TensorFlow 使用记录"
author: "Bin Li"
tags: "Deep_Learning TensorFlow"
comments: true
style: |
  .container {
        max-width: 44rem;
    } 
published: True
---

最近在使用 TensorFlow 跑一些模型，由于刚接触 TensorFlow，做一些笔记方便翻看。

## TensorFlow 运行调试相关
### 运行 Tensorboard

现在代码中设定 log 的记录和记录位置，在 `with tf.Session() as sess:` 下设置：

```python
summary_writer = tf.train.SummaryWriter('/tensorflow/logdir', sess.graph_def)
```

但是 `tf.train.SummaryWriter` 已经过时，用 `tf.summary.FileWriter` 替换。


```python
summary_writer = tf.summary.FileWriter('/tensorflow/logdir', sess.graph_def)
```

然后要在命令行中开启 tensorboard :

```shell
tensorboard --logdir=/tmp  --port=8008
```

## TensorFlow 代码相关
### 设置内存增长方式
在跑数据的时候，因为数据量比较大，刚开始跑模型时，任务一直被 terminated。猜想是内存使用量超额了，于是设定输出 log 确认情况后，选定 GPU 使用按照需求自动增长，如下的:

```python
config1.gpu_options.allow_growth = True
```

### 设置 GPU 可见
```python
import os

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = 2
```

该方法该即通常所说的翻译转换。将某一语种的文本映射到另一语言空间，从而将多语言文本表示问题转换为单语言文本的表示。方法可分为两种情形：将多语言文本（语种１，…，语种ｉ，…，语种ｎ）都翻译为语种ｉ（语种ｉ为多语言文本中的某一语种）；将多语言文本都翻译为中间语言。

基于语料库翻译的方法是利用平行或可比语料中文本对齐信息和共现信息，提取翻译等价单元，构建统计翻译模型，选择相关的翻译，从而实现多语种文本在某一语言空间的表示［１５］。早在 1996 年，Davis 等假定语料中的术语服从χ２分布，从平行语料中抽取相关的翻译，将英语查询映射为西班牙语查询，实现基于平行语料的双语伪文档表示。

1999 年，Gonzalo 等将不同语种的文档都用 EuroWorldNet 的语间索引进行标引，实现多语言文本基于EuroWorldNet 中间语言空间的映射表示［２２］。2000 年，Hasan 等考虑到中文、日语都是象形文字，提出了面向汉字字符的中间语言模型，实现了中日双语表示［２３］。2004 年，Korn 等利用一个单字词典和一个类似主题词表的词集，将德语和葡萄牙语的医学双语文档集合都映射到独立语种的概念层（符号语言），实现双语独立语种的表示［２４］。2005 年，Guyot 等将查询和文档都映射到多语言本体空间中相应的概念，实现了基于多语言本体的多语言文本表示［２５］。该方法实质是通过多语言本体中的概念中间语言（即概念标识符）进行跨语言匹配。


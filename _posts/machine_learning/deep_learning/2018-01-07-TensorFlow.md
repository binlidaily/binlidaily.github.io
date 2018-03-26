---
layout: post
title: "TensorFlow 使用记录"
author: "Bin Li"
tags: "DL TensorFlow"
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



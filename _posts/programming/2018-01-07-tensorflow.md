---
layout: post
title: "TensorFlow 使用记录"
author: "Bin Li"
tags: [Deep Learning, TensorFlow]
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
tensorboard --logdir=/tmp  --port=6006
```

如果想在远程访问：
```shell
ssh -NfL localhost:6006:crscd:6006 binli@192.168.31.127
```

若想在 Mac 上如何关掉这个端口可以用:
```shell
sudo lsof -nPi :yourPortNumber
# then
sudo kill -9 yourPIDnumber
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

## TensorFlow 基本概念
TensorFlow 三大核心：Tensor, Graph, Operation。

### Tensor
Tensor 和 NumPy array 的区别是，Tensor 是函数或者说是容器，需要我们去定义，当数据被喂给 Tensor，它就会发生计算最终得到一个值。而 NumPy array 则是一个数据结构，在坐标系中可以表示 Tensor。

### Graph
一个计算图（computational graph）是若干个 TensorFlow 操作（operations）被安排进了一个图的多个结点（Nodes）中。

每一个结点（Node）采用零个或多个 Tensors 作为输入，并产生一个 Tensor 作为输出。

操作 (Operation, OP) 是一个计算图（Graph）的结点，用来运算在 tensor 上执行的计算操作。

```python
In [1]: mult = tf.multiply(at, bt)

In [2]: at = tf.constant(3)

In [3]: bt = tf.constant(4)

In [4]: mult = tf.multiply(at, bt)

In [5]: print ("The multiplication produces:::", mult)
Out [1]: ('The multiplication produces:::', <tf.Tensor 'Mul_1:0' shape=() dtype=int32>)
```

这里就不能计算得出结果，而只是返回一个 Tensor。

首先我们要理解，这里的计算图中有：
1. Tensors: at, bt
2. Operations: mult

为了能执行 mult 操作，计算图需要一个会话（Session），在其上执行 Tensor 和Operation。

```python
sess = tf.Session()
# Executing the session
print ("The actual multiplication result:::", sess.run(mult))
Out [1]:  The actual multiplication result::: 12
```

这样就能得到想要的结果 12 了，当然我们向计算图传递数值的时候有两种方式：Variables 和 Placeholders。

Variables 可以用来存储模型的参数，后面再训练的时候可以更新，需要注意的是，这些变量需要显示地初始化，这样才能在模型训练时和训练后存到硬盘中。

```python
# Variable

var1 = tf.Variable(2, name="var1") 
var2 = tf.Variable(3, name="var2")
mulv = tf.mul(var1, var2)
print (mulv)
# Tensor("Mul_2:0", shape=(), dtype=int32)

with tf.Session() as sess:
    sess.run(tf.global_variables_initializer()) # always need to initialize the variable
    print ("The variable var1 is:::", sess.run(var1))
    print ("The variable var2 is:::", sess.run(var2))
    print ("The computational result is:::", sess.run(mulv))

# The variable var1 is::: 2
# The variable var2 is::: 3
# The computational result is::: 6
```

这种变量定义是需要传值的，那么还可以利用 Placeholders 的方式，不需要在创建计算图的时候立即传值。

```python
# Placeholder

pl = tf.placeholder(tf.float32, name="p") 
pi = tf.constant(3.) 
c = tf.add(pl, pi)
print (c)
#Tensor("Add_1:0", dtype=float32)

with tf.Session() as sess:
    sess.run(tf.global_variables_initializer()) # always need to initialize the variables
    writer = tf.train.SummaryWriter("output", sess.graph)
    print("The calculation result is:::", sess.run(c, {pl:3}))
writer.close()

# WARNING:tensorflow:From <ipython‐input‐15‐4c5578691c20>:3 in <module>.: SummaryWriter.__init__ (from tensorflow.python.training.summary_io) is deprecated and will be removed after 2016‐11‐30.
# Instructions for updating: Please switch to tf.summary.FileWriter. The interface and behavior is the same; thi s is just a rename.
# The calculation result is::: 6.0
```

## Q&A
* with tf.variable_scope(scope)？

## References
1. [Awesome TensorFlow ](https://github.com/jtoy/awesome-tensorflow#tutorials)
2. [基本概念: Tensor, Operation, Graph](https://blog.csdn.net/shenxiaolu1984/article/details/52813962)
3. [TensorFlow 101: Understanding Tensors and Graphs to get you started in Deep Learning](https://www.analyticsvidhya.com/blog/2017/03/tensorflow-understanding-tensors-and-graphs/)
4. [TensorFlow-Book](https://github.com/BinRoot/TensorFlow-Book)
5. [TensorFlow-Tutorials](https://github.com/Hvass-Labs/TensorFlow-Tutorials)
6. [handson-ml](https://github.com/ageron/handson-ml)
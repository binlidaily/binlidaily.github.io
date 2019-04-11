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
## 1. TensorFlow 基本概念
总结起来 TensorFlow 是：
* 异步的：一处写，一处读，一处训练
* 全局的：操作添加到全局的 Graph 中，监控添加到全局的 Summary 中，参数/损失添加到全局的 Collection 中
* 符号式的：创建时没有具体值，运行时才传入

TensorFlow 三大核心：Tensor, Graph, Operation。

### 1.1 Tensor
Tensor 可以看做一种符号化的句柄，指向操作的运算结果。在执行后返回：基本类型、numpy.ndarray或者其组成的 list，tuple 等。

Tensor 和 NumPy array 的区别是，Tensor 是函数或者说是容器，需要我们去定义，当数据被喂给 Tensor，它就会发生计算最终得到一个值。而 NumPy array 则是一个数据结构，在坐标系中可以表示 Tensor。

### 1.1.1 创建 Tensor
可以用函数（参看 [constant_op](http://www.tensorfly.cn/tfdoc/api_docs/python/constant_op.html) 文档）创建：常数、随机或者数列是的 Tensor。
```python
tf.zeros([3, 4], int32) # ==> [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
tf.linspace(10.0, 12.0, 3, name="linspace") # => [ 10.0  11.0  12.0]
tf.random_normal([2, 3], stddev=0.35, name = "weights")
```
### 1.1.2 Tensor 的内容
常用数据顺序： `batch * height * width * channel`

Tensor 的 rank 指维度，rank = 0 是标量。

可以用下标访问 Tensor 的元素，结果 y 也是一个符号型运算结果：

```python
y = x[0][2]
```

注意，Tensor 对矩阵形状要求严格。长度为 1 的维度不会被自动缩减。
```python
x1 = tf.constant(1.0, shape=[])      # 0D
x2 = tf.constant(1.0, shape=[1])      # 1D
x3 = tf.constant(1.0, shape=[1,1])    # 2D
```

如果你想创建一个标量 Tensor，在指定 shape 时应该传入 []，而不是 [1]。

### 1.1.2 Tensor 的形状
两种方式获得 Tensor 输出结果的形状。

静态方法：直接根据创建 Tensor 的方法推理出输出形状。

```python
x = tf.random_normal([2, 3])
print(x.get_shape())
```

动态方法：创建一个获取形状的新 Tensor，运行得到结果。
```python
x = tf.random_normal([2, 3])
s = tf.shape(x)
sess = tf.Session()
print(sess.run(s))
```

### 1.2 Operation
Operation 表示一种符号化的运算过程，是 TensorFlow 中的基本单元，即图中的节点。它的输入输出都是 Tensor。

考虑以下代码：

```python
x = tf.constant(1, shape=[1, 2])
y = tf.constant(2, shape=[1, 2])
z = tf.add(x, y)
```

其中包含了三个 Operation 
- 给 Tensor $x$ 赋常数值 
- 给 Tensor $y$ 赋常数值 
- Tensor $x$, $y$ 相加得到 Tensor $z$

Operation 没法从函数返回值中得到，可以用如下方法，从全局 Graph 中查看当前所有 Operation：

```python
g = tf.get_default_graph()
opts = g.get_operations()
```

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

Variables 可以用来存储模型的参数，后面在训练的时候可以更新，需要注意的是，这些变量需要显示地初始化，这样才能在模型训练时和训练后存到硬盘中。

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


### 1.3 Graph
Tensor 和 Operation 都是 Graph 中的对象。Operation 是图的节点，Tensor 是图的边上流动的数据。

<p align="center">
<img src="/img/media/15549679326131.jpg">
</p>

对象的 .graph 成员表示其所属的 Graph，如无特别指定，创建的 Tensor 和 Operation 都在默认图中。

```python
g1 = x.graph
g2 = opts[0].graph
g3 = tf.get_default_graph()
```

一个计算图（computational graph）是若干个 TensorFlow 操作（operations）被安排进了一个图的多个结点（Nodes）中。

每一个结点（Node）采用零个或多个 Tensors 作为输入，并产生一个 Tensor 作为输出。



## 2. TensorFlow 运行调试相关
### 2.1 运行 Tensorboard

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

### 2.2 TensorFlow 代码相关
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


## Q&A
* with tf.variable_scope(scope)？

## References
1. [Awesome TensorFlow ](https://github.com/jtoy/awesome-tensorflow#tutorials)
2. [基本概念: Tensor, Operation, Graph](https://blog.csdn.net/shenxiaolu1984/article/details/52813962)
3. [TensorFlow 101: Understanding Tensors and Graphs to get you started in Deep Learning](https://www.analyticsvidhya.com/blog/2017/03/tensorflow-understanding-tensors-and-graphs/)
4. [TensorFlow-Book](https://github.com/BinRoot/TensorFlow-Book)
5. [TensorFlow-Tutorials](https://github.com/Hvass-Labs/TensorFlow-Tutorials)
6. [handson-ml](https://github.com/ageron/handson-ml)
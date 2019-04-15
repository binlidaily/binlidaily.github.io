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
Tensor 可以看做一种符号化的句柄，指向操作的运算结果。在执行后返回：基本类型、numpy.ndarray 或者其组成的 list，tuple 等。

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

操作 (Operation, OP) 是一个计算图（Graph）的结点，用来运算在 Tensor 上执行的计算操作。

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
1. Tensors: $at$, $bt$
2. Operations: $mult$

为了能执行 mult 操作，计算图需要一个会话（Session），在其上执行 Tensor 和Operation。

```python
sess = tf.Session()
# Executing the session
print ("The actual multiplication result:::", sess.run(mult))
Out [1]:  The actual multiplication result::: 12
```

这样就能得到想要的结果 12 了，当然我们向计算图传递数值的时候有两种方式：Variables 和 Placeholders，在后面会介绍。

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


### 1.4 Variable
除了核心三要素，TensorFlow 还有一个很重要的部分是变量（Variable），用来表示 Graph 中的个模型参数。Variables 可以用来存储模型的参数，后面在训练的时候可以更新，需要注意的是，这些变量需要显示地初始化，这样才能在模型训练时和训练后存到硬盘中。

```python
W = tf.Variable(tf.zeros(shape=[1,2]))
```

注意，此时 $W$ 一样是一个抽象的概念，而且与 Tensor 不同，Variable 必须初始化以后才有具体的值。

```python
tensor = tf.zeros(shape=[1,2])
variable = tf.Variable(tensor)
sess = tf.InteractiveSession()
# print(sess.run(variable))  # 会报错
sess.run(tf.initialize_all_variables()) # 对variable进行初始化
print(sess.run(variable))
#===>[[ 0.  0.]]
```

### 1.5 Placeholder
又叫占位符，同样是一个抽象的概念，用于表示输入输出数据的格式。告诉系统：这里有一个值/向量/矩阵，现在我没法给你具体数值，不过我正式运行的时候会补上的！例如上式中的x和y。因为没有具体数值，所以只要指定尺寸即可：

```python
x = tf.placeholder(tf.float32,[1, 5],name='input')
y = tf.placeholder(tf.float32,[None, 5],name='input')
```

### 1.6 Session
以上的概念都是抽象的定义，那么我们需要具象化，于是就有了 Session。

## 2. TensorFlow 运行调试相关
### 2.1 TensorFlow 运行流程

<p align="center">
<img src="/img/media/15549831974385.jpg">
</p>

<p align="center">
<img src="/img/media/15549845890539.jpg">
</p>


如上图所示我们如果要实现这样一个模型的训练，那么我们先利用抽象的概念元素构建出模型，使用官方tutorial中的mnist数据集的分类代码，公式可以写作：

$$
\begin{array}{l}{z=W x+b} \\ {pred=\text{softmax}(z)}\end{array}
$$

```python
# 建立模型：输入、输出和模型参数（图结构）
x = tf.placeholder(tf.float32, [None, 784]) # 输入占位符
y = tf.placeholder(tf.float32, [None, 10])  # 输出占位符（预期输出）
W = tf.Variable(tf.zeros([784, 10]))        # 变量先要初始化，因为训练时要变化
b = tf.Variable(tf.zeros([10]))
pred = tf.nn.softmax(tf.matmul(x, W) + b)      # a表示模型的实际输出

# 定义损失函数和训练方法
cross_entropy = tf.reduce_mean(-tf.reduce_sum( y * tf.log(pred), reduction_indices=[1])) # 损失函数为交叉熵，与预测值和真实值有关
optimizer = tf.train.GradientDescentOptimizer(0.5)    # 梯度下降法，学习速率为0.5
train = optimizer.minimize(cross_entropy)
```

以上我们就定义模型（图结构，损失函数，下降方法和训练目标），都包含在 train 里面了，我们称之为训练模型，还需要预测模型：

```python
# 定义预测方式
correct_prediction = tf.equal(tf.argmax(pred, 1), tf.argmax(y, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
```
tf.argmax 表示找到最大值的位置，tf.cast 将 boolean 数组转成 int 数组，平均后就得到准确率。


有了训练模型和测试模型，接下来就实际训练模型：

```python
# 实际训练模型
sess = tf.InteractiveSession()             # 建立交互式会话
tf.initialize_all_variables().run()        # 所有变量初始化

for i in xrange(1000):
    batch_xs, batch_ys = mnist.train.next_batch(100)   # 获得一批 100 个数据样本
    train.run({x: batch_xs, y: batch_ys})  # 给训练模型提供输入

precision = sess.run(accuracy, feed_dict={x: mnist.test.images, y: mnist.test.labels})
print(precision)
```

### 2.2 TensorFlow 主要函数
### 2.2.1 tf.nn.conv2d
功能：给定 4 维的 input 和 filter，计算出一个 2 维的卷积结果。

```python
def conv2d(input, filter, strides, padding, use_cudnn_on_gpu=None,
           data_format=None, name=None):
```

参数：
* **input**：待卷积的数据。格式要求为一个张量，[batch, in_height, in_width, in_channels]，分别表示为：批次数，图像高度，宽度，输入通道数。 
* **filter**：卷积核。格式要求为 [filter_height, filter_width, in_channels, out_channels]，分别表示：卷积核的高度，宽度，输入通道数，输出通道数。
* **strides**：一个长为 4 的 list. 表示每次卷积以后卷积窗口在 input 中滑动的距离。这四个维度对应到 filter 上的四个值。
    * strides[0] = 1，也即在 batch 维度上的移动为 1，也就是不跳过任何一个样本，否则当初也不该把它们作为输入（input）
    * strides[3] = 1，也即在 channels 维度上的移动为 1，也就是不跳过任何一个颜色通道；
* **padding**：有 SAME 和 VALID 两种选项，表示是否要保留图像边上那一圈不完全卷积的部分。如果是SAME，则保留。
* **use_cudnn_on_gpu**：是否使用 cudnn 加速。默认是 True。

### 2.2.2 tf.nn.max_pool 
功能：进行最大值池化操作，而 avg_pool 则进行平均值池化操作。

```python
def max_pool(value, ksize, strides, padding, data_format="NHWC", name=None):
```

参数：
* **value**: 一个 4D 张量，格式为 [batch, height, width, channels]，与 conv2d 中 input 格式一样。 
* **ksize**: 长为 4 的 list，表示池化窗口的尺寸。一般是 [1, height, width, 1]，因为我们不想在 batch 和 channels 上做池化
* **strides**: 池化窗口的滑动值，与 conv2d 中的一样。
* **padding**: 与 conv2d 中用法一样。



### 2.3 TensorFlow 代码相关
### 2.3.1 设置内存增长方式
在跑数据的时候，因为数据量比较大，刚开始跑模型时，任务一直被 terminated。猜想是内存使用量超额了，于是设定输出 log 确认情况后，选定 GPU 使用按照需求自动增长，如下的:

```python
config1.gpu_options.allow_growth = True
```

### 2.3.2 设置 GPU 可见
```python
import os

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = 2
```

### 2.3.3 保存与读取模型
为了防止训练过程中突然中断产生悲剧，可以用保存与读取模型的方式，通过 saver.save 来保存模型，通过 saver.restore 来加载模型。

保存模型的方法：

```python
# 之前是各种构建模型graph的操作(矩阵相乘，sigmoid等等....)

saver = tf.train.Saver() # 生成saver

with tf.Session() as sess:
    sess.run(tf.global_variables_initializer()) # 先对模型初始化

    # 然后将数据丢入模型进行训练blablabla

    # 训练完以后，使用saver.save 来保存
    saver.save(sess, "save_path/file_name") #file_name如果不存在的话，会自动创建
```

载入已经保存好的模型：

```python
saver = tf.train.Saver()

with tf.Session() as sess:
    #参数可以进行初始化，也可不进行初始化。即使初始化了，初始化的值也会被restore的值给覆盖
    sess.run(tf.global_variables_initializer())     
    saver.restore(sess, "save_path/file_name") #会将已经保存的变量值resotre到 变量中。
```

### 2.3.4 使用 Tensorboard 来可视化
流程如下所示：

* 使用 tf.scalar_summary 来收集想要显示的变量
* 定义一个 summury op，用来汇总多个变量
* 得到一个 summury writer，指定写入路径
* 通过summary_str = sess.run()

```python
# 1. 由之前的各种运算得到此批数据的loss
loss = ..... 

# 2.使用tf.scalar_summary来收集想要显示的变量,命名为loss
tf.scalar_summary('loss',loss)  

# 3.定义一个summury op, 用来汇总由scalar_summary记录的所有变量
merged_summary_op = tf.merge_all_summaries()

# 4.生成一个summary writer对象，需要指定写入路径,例如我这边就是/tmp/logdir
summary_writer = tf.train.SummaryWriter('/tmp/logdir', sess.graph)

# 开始训练，分批喂数据
for(i in range(batch_num)):
    # 5.使用sess.run来得到merged_summary_op的返回值
    summary_str = sess.run(merged_summary_op)

    # 6.使用summary writer将运行中的loss值写入
    summary_writer.add_summary(summary_str,i)
```

然后要在命令行中开启 tensorboard :

```shell
tensorboard --logdir=/tmp  --port=6006
```

如果想在远程访问：
```shell
ssh -NfL localhost:6006:crscd:6006 binli@192.168.31.127
```

如果端口占用，在 Mac 上关掉这个端口可以用:
```shell
sudo lsof -nPi :yourPortNumber
# then
sudo kill -9 yourPIDnumber
```

## Q&A
* with tf.variable_scope(scope)？

## References
1. [Awesome TensorFlow ](https://github.com/jtoy/awesome-tensorflow#tutorials)
2. [基本概念: Tensor, Operation, Graph](https://blog.csdn.net/shenxiaolu1984/article/details/52813962)
3. [tensorflow笔记：流程，概念和简单代码注释](https://blog.csdn.net/u014595019/article/details/52677412)
4. [tensorflow笔记 ：常用函数说明](https://blog.csdn.net/u014595019/article/details/52805444)
5. [CNN 入门讲解：什么是全连接层（Fully Connected Layer）?](https://zhuanlan.zhihu.com/p/33841176)
6. [TensorFlow 101: Understanding Tensors and Graphs to get you started in Deep Learning](https://www.analyticsvidhya.com/blog/2017/03/tensorflow-understanding-tensors-and-graphs/)
7. [TensorFlow-Book](https://github.com/BinRoot/TensorFlow-Book)
8. [TensorFlow-Tutorials](https://github.com/Hvass-Labs/TensorFlow-Tutorials)
9. [handson-ml](https://github.com/ageron/handson-ml)
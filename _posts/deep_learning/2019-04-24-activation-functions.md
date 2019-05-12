---
layout: post
title: Activation Functions
subtitle: 激活函数
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　激活函数（Activation Function）在神经网络和深度学习中起着很重要的作用，主要引入一些非线性的成分，使得模型的学习能力更强。Bengio 教授将[激活函数定义](https://arxiv.org/pdf/1603.00391v3.pdf)为：激活函数是映射 $h$: $\mathrm{R} \rightarrow \mathrm{R}$，且几乎处处可导。


## 1. 激活函数的饱和
### 1.1 软饱和
　　激活函数要求在定义域内处处可导，当如果只有在极限条件下偏导数才等于 $0$ 的函数称之为软饱和。当激活函数 $f^{\prime}(x)$ 满足下式时称为左侧软饱和：

$$
\lim _{n \rightarrow-\infty} f^{\prime}(x)=0
$$

　　当激活函数 $f^{\prime}(x)$ 满足下式时称为右侧软饱和：

$$
\lim _{n \rightarrow+\infty} f^{\prime}(x)=0
$$

　　同时满足左饱和和右饱和的为软饱和。

### 1.2 硬饱和
　　不用到达极限条件，只需要以一个常数 $C$ 作为临界就能达到偏导数为 $0$ 的称为硬饱和。对于任意的 $x$ 满足下式的函数被称为左侧硬饱和：

$$
f^{\prime}(x)=0, \text{当} |x|<c, c \text{为常数}
$$

　　对于任意的 $x$ 满足下式的函数被称为右侧硬饱和：

$$
f^{\prime}(x)=0, \text{当} |x|>c, c \text{为常数}
$$


## 2. Sigmoid
　　Sigmoid 是一个 $S$ 型的激活函数，缺点是可能会导致不饱和。

$$
f(x)=\frac{1}{1+e^{-x}}
$$

<p align="center">
<img src="/img/media/15560939318918.jpg" width="520">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">Sigmoid 函数和求导结果</em>
</p>

　　Sigmoid 求导过程：

$$
\begin{aligned} \sigma^{\prime}(z) &=\left(\frac{1}{1+e^{-z}}\right)^{\prime} \\ &=(-1)\left(1+e^{-z}\right)^{(-1)-1} \cdot\left(e^{-z}\right)^{\prime} \\ &=\frac{1}{\left(1+e^{-z}\right)^{2}} \cdot\left(e^{-z}\right) \\ &=\frac{1}{1+e^{-z}} \cdot \frac{e^{-z}}{1+e^{-z}} \\ &=\frac{1}{1+e^{-z}} \cdot\left(1-\frac{1}{1+e^{-z}}\right) \\ &=\sigma(z)(1-\sigma(z)) \end{aligned}
$$

**优点**：
1. Sigmoid 函数输出映射在 $(0, 1)$ 之间，范围有限，且单调连续，可以做输出层。
2. 求导容易：$f^{\prime}(x)=f(x) \cdot(1-f(x))$，求导过程可[参看](https://www.jianshu.com/p/d4301dc529d9)。

**缺点**：
1. 由于其软饱和性，容易产生梯度消失，导致训练出现问题。
2. 其输出不是以 $0$ 为中心的。

　　那么为什么会出现梯度消失的现象呢？因为通常神经网络所用的激活函数是sigmoid函数，这个函数有个特点，就是能将负无穷到正无穷的数映射到0和1之间，并且对这个函数求导的结果是f′(x)=f(x)(1−f(x))f′(x)=f(x)(1−f(x))。因此两个0到1之间的数相乘，得到的结果就会变得很小了。神经网络的反向传播是逐层对函数偏导相乘，因此当神经网络层数非常深的时候，最后一层产生的偏差就因为乘了很多的小于1的数而越来越小，最终就会变为0，从而导致层数比较浅的权重没有更新，这就是梯度消失。



## 3. tanh 函数
　　比起 Sigmoid 函数，更常用的是 tanh 函数：

$$
\tanh (x)=\frac{1-e^{-2 x}}{1+e^{-2 x}}
$$

　　函数值位于 $[-1, 1]$ 区间上，对应的图像如下：

<p align="center">
<img src="/img/media/15561072848754.jpg" width="350">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">tanh 函数图像</em>
</p>

**优点**：
1. 比 Sigmoid 函数收敛速度更快。
2. 相比 Sigmoid，tanh 是以 $0$ 为中心。

**缺点**：
1. 没有改变 Sigmoid 的最大问题——由于软饱和性产生梯度消失问题。

## 4. ReLU
　　近期非常受欢迎的激活函数，其定义为：

$$
y=
\begin{cases}
0& x \leq 0\\
1& x>0
\end{cases}
$$

<p align="center">
<img src="/img/media/15561079877580.jpg" width="350">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">ReLUctant 函数图像</em>
</p>

　　值得注意的是，在 TensorFlow 中除了 ReLU 自身外，还定义了与之有关的激活函数，像：
* **tf.nn.relu6**(features, name=None) 定义为：`min(max(features, 0), 6)`
* **CReLU**，即 **tf.nn.crelu**(features, name=None) ，可[参考](https://arxiv.org/pdf/1603.05201v2.pdf)。

**优点**：
1. 相比 Sigmoid 和 tanh，ReLU 在 SGD 中能够更快速的收敛，有说法是因为其有线性、非饱和的特点。
2. Sigmoid 和 tanh 涉及较多费时的操作，如指数操作，而 ReLU 可以更加简单的实现。
3. ReLU 导数为 1，能够有效缓解梯度消失的问题。
4. 在没有无监督预训练的时候也能有较好的效果。🤔
<p align="center">
<img src="/img/media/15561085558892.jpg" width="400">
</p>
1. 为神经网络提供了**稀疏表达的能力**。

**缺点**：
1. 由于负数部分恒为 0，会导致一些神经元无法激活，随着逐步的训练，可能出现神经元死亡，即无法更新的情况（可通过设置小学习率部分解决）。
    * 如果发生这种情况，那么从这一刻开始途径该神经元的梯度都变为零，即 ReLU 神经元在训练中不可逆的死亡了。


### 梯度爆炸
解决办法:
- 预训练加微调
- 梯度剪切、权重正则（针对梯度爆炸）
- 使用不同的激活函数
- 使用batchnorm
- 使用残差结构
- 使用LSTM网络


## References
1. [神经网络激活函数汇总（Sigmoid、tanh、ReLU、LeakyReLU、pReLU、ELU、maxout）](https://blog.csdn.net/edogawachia/article/details/80043673)
2. [深度学习系列（8）：激活函数](https://plushunter.github.io/2017/05/12/深度学习系列（8）：激活函数/)
3. [The Activation Function in Deep Learning 浅谈深度学习中的激活函数](https://www.cnblogs.com/rgvb178/p/6055213.html)
4. [深度学习中的激活函数导引](https://zhuanlan.zhihu.com/p/22142013)
5. [详解机器学习中的梯度消失、爆炸原因及其解决方法](https://blog.csdn.net/qq_25737169/article/details/78847691)
---
layout: post
title: Normalization
subtitle:
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　神经网络中有各种归一化算法：Batch Normalization (BN)、Layer Normalization (LN)、Instance Normalization (IN)、Group Normalization (GN)。从公式看它们都差不多，如下式所示：无非是减去均值，除以标准差，再施以线性映射。

$$
y=\gamma\left(\frac{x-\mu(x)}{\sigma(x)}\right)+\beta
$$

　　这些归一化算法的主要区别在于操作的 feature map 维度不同。

## 1. Batch Normalization
　　神经网络训练过程的本质是学习数据的分布，如果训练数据与测试数据的分布不同将大大降低网络的泛化能力，因为我们需要在训练开始前对所有输入数据进行归一化处理。

![](/img/media/15788098873836.jpg)

　　然而随着网络训练的进行，每个隐层的参数变化使得后一层的输入发生变化，从而每一批训练数据的分布也随之改变，致使网络在每次迭代中都需要拟合不同的数据分布，增大训练的复杂度以及过拟合的风险。

　　批量归一化方法是针对每一批数据，在网络的每一层输入之前增加归一化处理（均值为 0，标准差为 1），将所有批数据强制在统一的数据分布下，即对该层的任意一个神经元（假设为第 $k$ 维）$\hat{x}^{(k)}$ 采用如下公式

$$
\hat{x}^{(k)}=\frac{x^{(k)}-E\left[x^{(k)}\right]}{\sqrt{\operatorname{Var}\left[x^{(k)}\right]}}
$$

　　其中 $x^{(k)}$ 为该层第 $k$ 个神经元的原始输入数据，$E[x^{(k)}]$ 为这一批输入数据在第 $k$ 个神经元的均值，${\sqrt{\operatorname{Var}\left[x^{(k)}\right]}}$ 为这一批数据在第 $k$ 个神经元的标准差。

　　批量归一化可以看作在每一层输入和上一层输出之间加入了一个新的计算层，对数据的分布进行额外的约束，从而增强模型的泛化能力。但是批量归一化同时也降低了模型的拟合能力，归一化之后的输入分布被强制为 0 均值和 1 标准差。以 Sigmoid 激活函数为例，批量归一化之后数据整体处于函数的非饱和区域，只包含线性变换，破坏了之前学习到的特征分布。为了恢复原始数据分布，具体实现中引入了变换重构以及可学习参数 $\gamma$ 和 $\beta$：

## References
1. [如何区分并记住常见的几种 Normalization 算法](http://www.tensorinfinity.com/paper_184.html)
2. [机器学习面试的12个基础问题，强烈推荐！](https://mp.weixin.qq.com/s/_jyIhPPBg82f5U6fp1vEig)


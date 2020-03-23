---
layout: post
title: Batch Normalization
subtitle: 批量归一化
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
---

　　神经网络训练过程的本质是学习数据的分布，如果训练数据与测试数据的分布不同将大大降低网络的泛化能力，因为我们需要在训练开始前对所有输入数据进行归一化处理。


<p align="center">
<img src="/img/media/15849378052937.jpg" width="560">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">BN 应用在 mini-batch 的激活输出 x 上</em>
</p>


　　然而随着网络训练的进行，每个隐层的参数变化使得后一层的输入发生变化，从而每一批训练数据的分布也随之改变，致使网络在每次迭代中都需要拟合不同的数据分布，增大训练的复杂度以及过拟合的风险。

　　批量归一化方法是针对每一批数据，在网络的每一层输入之前增加归一化处理（均值为 0，标准差为 1），将所有批数据强制在统一的数据分布下，即对该层的任意一个神经元（假设为第 $k$ 维）$\hat{x}^{(k)}$ 采用如下公式

$$
\hat{x}^{(k)}=\frac{x^{(k)}-E\left[x^{(k)}\right]}{\sqrt{\operatorname{Var}\left[x^{(k)}\right]}}
$$

　　其中 $x^{(k)}$ 为该层第 $k$ 个神经元的原始输入数据，$E[x^{(k)}]$ 为这一批输入数据在第 $k$ 个神经元的均值，${\sqrt{\operatorname{Var}\left[x^{(k)}\right]}}$ 为这一批数据在第 $k$ 个神经元的标准差。

　　批量归一化可以看作在每一层输入和上一层输出之间加入了一个新的计算层，对数据的分布进行额外的约束，从而增强模型的泛化能力。但是批量归一化同时也降低了模型的拟合能力，归一化之后的输入分布被强制为 0 均值和 1 标准差。以 Sigmoid 激活函数为例，批量归一化之后数据整体处于函数的非饱和区域，只包含线性变换，破坏了之前学习到的特征分布。为了恢复原始数据分布，具体实现中引入了变换重构以及可学习参数 $\gamma$ 和 $\beta$：

## 预测阶段的 BN 计算
　　BN 预测时，采用全局的均值和方差的方式。在预测阶段，对于均值来说直接计算所有训练batch u值的平均值；然后对于标准偏差采用训练阶段每个batch σB的**无偏估计**。


## 总结

批归一化的好处：
* 使得神经网络 的优化地形（Optimization Landscape）更加平滑，以及使梯度变得更加稳定， 从而允许我们使用更大的学习率，并提高收敛速度
* 使得大部分神经层的输入处于不饱和区域，从而让梯度变大，避免梯度消失问题；
    * 有效减少对参数初始化的依赖
* 归一化方法也可以作为一种隐形的正则化方法，从而提高网络的泛化 能力，避免过拟合


批量归一化的提出动机是为了解决内部协方差偏移问题，但后来的研究者发现其主要优点是归一化会导致更平滑的优化地形[Santurkaretal.,2018].


　　

## References
1. [Paper](/assets/papers/Batch Normalization Accelerating Deep Network Training by Reducing Internal Covariate Shift.pdf)
2. [How Does Batch Normalization Help Optimization?](https://arxiv.org/abs/1805.11604)
3. [深入理解Batch Normalization批标准化](https://www.cnblogs.com/guoyaohua/p/8724433.html)
4. [结构借鉴](https://zhuanlan.zhihu.com/p/89422962)
5. [批量归一化](https://zh.d2l.ai/chapter_convolutional-neural-networks/batch-norm.html)
    * 对全连接层、卷积层和预测时分别作了介绍如何做 BN
    * 还有一些代码练习实现 BN，以及一些修改观察的实验
6. [详解深度学习中的Normalization，BN/LN/WN](https://zhuanlan.zhihu.com/p/33173246)
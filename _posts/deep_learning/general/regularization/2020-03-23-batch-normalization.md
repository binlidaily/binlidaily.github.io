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


批归一化的好处：
* 归一化之后的数据，能够减少计算复杂度，加快神经网络收敛
* 避免造成梯度过饱和，可以说弱化了参数初始化的作用（不合适的参数初始化会造成梯度消失），使用Batch Normalization Layer可以有效降低深度网络对weight初始化的依赖
* 还将数据归一化到以 0 为中心，激活函数的输出是以“零为中心”，便于后续迭代优化

## References
1. [Paper](/assets/papers/Batch Normalization Accelerating Deep Network Training by Reducing Internal Covariate Shift.pdf)
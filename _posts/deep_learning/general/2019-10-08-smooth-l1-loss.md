---
layout: post
title: Smooth $L_1$
subtitle: 
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　对于大多数 CNN 网络，我们一般是使用L2-loss而不是L1-loss，因为L2-loss的收敛速度要比 L1-loss 要快得多。

　　对于边框预测回归问题，通常也可以选择平方损失函数（L2损失），但L2范数的缺点是当存在离群点（outliers)的时候，这些点会占loss的主要组成部分。比如说真实值为1，预测10次，有一次预测值为1000，其余次的预测值为1左右，显然loss值主要由1000主宰。所以FastRCNN采用稍微缓和一点绝对损失函数（smooth L1损失），它是随着误差线性增长，而不是平方增长。

　　Smooth L1 和 L1 Loss 函数的区别在于，L1 Loss 在0点处导数不唯一，可能影响收敛。Smooth L1的解决办法是在 0 点附近使用平方函数使得它更加平滑。

$$
\operatorname{smooth}_{L_{1}}(x)=\left\{\begin{array}{ll}{0.5 x^{2}} & {\text { if }|x|<1} \\ {|x|-0.5} & {\text { otherwise }}\end{array}\right.
$$

$$
\operatorname{smooth}_{L_{1}^{\prime}}(x)=\left\{\begin{array}{lll}{x} & {\text { if }|x|<1} \\ {-1} & {\text { if }x<-1} \\ {1} & {\text { if }x>1}\end{array}\right.
$$

![](/img/media/15705356483782.jpg)

Smooth L1
* 相比于L1损失函数，可以收敛得更快。
* 相比于L2损失函数，对离群点、异常值不敏感，梯度变化相对更小，训练时不容易跑飞。

## References
1. [损失函数：L1 loss, L2 loss, smooth L1 loss](https://zhuanlan.zhihu.com/p/48426076)
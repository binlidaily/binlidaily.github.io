---
layout: post
title: Triplet Loss
subtitle: 三元损失
author: Bin Li
tags: [Deep Learning, Loss]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

![-w933](/img/media/15706111790476.jpg)

　　Triplet Loss 的想法就是找到一种方法，使得正例与靶标尽量近，使负例尽量离靶标远。

$$
\left\|f\left(x_{i}^{a}\right)-f\left(x_{i}^{p}\right)\right\|_{2}^{2}+\alpha<\left\|f\left(x_{i}^{a}\right)-f\left(x_{i}^{n}\right)\right\|_{2}^{2}, \quad \forall\left(f\left(x_{i}^{a}\right), f\left(x_{i}^{p}\right), f\left(x_{i}^{n}\right)\right) \in \mathscr{T}
$$

　　其中：
* $f(x) \in \mathbb{R}^{d}$ 是 FaceNet 里提出的 Embedding，即把一张图片表达到 $d$ 维的欧几里得空间。
* a, p, n 分别表示 anchor, positive 和 negative
* $\mathscr{T}$ 是具有基数为 $N$ 的训练集中的三元组集合
* $\alpha$ 是横亘在正对和负对之间强制的边界大小

　　则对应的损失函数表示为：

$$
\sum_{i}^{N}\left[\left\|f\left(x_{i}^{a}\right)-f\left(x_{i}^{p}\right)\right\|_{2}^{2}-\left\|f\left(x_{i}^{a}\right)-f\left(x_{i}^{n}\right)\right\|_{2}^{2}+\alpha\right]_{+}
$$

　　其中 $+$ 表示括号内的损失结果为负时，损失归零。


![](/img/media/15706213192150.jpg)

## References
1. [Triplet Loss and Online Triplet Mining in TensorFlow](https://omoindrot.github.io/triplet-loss)
2. [TensorFlow Implementation](https://github.com/omoindrot/tensorflow-triplet-loss)
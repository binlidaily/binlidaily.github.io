---
layout: post
title: 点到超平面的距离公式
subtitle: 
author: Bin Li
tags: [Geometry]
image: 
comments: true
published: true
---


　　超平面 $S$ 的公式：

$$
w \cdot x+b=0
$$

　　假设空间中一点 $x_0$ 到超平面 $S$ 的距离为 $d$，点 $x_0$ 在平面 $S$ 上的投影为 $h$，则有：

$$
w \cdot h+b=0
$$

　　假设其中的 $x_0$，$w$，$x$，$h$ 均为 $N$ 维向量。因为向量 $\overrightarrow{x_0 h}$ 平行与 $S$ 平面的法向量 $w$，则有：

$$
\left|w \cdot \overrightarrow{x_{0}h} \right|=|w|\left|\overrightarrow{x_{0}h}\right|=\sqrt{\left(w^{1}\right)^{2}+\ldots+\left(w^{N}\right)^{2}} d=\|w\| d
$$

　　其中 $\vert\vert w\vert\vert$ 为向量 $w$ 的 $L_2$ 范数。

　　我们再展开这两个向量的点乘：



$$
\begin{aligned} w \cdot \overrightarrow{x_{0}h} &=w^{1}\left(x_{0}^{1}-h^{1}\right)+w^{2}\left(x_{0}^{2}-h^{2}\right)+\ldots+w^{N}\left(x_{0}^{N}-h^{N}\right) \\ &=w^{1} x_{0}^{1}+w^{2} x_{0}^{2}+\ldots+w^{N} x_{0}^{N}-\left(w^{1} h^{1}+w^{2} h^{2}+\ldots+w^{N} h^{N}\right) \\ &=w^{1} x_{0}^{1}+w^{2} x_{0}^{2}+\ldots+w^{N} x_{0}^{N}-(-b) \\
&= w\cdot x_0+b
\end{aligned}
$$

　　所以有

$$
\left|w \cdot \overrightarrow{x_{0}h}\right|=\left|w \cdot x_{0}+b\right|=\|w\| d
$$

　　故有点 $x_0$ 到超平面 $w \cdot x_{0}+b = 0$ 的距离公式为：

$$
d = \frac{\left|w \cdot x_{0}+b\right|}{\|w\|}
$$

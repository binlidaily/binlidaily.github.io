---
layout: post
title: Support Vector Machines
subtitle: 支持向量机
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　支持向量机（Support Vector Machines, SVM）是一种二分类模型，是定义在特征空间上间隔最大的线性分类器，间隔最大使之有别于感知机，感知机是对误分类集合样本相关的损失函数越小越好。

## 点到超平面
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

![-w1428](/img/media/15662180244881.jpg)


## 线性支持向量机
从 hinge loss 的角度来看待线性支持向量机
![-w1304](/img/media/15662007668997.jpg)

![-w1380](/img/media/15662007998128.jpg)


ideal loss

$$
l\left(f\left(x^{n}\right), \hat{y}^{n}\right)=\max \left(0,1-\hat{y}^{n} f(x)\right)
$$

Hinge loss 对 outlier 不那么敏感。
Kernel Trick

取 1 的时候，Hinge loss 才會是 ideal loss 的一個 type 的 upper bound，如果用其他的值的话，就不会是那么 tight 的 upper bound。
![-w1437](/img/media/15662192478583.jpg)

![-w1429](/img/media/15662197118358.jpg)


## Kernel

![-w1293](/img/media/15662017087873.jpg)

![-w1328](/img/media/15662021226082.jpg)

![-w1256](/img/media/15662022088653.jpg)

![-w1424](/img/media/15662023554996.jpg)

![-w1320](/img/media/15662024844999.jpg)


$$
d^{*}=\max _{\alpha, \beta : \alpha_{i} \geq 0} \min _{w} \mathcal{L}(w, \alpha, \beta) \leq \min _{w} \max _{\alpha, \beta : \alpha_{i} \geq 0} \mathcal{L}(w, \alpha, \beta)=p^{*}
$$

![-w1418](/img/media/15662111203965.jpg)

![-w1424](/img/media/15662112439409.jpg)

![-w1420](/img/media/15662115375172.jpg)

![-w1425](/img/media/15662116890554.jpg)

![-w1423](/img/media/15662118568830.jpg)

![-w1414](/img/media/15662119911487.jpg)

![-w1415](/img/media/15662125499087.jpg)

![-w1430](/img/media/15662156239382.jpg)

内积就是表示两个向量的相似性
![-w1358](/img/media/15662162612253.jpg)

## 常见重点
几何距离，函数距离

怎么选

## References
1. [深入理解拉格朗日乘子法（Lagrange Multiplier) 和KKT条件](https://www.cnblogs.com/mo-wang/p/4775548.html)
2. [cs229-notes3.pdf](/assets/cs229-notes3.pdf)
3. [Weak-Duality.pdf](/assets/Weak-Duality.pdf)
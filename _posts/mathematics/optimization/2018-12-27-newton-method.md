---
layout: post
title: Newton's Method
subtitle: 牛顿法
author: Bin Li
tags: [Mathematics]
image: 
comments: true
published: true
---

　　牛顿法的基本思想是利用迭代点 $x_k$ 处的一阶导数(梯度)和二阶导数(Hessen矩阵)对目标函数进行二次函数近似，然后把二次模型的极小点作为新的迭代点，并不断重复这一过程，直至求得满足精度的近似极小值。牛顿法的速度相当快，而且能高度逼近最优值。牛顿法分为基本的牛顿法和全局牛顿法。



<p align="center">
  <img width="500" height="" src="/img/media/600px-NewtonIteration_Ani.gif">
</p>

　　考虑**无约束**最优化问题：

$$
\min _{x \in \mathbf{R}^{n}} f(x)
$$

　　求极值一般的策略就是求导令导数为 0，我们这里求导前先将函数 $f(x)$ 利用泰特展开展开到二阶：

$$
f(x)=f\left(x_{k}\right)+f^{\prime}\left(x_{k}\right)\left(x-x_{k}\right)+\frac{1}{2} f^{\prime \prime}\left(x_{k}\right)\left(x-x_{k}\right)^{2}
$$

　　然后对右边等价于原函数的式子进行求导并且令导数为零：

$$
f^{\prime}\left(x_{k}\right)+f^{\prime \prime}\left(x_{k}\right)\left(x-x_{k}\right)=0
$$

　　即可得到牛顿法的更新公式：

$$
x=x_{k}-\frac{f^{\prime}\left(x_{k}\right)}{f^{\prime \prime}\left(x_{k}\right)}
$$


牛顿法**优点**：
* 牛顿法速度相当快
* 能高度逼近最优值

**缺点**：
* 初始点要尽量靠近最优值，不然可能导致算法不收敛

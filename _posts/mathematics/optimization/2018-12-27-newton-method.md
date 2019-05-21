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

　　牛顿法（Newton's Method）是一种有效的非线性方程 $f(x) = 0$ 求根方法，令 $f: \mathbb{R} \rightarrow \mathbb{R}$ 为一个连续可导函数，设 $x_0$ 为 $f(x) = 0$ 一根的近似值，写出泰勒级数：

$$
f(x)=0=f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right)+O\left(\left(x-x_{0}\right)^{2}\right)
$$

　　如何 $\vert x-x_0\vert$ 足够小，我们可以忽略阶段 $O\left(\left(x-x_{0}\right)^{2}\right)$ 求解线性方程 $f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right)=0$ 可得近似根：

$$
x_{1}=x_{0}-\frac{f\left(x_{0}\right)}{f^{\prime}\left(x_{0}\right)}
$$

　　上式的几何意义是 $(x_1, 0)$ 为函数 $f$ 于点 $(x0, f(x_0))$ 处的切线与 $x$ 轴的交点，我们期待 $x_1$ 比 $x_0$ 更接近真实值，那么迭代求解：

$$
x_{k+1}=x_{k}-\frac{f\left(x_{k}\right)}{f^{\prime}\left(x_{k}\right)}
$$

　　证明牛顿法的收敛性还是需要整理下。

<p align="center">
  <img width="500" height="" src="/img/media/600px-NewtonIteration_Ani.gif">
</p>

## 最优化中的牛顿法

　　在最优化时，我们需要找到损失函数偏导为零的参数值，即为最优值。

　　牛顿法的基本思想是利用迭代点 $x_k$ 处的一阶导数(梯度)和二阶导数(Hessen矩阵)对目标函数进行二次函数近似，然后把二次模型的极小点作为新的迭代点，并不断重复这一过程，直至求得满足精度的近似极小值。牛顿法的速度相当快，而且能高度逼近最优值。牛顿法分为基本的牛顿法和全局牛顿法。





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

## References
1. [Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method)
2. [牛頓法──非線性方程的求根方法](https://ccjou.wordpress.com/2013/07/08/%E7%89%9B%E9%A0%93%E6%B3%95%E2%94%80%E2%94%80%E9%9D%9E%E7%B7%9A%E6%80%A7%E6%96%B9%E7%A8%8B%E7%9A%84%E6%B1%82%E6%A0%B9%E6%96%B9%E6%B3%95/)
3. [牛顿法收敛性定理及其证明](https://www.jianshu.com/p/7c8c902fcd75)
4. [牛顿迭代法](http://netedu.xauat.edu.cn/jpkc/netedu/jpkc2009/jsff/content/dzja/3.4.htm)
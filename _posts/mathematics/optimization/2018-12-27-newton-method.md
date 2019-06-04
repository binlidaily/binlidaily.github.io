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

　　求极值一般的策略就是求导令导数为 $0$，我们这里求导前先将函数 $f(x)$ 利用泰勒公式在点 $x_{k}$ 附近展开到二阶：

$$
f(x)=f\left(x_{k}\right)+f^{\prime}\left(x_{k}\right)\left(x-x_{k}\right)+\frac{1}{2} f^{\prime \prime}\left(x_{k}\right)\left(x-x_{k}\right)^{2}
$$

　　然后对右边的式子进行求导并且令导数为零：

$$
f^{\prime}\left(x_{k}\right)+f^{\prime \prime}\left(x_{k}\right)\left(x-x_{k}\right)=0
$$

　　即可得到牛顿法的更新公式：

$$
x=x_{k}-\frac{f^{\prime}\left(x_{k}\right)}{f^{\prime \prime}\left(x_{k}\right)}
$$

　　以上是一维情况下的迭代，接下来拓展到多维的推导过程。

　　考虑**无约束**最优化问题：

$$
\min _{x \in \mathbf{R}^{n}} f(x)
$$

　　用泰勒展开式在 $x_k$ 点处展开到二阶：

$$
f(x)=f\left(x_{k}\right)+\nabla f\left(x_{k}\right)\left(x-x_{k}\right)+\frac{1}{2} (x-x_k)^T \nabla^2 f\left(x_{k}\right)\left(x-x_{k}\right)
$$

　　其中 $\nabla f$ 是 $f$ 的梯度向量（统一起见，此后记作 $g$），$\nabla^2 f$ 是 $f$ 的海森矩阵（记作 $H$），其定义分别是：

$$
\nabla f= g = \left[ \begin{array}{c}{\frac{\partial f}{\partial x_{1}}} \\ {\frac{\partial f}{\partial x_{2}}} \\ {\vdots} \\ {\frac{\partial f}{\partial x_{n}}}\end{array}\right]
$$

$$
\nabla^2 f = H(x)=\left[\frac{\partial^{2} f}{\partial x_{i} \partial x_{j}}\right]_{n \times n}
$$

　　函数 $f\left(x\right)$ 有极值的必要条件是在极值点处一阶导数为 0，将上述泰勒展开式右式进行求导令等于零：

$$
\nabla f\left(x_{k}\right)+ \nabla^2 f\left(x_{k}\right)\left(x-x_{k}\right) = 0
$$

　　得到

$$
x = x_{k} -  (\nabla^2 f\left(x_{k}\right) )^{-1}\nabla f\left(x_{k}\right)
$$

　　方便起见，$g_k = \nabla f\left(x_{k}\right)$，$H_k = \nabla^2 f\left(x_{k}\right)$，这样给定了初始值 $x_0$，上式就可以记录成迭代的方式：

$$
x_{(k+1)}=x_{(k)}-H_{k}^{-1} g_{k}, \quad k=0,1,2, \ldots
$$

　　这就是原始的牛顿迭代法，其中搜索方向 $d_k = -H_{k}^{-1} g_{k}$ 叫做牛顿方向。

<p align="center">
  <img width="500" height="" src="/img/media/15594530743307.jpg">
</p>




为什么牛顿法比较快？
> 牛顿法是二阶收敛，梯度下降是一阶收敛，所以牛顿法就更快。如果更通俗地说的话，比如你想找一条最短的路径走到一个盆地的最底部，梯度下降法每次只从你当前所处位置选一个坡度最大的方向走一步，牛顿法在选择方向时，不仅会考虑坡度是否够大，还会考虑你走了一步之后，坡度是否会变得更大。所以，可以说牛顿法比梯度下降法看得更远一点，能更快地走到最底部。
> 
> 根据 wiki 上的解释，从几何上说，牛顿法就是用一个二次曲面去拟合你当前所处位置的局部曲面，而梯度下降法是用一个平面去拟合当前的局部曲面，通常情况下，二次曲面的拟合会比平面更好，所以牛顿法选择的下降路径会更符合真实的最优下降路径。

牛顿法**优点**：
* 牛顿法是二阶收敛，速度相当快
* 能高度逼近最优值

**缺点**：
* 牛顿法是局部收敛的，当初始点选择不当时，往往导致不收敛，所以初始点要尽量靠近最优值
* 牛顿法是一种迭代算法，每一步都需要求解目标函数的 Hessian 矩阵的逆矩阵，计算比较复杂
* 对函数要求苛刻（二阶连续可微，海塞矩阵可逆），而且运算量大
* 可能发生被零除错误。当函数在它的零点附近，导函数的绝对值非常小时，运算会出现被零除错误。
* 可能出现死循环。当函数在它的零点有拐点时，可能会使迭代陷入死循环。


## 拟牛顿法 (Quasi-Newton method)
　　牛顿法每次得带都需要求解复杂的 Hessian 矩阵的逆矩阵导致速度很慢甚至当海森矩阵奇异时可能导致数值计算失败或产生的数值不稳定，于是拟牛顿法被提了出来，它使用**正定矩阵**来近似海森矩阵的逆。

<p align="center">
  <img width="330" height="" src="/img/media/1280px-Newton_optimization_vs_grad_descent.svg.png"> 
</p>



## References
1. [Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method)
2. [牛頓法──非線性方程的求根方法](https://ccjou.wordpress.com/2013/07/08/%E7%89%9B%E9%A0%93%E6%B3%95%E2%94%80%E2%94%80%E9%9D%9E%E7%B7%9A%E6%80%A7%E6%96%B9%E7%A8%8B%E7%9A%84%E6%B1%82%E6%A0%B9%E6%96%B9%E6%B3%95/)
3. [牛顿法收敛性定理及其证明](https://www.jianshu.com/p/7c8c902fcd75)
4. [牛顿迭代法](http://netedu.xauat.edu.cn/jpkc/netedu/jpkc2009/jsff/content/dzja/3.4.htm)
5. [最优化问题中，牛顿法为什么比梯度下降法求解需要的迭代次数更少？](https://www.zhihu.com/question/19723347)
6. [梯度下降法、牛顿法和拟牛顿法](https://zhuanlan.zhihu.com/p/37524275)
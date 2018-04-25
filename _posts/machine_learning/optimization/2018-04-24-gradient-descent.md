---
layout: post
title: "Gradient Descent"
author: "Bin Li"
tags: "ML"
category: "Major"
comments: true
published: true
---

Gradient Decent 算法一般是用来迭代求解最优值的，计算目标函数的偏导，取偏导为零，即当前位置的切线方向去更新对应的变量，形成新的目标函数形式，迭代进行此过程，直到满足终止条件。

我们这里以求线性回归的最优值为例，下图是有关房间的面积大小与其售价的关系数据$(x_i,y_i)$，我们利用这些数据来训练出一个线性回归模型，以此来预测房价。

<p align="center">
  <img width="" height="" src="/images/media/15245586264489.jpg">
</p>

我们先假设用以下的数学形式表示线性回归模型：

$$h(\boldsymbol{x}) = \boldsymbol{w}\boldsymbol{x}+b$$

OK，我们现在知道了模型的形式是这样，那么现在的问题是要如何找到这里的两个参数$\boldsymbol{w}$和$b$了。当然要求解最优的参数，我们可以利用的只有已知的数据了，于是，我们想到要模型能够最大限度地拟合现有数据，于是我们可以用简单的平方误差（Sum of Squared Errors）来衡量我们模型的好坏。

$$J(w,b)={1\over2}\Sigma_{i=1}^m((wx_i+b)-y_i)^2$$

通过上面式子可以看出，接下来只要找到能够使得这个SSE最小的模型$(w,b)$就好了。然而，我们一开始是不知道$(w,b)$的值的，于是Gradien Decent的想法就是，我们先随便初始化一个$(w_0,b_0)$，然后通过找到一定的更新策略，一步一步在最小化SSE的目标下，更新$(w,b)$。我们可以对这两个变量求导：

$$\begin{aligned}{\partial \over{\partial w}}J(w,b)& =\Sigma_{i=1}^m((wx_i+b)-y_i)\cdot {\partial \over{\partial w}}((wx_i+b)-y_i) \\ &= \Sigma_{i=1}^m((wx_i+b)-y_i)  x_i\end{aligned}$$

$$\begin{aligned}{\partial \over{\partial b}}J(w,b)& =\Sigma_{i=1}^m((wx_i+b)-y_i)\cdot {\partial \over{\partial b}}((wx_i+b)-y_i) \\ &= \Sigma_{i=1}^m((wx_i+b)-y_i) \end{aligned}$$

于是我们可以用下面的式子更新$(w,b)$：

$$w=w-\alpha {\partial \over{\partial w}}J(w,b) $$

$$b=b-\alpha {\partial \over{\partial b}}J(w,b) $$

其中的$\alpha$是学习率，不能太大也不能太小，太大会导致不能收敛，太小会导致收敛太慢。**所以如何调整这个$\alpha$？**

直到满足终止条件，Gradient Descent 的终止条件一般有这样几种：

* `最大迭代次数`：设定一个最大迭代次数，超过就终止迭代。
* `绝对误差`：当函数值变化接近于零，就停止迭代。
* `相对误差`：当函数值变化小于一个阈值，就停止迭代。

![](https://raw.githubusercontent.com/mattnedrich/GradientDescentExample/master/gradient_descent_example.gif)

可以参考我实现的 [Gradient Descent]()。
## 注意点
- [ ] 如何判断终止条件？
- [ ] 如何选择学习率？

## 与 Method of steepest descent 的区别


---
layout: post
title: Bias and Variance
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

　　在监督学习中，已知样本 $D = \left(x_{1}, y_{1}\right),\left(x_{2}, y_{2}\right), \ldots,\left(x_{n}, y_{n}\right)$，对于测试样本 $x$，令 $y_D$ 为 $x$ 在数据集中的标记，$y$ 为 $x$ 的真实标记， $f(x;D)$ 为训练集 $D$ 上学得模型 $f$ 在 $x$ 上的预测输出。

## 偏差-方差分解（Bias-Variance Decomposition）

　　基于上面的假设，学习算法的**期望预测**为:

$$
\overline{f}(\boldsymbol{x})=\mathbb{E}_{D}[f(\boldsymbol{x} ; D)]
$$

　　使用样本数相同的不同数据集产生的**方差**为：

$$
\operatorname{var}(\boldsymbol{x})=\mathbb{E}_{D}\left[(f(\boldsymbol{x} ; D)-\overline{f}(\boldsymbol{x}))^{2}\right]
$$

　　方差度量了同样大小的训练集的变动所导致的学习性能的变化，即刻画了数据扰动所造成的影响。


　　**噪声**为：

$$
\varepsilon^{2}=\mathbb{E}_{D}\left[\left(y_{D}-y\right)^{2}\right]
$$

　　噪声则表达了在当前任务上任何学习算法所能达到的期望泛化误差的下界，即刻画了学习问题本身的难度。


　　期望输出与真是标记的差别称为**偏差**（bias），即：

$$
\operatorname{bias}^{2}(\boldsymbol{x})=(\overline{f}(\boldsymbol{x})-y)^{2}
$$

　　为了方便讨论，我们假设噪声期望为零，即 $\mathbb{E}_{D}\left[y_{D}-y\right]=0$，那么可对算法的期望泛化误差进行分解：

$$
\begin{aligned} 
E(f ; D) &=\mathbb{E}_{D}\left[\left(f(\boldsymbol{x} ; D)-y_{D}\right)^{2}\right] \\ &=\mathbb{E}_{D}\left[\left(f(\boldsymbol{x} ; D)-\overline{f}(\boldsymbol{x})+\overline{f}(\boldsymbol{x})-y_{D}\right)^{2}\right] \\ &=\mathbb{E}_{D}\left[(f(\boldsymbol{x} ; D)-\overline{f}(\boldsymbol{x}))^{2}\right]+\mathbb{E}_{D}\left[\left(\overline{f}(\boldsymbol{x})-y_{D}\right)^{2}\right] +\mathbb{E}_{D}\left[2(f(\boldsymbol{x} ; D)-\overline{f}(\boldsymbol{x}))\left(\overline{f}(\boldsymbol{x})-y_{D}\right)\right] \\
&=\mathbb{E}_{D}\left[(f(\boldsymbol{x} ; D)-\overline{f}(\boldsymbol{x}))^{2}\right]+\mathbb{E}_{D}\left[\left(\overline{f}(\boldsymbol{x})-y_{D}\right)^{2}\right] \\ 
&=\mathbb{E}_{D}\left[(f(\boldsymbol{x} ; D)-\overline{f}(\boldsymbol{x}))^{2}\right]+\mathbb{E}_{D}\left[\left(\overline{f}(\boldsymbol{x})-y+y-y_{D}\right)^{2}\right] \\ 
&=\mathbb{E}_{D}\left[(f(\boldsymbol{x} ; D)-\overline{f}(\boldsymbol{x}))^{2}\right]+\mathbb{E}_{D}\left[(\overline{f}(\boldsymbol{x})-y)^{2}\right]+\mathbb{E}_{D}\left[\left(y-y_{D}\right)^{2}\right]+2 \mathbb{E}_{D}\left[(\overline{f}(\boldsymbol{x})-y)\left(y-y_{D}\right)\right] \\
&=\mathbb{E}_{D}\left[(f(\boldsymbol{x} ; D)-\overline{f}(\boldsymbol{x}))^{2}\right]+(\overline{f}(\boldsymbol{x})-y)^{2}+\mathbb{E}_{D}\left[\left(y_{D}-y\right)^{2}\right]
\end{aligned}
$$


　　于是有

$$
E(f ; D)=b i a s^{2}(\boldsymbol{x})+\operatorname{var}(\boldsymbol{x})+\varepsilon^{2}
$$

　　即说明，泛化误差看分解为偏差、方差与噪声之和。偏差一方差分解说明，泛化性能是由学习算法的能力、数据的充分性以及学习任务本身的难度所共同决定的。给定学习任务，为了取得好的泛化性能，则需使偏差较小，即能够充分拟合数据，并且使方差较小，即使得数据扰动产生的影响小。

　　一般来说，偏差与方差是有冲突的，这称为偏差一方差窘境（bias-variance dilemma）。下图给出了一个示意图。给定学习任务，假定我们能控制学习算法的训练程度，则在训练不足时，学习器的拟合能力不够强，训练数据的扰动不足以使学习器产生显著变化，此时偏差主导了泛化错误率；随着训练程度的加深，学习器的拟合能力逐渐增强，训练数据发生的扰动渐渐能被学习器学到，方差逐渐主导了泛化错误率；在训练程度充足后，学习器的拟合能力已非常强，训练数据发生的轻微扰动都会导致学习器发生显著变化，若训练数据自身的、非全局的特性被学习器学到了，则将发生过拟合。

![-w567](/img/media/15626762603629.jpg)

![-w568](/img/media/15319044453260.jpg)

如上两个数据，会得到完全一样的模型结果，显然模型在这两个数据集上效果是不一样的，那么我们要如何判断这些模型的好坏呢？有一种方法是可以利用预测值 $\hat{y}$ 序列和真实值 $y$ 序列的**相关系数**来衡量。

线性回归有一个问题就是可能出现欠拟合的现象，因为线性回归是具有最小均方误差的**无偏估计**，那么如果出现欠拟合就不能得到最好的预测效果。如果允许引入一些偏差就能降低预测的均方误差，其中一个办法就是局部加权线性回归（Locally Weighted Linear Regression, LWLR）。

无偏估计，也就是说只要你采用这种方法进行估算，估算的结果的期望值（你可以近似理解为很多次估算结果的平均数）既不会大于真实的平均数，也不会小于之。换句话说：你这种估算方法没有系统上的偏差，而产生误差的原因只有一个：随机因素（也就是你的手气好坏造成的）。

[那么为什么有偏效果就更好？](https://www.matongxue.com/madocs/808.html)

![](/img/media/15320525983645.jpg)

如上图所示，有时候会出现这种情况，那么在这种情况下有偏但有效性好（这种情况就是欠拟合的情况），还是可取的。一般情况下，无偏是比有偏好的。

## References
1. 《机器学习》周志华
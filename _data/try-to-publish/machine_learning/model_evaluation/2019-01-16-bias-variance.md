---
layout: post
title: Bias and Variance
subtitle: 偏差与方差
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

　　在监督学习中，已知样本 $D = \left(x_{1}, y_{1}\right),\left(x_{2}, y_{2}\right), \ldots,\left(x_{n}, y_{n}\right)$，对于测试样本 $x$，令 $y_D$ 为 $x$ 在数据集中的标记，$y$ 为 $x$ 的真实标记， $f(x;D)$ 为训练集 $D$ 上学得模型 $f$ 在 $x$ 上的预测输出。

　　偏差与方差分别是用于衡量一个模型**泛化误差**的两个方面；
* 模型的偏差（Bias）
    * 指的是模型预测的**期望值**与**真实值**之间的差；
    * 偏差用于描述模型的**拟合能力**。
    * 偏差主要由于学习器的表达能力有限导致的系统性错误，表现在训练误差不收敛。
* 模型的方差（Variance）
    * 指的是模型预测的**期望值**与**预测值**之间的差平方和；
    * 方差用于描述模型的**稳定性**。
    * 方差主要由于学习器对于样本分布过于敏感，常见于训练样本数较少时，产生过拟合。

<p align="center">
  <img width="" height="" src="/img/media/15704308421474.jpg">
</p>


## 1. 偏差-方差分解（Bias-Variance Decomposition）

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


　　期望输出与真实标记的差别称为**偏差**（Bias），即：

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

### 1.1 偏差与方差的权衡（过拟合与模型复杂度的权衡）
　　一般来说，偏差与方差是有冲突的，这称为偏差一方差窘境（bias-variance dilemma）。下图给出了一个示意图。给定学习任务，假定我们能控制学习算法的训练程度：
* 当训练不足时，模型的拟合能力不够（数据的扰动不足以使模型产生显著的变化），此时偏差主导模型的泛化误差；
* 随着训练的进行，模型的拟合能力增强（模型能够学习数据发生的扰动），此时方差逐渐主导模型的泛化误差；
* 当训练充足后，模型的拟合能力过强（数据的轻微扰动都会导致模型产生显著的变化），此时即发生过拟合（训练数据自身的、非全局的特征也被模型学习了）


<p align="center">
  <img width="500" height="" src="/img/media/15704311392053.jpg">
</p>

　　偏差和方差的关系和模型容量（模型复杂度）、欠拟合和过拟合的概念紧密相联：
* 当模型的容量增大（x 轴）时， 偏差（用点表示）随之减小，而方差（虚线）随之增大
* 沿着 x 轴存在最佳容量，小于最佳容量会呈现欠拟合，大于最佳容量会导致过拟合。

![](/img/media/15788102581356.jpg)



### 1.2 有偏无偏分析
<p align="center">
  <img width="500" height="" src="/img/media/15319044453260.jpg">
</p>


　　如上两个数据，会得到完全一样的模型结果，显然模型在这两个数据集上效果是不一样的，那么我们要如何判断这些模型的好坏呢？有一种方法是可以利用预测值 $\hat{y}$ 序列和真实值 $y$ 序列的**相关系数**来衡量。

　　线性回归有一个问题就是可能出现欠拟合的现象，因为线性回归是具有最小均方误差的**无偏估计**，那么如果出现欠拟合就不能得到最好的预测效果。如果允许引入一些偏差就能降低预测的均方误差，其中一个办法就是局部加权线性回归（Locally Weighted Linear Regression, LWLR）。

　　无偏估计，也就是说只要你采用这种方法进行估算，估算的结果的期望值（你可以近似理解为很多次估算结果的平均数）既不会大于真实的平均数，也不会小于之。换句话说：你这种估算方法没有系统上的偏差，而产生误差的原因只有一个：随机因素（也就是你的手气好坏造成的）。

　　[那么为什么有偏效果就更好？](https://www.matongxue.com/madocs/808.html)

<p align="center">
  <img width="500" height="" src="/img/media/15320525983645.jpg">
</p>


　　如上图所示，有时候会出现这种情况，那么在这种情况下有偏但有效性好（这种情况就是欠拟合的情况），还是可取的。一般情况下，无偏是比有偏好的。

## References
1. 《机器学习》周志华
2. [ML-机器学习基础](https://github.com/imhuay/Algorithm_Interview_Notes-Chinese/blob/master/A-%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/A-%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E5%9F%BA%E7%A1%80.md)
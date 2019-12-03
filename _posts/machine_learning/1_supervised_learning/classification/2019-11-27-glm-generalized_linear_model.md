---
layout: post
title: Generalized Linear Model
subtitle: 广义线性模型
author: Bin
tags: [Machine Learning]
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

GLM 的好处是能够假设反应变量（response variables）可以服从任意的分布。

* dependent variables, or response variables: 都表示**因变量** $y$
* independent variables, or predictor variable, or explanatory variable: 都表示**自变量** $x$


　　GLM 模型有三个元素组成：
1. 随机成分（Random Component）
    * 一个概率分布的指数簇，给定 $x$ 和 $w$，$y$ 的分布服从参数为 $\theta$ 指数簇分布
    * $y|x;w\sim \text{ExponentialFamily}(\eta)$
    * 给定模型中的自变量 $x$ 的值，随机成分用于指定因变量 $y_i$ 的条件分布（对于 $n$ 个独立采样的观测值的第 $i$ 个）。
2. 系统成分（Systematic Component）
    * 表示自变量可以写成线性预测的组合，这是 GLM 的线性基础
    * 一个线性的预测器（Linear predictor）：$\eta=\mathbf{w}^{T} \mathbf{x}$
3. 连接函数（Link Function）$g$
    * $g$ 是单调可微函数，用来转换因变量的期望值到线性预测器上
    * ${\displaystyle E(Y\mid X)=\mu =g^{-1}(\eta)}$




式子可以写成：

$$
{\displaystyle f_{Y}(\mathbf {y} \mid {\boldsymbol {\theta }},\tau )=h(\mathbf {y} ,\tau )\exp \left({\frac {\mathbf {b} ({\boldsymbol {\theta }})^{\rm {T}}\mathbf {T} (\mathbf {y} )-A({\boldsymbol {\theta }})}{d(\tau )}}\right).\,\!}
$$

　　其中：
* Dispersion parameter, ${\displaystyle \tau }$ 是与分布的方差相关,
* ${\displaystyle h(\mathbf {y} ,\tau )}$, ${\displaystyle \mathbf {b} ({\boldsymbol {\theta }})}$, ${\displaystyle \mathbf {T} (\mathbf {y} )}$, ${\displaystyle A({\boldsymbol {\theta }})}$, 以及 ${\displaystyle d(\tau )}$ 根据不同的指数簇是可以知道的。

![-w645](/img/media/15748503365970.jpg)


### Linear predictor
针对输入数据的线性计算：

$$
\eta_{i}=\mathbf{w}^{T} \mathbf{x}_{i}
$$

### Link function
　　链接函数（Link function）建立了 Linear predictor 和分布函数（distribution function）平均值之间的联系。计算出这个平均值的方式是通过将线性预测器的结果套上一个平均函数（mean function）$g^{-1}$：

$$
\mu_{i}=g^{-1}\left(\eta_{i}\right)=g^{-1}\left(\mathbf{w}^{T} \mathbf{x}_{i}\right)
$$

　　平均函数的逆函数 $g$ 就是连接函数，一般来说 $g$ 的选择只要是有逆的，并且逆函数取值在一定取值范围内的都可以。


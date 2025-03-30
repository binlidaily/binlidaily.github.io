---
layout: post
title: Generalized Linear Model
subtitle: 广义线性模型（GLM）
author: Bin
tags: [Machine Learning]
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

## 0. 广义线性模型
　　先搞清楚 GLM 的三个重要假设：

1. 服从参数为 $\eta$ 的指数簇分布
    * $y\mid x; \theta\sim \text{ExponentialFamily}(\eta)$
    * 给定 $x$ 和 $\theta$，$y$ 的分布服从参数为 $\eta$ 的指数簇分布
2. 给定 $x$，我们的目标是预测已知 $x$ 时 $T(y)$ 的值。
    * 多数时候，有 $T(y) = y$，亦即有 $h(x)=E[y\mid x]$
    * 线性回归和逻辑回归都满足上面这个假设，$h_\theta(x)=p(y=1 \mid x ; \theta)=0 \cdot p(y=0 \mid x ; \theta)+1 \cdot p(y=1 \mid x ; \theta)=\mathrm{E}[y \mid x ; \theta]$
3. 自然参数 $\eta$ 和输入 $x$ 是线性的
    * 如果 $\eta$ 是实数，$\eta=\theta^{T} x$
    * 如果 $\eta$ 是向量，$\eta_{i}=\theta_{i}^{T} x$

　　GLM 的模型对于 $y$ 的不同类型分布的建模非常有效，如下面我们介绍对线性回归和逻辑回归的建模。

## 1. Ordinary Least Squares
　　我们从指数簇分布中可以看到，OLS 属于指数簇。对于实数 $y$ 当有 $x$ 时一般假设服从正态分布，于是有 $y \mid x \sim \text{Gaussian}(\mu,\sigma^2)$，这里的 $\mu$ 可能会依赖于 $x$。

　　我们接下来想让指数簇分布 $\text{ExponentialFamily}(\eta)$ 转换为一个正态分布的形式，由于这里方差 $\sigma^2$ 取任意值对最后的参数 $\theta$ 的选择没有影响，则我们设 $\sigma^2 = 1$。根据正态分布的概率密度函数有：

$$
\begin{aligned} p(y ; \mu) &=\frac{1}{\sqrt{2 \pi}} \exp \left(-\frac{1}{2}(y-\mu)^{2}\right) \\ &=\frac{1}{\sqrt{2 \pi}} \exp \left(-\frac{1}{2} y^{2}\right) \cdot \exp \left(\mu y-\frac{1}{2} \mu^{2}\right) \end{aligned}
$$

　　对应到指数簇分布的公式上，有：

$$
\begin{aligned} \eta &=\mu \\ T(y) &=y \\ a(\eta) &=\mu^{2} / 2 \\ &=\eta^{2} / 2 \\ b(y) &=(1 / \sqrt{2 \pi}) \exp \left(-y^{2} / 2\right) \end{aligned}
$$

　　现在我们来求决策函数 $h_{\theta}(x)$，我们从上面的等式中可知充分统计量等于因变量 $T(y) = y$，即不需要做其他变换，那么我们就用分布的期望值来做为决策函数值：

$$
\begin{aligned} h_{\theta}(x) &=E[y | x ; \theta] \\ &=\mu \\ &=\eta \\ &=\theta^{T} x \end{aligned}
$$

　　这样就推出了线性回归的决策函数。

## 2. Logistic Regression
 　　LR 假设的是服从均值为 $\phi$ 的伯努利分布 $y \mid x \sim \text{Bernoulli}(\phi)$，接下来转换成指数簇分布的形式，首先假设分布的 $y\in\{0, 1\}$，那么我们有：

$$
\begin{aligned} p(y=1;\phi) &=\phi \\ p(y=0;\phi) &=1-\phi \end{aligned}
$$

　　根据伯努利分布的 pmf 有：

$$
\begin{aligned} p(y ; \phi) &=\phi^{y}(1-\phi)^{1-y} \\ &=\exp (y \log \phi+(1-y) \log (1-\phi)) \\ &=\exp \left(\left(\log \left(\frac{\phi}{1-\phi}\right)\right) y+\log (1-\phi)\right) \end{aligned}
$$

　　对照指数分布簇的形式，可以得到：

$$
\begin{aligned} \eta&=\log (\phi /(1-\phi))\\ T(y) &=y \\ a(\eta) &=-\log (1-\phi) \\ &=\log \left(1+e^{\eta}\right) \\ b(y) &=1 \end{aligned}
$$

　　如果我们反转求自然参数 $\eta$ 的过程（即逆函数），反过来求其中的参数 $\phi$：

$$
\phi = \frac{1}{1+e^{-\eta}}
$$

　　接着我们来求决策函数 $h_{\theta}(x)$，我们从上面的等式中可知充分统计量等于因变量 $T(y) = y$，即不需要做其他变换，那么我们就用分布的期望值来做为决策函数值：

$$
\begin{aligned} h_{\theta}(x) &=E[y | x ; \theta] \\ &=1\times \phi + 0 \times(1 - \phi)\\ &=\phi \\ &=1 /\left(1+e^{-\eta}\right) \\ &=1 /\left(1+e^{-\theta^{T} x}\right) \end{aligned}
$$

　　这样就得出了 LR 的决策函数。

GLM 的好处是能够假设反应变量（response variables）可以服从任意的分布。

* dependent variables, or response variables: 都表示**因变量** $y$
* independent variables, or predictor variable, or explanatory variable: 都表示**自变量** $x$

## Old Explanation
　　GLM 模型有三个元素组成：
1. 随机成分（Random Component）
    * 模型服从一个指数分布簇中的某一个分布（特定自然参数），给定 $x$ 和 $w$，$y$ 的分布服从参数为 $\eta$ 指数簇分布
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

## References
1. [从广义线性模型(GLM)理解逻辑回归](https://fighterhit.oschina.io/2017/12/24/machine_learning_notes/%E4%BB%8E%E5%B9%BF%E4%B9%89%E7%BA%BF%E6%80%A7%E6%A8%A1%E5%9E%8B%E7%90%86%E8%A7%A3%E9%80%BB%E8%BE%91%E5%9B%9E%E5%BD%92/)
2. 《CSS 229》
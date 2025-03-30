---
layout: post
title: Maximum Likelihood Estimation
subtitle: 最大似然估计
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　给定一个概率分布 $D$，已知其概率密度函数（连续分布）或概率质量函数（离散分布）为 $f_D$，已知一个分布参数 $\theta$，我们可以从这个分布中抽出一个具有 $n$ 个值的采样 ${\displaystyle x_{1}, x_{2},\ldots ,x_{n}}$，利用 $f_D$ 计算出其**似然函数**（给定联合样本值 $\textbf{x}$ 下关于(未知)参数 $\theta$ 的函数）：

$$
{\displaystyle {\mbox{L}}(\theta \mid x_{1},\dots ,x_{n})=f(x_{1},\dots ,x_{n}\vert {\theta })=f_{\theta }(x_{1},\dots ,x_{n})}
$$

1. 如果 $D$ 是离散分布，$f_{\theta}$ 即是当参数为 $\theta$ 时观测到当前这一采样的概率。
2. 如果 $D$ 是连续分布，$f_{\theta}$ 则为 ${\displaystyle x_{1}, x_{2},\ldots ,x_{n}}$ 联合概率分布的概率密度函数在观测值处（当前采样）的取值。

　　一旦有了 $x_{1}, x_{2},\ldots ,x_{n}$，那么我们就可以求得一个关于 $\theta$ 的估计。因为 $\theta$ 可以取很多种组合，如何寻找一个能够使得当前采样的“可能性”最大？从数学上来说就是如何在 $\theta$ 所有可能取值中找到一个值使得似然函数取得最大值。最大似然估计（MLE）将参数 $\theta$ 看成一个未知的值，其本身可以看作参数 $\theta$ 的函数。

　　求最大似然估计量的一般步骤：
* （1）根据假设的分布写出似然函数；
* （2）对似然函数取对数（log、ln）；
* （3）求对数似然函数的导数并令其为零得到似然方程；
* （4）求解似然方程。

　　最大似然估计的特点：
1. 比其他估计方法更加简单；
2. 收敛性：无偏或者渐近无偏，当样本数目增加时，收敛性质会更好；
3. 如果假设的类条件概率模型正确，则通常能获得较好的结果。但如果假设模型出现偏差，将导致非常差的估计结果。

　　缺点就是数据比较少的时候往往 overfit。

## 线性回归举例最大似然估计
　　如果有数据集 $(X,Y)$，并且 $Y$ 是有白噪声（就是与测量得到的 $Y$ 与真实的 $Y_{real}$ 有均值为零的高斯分布误差），目的是用新产生的 $X$ 来得到 $Y$。我们有如下一些假设：

1. $X$ 符合任意分布。
2. $\epsilon$ 是白噪声，即 $\epsilon \sim N\left(0, \sigma^{2}\right)$，且且与观察数据无关。
3. 样本之间相互独立。

　　如果用线性模型来测量，那么有：

$$
f(X)=\sum_{i}\left(\beta_{i0}+\beta_{i1} x_i\right)+\epsilon=\beta_{0}+\beta_{1} x+\epsilon
$$

　　我们假设白噪声 $\epsilon$ 在不同的衡量指标下都独立，输入 $X$ 是已知的，那么 $Y$ 因为是 $\beta_{0}+\beta_{1} x$ 和随机变量 $\epsilon$ 的加和，则 $Y$ 也成为一个随机变量，并且其数据分布也承袭了白噪声的高斯分布：

$$
p\left(y | x ; \beta_{0}, \beta_{1}\right) = p_{\varepsilon}\left(y-\beta_{0}-\beta_{1} x \right) = \mathcal{N}\left(y | \beta_{0}+\beta_{1} x, \sigma^{2}\right)
$$

　　那么对于单个 $(x_i, y_i)$ 的条件概率密度函数可以写成：

$$
p\left(y_{i} | x_{i} ; \beta_{0}, \beta_{1}, \sigma^{2}\right) = \frac{1}{\sqrt{2 \pi \sigma^{2}}} e^{-\frac{\left(y_{i}-\left(\beta_{0}+\beta_{1} x_{i}\right)\right)^{2}}{2 \sigma^{2}}}
$$

　　假设所有样本相互独立，则参数的似然函数如下：


$$
p\left(y | x ; \beta_{0}, \beta_{1}, \sigma^{2}\right) = \prod_{i=1}^{n} p\left(y_{i} | x_{i} ; \beta_{0}, \beta_{1}, \sigma^{2}\right)=\prod_{i=1}^{n} \frac{1}{\sqrt{2 \pi \sigma^{2}}} e^{-\frac{\left(y_{i}-\left(\beta_{0}+\beta_{1} x_{i}\right)\right)^{2}}{2 \sigma^{2}}}
$$

　　套上对数变成对数似然函数：

$$
\begin{aligned} L\left(\beta_{0}, \beta_{1}, \sigma^{2}\right) &=\log \prod_{i=1}^{n} p\left(y_{i} | x_{i} ; \beta_{0}, \beta_{1}, \sigma^{2}\right) \\ &=\sum_{i=1}^{n} \log p\left(y_{i} | x_{i} ; \beta_{0}, \beta_{1}, \sigma^{2}\right) \\ &=-\frac{n}{2} \log 2 \pi-n \log \sigma-\frac{1}{2 \sigma^{2}} \sum_{i=1}^{n}\left(y_{i}-\left(\beta_{0}+\beta_{1} x_{i}\right)\right)^{2} \end{aligned}
$$

　　最大化对数似然函数其实就是最小化其中的 $\left(y_{i}-\left(\beta_{0}+\beta_{1} x_{i}\right)\right)^{2}$！这就得到了最小二乘法的计算公式，可见线性回归使用最小二乘作为损失函数也是很合理的，符合极大似然估计的做法。

## 概率和似然的比较
　　概率和似然都是指可能性，但在统计学中，概率和似然有截然不同的用法。概率描述了已知参数时的随机变量的输出结果；似然则用来描述已知随机变量输出结果时，未知参数的可能取值。例如，对于“一枚正反对称的硬币上抛十次”这种事件，我们可以问硬币落地时十次都是正面向上的“概率”是多少；而对于“一枚硬币上抛十次，五次正面冲上“，我们则可以问，这枚硬币正反面对称的“似然”程度是多少。

　　概率(密度)表达给定 $\theta$ 下样本随机向量 $X=x$ 的可能性，而似然表达了给定样本 $X=x$ 下参数 $\theta_1$(相对于另外的参数 $\theta_2$)为真实值的可能性。我们总是对随机变量的取值谈概率，而在非贝叶斯统计的角度下，参数是一个实数而非随机变量，所以我们一般不谈一个参数的概率，而说似然。



## References
1. [最大似然估计](https://zh.wikipedia.org/wiki/最大似然估计)
2. [一文搞懂极大似然估计](https://zhuanlan.zhihu.com/p/26614750)
3. [如何理解似然函数](https://www.zhihu.com/question/54082000)
4. [如何通俗地理解概率论中的「极大似然估计法」?](https://www.zhihu.com/question/24124998)
5. [Laplace（拉普拉斯）先验与L1正则化](https://www.cnblogs.com/heguanyou/p/7688344.html)
6. [lr-mle.pdf](/assets/lr-mle.pdf)
7. [probabilistic_modeling_compendium.pdf](/assets/probabilistic_modeling_compendium.pdf)
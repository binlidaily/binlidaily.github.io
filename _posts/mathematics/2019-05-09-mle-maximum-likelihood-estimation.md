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

　　一旦有了 $x_{1}, x_{2},\ldots ,x_{n}$，那么我们就可以求得一个关于 $\theta$ 的估计。因为 $\theta$ 可以取很多种组合，如何寻找一个能够使得当前采样的“可能性”最大？从数学上来说就是如何在 $\theta$ 所有可能取值中找到一个值使得似然函数取得最大值。最大似然估计将参数 $\theta$ 看成一个未知的值，其本身可以看作参数 $\theta$ 的函数。

求最大似然估计量的一般步骤：
* （1）根据假设的分布写出似然函数；
* （2）对似然函数取对数（log、ln）；
* （3）求对数似然函数的导数并令其为零得到似然方程；
* （4）求解似然方程。

最大似然估计的特点：
1. 比其他估计方法更加简单；
2. 收敛性：无偏或者渐近无偏，当样本数目增加时，收敛性质会更好；
3. 如果假设的类条件概率模型正确，则通常能获得较好的结果。但如果假设模型出现偏差，将导致非常差的估计结果。



## References
1. [最大似然估计](https://zh.wikipedia.org/wiki/最大似然估计)
2. [一文搞懂极大似然估计](https://zhuanlan.zhihu.com/p/26614750)
3. [如何理解似然函数](https://www.zhihu.com/question/54082000)
4. [如何通俗地理解概率论中的「极大似然估计法」?](https://www.zhihu.com/question/24124998)
---
layout: post
title: Maximum A Posteriori Estimation
subtitle: 最大后验概率
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　根据贝叶斯定理，我们能得到后验概率的计算公式：

$$
\begin{aligned} P(\theta | y) &=\frac{P(y | \theta) P(\theta)}{P(y)} \\ \text { posterior } &=\frac{\text { likelihood } \cdot \text { prior }}{\text { evidence }} \end{aligned}
$$

　　其中 $\theta$ 表示模型的参数，$y$ 这里表示的是数据，可以看成包含了特征和类标。后验概率说的是，给定了数据后，尝试去估计对应的模型参数，当然是通过估计参数的概率分布的形式来进行估计。

　　那么我们可以通过最大化后验概率来估计参数：

$$
\begin{aligned} \hat{\theta}_{\mathbf{M A P}} &=\arg \max _{\theta} P(\theta | y) \\ &=\arg \max _{\theta} \frac{P(y | \theta) P(\theta)}{P(y)} \\ &=\arg \max _{\theta} P(y | \theta) P(\theta) \\ &=\arg \max _{\theta} \log (P(y | \theta) P(\theta)) \\ &=\arg \max _{\theta} \log P(y | \theta)+\log P(\theta) \end{aligned}
$$

　　因为数据确定时 $P(y)$ 就为一个常数了，最大化后验概率的时候就可以将其去掉，然后为了方便可能出现的连乘变成连加的形式，我们会在最大化后验概率的时候套上一个单调的对数函数。

　　这里对比一下最大似然估计的式子，可见最大似然估计不考虑参数本身的先验概率，而最大后验概率是有一定的参数概率分布先验。

$$
\hat{\theta}_{\mathrm{MLE}}=\arg \max _{\theta} \log P(y | \theta)
$$

## References
1. [如何通俗地解释贝叶斯线性回归的基本原理？](https://www.zhihu.com/question/22007264/answer/20014371)
2. [A Probabilistic Interpretation of Regularization](http://bjlkeng.github.io/posts/probabilistic-interpretation-of-regularization/)
3. [Bayes’ Theorem: An Informal Derivation](https://www.probabilisticworld.com/anatomy-bayes-theorem/)
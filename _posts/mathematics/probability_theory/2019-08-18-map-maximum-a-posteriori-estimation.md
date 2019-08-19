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

## 选择先验对线性回归的正则化推导
　　不同的先验会引导线性回归得到不同的正则化，正态分布先验得到 L2 正则，Laplace 先验得到 L1 正则。

### 正态分布先验
　　对于线性回归，我们可以从极大似然估计[博客](http://binlidaily.github.io/2019-05-09-mle-maximum-likelihood-estimation)里看到其 $p(y\vert \theta)$ 的计算，然后这里我们采用正态分布的先验，即每个参数 $\beta_i$ 都是服从零均值单位方差 $\tau$ 的正态分布，那么最大后验概率的计算求解参数的式子可以写成：

$$
\begin{align*}
&\arg \max _{\beta} \log P(y | \beta)+\log P(\beta)\\
 &=\arg\max_{\bf \beta} \Big[ \log \prod_{i=1}^{n} \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{(y_i- (\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2}{2\sigma^2}}
 + \log \prod_{j=0}^{p} \frac{1}{\tau\sqrt{2\pi}}e^{-\frac{\beta_j^2}{2\tau^2}} \Big] \\
&= \arg\max_{\bf \beta} \Big[- \sum_{i=1}^{n} {\frac{(y_i- (\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2}{2\sigma^2}}
 - \sum_{j=0}^{p} {\frac{\beta_j^2}{2\tau^2}} \Big]\\
&= \arg\min_{\bf \beta} \frac{1}{2\sigma^2} \big[ \sum_{i=1}^{n} (y_i-(\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2
 + \frac{\sigma^2}{\tau^2} \sum_{j=0}^{p} \beta_j^2 \big] \\
&= \arg\min_{\bf \beta} \big[ \sum_{i=1}^{n} (y_i-(\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2 + \lambda \sum_{j=0}^{p} \beta_j^2 \big]
\end{align*}
$$

　　可见，从参数服从正态分布可以推导到 L2 正则。

### Laplace 分布先验
　　假设零均值的 Laplace 先验，则最大化后验概率估计可得到参数：

$$
\begin{align*}
&\arg \max _{\beta} \log P(y | \beta)+\log P(\beta)\\
&= \arg\max_{\bf \beta} \Big[ \log \prod_{i=1}^{n} \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{(y_i- (\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2}{2\sigma^2}}
 + \log \prod_{j=0}^{p} \frac{1}{2b}e^{-\frac{|\beta_j|}{2b}} \Big] \\
&= \arg\max_{\bf \beta} \Big[- \sum_{i=1}^{n} {\frac{(y_i- (\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2}{2\sigma^2}}
 - \sum_{j=0}^{p} {\frac{|\beta_j|}{2b}} \Big]\\
&= \arg\min_{\bf \beta} \frac{1}{2\sigma^2} \big[ \sum_{i=1}^{n} (y_i-(\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2
 + \frac{\sigma^2}{b} \sum_{j=0}^{p} |\beta_j| \big] \\
&= \arg\min_{\bf \beta} \big[ \sum_{i=1}^{n} (y_i-(\beta_0 + \beta_1 x_{i,1} + ... + \beta_p x_{i,p}))^2 + \lambda \sum_{j=0}^{p} |\beta_j| \big]
\end{align*}
$$

## References
1. [如何通俗地解释贝叶斯线性回归的基本原理？](https://www.zhihu.com/question/22007264/answer/20014371)
2. [A Probabilistic Interpretation of Regularization](http://bjlkeng.github.io/posts/probabilistic-interpretation-of-regularization/)
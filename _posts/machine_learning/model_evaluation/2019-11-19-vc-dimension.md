---
layout: post
title:  VC Dimension
subtitle: VC 维
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---


## VC Dimensionality
![](/img/media/15733755452384.jpg)

"As the number of features or dimensions grows, the amount of data we need to generalize accurately grows exponentially."

　　在一定程度上增加特征，是能够提升模型效果的。但是过了一个门槛后，增加特征就没有太大作用了，因为特征维度越大，要实现好的模型效果就需要指数级增长的数据支撑。这就是维度灾难，所以我们并不能一维的增加模型特征个数，需要做一定的特征选择。

### 1. VC dimension
　　如果VC维很小，那么发生预测偏差很大的坏事情的可能性也就很小，那这有利于Ein(g)接近Eout(g)；但是，这是我们的假设空间的表达能力受到了限制，这样Ein(g)可能就没有办法做到很小。

　　如果VC维很大，那么假设空间的表达能力很强，我们很有可能选到一个Ein(g)很小的假设，但是Ein(g)和Eout(g)之差很大的坏事情发生的情况发生的可能性就变得很大，这样Ein(g)和Eout(g)根本不接近，我们就无法确定选择的假设在测试数据的时候表现的很好。

## References
1. [《台大机器学习基石》VC Dimension](http://kubicode.me/2015/08/15/Machine%20Learning/VC-Dimension/)
2. [Vapnik-Chervonenkis dimension](https://blog.csdn.net/u010945683/article/details/78061247)
---
layout: post
title: "Machine Learning by Hung-yi Lee"
author: "Bin Li"
tags: ""
category: ""
comments: true
published: false
---

## ML Lecture 0-1: Introduction of Machine Learning

* Supervised Learning
* Unsupervised Learning
* Semi-Supervised Learning

![](/images/media/15252473988428.jpg)


Reiforcement Learning 是数据不够的情况下才开始用的，能用 Supervised Learning 的就用之。

## ML Lecture 1: Regression - Case Study
![](/images/media/15252493832068.jpg)

两个偏导数放一起就是 gradient。

![](/images/media/15252498956436.jpg)

用线性回归可能不是很好，那么可以加上二次，甚至多次的结果。
![](/images/media/15252499405450.jpg)

![](/images/media/15252499722591.jpg)


![](/images/media/15252500118688.jpg)


我们可以看到，用到4次的时候，结果已经更差了，所以就没有必要再往高了拟合了。

![](/images/media/15252500726292.jpg)

我们整合在一起看，这里我们用了更加复杂的模型，那么我们的training error是会降低，但是testing error反而会更差了，很明显已经过拟合了。

![](/images/media/15252501773723.jpg)




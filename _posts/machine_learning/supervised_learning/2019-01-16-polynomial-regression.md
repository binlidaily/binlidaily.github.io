---
layout: post
title: Polynomial Regression
subtitle: 多项式回归算法 
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---
## Polynomial regression（多项式回归算法）
多项式要在线性回归的基础上对训练数据做对应的拓展，可以想象成就是线性回归，不过在线性回归之前，我们将输入数据X做了一下多项式的变换。

例如，假设我们的输入数据X是下面这样：

![](/img/media/15310163561755.jpg)

对于一般的线性回归，我们只要找到对应的参数就可以完成设定了，这里没有将bias的1加进去。

$$y=a_1x$$

那么，如果多项式回归我们设定的阶数是 $3$ 的话，在进行线性回归代入前，我们将 $X$ 转化成多项式形式：

![](/img/media/15310186312398.jpg)

那么最后的形式就是：

$$y=\alpha_1x+\alpha_2x^2+\alpha_3x^3$$

**需要弄清楚的几个概念**：
* [ ] 随机变量
* [ ] non-parametric algorithm vs parametric learning algorithm

### Parametric algorithms 参数方法
参数方法指的是那些有固定且有限的参数的模型，只需要存储这些参数即可不需要存储数据，因为我们在预测是不需要利用训练数据。

## References
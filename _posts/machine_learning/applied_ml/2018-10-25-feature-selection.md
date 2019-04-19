---
layout: post
title: Feature Selection
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　在数据预处理完成后，我们需要选择有意义的特征输入机器学习的算法和模型进行训练，通常来说从以下两个方面来选择特征:
1. 特征是否发散：如果一个特征不发散，例如方差接近于零，也就是说样本在这个特征上基本上没有差异，这个特征对区分样本并没有什么用。
2. 特征与目标的相关性：优先选择与目标相关性高的特征，

## References
1. [特征选择](https://zhuanlan.zhihu.com/p/32749489)
2. [为何推荐sklearn做单机特征工程？【下】](https://mp.weixin.qq.com/s/1RHBQMlC8eyJcbNcArTtCQ)
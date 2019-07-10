---
layout: post
title: Click Models
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　CTR (Click-through rate, 点击率)预估在工业级推荐系统、广告系统中是非常重要的一个环节, 其预估效果会直接影响推荐系统的性能。CTR预估常伴有训练数据量大、特征高度稀疏、推断性能要求高等特点，使得算法的设计多围绕这些特点来进行。

现阶段, 工业级的推荐系统常因为候选集数据量、系统响应时效等因素的影响, 需要分多个阶段完成整个推荐的流程, 具体地, 常将其分为**召回**与**排序**两大阶段。

我们通常先采用多路召回策略(协同过滤、热点、用户画像标签等)从待推荐物料库中先召回一批数据, 使数据量下降到千量级. 由于召回阶段的数据量较大, 所以要求该阶段所使用的策略和模型要足够的简单. 通过召回阶段, 我们顺利地将待排序数据量降至千量级, 此时, 我们便可以通过用户画像、物料画像、用户行为记录等数据来进行排序, 从而得到用户对每个物料的CTR预估值. 

## LR 在 CTR 预估中的应用



对于特征的离散化，在 CTR 预估中通常还会使用 GBDT+LR 的方法，用 GBDT 产生稀疏特征后在放入 LR 中进行训练，效果还不错。




## References
1. [点击模型：提升算法精度的利器](https://www.infoq.cn/article/tool-to-improve-the-accuracy-of-algorithm)
2. [Kaggle: Display Advertising Challenge](https://www.kaggle.com/c/criteo-display-ad-challenge)
3. [Kaggle: Click-Through Rate Prediction](https://www.kaggle.com/c/avazu-ctr-prediction)
4. [Kaggle: Avito Demand Prediction Challenge](https://www.kaggle.com/c/avito-demand-prediction) 
5. [**CTR点击率预估之经典模型回顾**](http://www.tensorinfinity.com/paper_161.html)
6. [LR+FTRL算法原理以及工程化实现](https://zhuanlan.zhihu.com/p/55135954)



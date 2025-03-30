---
layout: post
title: Graph Embedding
subtitle: 图嵌入
author: Bin Li
tags: [Deep Learning, Graph Model]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

　　图嵌入（Graph Embedding/Network Embedding，GE），属于表示学习的范畴，也可以叫做网络嵌入，图表示学习，网络表示学习等等。通常有两个层次的含义：

- **将图中的节点表示成低维、实值、稠密的向量形式**，使得得到的向量形式可以在向量空间中具有表示以及推理的能力，这样的向量可以用于下游的具体任务中。例如用户社交网络得到节点表示就是每个用户的表示向量，再用于节点分类等；
- **将整个图表示成低维、实值、稠密的向量形式**，用来对整个图结构进行分类；



　　图嵌入的方式主要有三种：

- **矩阵分解：**基于矩阵分解的方法是将节点间的关系用矩阵的形式加以表达，然后分解该矩阵以得到嵌入向量。通常用于表示节点关系的矩阵包括邻接矩阵，拉普拉斯矩阵，节点转移概率矩阵，节点属性矩阵等。根据矩阵性质的不同适用于不同的分解策略。
- **DeepWalk：**DeepWalk 是基于 word2vec 词向量提出来的。word2vec 在训练词向量时，将语料作为输入数据，而图嵌入输入的是整张图，两者看似没有任何关联。但是 DeepWalk 的作者发现，预料中词语出现的次数与在图上随机游走节点被访问到底的次数都服从幂律分布。因此 DeepWalk 把节点当做单词，把随机游走得到的节点序列当做句子，然后将其直接作为 word2vec 的输入可以节点的嵌入表示，同时利用节点的嵌入表示作为下游任务的初始化参数可以很好的优化下游任务的效果，也催生了很多相关的工作；
- **Graph Neural Network：**图结合deep learning方法搭建的网络统称为图神经网络GNN，也就是下一小节的主要内容，因此图神经网络GNN可以应用于图嵌入来得到图或图节点的向量表示；



## 参考

1. [一文读懂图卷积GCN](https://zhuanlan.zhihu.com/p/89503068)
---
layout: post
title: Weights Initialization in Deep Learning
subtitle: 深度学习中的权重初始化
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
---

　　在深度学习中神经网络的权重初始化方法对模型的收敛速度和模型性能质量有着至关重要的影响。在深度神经网络中，随着层数的增多，我们在梯度下降的过程中，极易出现梯度消失或者梯度爆炸。因此，对权重w的初始化则显得至关重要，一个好的权重初始化虽然不能完全解决梯度消失和梯度爆炸的问题，但是对于处理这两个问题是有很大的帮助的，并且十分有利于模型性能和收敛速度。



　　BN 其实弱化了参数初始化的作用，但是我们一旦不使用了BN,使用传统的随机初始化容易出现梯度消失的问题，因此决定尝试一些其他的参数初始化方法。

　　深度学习中不少时候也会使用梯度下降法进行优化，在优化开始时需要对参数赋初值，这个初值的选取比较关键。

　　一般我们会希望数据和参数的均值都为 0，输入和输出数据的方差一致。在实际应用中，参数服从高斯分布或者均匀分布都是比较有效的初始化方式。

　　为了使得在经过多层网络后，信号不被过分放大或过分减弱，我们尽可能保持 每个神经元的输入和输出的方差一致。

* 高斯分布初始化：参数从一个固定均值(比如0)和固定方差(比如0.01)的高斯分布进行随机初始化。
* 均匀分布初始化：在一个给定的区间[-r,r]内采用均匀分布来初始化参数。超参数r的设置可以按照神经元的连接数量进行自适应的调整。
* 初始化一个深层神经网络时，一个比较好的初始化策略是保持每个神经元输入和输出的方差一致。


## 1. 初始化为 $0$ 或某个常数
　　在感知器和 logistic 回归的训练中，我们一般将参数全部初始化为 0。但是在深度学习里，我们不可以将权重全部初始化为 0！考虑全连接的深度神经网络，同一层中的任意神经元都是同构的，它们拥有相同的输入和输出，如果再将参数全部初始化为同样的值，那么无论前向传播还是反向传播的取值都是完全相同的。这样会导致深层神经元没有区分 性，这种现象也称为对称权重现象。学习过程将永远无法打破这种对称性，最终同一网络层中的各个参数仍然是相同的。

## 2. 预训练（Pre-training）
　　Pre-training 是早期训练神经网络的有效初始化方法，一个便于理解的例子是先使用逐层贪婪预训练（Greedy layerwise auto-encoder）做 unsupervised pre-training，然后再做 fine-tuning。

1. Pre-training 阶段，将神经网络中的每一层取出，构造一个 auto-encoder 做训练，使得输入层和输出层保持一致。在这一过程中，参数得以更新，形成初始值。
2. Fine-tuning 阶段，将 pre-train 过的每一层放回神经网络，利用 pre-train 阶段得到的参数初始值和训练数据对模型进行整体调整。在这一过程中，参数进一步被更新，形成最终模型。

　　随着数据量的增加以及 activation function 的发展，pre-training的概念已经渐渐发生变化。目前，从零开始训练神经网络时我们也很少采用auto-encoder进行pre-training，而是直奔主题做模型训练。在迁移学习中，不想从零开始训练神经网络时，我们往往选择一个已经训练好的在任务A上的模型（称为 pre-trained model），将其放在任务B上做模型调整（称为fine-tuning）。

## 高斯分布初始化
　　Gaussian 初始化方法是最简单的初始化方法，参数从一个固定均值（比如 $0$）和固定方差（比如 $0.01$）的高斯分布进行随机初始化。

　　初始化一个深度网络时，一个比较好的初始化方案是保持每个神经元输入和输出的方差为一个常量。当一个神经元的输入连接数量为 $n_{in}$ 时，可以设置其输入连接权重以
$\mathcal{N}(0, \sqrt{\frac{1}{n_{i n}}})$ 的高斯分布进行初始化。如果同时考虑输出连接的数量 $n_{out}$，则可以按 $\mathcal{N}(0, \sqrt{\frac{2}{n_{i n}+n_{o u t}}})$ 的高斯分布进行初始化。

然而只适用于小型网络,对于深层次网络,权重小导致反向传播计算中梯度也小,梯度"信号"被削弱.

### 为什么用正态分布
一般来讲权重矩阵是K个N维向量。从直觉上来讲，如果这K个N维向量在N维空间中均匀分布在以原点为中心的N-1维单位超球面上，在随机性上应该是最好的。因为这样，这K个向量的夹角为均匀分布。

此时问题变成了，如何在N-1维超球面上进行均匀采样。根据这篇论文A note on a method for generating points uniformly on n-dimensional spheres 可知，若对N维向量的每个分量进行N(0,1)的正态分布采样，生成K个N维向量，然后投影到单位超球面上，那么形成的K个N维向量在单位超球面上均匀分布。

所以用正态分布初始化，再单位化，就可以达到这种效果。当然也可以不必单位化(事实上每个向量还要用BN重新放缩,所以不可能单位化)，此时也能达到K个向量的夹角为均匀分布。

但事实上在高维空间中的深度学习中的采样都是稀疏采样，很难达到真正的均匀分布。理论上我猜最好的方法是不用采样，而是用算法直接在N-1维超球面上进行均匀划分获得K个N维点。

### 为什么用截断的正态分布
我们知道正态分布有个3σσ原则，意思就是99.7%的点都在距离中心3个标准差之内。换句话说，随机初始化的权值依然是有可能是离中心点比较远的。

假设我们用了sigmoid作为激活函数，一旦初始值过小，或者过大，就可能会导致输入到隐藏层的数据太小或者太大，从而进入饱和区。一旦进入饱和区，这些对应的neuron就死掉了，再也不会更新了。

所以为了防止这个dying neuron现象，我们就用了截断正态，保证初始的权值不太大也不太小。

## 3. 随机初始化（Random Initialization）
　　随机初始化是很多人目前经常使用的方法，然而这是有弊端的，一旦随机分布选择不当，就会导致网络优化陷入困境。


## 4. Xavier 初始化（Xavier Initialization）
　　Xavier初始化的基本思想是保持输入和输出的方差一致，这样就避免了所有输出值都趋向于0。注意，为了问题的简便，Xavier初始化的推导过程是基于线性函数的，但是它在一些非线性神经元中也很有效。

## 5. He initialization
　　在ReLU网络中，假定每一层有一半的神经元被激活，另一半为0，所以，要保持variance不变，只需要在Xavier的基础上再除以2

## Batch Normalization Layer
　　Batch Normalization是一种巧妙而粗暴的方法来削弱bad initialization的影响，其基本思想是：If you want it, just make it!


![](/img/media/15841798431306.jpg)



参数初始化方法：
1. 截断高斯分布
2. 随机初始化
3. Xavier 初始化（适用于激活函数是 Sigmoid 和 tanh）
    * 尽可能的让输入和输出服从相同的分布，这样就能够避免后面层的激活函数的输出值趋向于 0
    * Understanding the difficulty of training deep feedforward neural networks
    * Uniform 形式和 Normal 形式
3. He initialization
4. MSRA 初始化
    * Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet Classification

## 总结
1. 当前的主流初始化方式 Xavier，MSRA 主要是为了保持每层的输入与输出方差相等, 而参数的分布采用均匀分布或高斯分布都行。

2. 在广泛采用 Batch Normalization 的情况下，使用普通的小方差的高斯分布即可。

3. 在迁移学习的情况下，优先采用预训练的模型进行参数初始化。

## References
1. [深度学习权重初始化的几种方法](https://blog.csdn.net/alxe_made/article/details/81433330)
2. [深度学习中神经网络的几种权重初始化方法](https://blog.csdn.net/u012328159/article/details/80025785?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)
3. [聊一聊深度学习的weight initialization](https://zhuanlan.zhihu.com/p/25110150)
4. [深度学习中的参数初始化](https://blog.csdn.net/mzpmzk/article/details/79839047)
5. [权重初始化方式](https://blog.csdn.net/u012370185/article/details/94996773)
6. [神经网络中权值初始化的方法 - 更多](https://blog.csdn.net/u013989576/article/details/76215989)
7. [Weight Initialization in Neural Networks: A Journey From the Basics to Kaiming](https://towardsdatascience.com/weight-initialization-in-neural-networks-a-journey-from-the-basics-to-kaiming-954fb9b47c79)
8. [深度学习 权重初始化为什么要用正态分布](https://blog.csdn.net/LYF1993/article/details/91558395)
9. [随机三维单位向量的生成算法如何做到均匀分布？](https://www.zhihu.com/question/26579222)
10. [为什么神经网络用截断正态分布生成初始权值？](http://sofasofa.io/forum_main_post.php?postid=1004400)
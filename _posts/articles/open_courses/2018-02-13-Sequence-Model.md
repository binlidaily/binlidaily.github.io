---
layout: post
title: "Sequence Model"
author: "Bin Li"
tags: [Open Courses, Deep Learning]
comments: true
style: |
  .container {
        max-width: 44rem;
    } 
published: false
---

- [ ] 如何理解 time step

## Week 1
### Why sequence models

有着这些 sequence data 的相关问题：

![](/images/media/15185238564570.jpg)

![](/images/media/15185318428137.jpg)

![](/images/media/15185320627036.jpg)

为什么不能用常用的网络呢？

* 输入输出在不同的例子中可能有着不同大小，于是不能固定使用
* 不能从不同位置的文本学习到可以共享的特征


![](/images/media/15187848783728.jpg)

RNN 只能用到前面的信息，后面的信息用不上。

### 前向传播
![](/images/media/15187903777158.jpg)

![](/images/media/15187919491493.jpg)

### 后向传播


### Different types of RNNs
![](/images/media/15218715230193.jpg)

![](/images/media/15218719648653.jpg)


### Language model and sequence generation
- [ ] 这个word在RNN实现的时候是怎么表示的？
- [ ] 怎么用loss function衡量缺失？


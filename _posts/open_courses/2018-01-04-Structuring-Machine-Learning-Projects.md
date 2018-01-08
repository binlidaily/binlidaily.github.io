---
layout: post
title: "Structuring Machine Learning Projects"
author: "Bin Li"
tags: "Open_Courses Deep_Learning"
comments: true
style: |
  .container {
        max-width: 44rem;
    } 
published: false
---

*Structuring Machine Learning Projects* 是 Andrew NG 的 deeplearing.ai 中的第四门课。主要讲

## Comparing to human-level performance
### Why human-level performance
![](/images/media/15150771159840.jpg)



为什么要跟真人级别的性能对比呢？因为当我们的模型效果比人差的时候，我们就可以利用人类的能力对模型做一些优化。包括：

* 从人类那里得到更多有标注的数据
* 从人类角度做错误分析得到更佳的洞察力
* 从人类那儿得到更好的对于准和确比较好的分析


### Avoidable bias
![](/images/media/15151526777697.jpg)

看 Bayes error 和 training error 的差距（reduce bias），以及 training error 和 validation error 的差距（reduce variance），哪个有课增加的空间就去尝试哪方面。

Bayes error is the lowest possible prediction error that can be achieved and is the same as irreducible error.

### Understanding human-level performance
![](/images/media/15152279167960.jpg)

一般选人类能达到的最好的错误率作为 proxy 或者叫 estimate of Bayes error。

![](/images/media/15152283641353.jpg)

要知道怎么去选择优化 bias 还是 variance。

### Surpassing human-level performance
![](/images/media/15152285907937.jpg)


![](/images/media/15152287577018.jpg)


![](/images/media/15152304054119.jpg)



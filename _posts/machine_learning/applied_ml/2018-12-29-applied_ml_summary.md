---
layout: post
title: Applied Machine Learning Summary
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

## Handle with Bad Case (Error Analysis)
继续。

CTR 预测：
* FFM

搜索、推荐或广告系统

* 负责小程序账号搜索、内容搜索的排序算法优化、搜索意图识别等相关研究工作。
* 内容质量判定、召回及排序等系列问题。

自然语言处理！

“bad case 分析”

关注 bad case，即**分错的样例**。具体到本例，比如针对幸存者，我们对从原始训练集中拆分出的测试集进行预测，把预测结果和真实数据做个对比，仔细观察错误项，看到底是什么原因给它分错了，这有助于我们进一步优化特征。

在模型优化过程中，经常分析bad case，可能会发现一些我们忽视的特征 或者特征问题。 例如实际标注为正样本，但是预测出来的确实负样本，且概率特别低的负样本，都是可以作为分析的对象，一般拿一批类似样本分析，就可能会找到问题规律所在。这个也是在模型优化阶段，发现潜在问题的有效手段。


处理思路：
(1)找出所有bad cases 
(2)逐一对每个 badcase 分析找出原因 
(3)分析对应的 error 类别 
(4)统计不同 error 类别占总体的比例 
(5)发现问题的优先级 
(6)构思新的优化方法

2.3 Bad-case分析
　　Bad-case分析也是经常要做的，怎么做呢？ 
　　分类问题Bad-case分析： 
1. 哪些训练样本分错了？ 
2. 我们哪部分特征使得它做了这个判定？ 
3. 这些bad cases有没有共性？例如bad的都是新产品，材质的问题？ 
4. 是否有还没挖掘的特性？分错的样本有没有新的特征是没考虑到的？ 
　　回归问题Bad-case分析：哪些样本预测结果差距大， 为什么 

Bad-Case 分析
关注错误样本的相关信息：

* 那些样本分错了
* 哪些特征促使模型做出此判断（权值高）
* 这些 bad-case 存在那些共性
* 是否有可以继续挖掘的特性
* 哪些样本预测结果与真实结果差距非常大，以及为什么。

## References
1. [Error Analysis](http://mlwiki.org/index.php/Error_Analysis)
2. [机器学习模型应用以及模型优化的一些思路](https://blog.csdn.net/mozhizun/article/details/60966354)
3. [工作流程与模型调优](https://blog.csdn.net/JoyceWYJ/article/details/51659747)
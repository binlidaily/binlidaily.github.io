---
layout: post
title: Bad Case Analysis
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　在进一步优化模型的时候，其中重要的一步是，要分析 bad case，即**分错的样例**。具体到 Kaggle Titanic 比赛中的实例，比如针对幸存者，我们对从原始训练集中拆分出的测试集进行预测，把预测结果和真实数据做个对比，仔细观察错误项，看到底是什么原因给它分错了，这有助于我们进一步优化特征。

　　在模型优化过程中，经常分析 bad case，可能会发现一些我们忽视的特征或者特征问题。例如实际标注为正样本，但是预测出来的却是负样本，且概率特别低的负样本，都是可以作为分析的对象，一般拿一批类似样本分析，就可能会找到问题规律所在。这个也是在模型优化阶段，发现潜在问题的有效手段。

　　误差分析也是机器学习至关重要的步骤。通过观察误差样本，全面分析误差产生误差的原因：
* 是参数的问题还是算法选择的问题
* 是特征的问题还是数据本身的问题（这里要怎么定位原因的来由？）。

　　诊断后的模型需要进行调优，调优后的新模型需要重新进行诊断，这是一个反复迭代不断逼近的过程，需要不断地尝试，进而达到最优状态。

## 分类问题的 Bad Case 分析
处理思路是：
1. 找出所有 bad cases，看看哪些训练样本分错了？
2. 逐一对每个 badcase 分析找出原因 
    * 我们哪部分特征使得它做了这个判定？
    * 这些 bad cases 有没有共性？例如 bad 的都是新产品，材质的问题？
3. 分析对应的 error 类别 
4. 统计不同 error 类别占总体的比例 
5. 发现问题的优先级 
    * 是否有还没挖掘的特性？分错的样本有没有新的特征是没考虑到的？ 
6. 构思新的优化方法


## 回归问题的 Bad Case 分析
主要看哪些样本预测结果差距大，找出为什么 ？


## References
1. [Error Analysis](http://mlwiki.org/index.php/Error_Analysis)
2. [机器学习模型应用以及模型优化的一些思路](https://blog.csdn.net/mozhizun/article/details/60966354)
3. [工作流程与模型调优](https://blog.csdn.net/JoyceWYJ/article/details/51659747)
4. [Titanic 竞赛的 bad case 分析](https://blog.csdn.net/haishu_zheng/article/details/80300705)
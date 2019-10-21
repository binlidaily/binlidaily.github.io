---
layout: post
title: Interview
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　在这个部分主要总结一下面试的一些注意，帮助自己梳理一下面试中一些重要的内容，以便于自己能够更好地做准备，毕竟程序员是一个跳槽较为频繁的行业啊！

## 1. 机器学习面试

　　机器学习方面的面试主要包括三个方面：

1. 算法和理论基础
2. 工程实现能力和编码水平
3. 业务理解和思考深度

### 1.1 算法和理论基础

　　算法理论方面，要对 LR，SVM，决策树，KNN，KMeans 等一些聚类算法随手写出核心迭代步骤的伪代码！

　　数学知识方面，要深刻理解矩阵的各种变换，尤其是**特征值**相关的内容。优化的算法更要撸一波，像梯度下降（利用平面逼近局部）、牛顿法（利用曲面逼近局部）等。

### 1.2 工程实现能力和编码水平

　　工程实现角度主要看机器学习各个算法中对应的数据结构至少要很清楚，比如 KNN 用的是 KD 树，那么如何给图结构设计数据结构？

### 1.3 业务理解和思考深度

　　算法的先进性对真正业务结果的影响不到 30%，离线算法最好在 4 个小时内完成。机器学习大多数场景是搜索，广告，安全，垃圾过滤，推荐系统等等，对业务有深刻理解对做出来的结果影响可能超过 70%。

## 2. 人工智能相关岗位智能
### 2.1 平台搭建类
* 数据计算平台搭建，基础算法实现
* 要求支持大样本量、高维度数据，所以可能还需要底层开发、并行计算、分布式计算等方面的知识

### 2.2 算法研究类
*	**文本挖掘**，如领域知识图谱构建、垃圾短信过滤等
*	**推荐**，广告推荐、APP 推荐、题目推荐、新闻推荐等；
*	**广告投放效果分析**；
*	**排序**，搜索结果排序、广告排序等；
*	**互联网信用评价**；
*	**图像**识别、理解。

### 2.3 数据挖掘类
* 	商业智能，如统计报表
*	用户体验分析，预测流失用户

　　以上是根据求职季有限的接触所做的总结。有的应用方向比较成熟，业界有足够的技术积累，比如搜索、推荐，也有的方向还有很多开放性问题等待探索，比如互联网金融、互联网教育。在面试的过程中，一方面要尽力向企业展现自己的能力，另一方面也是在增进对行业发展现状与未来趋势的理解，特别是可以从一些刚起步的企业和团队那里，了解到一些有价值的一手问题。
## References
1. [Algorithm_Interview_Notes-Chinese](https://github.com/imhuay/Algorithm_Interview_Notes-Chinese)
2. [牛客技术类汇总](https://www.nowcoder.com/discuss/146655)
3. [面试官如何判断面试者的机器学习水平？](https://www.zhihu.com/question/62482926)
4. [如何准备机器学习工程师的面试 ？](https://www.zhihu.com/question/23259302/answer/527513387)
5. [机器学习 · 学以致用-圆桌会议](https://www.zhihu.com/roundtable/jiqixuexi)
6. [你实践中学到的最重要的机器学习经验是什么？](https://www.zhihu.com/question/46301335)
7. [什么是 A/B 测试？](https://www.zhihu.com/question/20045543)
8. [41 Essential Machine Learning Interview Questions (with answers)](https://www.springboard.com/blog/machine-learning-interview-questions/)
9. [【技术类】2019校招技术类岗位面经汇总](https://www.nowcoder.com/discuss/146655)
10. [深度学习500问](https://github.com/scutan90/DeepLearning-500-questions)
11. [最全BAT算法面试100题：阿里、百度、腾讯、京东、美团、今日头条](https://maimai.cn/article/detail?fid=1227449005&efid=PlYbSWtiXlKeGqCA0mAXKg)
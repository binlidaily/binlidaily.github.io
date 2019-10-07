---
layout: post
title: 学习方法
subtitle: 关于学习的零星火花
author: Bin Li
tags: [Articles]
image: 
comments: true
published: true
---

## 1. 专业课学习
　　如何搭建一个理解论文的框架？
* 算法伪代码要清楚！（关键步骤，流程）
* 核心贡献，解决什么问题？

### 1.1 做笔记
　　在写代码实现的时候，把所有的问题先都记录下来，做完紧急的部分后回来回顾补充，而不要太相信自己的记忆力！
- 记 MD 笔记
	- 对于每一比较重要的工作都建立一个MD文件
		- 在进行此工作时，遇到的问题和解决办法简单记录
		- 看过的参考文献也要及时附上
		- 对于一些已经归好类的问题记录（如 Python）整理好放到对应的文档中，不留在当前文档
	- 算法整理
		- 刚开始简要介绍该算法，想象成这段话是要给面试官听的
- 思维导图
	- 主要用于记录梗概，想法
- 严肃输出形式
	- Day One
		- 私密内容的整理
	- 个人博客
		- 博彩内容的润色

### 1.2 学习算法
* 多结合 Kaggle 的 kernel 走几遍！
* 熟悉一个知识的百分之70%就去运用，你可以更早的构建知识的连结点。而不是等到你学满之后在去。这样可以减少你的记忆量，帮助你更快的学习。
* 写代码之前要先手写伪代码
* 写一些代码模板方便后续使用
- 实现算法那一定要先把算法的伪代码想清楚了再写
- **对于不好理解的部分，举例子或者做类比**
* 复习笔记时，要强调手写出核心公式，清楚推导过程，并能手写出伪代码！
* 在学习的时候强调用自己的话组织一下学习过的东西，不要图省事直接拷贝。

**有效学习的六个阶段 PQ4R**：
* 预习（Preview）
* 问题（Questions）
* 阅读（Read）
* 思考（Reflect）
* 重述（Recite）
* 复习（Review）

**算法**解释模板：
1. 一个图例（如 SVM margin）
2. 算法的**核心思想**要清楚
3. 关键表达式能写出
    1. 决策/目标函数（其中含有一些待求参数）
    2. 最小化损失函数（得到待求参数）
        * 最优参数计算公式（求导为零就能一步计算得到）
        * 迭代公式（需要迭代计算偏导更新参数）
4. 算法过程能通过文字伪代码的形式写出
5. 算法优缺点，即缺点拓展
6. 算法使用场景及**特征处理要求**
7. 实践示例及调参相关
8. 看算法的原来 Paper 以及源代码（可以是 github 上的简单实现也可以是 Sklearn 的实现）

速记版：
2. 算法的**核心思想**要清楚
3. 关键表达式能写出
    1. 决策/目标函数（其中含有一些待求参数）
    2. 最小化损失函数（得到待求参数）
        * 最优参数计算公式（求导为零就能一步计算得到）
        * 迭代公式（需要迭代计算偏导更新参数）
4. 算法过程能通过文字伪代码的形式写出
5. 算法优缺点，即缺点拓展
6. 算法使用场景及**特征处理要求**
7. 实践示例及调参相关
8. 看算法的原来 Paper 以及源代码（可以是 github 上的简单实现也可以是 Sklearn 的实现）


编程（Github 展示）主要偏向：
1. 尝试复现想要学习的比赛流程，不要觉得都是琐碎的工作就放弃不做，真实工作其实也差不多。
    1. 在复用的同时，可以附上该算法的普遍用法，比如代码实例，调参实例等
2. 第二个就是尝试实现各个算法的简单版本，以期更好的了解算法原理。
3. 刷题。


![费曼技巧](/img/media/%E8%B4%B9%E6%9B%BC%E6%8A%80%E5%B7%A7.jpg)

## 善用佳器
* 画网络结构图，[参考](https://zhuanlan.zhihu.com/p/60146525)。
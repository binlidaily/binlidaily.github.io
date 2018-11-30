---
layout: post
title: Ensemble Learning
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: false
---

10.2.36.246

理论上可以证明（周志华机器学习第八章），随着集成中个体分类器数目 T 的增大，集成的错误率将指数级下降，最终趋向于零。值得注意的是，这里的前提是基学习器的误差相互独立！

目前的集成方法大致分成两类：
* 个体学习器之间存在强依赖关系、必须串行生成的序列化方法（Boosting）
* 个体学习器间不存在强依赖关系、可同时生成的并行化方法（Bagging 和 Random Forest）

思想：通过将多个弱学习器集成起来能够达到强学习器的效果。“三个臭皮匠顶个诸葛亮”。

问题：
* 如何得到这些弱分类器？
* 有了弱分类器，如何集成？即结合策略。
---
layout: post
title: Resampling For Imbalanced Dataset
subtitle: 不均衡样本集的重采样
author: Li Bin
tags: [Machine Learning]
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

为什么很多分类模型在训练数据不均衡时会出现问题？
* 本质原因是模型在训练时优化的目标函数和人们在测试时使用的评价标准不一致。这种“不一致”可能是由于训练数据的样本分布与测试时期望的样本分布不一致，例如，在训练时优化的是整个训练集（正负样本比例可能是1∶99）的正确率，而测试时可能想要模型在正样本和负样本上的平均正确率尽可能大（实际上是期望正负样本比例为1∶1）；
* 也可能是由于训练阶段不同类别的权重（重要性）与测试阶段不一致，例如训练时认为所有样本的贡献是相等的，而测试时假阳性样本（FalsePositive）和伪阴性样本（FalseNegative）有着不同的代价。

不均衡样本集的重采样
* 基于数据的方法
    * 最简单就是随机采样
        * 过采样（Over-resampling）
        * 欠采样（Under-resampling）
    * 对于过采样出现的过拟合问题可以采用一些方法生成新样本
        * SMOTE 算法
        * Borderline-SMOTE 算法
        * ADASYN 算法
    * 对于欠采样的数据丢失问题可以采用 Informed Undersampling 算法
        * Easy Ensemble 算法
        * Balance Cascade 算法
        * NearMiss、One-sided Selection 等
* 基于算法的方法
    * 代价敏感学习
    * 极不平衡时采用单类学习、异常点检测

## 不平衡学习的评价方法

## References
1. [不平衡数据下的机器学习方法简介](http://baogege.info/2015/11/16/learning-from-imbalanced-data/)
2. [Credit Fraud || Dealing with Imbalanced Datasets](https://www.kaggle.com/janiobachmann/credit-fraud-dealing-with-imbalanced-datasets)
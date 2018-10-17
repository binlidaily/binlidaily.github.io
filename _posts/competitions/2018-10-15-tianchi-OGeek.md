---
layout: post
title: OGeek
subtitle:
author: Bin Li
tags: [Competitions]
image: 
comments: true
published: false
---

[题意](https://tianchi.aliyun.com/competition/uploadResult.htm?spm=5176.11165261.5678.6.e53b2efcpMtq9U&raceId=231688)理解：用户输入前缀词，然后有预测出来的用户完整需求查询词，那么就会有一篇文章出现（怎么出现的？应该是我们推荐给他的？），以及这篇文章相关的标题和标签内容，然后预测用户会不会点击该文章。

## Load Data
读取数据注意下数据的奇葩格式：
```
挂号 {"挂号信是什么": "0.023", "挂号网上预约": "0.029", "挂号网官网": "0.015", "挂号信": "0.082", "挂号": "0.066", "挂号信单号查询": "0.075", "挂号平台": "0.025", "挂号网": "0.225", "挂号信查询": "0.201", "挂号信查询中国邮政": "0.020", "挂号预约": "0.021"} 预约挂号网 应用 1
挂号 {"挂号信是什么": "0.023", "挂号网上预约": "0.029", "挂号网官网": "0.015", "挂号信": "0.082", "挂号": "0.066", "挂号信单号查询": "0.075", "挂号平台": "0.025", "挂号网": "0.225", "挂号信查询": "0.201", "挂号信查询中国邮政": "0.020", "挂号预约": "0.021"} 挂号网 网站 0
```



```python
train_df = pd.read_csv('datalab/4608/OGeek算法挑战赛最新版本数据/oppo_round1_train_20180929.txt', sep='\t', error_bad_lines=False, names=['prefix', 'query_prediction', 'title', 'tag', 'label'])
test_df = pd.read_csv('datalab/4608/OGeek算法挑战赛最新版本数据/oppo_round1_test_A_20180929.txt', sep='\t', error_bad_lines=False, names=['prefix', 'query_prediction', 'title', 'tag'])
val_df = pd.read_csv('datalab/4608/OGeek算法挑战赛最新版本数据/oppo_round1_vali_20180929.txt', sep='\t', error_bad_lines=False, names=['prefix', 'query_prediction', 'title', 'tag', 'label'])
```

## 思路
> 不太懂CTR比赛的专业解决方案，谨在此分享一些思路和资料，仅供参考，大佬请忽略。

> 主线思路：CTR思路，围绕用户点击率做文章(如开源中：单字段点击率，组合字段点击率等等) (FM, FFM模型，参考腾讯社交广告比赛？？)
> 文本匹配思路（Kaggle Quora） 传统特征：抽取文本相似度特征，各个字段之间的距离量化 https://www.kaggle.com/c/quora-question-pairs https://github.com/qqgeogor/kaggle-quora-solution-8th https://github.com/abhishekkrthakur/is_that_a_duplicate_quora_question
> 深度学习模型(1DCNN, Esim, Decomp Attention，ELMO等等)： https://www.kaggle.com/rethfro/1d-cnn-single-model-score-0-14-0-16-or-0-23/notebook https://www.kaggle.com/lamdang/dl-models/comments 更多文本匹配模型见斯坦福SNLI论文集：https://nlp.stanford.edu/projects/snli/
> 文本分类思想：主要是如何组织输入文本？另外query_prediction权重考虑？ 传统特征：tfidf，bow，ngram+tfidf，sent2vec，lsi，lda等特征 深度学习模型： 参考知乎看山杯(知乎)以及Kaggle Toxic比赛 https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/discussion/52557 https://www.kaggle.com/larryfreeman/toxic-comments-code-for-alexander-s-9872-model/comments https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/discussion/52702
> Stacking无效(模型个数限制)，简单Blending，NN+LightGBM的方案比较靠谱？
> PS1：词向量可使用word2vec训练或者使用公开词向量数据：https://github.com/Embedding/Chinese-Word-Vectors PS2：分词需要加上自定义词典，分词质量对模型训练很重要！





### TODO
- [ ] 如何利用这样的数据，全是文本，候选词还有概率。

ngrams+dssm

## Problems
读数据的时候报错.

```shell
ParserError: Error tokenizing data. C error: Expected 20 fields in line
```

fix

```python
test_df = pd.read_csv('datalab/4608/OGeek算法挑战赛最新版本数据/oppo_round1_test_A_20180929.txt', sep=' ', error_bad_lines=False)
```



## Refereces
1. [Outbrain Click Prediction](https://www.kaggle.com/c/outbrain-click-prediction/data)
2. [Click-Through Rate Prediction](https://www.kaggle.com/c/avazu-ctr-prediction/data)
3. [CS 276 / LING 286: Information Retrieval and Web Search](https://web.stanford.edu/class/cs276/)
4. [1st Place Solution for Search Results Relevance Competition on Kaggle](https://github.com/ChenglongChen/Kaggle_CrowdFlower)
5. [ML理论&实践](https://zhuanlan.zhihu.com/c_152307828)
6. [https://tianchi.aliyun.com/notebook/detail.html?spm=5176.11409386.0.0.72e31d07RvAjeX&id=25725](https://tianchi.aliyun.com/notebook/detail.html?spm=5176.11409386.0.0.72e31d07RvAjeX&id=25725)
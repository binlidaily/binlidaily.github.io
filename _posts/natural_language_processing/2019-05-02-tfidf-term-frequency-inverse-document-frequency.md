---
layout: post
title: Term Frequency Inverse Document Frequency
subtitle: 词频和逆文档频率
author: Bin Li
tags: [Coding]
image: 
comments: true
published: true
---

　　通过过滤停用词词表。

```python
# 进行分词操作
    tokens = cut_model.tokenize(doc)
    # 使用停止用词表去除停用词
    doc = [token for token in tokens if token not in stopwords]
    # 将去除停用词后的字符串使用' '连接，为了接下来的词袋模型做准备
    doc = ' '.join(doc)
```
    
　　字词的重要程度与其在文档中出现的频率成正比，与字词在其他文档中出现的频率成反比。当一个单词在当前这篇文章里出现的频率高，但在其他文章中出现的频率低，那么可以认为这个单词具有较强的区分能力，比较适合做分类。

　　TF（Term Frequency）表示的是词频：即这个词在一篇文档中出现的频率。假设在文档 $d$ 中，总得单词数为 $size(d)$，单词 $w$ 出现的次数为 $count(w, d)$，则单词 $w$ 在 $d$ 中的频率为：

$$
tf(w, d) = count(w, d) / size(d)
$$

　　这里为什么要对出现的次数除去文档总的单词数呢，其实是在做归一化，是为了保证数据结果相对于其他文档的公平性，比如长文档里统计的某个单词的出现次数很大概率会比短文档高，但是其并不一定能代表文档。

　　IDF（Inverse Document Frequency）表示的是逆文档频率。假设在文档集 $D$ 总文档数为 $size(D)$，而 $w$ 在文档集的 $count(w, D)$ 个文档出现次数，则单词逆向文件频率为：

$$
idf(w, D) = log(size(D) / count(w, D))
$$

　　可以看出出现该词的文档个数越小，表示这个词越稀有，在这篇文档中也是越重要。
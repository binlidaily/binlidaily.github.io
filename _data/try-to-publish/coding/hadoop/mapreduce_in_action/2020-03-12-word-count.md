---
layout: post
title: Word Count
subtitle: 统计单词
author: Bin Li
tags: [Coding, MapReduce]
image: 
comments: true
published: true
---

## Spark
　　在 pyspark 命令行下可以：

```shell
>>> textFile = sc.textFile("file:///usr/local/spark/mycode/wordcount/word.txt")
>>> wordCount = textFile.flatMap(lambda line: line.split(" ")).map(lambda word: (word,1)).reduceByKey(lambda a, b : a + b)
>>> wordCount.collect()
```

　　写成 python 脚本：

```python
from pyspark import SparkContext
sc = SparkContext( 'local', 'test')
textFile = sc.textFile("file:///usr/local/spark/mycode/wordcount/word.txt")
wordCount = textFile.flatMap(lambda line: line.split(" ")).map(lambda word: (word,1)).reduceByKey(lambda a, b : a + b)
wordCount.foreach(print)
```

## MapReduce

```python
class WordCount:

    # @param {str} line a text, for example "Bye Bye see you next"
    def mapper(self, _, line):
        # Please use 'yield key, value'
        for word in line.split():
            yield word, 1

    # @param key is from mapper
    # @param values is a set of value with the same key
    def reducer(self, key, values):
        # Please use 'yield key, value'
        yield key, sum(values)
```

## References
1. [Spark2.1.0+入门：第一个Spark应用程序：WordCount(Python版)](http://dblab.xmu.edu.cn/blog/1692-2/)
2. [MapReduce implement word count](https://www.michael-noll.com/tutorials/writing-an-hadoop-mapreduce-program-in-python/)
3. [LintCode Word Count Problem](https://www.lintcode.com/problem/word-count-map-reduce/description)
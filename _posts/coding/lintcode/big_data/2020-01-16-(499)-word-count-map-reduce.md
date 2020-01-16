---
layout: post
title: 499. Word Count (Map Reduce)
subtitle: 
author: Bin Li
tags: [Coding, LintCode]
image: 
comments: true
published: true
---

## Description

Using map reduce to count word frequency.

https://hadoop.apache.org/docs/r1.2.1/mapred_tutorial.html#Example%3A+WordCount+v1.0

Example 1:

```
Input:
    chunk1: "Google Bye GoodBye Hadoop code"
    chunk2: "lintcode code Bye"

Output:
    Bye: 2
    GoodBye: 1
    Google: 1
    Hadoop: 1
    code: 2
    lintcode: 1
```

Example 2:

```
Input:
    chunk1: "Lintcode is so so good"

Output:
    Lintcode: 1
    good: 1
    is: 1
    so: 2
```


## Solutions
### 1. MapReduce

```python
# Python
class WordCount:

    # @param {str} line a text, for example "Bye Bye see you next"
    def mapper(self, _, line):
        # Write your code here
        # Please use 'yield key, value'
        for word in line.split():
            yield word, 1

    # @param key is from mapper
    # @param values is a set of value with the same key
    def reducer(self, key, values):
        # Write your code here
        # Please use 'yield key, value'
        yield key, sum(values)
```


```java
// java
/**
 * Definition of OutputCollector:
 * class OutputCollector<K, V> {
 *     public void collect(K key, V value);
 *         // Adds a key/value pair to the output buffer
 * }
 */
public class WordCount {

    public static class Map {
        public void map(String key, String value, OutputCollector<String, Integer> output) {
            // Write your code here
            // Output the results into output buffer.
            // Ps. output.collect(String key, int value);
            String[] words = value.trim().split("\\s+");
            for (String word: words){
                output.collect(word, 1);
            }
        }
    }

    public static class Reduce {
        public void reduce(String key, Iterator<Integer> values,
                           OutputCollector<String, Integer> output) {
            // Write your code here
            // Output the results into output buffer.
            // Ps. output.collect(String key, int value);
            int sum = 0;
            while(values.hasNext()){
                sum += values.next();
            }
            output.collect(key, sum);
        }
    }
}
```
## References
1. [499. Word Count (Map Reduce)](https://www.lintcode.com/problem/word-count-map-reduce/description)
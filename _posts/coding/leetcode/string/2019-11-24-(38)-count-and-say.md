---
layout: post
title: 38. Count and Say
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, String]
image: 
comments: true
published: true
---

## Description

The count-and-say sequence is the sequence of integers with the first five terms as following:

```
1.     1
2.     11
3.     21
4.     1211
5.     111221
```

`1` is read off as `"one 1"` or `11`.
`11` is read off as `"two 1s"` or `21`.
`21` is read off as `"one 2`, then `one 1"` or `1211`.

Given an integer *n* where 1 ≤ *n* ≤ 30, generate the *n*th term of the count-and-say sequence.

Note: Each term of the sequence of integers will be represented as a string.

 

**Example 1:**

```
Input: 1
Output: "1"
```

**Example 2:**

```
Input: 4
Output: "1211"
```

## Solutions
　　主要是题目理解的意思，下一个数的输出，是针对上一个数的读取。

### 1. 迭代

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def countAndSay(self, n: int) -> str:
        if n <= 0:
            return ''
        res = '1'
        if n == 1:
            return '1'
        for i in range(n-1):
            res = self.count_read(res)
        return res
    
    def count_read(self, strs):
        if not strs:
            return ''
        n = len(strs)
        if n == 1:
            return '1'+ strs
        cnt = 1
        res = ''
        for i in range(n):
            if i >= 1 and strs[i-1] == strs[i]:
                cnt += 1
            elif i >= 1 and strs[i-1] != strs[i]:
                res += str(cnt) + strs[i-1]
                cnt = 1
            if i == n-1:
                if cnt == 1:
                    res += '1' + strs[i]
                else:
                    res += str(cnt) + strs[i]
        return res
# 18/18 cases passed (36 ms)
# Your runtime beats 84.12 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [38. Count and Say](https://leetcode.com/problems/count-and-say/)



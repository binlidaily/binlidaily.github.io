---
layout: post
title: 43. Multiply Strings
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, String]
image: 
comments: true
published: true
---

## Description

Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string.

**Example 1:**

```
Input: num1 = "2", num2 = "3"
Output: "6"
```

**Example 2:**

```
Input: num1 = "123", num2 = "456"
Output: "56088"
```

**Note:**

1. The length of both `num1` and `num2` is < 110.
2. Both `num1` and `num2` contain only digits `0-9`.
3. Both `num1` and `num2` do not contain any leading zero, except the number 0 itself.
4. You **must not use any built-in BigInteger library** or **convert the inputs to integer** directly.


## Solutions
### 1. Math
　　值得注意的是，提前用一个很长且全零的数组预存好结果，然后算进位和当前位的时候都在这个基础上进行操作。

```python
# Time: O(nm)
# Space: O(n)
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if not num1 or not num2:
            return ''
        if num1 == '0' or num2 == '0':
            return '0'
        str_int = dict(zip(list('0123456789')+['10', '11', '12', '13', '14', '15', '16', '17', '18'], range(19)))
        int_str = dict(zip(range(19), list('0123456789')+['10', '11', '12', '13', '14', '15', '16', '17', '18']))
        l1, l2 = len(num1), len(num2)
        res = ['0'] * (l1 + l2)
        for i in range(l1-1, -1, -1):
            for j in range(l2-1, -1, -1):
                # this is crucial
                add = str_int[res[i + j + 1]] + str_int[num1[i]] * str_int[num2[j]]
                res[i + j + 1] = int_str[add % 10]
                res[i + j] = int_str[str_int[res[i + j]] + add // 10]
        l = len(res)
        for i in range(l):
            if res[i] != '0' or i == l - 1:
                return ''.join(res[i:])
        return ''

# 311/311 cases passed (132 ms)
# Your runtime beats 48.33 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

## References
1. [43. Multiply Strings](https://leetcode.com/problems/multiply-strings/description/)
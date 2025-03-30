---
layout: post
title: 171. Excel Sheet Column Number
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

## Description

Given a column title as appear in an Excel sheet, return its corresponding column number.

For example:

```
    A -> 1
    B -> 2
    C -> 3
    ...
    Z -> 26
    AA -> 27
    AB -> 28 
    ...
```

**Example 1:**

```
Input: "A"
Output: 1
```

**Example 2:**

```
Input: "AB"
Output: 28
```

**Example 3:**

```
Input: "ZY"
Output: 701
```


## Solutions
### 1. Math

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def titleToNumber(self, s: str) -> int:
        keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        values = range(1, 27)
        hash_map = dict(zip(keys, values))
        res = 0
        for ch in s:
            res = res * 26 + hash_map[ch]
        return res

# 1000/1000 cases passed (32 ms)
# Your runtime beats 53.41 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```

　　利用现成的库：

```python
from functools import reduce
# Time: O(n)
# Space: O(n)
class Solution:
    def titleToNumber(self, s: str) -> int:
        return reduce(lambda x, y : x * 26 + y, [ord(c) - 64 for c in list(s)])

# 1000/1000 cases passed (32 ms)
# Your runtime beats 53.41 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [171. Excel Sheet Column Number](https://leetcode.com/problems/excel-sheet-column-number/)
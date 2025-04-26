---
layout: post
title: 6. ZigZag Conversion
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, String]
image: 
comments: true
published: true
---

## Description

The string `"PAYPALISHIRING"` is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

```
P   A   H   N
A P L S I I G
Y   I   R
```

And then read line by line: `"PAHNAPLSIIGYIR"`

Write the code that will take a string and make this conversion given a number of rows:

```
string convert(string s, int numRows);
```

**Example 1:**

```
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"
```

**Example 2:**

```
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
Explanation:

P     I    N
A   L S  I G
Y A   H R
P     I
```


## Solutions
### 1. String

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def convert(self, s: str, numRows: int) -> str:
        if numRows == 1:
            return s
        n = len(s)
        interval = 2 * (numRows - 1)
        res = ''
        # first row
        for i in range(0, n, interval):
            res += s[i]
        # middle lines
        for r in range(1, numRows - 1):
            inter = 2 * r
            i = r
            while i < n:
                res += s[i]
                inter = interval - inter
                i += inter
            
        for i in range(numRows-1, n, interval):
            res += s[i]
        return res

# 1158/1158 cases passed (52 ms)
# Your runtime beats 86.83 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

## References
1. [6. ZigZag Conversion](https://leetcode.com/problems/zigzag-conversion/description/)
2. [规律](https://www.cnblogs.com/TenosDoIt/p/3738693.html)
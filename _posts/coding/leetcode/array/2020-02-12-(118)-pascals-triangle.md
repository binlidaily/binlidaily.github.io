---
layout: post
title: 118. Pascal's Triangle
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Array]
image: 
comments: true
published: true
---

## Description

Given a non-negative integer *numRows*, generate the first *numRows* of Pascal's triangle.

![](/img/media/15815014656452.jpg)


In Pascal's triangle, each number is the sum of the two numbers directly above it.

**Example:**

```
Input: 5
Output:
[
     [1],
    [1,1],
   [1,2,1],
  [1,3,3,1],
 [1,4,6,4,1]
]
```


## Solutions
### 1. Array
```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        if numRows <= 0:
            return []
        res = []
        for i in range(numRows):
            row = []
            for j in range(i):
                if j == 0:
                    row.append(1)
                else:
                    row.append(res[-1][j-1] + res[-1][j])
            row.append(1)
            res.append(row)
        return res

# 15/15 cases passed (24 ms)
# Your runtime beats 88.09 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [118. Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/)

---
layout: post
title: 119. Pascal's Triangle II
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Array]
image: 
comments: true
published: true
---

## Description

Given a non-negative index *k* where *k* ≤ 33, return the *k*th index row of the Pascal's triangle.

Note that the row index starts from 0.

![](/img/media/15815014656452.jpg)

In Pascal's triangle, each number is the sum of the two numbers directly above it.

**Example:**

```
Input: 3
Output: [1,3,3,1]
```

**Follow up:**

Could you optimize your algorithm to use only *O*(*k*) extra space?


## Solutions
### 1. 从右往左计算

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def getRow(self, rowIndex: int) -> List[int]:
        res = [1] + [0] * (rowIndex)
        for i in range(1, rowIndex + 1):
            for j in range(i, 0, -1):
                res[j] = res[j] + res[j-1]
        return res

# 34/34 cases passed (24 ms)
# Your runtime beats 90.08 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [119. Pascal's Triangle II](https://leetcode.com/problems/pascals-triangle-ii/description/)

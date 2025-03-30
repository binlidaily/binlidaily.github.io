---
layout: post
title: 739. Daily Temperatures
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Stack]
image: 
comments: true
published: true
---

## Description

Given a list of daily temperatures `T`, return a list such that, for each day in the input, tells you how many days you would have to wait until a warmer temperature. If there is no future day for which this is possible, put `0` instead.

For example, given the list of temperatures `T = [73, 74, 75, 71, 69, 72, 76, 73]`, your output should be `[1, 1, 4, 2, 1, 1, 0, 0]`.

**Note:** The length of `temperatures` will be in the range `[1, 30000]`. Each temperature will be an integer in the range `[30, 100]`.


## Solutions
### 1. Brute Force
　　TLE.

```python
# Time: O(n^2)
# Space: O(1)
class Solution:
    def dailyTemperatures(self, T: List[int]) -> List[int]:
        n = len(T)
        res = []
        for i in range(n-1):
            gap = 0
            for j in range(i+1, n):
                if T[i] < T[j]:
                    gap = j - i
                    break
            res.append(gap)
        res.append(0)
        return res

# Time Limit Exceeded
# 28/37 cases passed (N/A)
```

### 2. Stack

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def dailyTemperatures(self, T: List[int]) -> List[int]:
        n = len(T)
        stack = []
        res = [0] * n
        for i in range(n):
            while stack and T[i] > T[stack[-1]]:
                idx = stack.pop()
                res[idx] = i - idx
            stack.append(i)
        return res

# 37/37 cases passed (492 ms)
# Your runtime beats 76.4 % of python3 submissions
# Your memory usage beats 55.26 % of python3 submissions (16.7 MB)
```
## References
1. [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
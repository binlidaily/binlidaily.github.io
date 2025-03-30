---
layout: post
title: 216. Combination Sum III
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Backtracking]
image: 
comments: true
published: true
---

## Description


Find all possible combinations of ***k*** numbers that add up to a number ***n***, given that only numbers from 1 to 9 can be used and each combination should be a unique set of numbers.

**Note:**

- All numbers will be positive integers.
- The solution set must not contain duplicate combinations.

**Example 1:**

```
Input: k = 3, n = 7
Output: [[1,2,4]]
```

**Example 2:**

```
Input: k = 3, n = 9
Output: [[1,2,6], [1,3,5], [2,3,4]]
```

## Solutions
### 1. Backtracking
　　连续做了之前的两题，这里就只要注意下写死 10 就好了，因为不能是两位数。

```python
# Time: O(n^size)
# Sapce: O(n)
class Solution:
    def combinationSum3(self, k: int, n: int) -> List[List[int]]:
        res = []
        self.dfs(k, 1, n, [], res)
        return res

    def dfs(self, size, start, target, path, res):
        if target == 0 and len(path) == size:
            res.append(path)
        
        l = len(path)
        for i in range(start, 10):
            if target >= i and l <= size:
                self.dfs(size, i + 1, target - i, path + [i], res)
# 18/18 cases passed (28 ms)
# Your runtime beats 96.4 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [216. Combination Sum III](https://leetcode.com/problems/combination-sum-iii/)
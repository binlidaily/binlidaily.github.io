---
layout: post
title: 77. Combinations
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium]
image: 
comments: true
published: true
---

## Description

Given two integers *n* and *k*, return all possible combinations of *k* numbers out of 1 ... *n*.

**Example:**

```
Input: n = 4, k = 2
Output:
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
```

## Solutions
### 1. Backtracking

```python
# Time: O()
# Space: O()
class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        if k < 0 or k > n:
            return []
        res = []
        self.dfs(n, k, 1, [], res)
        return res
    
    def dfs(self, n, k, start, path, res):
        if start > n+1:
            return
        if path and len(path) == k:
            res.append(path)
        
        for i in range(start, n+1):
            self.dfs(n, k, i+1, path + [i], res)

# 27/27 cases passed (616 ms)
# Your runtime beats 45.02 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14.2 MB)
```

## References
1. [77. Combinations](https://leetcode.com/problems/combinations)
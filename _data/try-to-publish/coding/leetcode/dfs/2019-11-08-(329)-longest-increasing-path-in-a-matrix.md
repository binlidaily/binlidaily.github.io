---
layout: post
title: 329. Longest Increasing Path in a Matrix
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, DFS, Hard]
image: 
comments: true
published: true
---

Given an integer matrix, find the length of the longest increasing path.

From each cell, you can either move to four directions: left, right, up or down. You may NOT move diagonally or move outside of the boundary (i.e. wrap-around is not allowed).

**Example 1:**

```
Input: nums = 
[
  [9,9,4],
  [6,6,8],
  [2,1,1]
] 
Output: 4 
Explanation: The longest increasing path is [1, 2, 6, 9].
```

**Example 2:**

```
Input: nums = 
[
  [3,4,5],
  [3,2,6],
  [2,2,1]
] 
Output: 4 
Explanation: The longest increasing path is [3, 4, 5, 6]. Moving diagonally is not allowed.
```

## Solutions

### 1. DFS+DP+记忆化-递归

　　使用 DFS 图搜索，注意记忆化！

```python
# Time Complexity: O(mn)
# Space Complexity: O(mn)
class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        if not matrix:
            return 0
        r, c = len(matrix), len(matrix[0])
        res = 1
        dp = [[0 for _ in range(c)] for _ in range(r)]
        for i in range(r):
            for j in range(c):
                dp[i][j] = self.dfs(matrix, i, j, r, c, dp)
                res = max(res, dp[i][j])
        return res
    
    def dfs(self, matrix, i, j, r, c, dp):
        if dp[i][j]:
            return dp[i][j]
        max_val = 1
        for m, n in {(i+1, j), (i-1, j), (i, j+1), (i, j-1)}:
            if m < 0 or m >= r or n < 0 or n >= c:
                continue
            
            if matrix[m][n] > matrix[i][j]:
                # find the max val in the four directions
                max_val = max(max_val, self.dfs(matrix, m, n, r, c, dp)+1)
        dp[i][j] = max_val
        return dp[i][j]
# Runtime: 512 ms, faster than 67.50% of Python3 online submissions for Longest Increasing Path in a Matrix.
# Memory Usage: 12.9 MB, less than 100.00% of Python3 online submissions for Longest Increasing Path in a Matrix.
```




## References
1. [ 329. Longest Increasing Path in a Matrix ]( https://leetcode.com/problems/longest-increasing-path-in-a-matrix/ )
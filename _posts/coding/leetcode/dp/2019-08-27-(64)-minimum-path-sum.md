---
layout: post
title: 64. Minimum Path Sum
subtitle: 最小路径和（Medium）
author: Bin Li
tags: [Coding, LeetCode, Medium]
image: 
comments: true
published: true
---

## Description
Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right which minimizes the sum of all numbers along its path.

Note: You can only move either down or right at any point in time.

Example:
```python
Input:
[
  [1,3,1],
  [1,5,1],
  [4,2,1]
]
Output: 7
Explanation: Because the path 1→3→1→1→1 minimizes the sum.
```

## Solutions
### 2D-DP

```python
# Time: O(mn)
# Space: O(mn)
class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        if not grid or len(grid) == 0:
            return 0
        
        r, c = len(grid), len(grid[0])
        dp = [[0 for _ in range(c)] for _ in range(r)]
        dp[0][0] = grid[0][0]
        for i in range(1, r):
            dp[i][0] = dp[i-1][0] + grid[i][0]
        for i in range(1, c):
            dp[0][i] = dp[0][i-1] + grid[0][i]

        for i in range(1, r):
            for j in range(1, c):
                dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
        return dp[-1][-1]
# Runtime: 100 ms, faster than 73.26%
# Memory Usage: 14.4 MB, less than 75.44%
```

## References
1. [64. Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)
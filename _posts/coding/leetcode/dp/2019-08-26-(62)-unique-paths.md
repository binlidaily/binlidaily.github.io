---
layout: post
title: 62. Unique Paths
subtitle: 唯一路径（Medium）
author: Bin Li
tags: [Coding, LeetCode, DP, Medium]
image: 
comments: true
published: true
---

## Description

A robot is located at the top-left corner of a *m* x *n* grid (marked 'Start' in the diagram below).

The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).

How many possible unique paths are there?

![](/img/media/15668161183071.jpg)

Above is a 7 x 3 grid. How many possible unique paths are there?

 

**Example 1:**

```
Input: m = 3, n = 2
Output: 3
Explanation:
From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Right -> Down
2. Right -> Down -> Right
3. Down -> Right -> Right
```

**Example 2:**

```
Input: m = 7, n = 3
Output: 28
```

 

**Constraints:**

- `1 <= m, n <= 100`
- It's guaranteed that the answer will be less than or equal to `2 * 10 ^ 9`.

## Solutions
　　寻找从开始到结束位置，有多少可能的唯一路径，每一步只能向右或者向下走。

### 1. DP
　　这一题还是很好求解的，只要列出状态转移方程就好了，用二维的 DP：

```python
class Solution(object):
    def uniquePaths(self, m, n):
        """
        :type m: int
        :type n: int
        :rtype: int
        """
        dp = [[0 for _ in range(n)] for _ in range(m)]
        # dp[0][0] = 1
        for i in range(m):
            for j in range(n):
                if i == 0 and j != 0:
                    dp[i][j] = dp[i][j - 1]
                elif i != 0 and j == 0:
                    dp[i][j] = dp[i - 1][j]
                elif i == 0 and j == 0:
                    dp[i][j] = 1
                else:
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
        return dp[m-1][n-1]

# Runtime: 20 ms, faster than 49.22% of Python online submissions for Unique Paths.
# Memory Usage: 11.9 MB, less than 6.90% of Python online submissions for Unique Paths.
```

　　然而这里有很多 if 的判断不是很清爽，可以在数组的每个维度上多加 1，然后改写一下就清爽很多了：

```python
class Solution(object):
    def uniquePaths(self, m, n):
        """
        :type m: int
        :type n: int
        :rtype: int
        """
        dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]
        dp[1][1] = 1
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if i == 1 and j == 1:
                    continue
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
        return dp[m][n]

# Runtime: 20 ms, faster than 49.22% of Python online submissions for Unique Paths.
# Memory Usage: 11.8 MB, less than 31.03% of Python online submissions for Unique Paths.
```

## References
1. [62. Unique Paths](https://leetcode.com/problems/unique-paths/)
2. [花花酱 LeetCode 62. Unique Paths](https://www.youtube.com/watch?v=fmpP5Ll0Azc)
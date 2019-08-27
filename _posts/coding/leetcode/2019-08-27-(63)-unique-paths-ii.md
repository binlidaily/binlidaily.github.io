---
layout: post
title: 63. Unique Paths II
subtitle: 唯一路径
author: Bin Li
tags: [Coding, LeetCode, DP]
image: 
comments: true
published: true
---

A robot is located at the top-left corner of a m x n grid (marked 'Start' in the diagram below).

The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).

Now consider if some obstacles are added to the grids. How many unique paths would there be?

![](/img/media/15668945182340.jpg)


An obstacle and empty space is marked as 1 and 0 respectively in the grid.

Note: m and n will be at most 100.

Example 1:
```python
Input:
[
  [0,0,0],
  [0,1,0],
  [0,0,0]
]
Output: 2
Explanation:
There is one obstacle in the middle of the 3x3 grid above.
There are two ways to reach the bottom-right corner:
1. Right -> Right -> Down -> Down
2. Down -> Down -> Right -> Right
```

## Solutions
　　在第一题的基础上改一下就好，还是很多 if，写出来不是很优雅：

```python
class Solution(object):
    def uniquePathsWithObstacles(self, obstacleGrid):
        """
        :type obstacleGrid: List[List[int]]
        :rtype: int
        """
        if not obstacleGrid:
            return 0
        m = len(obstacleGrid)
        n = len(obstacleGrid[0])
        
        dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]

        if obstacleGrid[0][0] == 1:
            dp[1][1] = 0
        else:
            dp[1][1] = 1
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if i == 1 and j == 1:
                    continue
                if obstacleGrid[i - 1][j - 1] == 1:
                    continue
                if obstacleGrid[i - 1 - 1][j - 1] == 1 and obstacleGrid[i - 1][j - 1 - 1] != 1:
                    dp[i][j] = dp[i][j - 1]
                elif obstacleGrid[i - 1 - 1][j - 1] != 1 and obstacleGrid[i - 1][j - 1 - 1] == 1:
                    dp[i][j] = dp[i - 1][j]
                elif obstacleGrid[i - 1 - 1][j - 1] == 1 and obstacleGrid[i - 1][j - 1 - 1] == 1:
                    continue
                else:
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
        return dp[m][n]

# Runtime: 32 ms, faster than 69.02% of Python online submissions for Unique Paths II.
# Memory Usage: 11.9 MB, less than 31.58% of Python online submissions for Unique Paths II.
```

　　更加优雅的做法：

```python
class Solution(object):
    def uniquePathsWithObstacles(self, obstacleGrid):
        """
        :type obstacleGrid: List[List[int]]
        :rtype: int
        """
        if not obstacleGrid:
            return 0
        m = len(obstacleGrid)
        n = len(obstacleGrid[0])
        
        dp = [[0 for _ in range(n)] for _ in range(m)]

        dp[0][0] = 1 - obstacleGrid[0][0]
        for i in xrange(1, m):
            dp[i][0] = dp[i-1][0] * (1 - obstacleGrid[i][0])
        for i in xrange(1, n):
            dp[0][i] = dp[0][i-1] * (1 - obstacleGrid[0][i])

        for i in xrange(1, m):
            for j in xrange(1, n):
                dp[i][j] = (dp[i][j-1] + dp[i-1][j]) * (1 - obstacleGrid[i][j])
        return dp[-1][-1]

# Runtime: 32 ms, faster than 69.02% of Python online submissions for Unique Paths II.
# Memory Usage: 11.6 MB, less than 100.00% of Python online submissions for Unique Paths II.
```

　　空间复杂度继续提升，需要进一步理解哈：

```python
class Solution(object):
    def uniquePathsWithObstacles(self, obstacleGrid):
        """
        :type obstacleGrid: List[List[int]]
        :rtype: int
        """
        if not obstacleGrid:
            return 0
        m = len(obstacleGrid)
        n = len(obstacleGrid[0])
        
        dp = [0 for _ in range(n)]

        dp[0] = 1 - obstacleGrid[0][0]
        
        for i in xrange(1, n):
            dp[i] = dp[i - 1] * (1 - obstacleGrid[0][i])

        for i in xrange(1, m):
            dp[0] *= (1 - obstacleGrid[i][0])
            for j in xrange(1, n):
                dp[j] = (dp[j-1] + dp[j]) * (1 - obstacleGrid[i][j])
        return dp[-1]

# Runtime: 32 ms, faster than 69.02% of Python online submissions for Unique Paths II.
# Memory Usage: 11.5 MB, less than 100.00% of Python online submissions for Unique Paths II.
```
## References
1. [63. Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)
2. [Python different solutions (O(m*n), O(n), in place).](https://leetcode.com/problems/unique-paths-ii/discuss/23410/Python-different-solutions-(O(m*n)-O(n)-in-place).)
---
layout: post
title: 980. Unique Paths III
subtitle: 最小路径和（Hard）
author: Bin Li
tags: [Coding, LeetCode, Hard, Backtracking, DFS, DP]
image: 
comments: true
published: true
---

## Description

On a 2-dimensional `grid`, there are 4 types of squares:

- `1` represents the starting square. There is exactly one starting square.
- `2` represents the ending square. There is exactly one ending square.
- `0` represents empty squares we can walk over.
- `-1` represents obstacles that we cannot walk over.

Return the number of 4-directional walks from the starting square to the ending square, that **walk over every non-obstacle square exactly once**.

 

**Example 1:**

```
Input: [[1,0,0,0],[0,0,0,0],[0,0,2,-1]]
Output: 2
Explanation: We have the following two paths: 
1. (0,0),(0,1),(0,2),(0,3),(1,3),(1,2),(1,1),(1,0),(2,0),(2,1),(2,2)
2. (0,0),(1,0),(2,0),(2,1),(1,1),(0,1),(0,2),(0,3),(1,3),(1,2),(2,2)
```

**Example 2:**

```
Input: [[1,0,0,0],[0,0,0,0],[0,0,0,2]]
Output: 4
Explanation: We have the following four paths: 
1. (0,0),(0,1),(0,2),(0,3),(1,3),(1,2),(1,1),(1,0),(2,0),(2,1),(2,2),(2,3)
2. (0,0),(0,1),(1,1),(1,0),(2,0),(2,1),(2,2),(1,2),(0,2),(0,3),(1,3),(2,3)
3. (0,0),(1,0),(2,0),(2,1),(2,2),(1,2),(1,1),(0,1),(0,2),(0,3),(1,3),(2,3)
4. (0,0),(1,0),(2,0),(2,1),(1,1),(0,1),(0,2),(0,3),(1,3),(1,2),(2,2),(2,3)
```

**Example 3:**

```
Input: [[0,1],[2,0]]
Output: 0
Explanation: 
There is no path that walks over every empty square exactly once.
Note that the starting and ending square can be anywhere in the grid.
```

 

**Note:**

1. `1 <= grid.length * grid[0].length <= 20`

## Solutions
　　找到所有不重复的从起点到终点的路径长度，每个非障碍物坐标只能访问一次。

### 1. Backtracking, DFS-Brute Force

```python
# Time: O(4^{mn})
# Space: O(m*n)
class Solution:
    def uniquePathsIII(self, grid: List[List[int]]) -> int:
        res = [0]
        self.m, self.n, empty = len(grid), len(grid[0]),1
        for i in range(self.m):
            for j in range(self.n):
                if grid[i][j] == 1: x,y = (i, j)
                elif grid[i][j] == 2: self.end = (i, j)
                elif grid[i][j] == 0: empty += 1
        self.dfs(grid, x, y, empty, res)
        return res[0]
    def dfs(self, grid, x, y, empty, res):
            if not (0 <= x < self.m and 0 <= y < self.n and grid[x][y] >= 0): return
            if (x, y) == self.end:
                res[0] += empty == 0
                return
            grid[x][y] = -2
            self.dfs(grid, x + 1, y, empty - 1, res)
            self.dfs(grid, x - 1, y, empty - 1, res)
            self.dfs(grid, x, y + 1, empty - 1, res)
            self.dfs(grid, x, y - 1, empty - 1, res)
            grid[x][y] = 0
# 39/39 cases passed (56 ms)
# Your runtime beats 88.68 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```

### 2. DP

```python
# Time: O(m*n*2^{m*n})
# Space: O(m*n)
class Solution:
    def uniquePathsIII(self, grid):
        R, C = len(grid), len(grid[0])

        def code(r, c):
            return 1 << (r * C + c)

        def neighbors(r, c):
            for nr, nc in ((r-1, c), (r, c-1), (r+1, c), (r, c+1)):
                if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] % 2 == 0:
                    yield nr, nc

        target = 0
        for r, row in enumerate(grid):
            for c, val in enumerate(row):
                if val % 2 == 0:
                    target |= code(r, c)

                if val == 1:
                    sr, sc = r, c
                if val == 2:
                    tr, tc = r, c

        @lru_cache(None)
        def dp(r, c, todo):
            if r == tr and c == tc:
                return +(todo == 0)

            ans = 0
            for nr, nc in neighbors(r, c):
                if todo & code(nr, nc):
                    ans += dp(nr, nc, todo ^ code(nr, nc))
            return ans

        return dp(sr, sc, target)
# 39/39 cases passed (64 ms)
# Your runtime beats 65.87 % of python3 submissions
# Your memory usage beats 7.69 % of python3 submissions (13.7 MB)
```
## References
1. [980. Unique Paths III](https://leetcode.com/problems/unique-paths-iii/)
2. [huahua](https://www.youtube.com/watch?v=dSXtmaGr4Fc)
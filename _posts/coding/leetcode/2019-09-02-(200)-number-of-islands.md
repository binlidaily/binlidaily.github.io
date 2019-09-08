---
layout: post
title: 200. Number of Islands
subtitle:
author: Bin Li
tags: [Coding, LeetCode, BFS]
image: 
comments: true
published: true
---

Given a 2d grid map of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

Example 1:
```
Input:
11110
11010
11000
00000

Output: 1
```
Example 2:
```
Input:
11000
11000
00100
00011

Output: 3
```
## Solutions
### DFS
　　主要看想法，其实只要在间断访问每个位置是，每一遍首次访问到 1 时都表示会有一个岛，然后从这个 1 出发，深度遍历出跟自己毗邻的所有岛的区域。


```python
class Solution(object):
    def numIslands(self, grid):
        """
        :type grid: List[List[str]]
        :rtype: int
        """
        if not grid:
            return 0
        r = len(grid)
        c = len(grid[0])
        res = 0
        for i in range(r):
            for j in range(c):
                if grid[i][j] == '1':
                    res += 1
                    self.dfs(grid, i, j, r, c)
        return res
    
    def dfs(self, grid, x, y, r, c):
        if x < 0 or x > r - 1 or y < 0 or y > c - 1 or grid[x][y] == '0':
            return
        grid[x][y] = '0'
        self.dfs(grid, x-1, y, r, c)
        self.dfs(grid, x, y-1, r, c)
        self.dfs(grid, x+1, y, r, c)
        self.dfs(grid, x, y+1, r, c)
# Runtime: 136 ms, faster than 48.92% of Python online submissions for Number of Islands.
# Memory Usage: 19.1 MB, less than 39.19% of Python online submissions for Number of Islands.
```

### BFS
　　这里的 BFS 解法没有什么特别要注意的，其实跟 DFS 类似，就是提供了一种遍历的方法而已：

```python
class Solution(object):
    def numIslands(self, grid):
        """
        :type grid: List[List[str]]
        :rtype: int
        """
        if not grid:
            return 0
        r = len(grid)
        c = len(grid[0])
        res = 0
        for i in range(r):
            for j in range(c):
                if grid[i][j] == '1':
                    res += 1
                    self.bfs(grid, i, j, r, c)
        return res
    
    def bfs(self, grid, x, y, r, c):
        queue = [(x, y)]
        grid[x][y] = '0'
        while queue:
            directions = [(0,1), (0,-1), (-1,0), (1,0)]
            cr, cc = queue.pop()
            for dr in directions:
                # cx, cy = cx + dr[0], cy + dr[1]
                cx, cy = cr + dr[0], cc + dr[1]
                if cx < 0 or cx > r - 1 or cy < 0 or cy > c - 1 or grid[cx][cy] == '0':
                    continue
                else:
                    grid[cx][cy] = '0'
                    queue.insert(0, (cx, cy))
# Runtime: 152 ms, faster than 24.33% of Python online submissions for Number of Islands.
# Memory Usage: 18.8 MB, less than 91.89% of Python online submissions for Number of Islands.
```

　　这里值得注意的是如果用注释中的那种方式赋值就有问题，他喵的……
## References
1. [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)
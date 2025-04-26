---
layout: post
title: 994. Rotting Oranges
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, BFS]
image: 
comments: true
published: true
---
In a given grid, each cell can have one of three values:

* the value 0 representing an empty cell;
* the value 1 representing a fresh orange;
* the value 2 representing a rotten orange.

Every minute, any fresh orange that is adjacent (4-directionally) to a rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has a fresh orange.  If this is impossible, return -1 instead.

 

Example 1:
![](/img/media/15700065312491.jpg)

```
Input: [[2,1,1],[1,1,0],[0,1,1]]
Output: 4
```
Example 2:
```
Input: [[2,1,1],[0,1,1],[1,0,1]]
Output: -1
Explanation:  The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally.
```
Example 3:
```
Input: [[0,2]]
Output: 0
Explanation:  Since there are already no fresh oranges at minute 0, the answer is just 0.
```

Note:

1. 1 <= grid.length <= 10
2. 1 <= grid[0].length <= 10
3. grid[i][j] is only 0, 1, or 2.


## Solutions
### 1. BFS
　　坏一个橘子，其周围的都会坏，很明显这是一个 BFS 的问题。那么所有变坏了的橘子都要存进 queue 里。每一次 while 其实是对当前 queue 里所有的橘子都要判断一下，而对每一个橘子的判断又需要四个方向，这么一次 while 的循环就是一个时间的变质扩张，统计有多少次变质扩张即可。


```python
# Time Complexity: O(nm)
# Space Complexity: O(nm)
class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        if not grid:
            return -1
        r, c = len(grid), len(grid[0])
        
        cnt = 0
        queue = collections.deque()
        
        for i in range(r):
            for j in range(c):
                if grid[i][j] == 1:
                    cnt += 1
                if grid[i][j] == 2:
                    queue.append((i, j))
        
        # Input: [[0,2]]
        # Output: 0
        # like this, the res should be initialized to -1
        res = -1
        
        while queue:
            size = len(queue)
            for _ in range(size):
                x, y = queue.popleft()
                for i, j in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                    if 0 <= i < r and 0 <= j < c and grid[i][j] == 1:
                        grid[i][j] = 2
                        cnt -= 1
                        queue.append((i, j))
            res += 1
        return max(res, 0) if cnt == 0 else -1
# Runtime: 56 ms, faster than 92.11% of Python3 online submissions for Rotting Oranges.
# Memory Usage: 13.7 MB, less than 16.67% of Python3 online submissions for Rotting Oranges.
```

　　参考解决方案中一种极简的方案，比较优雅：

```python
# Time Complexity: O(nm)
# Space Complexity: O(nm)
class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        row, col = len(grid), len(grid[0])
        rotting = {(i, j) for i in range(row) for j in range(col) if grid[i][j] == 2}
        fresh = {(i, j) for i in range(row) for j in range(col) if grid[i][j] == 1}
        time = 0
        while fresh:
            if not rotting: return -1
            rotting = {(i+di, j+dj) for i, j in rotting for di, dj in [(0, 1), (1, 0), (0, -1), (-1, 0)] if (i+di, j+dj) in fresh}
            fresh -= rotting
            time += 1
        return time
# Runtime: 60 ms, faster than 74.97% of Python3 online submissions for Rotting Oranges.
# Memory Usage: 13.9 MB, less than 16.67% of Python3 online submissions for Rotting Oranges.
```
## References
1. [994. Rotting Oranges](https://leetcode.com/problems/rotting-oranges/solution/)
---
layout: post
title: 130. Surrounded Regions
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DFS]
image: 
comments: true
published: true
---

Given a 2D board containing 'X' and 'O' (the letter O), capture all regions surrounded by 'X'.

A region is captured by flipping all 'O's into 'X's in that surrounded region.

Example:
```
X X X X
X O O X
X X O X
X O X X
```
After running your function, the board should be:
```
X X X X
X X X X
X X X X
X O X X
```
Explanation:

Surrounded regions shouldn’t be on the border, which means that any 'O' on the border of the board are not flipped to 'X'. Any 'O' that is not on the border and it is not connected to an 'O' on the border will be flipped to 'X'. Two cells are connected if they are adjacent cells connected horizontally or vertically.

## Solutions
　　这题主要看的是思路，直接找到那些被 X 包围的 O 比较难，不如换一下思路，找到那些肯定无法被包围的 O，即那些在边界上的 O。然后与这些 O 相邻的肯定都不会被包围，所以只要找到这些 O，剩下的 O 都是能够被包围的，对应翻成 X 就好。

```python
class Solution(object):
    def solve(self, board):
        """
        :type board: List[List[str]]
        :rtype: None Do not return anything, modify board in-place instead.
        """
        if not board or not board[0]:
            return
        m = len(board)
        n = len(board[0])
        queue = []
        
        # O on edge
        for i in range(m):
            for j in range(n):
                if (i in (0, m-1) or j in (0, n-1)) and board[i][j] == 'O':
                    queue.insert(0, (i, j))
        
        while(queue):
            r, c = queue.pop()
            if 0 <= r < m and 0 <= c < n and board[r][c] == 'O':
                board[r][c] = 'M'
                if r - 1 >= 0 and board[r-1][c] == 'O':
                    queue.insert(0, (r-1, c))
                if r + 1 < m and board[r+1][c] == 'O':
                    queue.insert(0, (r+1, c))
                if c - 1 >= 0 and board[r][c-1] == 'O':
                    queue.insert(0, (r, c-1))
                if c + 1 < n and board[r][c+1] == 'O':
                    queue.insert(0, (r, c+1))
        
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'M':
                    board[i][j] = 'O'
                else:
                    board[i][j] = 'X'
        return board
# Runtime: 128 ms, faster than 80.67% of Python online submissions for Surrounded Regions.
# Memory Usage: 16.7 MB, less than 85.71% of Python online submissions for Surrounded Regions.
```

## References
1. [130. Surrounded Regions](https://leetcode.com/problems/surrounded-regions/)
2. [LeetCode 200. Number of Islands](https://www.youtube.com/watch?v=XSmgFKe-XYU)
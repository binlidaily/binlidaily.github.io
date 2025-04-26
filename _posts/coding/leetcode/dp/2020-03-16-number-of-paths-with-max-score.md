---
layout: post
title: 1301. Number of Paths with Max Score
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, DP]
image: 
comments: true
published: true
---

## Description

You are given a square `board` of characters. You can move on the board starting at the bottom right square marked with the character `'S'`.

You need to reach the top left square marked with the character `'E'`. The rest of the squares are labeled either with a numeric character `1, 2, ..., 9` or with an obstacle `'X'`. In one move you can go up, left or up-left (diagonally) only if there is no obstacle there.

Return a list of two integers: the first integer is the maximum sum of numeric characters you can collect, and the second is the number of such paths that you can take to get that maximum sum, **taken modulo `10^9 + 7`**.

In case there is no path, return `[0, 0]`.

 

**Example 1:**

```
Input: board = ["E23","2X2","12S"]
Output: [7,1]
```

**Example 2:**

```
Input: board = ["E12","1X1","21S"]
Output: [4,2]
```

**Example 3:**

```
Input: board = ["E11","XXX","11S"]
Output: [0,0]
```

 

**Constraints:**

- `2 <= board.length == board[i].length <= 100`


## Solutions
　　从右下角按照上、左和左上的三个方向走到最左上角。找出最大的加和以及走到最大加和处可能的路径数。

###  1. DP

　　自己写他喵的是绝对写不出来的！擦。


```python
class Solution:
    def pathsWithMaxScore(self, board: List[str]) -> List[int]:
        if not board or len(board) == 0:
            return [0, 0]
        
        modulo = 10**9 + 7

        r, c = len(board), len(board[0])
        dp = [[[0, 0] for _ in range(c)] for _ in range(r)]
        dp[-1][-1] = [0, 1]
        for i in range(r-2, -1, -1):
            if board[i][-1] == 'X':
                continue
            dp[i][-1][0] = dp[i-1][-1][0] + int(board[i][-1])
            dp[i][-1][1] = dp[i-1][-1][1]
        
        for i in range(c-2, -1, -1):
            if board[-1][i] == 'X':
                continue
            dp[-1][i][0] = dp[-1][i-1][0] + int(board[-1][i])
            dp[-1][i][1] = dp[-1][i-1][1]

        for i in range(r-2, -1, -1):
            for j in range(c-2, -1, -1):
                if board[i][j] == 'X':
                    continue
                max_v = max(dp[i+1][j][0] if board[i+1][j] != 'X' else 0, \
                                dp[i][j+1][0] if board[i][j+1] != 'X' else 0, \
                                dp[i+1][j+1][0] if board[i+1][j+1] != 'X' else 0)

                if max_v == dp[i+1][j][0]:
                    dp[i][j][1] += dp[i+1][j][1] % modulo
                if max_v == dp[i][j+1][0]:
                    dp[i][j][1] += dp[i][j+1][1] % modulo
                if max_v == dp[i+1][j+1][0]:
                    dp[i][j][1] += dp[i+1][j+1][1] % modulo

                dp[i][j][0] = max_v + int(board[i][j]) if board[i][j] != 'E' else 0
                
        return dp[0][0]
```

```python
# Time: O(n^2)
# Space: O(n^2)
class Solution1:
    def pathsWithMaxScore(self, board: List[str]) -> List[int]:
        n, mod = len(board), 10**9 + 7
        dp = [[[-10**5, 0] for j in range(n + 1)] for i in range(n + 1)]
        dp[n - 1][n - 1] = [0, 1]
        
        # loop bottom-to-up, right-to-left
        for x in range(n)[::-1]:
            for y in range(n)[::-1]:
                if board[x][y] in 'XS': continue
                for dx, dy in [[0, 1], [1, 0], [1, 1]]:
                    inheritsum = dp[x + dx][y + dy][0]
                    if dp[x][y][0] < inheritsum:
                        dp[x][y] = [inheritsum, 0]
                    if dp[x][y][0] == inheritsum:
                        dp[x][y][1] += dp[x + dx][y + dy][1]
                dp[x][y][0] += int(board[x][y]) if x or y else 0
        # return 0 as sum if the cell is not reachable
        return [dp[0][0][0] if dp[0][0][1] else 0, dp[0][0][1] % mod]

# 25/25 cases passed (200 ms)
# Your runtime beats 63.59 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14.3 MB)
```

## References
1. [1301. Number of Paths with Max Score](https://leetcode.com/problems/number-of-paths-with-max-score/)
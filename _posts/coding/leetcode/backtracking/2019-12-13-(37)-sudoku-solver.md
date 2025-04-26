---
layout: post
title: 37. Sudoku Solver
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Backtracking]
image: 
comments: true
published: true
---

## Description

Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy **all of the following rules**:

1. Each of the digits `1-9` must occur exactly once in each row.
2. Each of the digits `1-9` must occur exactly once in each column.
3. Each of the the digits `1-9` must occur exactly once in each of the 9 `3x3` sub-boxes of the grid.

Empty cells are indicated by the character `'.'`.

![](/img/media/15762009519564.jpg)


A sudoku puzzle...

![](/img/media/15762008060740.jpg)

...and its solution numbers marked in red.

**Note:**

- The given board contain only digits `1-9` and the character `'.'`.
- You may assume that the given Sudoku puzzle will have a single unique solution.
- The given board size is always `9x9`.

## Solutions
### 1. Backtracking
　　注意剪枝！


```python
# Time: O()
# Space: O()
class Solution:
    def dfs_Sudoku(self, row_map, col_map, sec_map, unfilled, board):
        
        if len(unfilled)==0: return True
        
        row, col = unfilled.pop()
        for num in range(9):
            sec_index = 3 * (row // 3) + col // 3
            if row_map[row][num] == False and \
               col_map[col][num] == False and \
               sec_map[sec_index][num] == False:
                row_map[row][num] = True
                col_map[col][num] = True
                sec_map[sec_index][num] = True
                board[row][col] = str(num+1)
                
                completed = self.dfs_Sudoku(row_map, col_map, sec_map, unfilled, board)
                
                if completed: return True
                
                row_map[row][num] = False
                col_map[col][num] = False
                sec_map[sec_index][num] = False
                board[row][col] = '.'
        unfilled.append((row, col))
        return False
    
    def solveSudoku(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        
        unfilled = []
        row_map = [[False]*9 for _ in range(9)]
        col_map = [[False]*9 for _ in range(9)]
        sec_map = [[False]*9 for _ in range(9)]
        
        for i in range(9):
            for j in range(9):
                if board[i][j] == '.': 
                    unfilled.append((i,j))
                    continue
                index = int(board[i][j]) - 1
                row_map[i][index] = True
                col_map[j][index] = True
                sec_index = 3 * (i // 3) + j // 3
                sec_map[sec_index][index] = True
        
        self.dfs_Sudoku(row_map, col_map, sec_map, unfilled, board)
# 6/6 cases passed (148 ms)
# Your runtime beats 73.69 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```



　　采用迭代形式：
```python
# Time: O()
# Space: O()
class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        def isValid(x,y):
            tmp=board[x][y]
            board[x][y]='D'
            for i in range(9):
                if board[i][y]==tmp: 
                    return False
            for i in range(9):
                if board[x][i]==tmp: 
                    return False
            for i in range(3):
                for j in range(3):
                    if board[(x//3)*3+i][(y//3)*3+j]==tmp: 
                        return False
            board[x][y]=tmp
            return True
        
        def dfs(board):
            for i in range(9):
                for j in range(9):
                    if board[i][j]=='.':
                        for k in '123456789':
                            board[i][j]=k
                            if isValid(i,j) and dfs(board):
                                return True
                            board[i][j]='.'
                        return False
            return True
        dfs(board)
# 6/6 cases passed (752 ms)
# Your runtime beats 19.48 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```




## References
1. [37. Sudoku Solver](https://leetcode.com/problems/sudoku-solver)
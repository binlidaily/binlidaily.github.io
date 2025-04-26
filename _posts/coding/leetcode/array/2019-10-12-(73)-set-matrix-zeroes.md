---
layout: post
title: 73. Set Matrix Zeroes
subtitle: 矩阵赋零（Medium）
author: Bin Li
tags: [Coding, LeetCode, Array, Medium]
image: 
comments: true
published: true
---

Given a m x n matrix, if an element is 0, set its entire row and column to 0. Do it in-place.

Example 1:
```
Input: 
[
  [1,1,1],
  [1,0,1],
  [1,1,1]
]
Output: 
[
  [1,0,1],
  [0,0,0],
  [1,0,1]
]
```
Example 2:
```
Input: 
[
  [0,1,2,0],
  [3,4,5,2],
  [1,3,1,5]
]
Output: 
[
  [0,0,0,0],
  [0,4,5,0],
  [0,3,1,0]
]
```
Follow up:

* A straight forward solution using O(mn) space is probably a bad idea.
* A simple improvement uses O(m + n) space, but still not the best solution.
* Could you devise a constant space solution?

## Solutions
### 1. Space O(m+n)
　　注意理解位操作，以及最后是要成行或成列都要变成 0.

```python
# Time Complexity: O(mn)
# Space Complexity: O(m+n)
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """
        if not matrix:
            return matrix
        lr, ll = len(matrix), len(matrix[0])
        row = [0 for i in range(lr)]
        col = [0 for i in range(ll)]
        for i in range(lr):
            for j in range(ll):
                row[i] = row[i] | (matrix[i][j] == 0)
                col[j] = col[j] | (matrix[i][j] == 0)
        
        for i in range(lr):
            for j in range(ll):
                if row[i] or col[j]:
                    matrix[i][j] = 0

        return matrix
# Runtime: 160 ms, faster than 35.48% of Python3 online submissions for Set Matrix Zeroes.
# Memory Usage: 14.5 MB, less than 5.13% of Python3 online submissions for Set Matrix Zeroes.
```

### 2. Space O(1)

```python
# Time Complexity: O(mn)
# Space Complexity: O(1)
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """
        if not matrix:
            return matrix
        lr, ll = len(matrix), len(matrix[0])
        r0 = False
        c0 = False
        # if there is 0 in edge
        for i in range(lr):
            r0 = r0 | (matrix[i][0] == 0)
        for j in range(ll):
            c0 = c0 | (matrix[0][j] == 0)
        
        for i in range(1, lr):
            for j in range(1, ll):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0
        
        for i in range(1, lr):
            for j in range(1, ll):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
        
        if r0:
            for i in range(lr):
                matrix[i][0] = 0
        if c0:
            for j in range(ll):
                matrix[0][j] = 0

        return matrix
# Runtime: 148 ms, faster than 93.53% of Python3 online submissions for Set Matrix Zeroes.
# Memory Usage: 14.4 MB, less than 5.13% of Python3 online submissions for Set Matrix Zeroes.
```

## References
1. [73. Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/)
2. [花花酱](https://zxi.mytechroad.com/blog/algorithms/array/leetcode-73-set-matrix-zeroes/)
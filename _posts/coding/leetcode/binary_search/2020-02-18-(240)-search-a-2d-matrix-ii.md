---
layout: post
title: 240. Search a 2D Matrix II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Binary Search]
image: 
comments: true
published: true
---

## Description

Write an efficient algorithm that searches for a value in an *m* x *n* matrix. This matrix has the following properties:

- Integers in each row are sorted in ascending from left to right.
- Integers in each column are sorted in ascending from top to bottom.

**Example:**

Consider the following matrix:

```
[
  [1,   4,  7, 11, 15],
  [2,   5,  8, 12, 19],
  [3,   6,  9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
]
```

Given target = `5`, return `true`.

Given target = `20`, return `false`.


## Solutions
### 1. Binary Search
　　右上角向下向左遍历。

```python
# Time: O(nlogn)
# Space: O(nlogn)
class Solution:
    def searchMatrix(self, matrix, target):
        """
        :type matrix: List[List[int]]
        :type target: int
        :rtype: bool
        """
        if not matrix or not matrix[0]:
            return False
        
        r = len(matrix)
        for i in range(r):
            if matrix[i][-1] < target:
                continue
            if self.binary_search(matrix[i], target):
                return True
        return False
    
    def binary_search(self, nums, target):
        if not nums:
            return False
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = l + (r - l) // 2
            if nums[mid] == target:
                return True
            elif nums[mid] > target:
                r = mid - 1
            else:
                l = mid + 1
        return False

# 129/129 cases passed (32 ms)
# Your runtime beats 82.94 % of python3 submissions
# Your memory usage beats 88.89 % of python3 submissions (17.4 MB)
```

### 2. Trick

```python
# Time: O(m+n)
# Space: O(1)
class Solution:
    def searchMatrix(self, matrix, target):
        if not matrix or not matrix[0]:
            return False
        
        r, c = 0, len(matrix[0]) - 1
        while r < len(matrix) and c >= 0:
            if matrix[r][c] == target:
                return True
            elif matrix[r][c] > target:
                c -= 1
            else:
                r += 1
        return False

# 129/129 cases passed (40 ms)
# Your runtime beats 36.96 % of python3 submissions
# Your memory usage beats 92.59 % of python3 submissions (17.4 MB)
```

## References
1. [240. Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii/)
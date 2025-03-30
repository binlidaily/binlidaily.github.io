---
layout: post
title: 74. Search a 2D Matrix
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Binary Search]
image: 
comments: true
published: true
---

## Description

Write an efficient algorithm that searches for a value in an *m* x *n* matrix. This matrix has the following properties:

- Integers in each row are sorted from left to right.
- The first integer of each row is greater than the last integer of the previous row.

**Example 1:**

```
Input:
matrix = [
  [1,   3,  5,  7],
  [10, 11, 16, 20],
  [23, 30, 34, 50]
]
target = 3
Output: true
```

**Example 2:**

```
Input:
matrix = [
  [1,   3,  5,  7],
  [10, 11, 16, 20],
  [23, 30, 34, 50]
]
target = 13
Output: false
```

## Solutions
### 1. Binary Search
　　要找到trick，每一行最右边的数都比该行前面的数大，那么先可以通过每一行最后一个数确定行，然后采用 binary search 即可：

```python
# Time: O(nlogm)
# Space: O(n)
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        if not matrix or len(matrix) == 0:
            return False
        h, w = len(matrix), len(matrix[0])
        r = -1
        for i in range(h):
            if w-1 >= 0 and matrix[i][w-1] >= target:
                r = i
                break

        if r == -1:
            return False
        if self.binary_search(matrix[r], target) == -1:
            return False
        else:
            return True
    
    def binary_search(self, nums, target):
        if not nums:
            return -1
        
        n = len(nums)
        l, r = 0, n - 1
        while l <= r:
            mid = (l + r) >> 1
            if nums[mid] == target:
                return mid
            elif nums[mid] > target:
                r = mid - 1
            else:
                l = mid + 1
        return -1
# 136/136 cases passed (68 ms)
# Your runtime beats 92.86 % of python3 submissions
# Your memory usage beats 5.88 % of python3 submissions (14.9 MB)
```

## References
1. [74. Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/)
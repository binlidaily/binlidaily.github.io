---
layout: post
title: 378. Kth Smallest Element in a Sorted Matrix
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Binary Search, Heap]
image: 
comments: true
published: true
---

## Description

Given a *n* x *n* matrix where each of the rows and columns are sorted in ascending order, find the kth smallest element in the matrix.

Note that it is the kth smallest element in the sorted order, not the kth distinct element.

**Example:**

```
matrix = [
   [ 1,  5,  9],
   [10, 11, 13],
   [12, 13, 15]
],
k = 8,

return 13.
```

**Note:**
You may assume k is always valid, 1 ≤ k ≤ n2.


## Solutions
### 1. Brute Force

```python
# Time: O(mnlog(mn))
# Space: O(mn)
class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        nums = []
        for row in matrix:
            nums += row
        nums.sort()
        return nums[k-1]

# 85/85 cases passed (176 ms)
# Your runtime beats 90.28 % of python3 submissions
# Your memory usage beats 9.09 % of python3 submissions (18.6 MB)
```

### 2. Binary Search

```python
# Time: O(mnlog(mn))
# Space: O(mn)
class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        n = len(matrix)

        if k == n ** 2:
            return matrix[-1][-1]
        if k == 1:
            return matrix[0][0]
        
        low, high = matrix[0][0], matrix[-1][-1]

        while low < high:
            mid = low + (high - low) // 2
            j, cnt = 0, 0
            for i in range(n - 1, -1, -1):
                while j < n and matrix[i][j] <= mid:
                    j += 1
                cnt += j
                if cnt > k:
                    break
            if cnt < k:
                low = mid + 1
            else:
                high = mid
        return low

# 85/85 cases passed (168 ms)
# Your runtime beats 98.03 % of python3 submissions
# Your memory usage beats 9.09 % of python3 submissions (18.7 MB)
```

### 3. Min Heap

```python
# Time: O(mnlog(mn))
# Space: O(nlogn)
class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        if not matrix:
            return
        r, c = len(matrix), len(matrix[0])
        min_heap = [(matrix[0][0], 0, 0)]
        res = None
        for _ in range(k):
            res, i, j = heapq.heappop(min_heap)
            if j == 0 and i + 1 < r:
                heapq.heappush(min_heap, (matrix[i + 1][j], i + 1, j))
            if j + 1 < c:
                heapq.heappush(min_heap, (matrix[i][j + 1], i, j + 1))
        print(len(min_heap))
        return res

# 85/85 cases passed (224 ms)
# Your runtime beats 45.98 % of python3 submissions
# Your memory usage beats 9.09 % of python3 submissions (18.6 MB)
```

## References
1. [378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/description/)
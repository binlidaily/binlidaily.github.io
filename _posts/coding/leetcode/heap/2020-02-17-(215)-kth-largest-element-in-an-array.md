---
layout: post
title: 215. Kth Largest Element in an Array
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Heap]
image: 
comments: true
published: true
---

## Description

Find the **k**th largest element in an unsorted array. Note that it is the kth largest element in the sorted order, not the kth distinct element.

**Example 1:**

```
Input: [3,2,1,5,6,4] and k = 2
Output: 5
```

**Example 2:**

```
Input: [3,2,3,1,2,4,5,5,6] and k = 4
Output: 4
```

**Note:**
You may assume k is always valid, 1 ≤ k ≤ array's length.


## Solutions
### 1. Heap

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = []
        for num in nums:
            heapq.heappush(heap, num)
            if len(heap) > k:
                heapq.heappop(heap)
        
        return heapq.heappop(heap)

# 32/32 cases passed (68 ms)
# Your runtime beats 59.02 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.3 MB)
```

## References
1. [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/description/)
---
layout: post
title: 581. Shortest Unsorted Continuous Subarray
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Sort]
image: 
comments: true
published: true
---

## Description

Given an integer array, you need to find one **continuous subarray** that if you only sort this subarray in ascending order, then the whole array will be sorted in ascending order, too.

You need to find the **shortest** such subarray and output its length.

**Example 1:**

```
Input: [2, 6, 4, 8, 10, 9, 15]
Output: 5
Explanation: You need to sort [6, 4, 8, 10, 9] in ascending order to make the whole array sorted in ascending order.
```



**Note:**

1. Then length of the input array is in range [1, 10,000].
2. The input array may contain duplicates, so ascending order here means **<=**.

## Solutions
### 1. 排序
　　直接排序然后比较不同，结果 TLE 了。

```python
class Solution:
    def findUnsortedSubarray(self, nums: List[int]) -> int:
        copy = [num for num in nums]
        n = len(nums)
        self.quick_sort(nums, 0, n-1)
        min_i, max_i = 0, 0
        for i in range(n):
            if nums[i] != copy[i]:
                min_i = i
                break
        
        for i in range(n-1, -1, -1):
            if nums[i] != copy[i]:
                max_i = i
                break
        if max_i == min_i:
            return 0
        return max_i - min_i + 1
    
    def quick_sort(self, nums, l=0, r=None):
        if l > r:
            return
        pivot = self.partition(nums, l, r)
        self.quick_sort(nums, l, pivot-1)
        self.quick_sort(nums, pivot+1, r)
    
    def partition(self, nums, l, r):
        pivot = nums[r]
        i = l
        for j in range(l, r+1):
            if nums[j] < pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[r] = nums[r], nums[i]
        return i
```

### 2. 最大最小扫描

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def findUnsortedSubarray(self, nums: List[int]) -> int:
        if not nums:
            return 0
        
        n = len(nums)
        max_v, min_v = float('-inf'), float('inf')
        p, q = 0, 0
        for i in range(n):
            if nums[i] >= max_v:
                max_v = nums[i]
            else:
                p = i
        for i in range(n-1, -1, -1):
            if nums[i] <= min_v:
                min_v = nums[i]
            else:
                q = i
        
        if p == q:
            return 0
        return p - q + 1
# 307/307 cases passed (216 ms)
# Your runtime beats 87.91 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.7 MB)
```

## References
1. [581. Shortest Unsorted Continuous Subarray](https://leetcode.com/problems/shortest-unsorted-continuous-subarray/)
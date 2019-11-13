---
layout: post
title: 88. Merge Sorted Array
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Array]
image: 
comments: true
published: true
---

Given two sorted integer arrays nums1 and nums2, merge nums2 into nums1 as one sorted array.

Note:

* The number of elements initialized in nums1 and nums2 are m and n respectively.
* You may assume that nums1 has enough space (size that is greater or equal to m + n) to hold additional elements from nums2.

Example:
```
Input:
nums1 = [1,2,3,0,0,0], m = 3
nums2 = [2,5,6],       n = 3

Output: [1,2,2,3,5,6]
```

## Solutions
　　从后往前进行判断：


```python
class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        l1, l2 = m-1, n-1
        i = 0
        while l1 >=0 and l2 >= 0:
            if nums1[l1] >= nums2[l2]:
                nums1[m+n-1-i] = nums1[l1]
                l1 -= 1
            else:
                nums1[m+n-1-i] = nums2[l2]
                l2 -= 1
            i += 1
        if l2 >= 0:
            nums1[:l2+1] = nums2[:l2+1]
        return nums1
# Runtime: 28 ms, faster than 99.79% of Python3 online submissions for Merge Sorted Array.
# Memory Usage: 12.7 MB, less than 100.00% of Python3 online submissions for Merge Sorted Array.
```

## References
1. [88. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)
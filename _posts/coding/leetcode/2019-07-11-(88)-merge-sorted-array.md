---
layout: post
title: 88. Merge Sorted Array
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
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
　　一堆 if else 写了出来：

```python
class Solution(object):
    def merge(self, nums1, m, nums2, n):
        """
        :type nums1: List[int]
        :type m: int
        :type nums2: List[int]
        :type n: int
        :rtype: None Do not return anything, modify nums1 in-place instead.
        """
        if not nums2 or not nums1:
            return nums1
        tmp = nums1[:m]
        p1 = p2 = i = 0
        while p1 <= m and p2 <= n:
            if p1 == m:
                nums1[i:] = nums2[p2:]
                break
            if p2 == n:
                nums1[i:] = tmp[p1:]
                break
                
            if tmp[p1] < nums2[p2]:
                nums1[i] = tmp[p1]
                p1 += 1
                i += 1
            else:
                nums1[i] = nums2[p2]
                p2 += 1
                i += 1

        return nums1

# Runtime: 24 ms, faster than 76.13% of Python online submissions for Merge Sorted Array.
# Memory Usage: 11.7 MB, less than 61.94% of Python online submissions for Merge Sorted Array.
```

　　因为引入了

## References
1. [88. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)
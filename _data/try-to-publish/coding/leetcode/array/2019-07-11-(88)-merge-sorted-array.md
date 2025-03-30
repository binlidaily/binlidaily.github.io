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

## Description
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
　　从后往前进行判断，注意在比较大小满足退出条件时，第二个数组可能还没有遍历完，需要补充进去。


```python
# Time: O(n+m)
# Space: O(1)
class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        a, b = m - 1, n - 1
        i = m + n - 1
        while i >= 0 and a >= 0 and b >= 0:
            if nums1[a] > nums2[b]:
                nums1[i] = nums1[a]
                a -= 1
            else:
                nums1[i] = nums2[b]
                b -= 1
            i -= 1
        if b >= 0:
            nums1[:b+1] = nums2[:b+1]

# 59/59 cases passed (36 ms)
# Your runtime beats 56.75 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

## References
1. [88. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)
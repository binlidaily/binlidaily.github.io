---
layout: post
title: 154. Find Minimum in Rotated Sorted Array II
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Binary Search, Hard]
image: 
comments: true
published: true
---

## Description

Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.

(i.e.,  `[0,1,2,4,5,6,7]` might become  `[4,5,6,7,0,1,2]`).

Find the minimum element.

The array may contain duplicates.

**Example 1:**

```
Input: [1,3,5]
Output: 1
```

**Example 2:**

```
Input: [2,2,2,0,1]
Output: 0
```

**Note:**

- This is a follow up problem to [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/).
- Would allow duplicates affect the run-time complexity? How and why?

## Solutions
### 1. Binary Search
　　如果有重复的话，需要跟左边的数进行比较，注意顺序。
```python
# O(logn)
# O(1)
class Solution:
    def findMin(self, nums: List[int]) -> int:
        l, r = 0, len(nums)-1
        while l < r:
            if nums[l] < nums[r]:
                return nums[l]
            mid = (l + r) >> 1
            if nums[mid] == nums[l]:
                l += 1
            elif nums[mid] > nums[l]:
                l = mid + 1
            else:
                r = mid
        return nums[l]
# 192/192 cases passed (48 ms)
# Your runtime beats 97.99 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.1 MB)
```

## References
1. [154. Find Minimum in Rotated Sorted Array II](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii)
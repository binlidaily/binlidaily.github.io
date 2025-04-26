---
layout: post
title: 34. Find First and Last Position of Element in Sorted Array
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Binary Search]
image: 
comments: true
published: true
---

## Description

Given an array of integers `nums` sorted in ascending order, find the starting and ending position of a given `target` value.

Your algorithm's runtime complexity must be in the order of *O*(log *n*).

If the target is not found in the array, return `[-1, -1]`.

**Example 1:**

```
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
```

**Example 2:**

```
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
```


## Solutions
### 1. Binary Search

```python
# Time: O(logn)
# Space: O(1)
class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        if not nums:
            return [-1, -1]
        start, end = -1, -1
        l, r = 0, len(nums)-1
        while l < r:
            mid = l + (r - l) // 2 
            if nums[mid] < target:
                l = mid + 1
            else:
                r = mid
        if nums[l] != target:
            return [-1, -1]
        else:
            start = l
        r = len(nums) - 1
        while l < r:
            mid = l + (r - l) // 2 + 1 # take care of this calculation of mid, need +1 here
            if nums[mid] > target:
                r = mid - 1
            else:
                l = mid
        end = r
        return [start, end]
# 88/88 cases passed (88 ms)
# Your runtime beats 68.21 % of python3 submissions
# Your memory usage beats 8.93 % of python3 submissions (14 MB)
```

## References
1. [34. Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
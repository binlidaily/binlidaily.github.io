---
layout: post
title: 33. Search in Rotated Sorted Array
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Array, Medium, Binary Search]
image: 
comments: true
published: true
---

## Description

Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.

(i.e., `[0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`).

You are given a target value to search. If found in the array return its index, otherwise return `-1`.

You may assume no duplicate exists in the array.

Your algorithm's runtime complexity must be in the order of *O*(log *n*).

**Example 1:**

```
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```

**Example 2:**

```
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
```

## Solutions
### 1. Binary Search
　　分清楚什么时候向前，什么时候向后规约即可。值得注意的是：
1. 如果 mid 对应的数小于最右边的数的话，那么右侧就是有序的，则就着右边的进行判断，如果 target 在右侧之间，那么更新 l 指针，否则就更新 r 指针
2. 如果 mid 对应的数大于最右边的数的话，那么左侧是有序的，如上调整两个指针


```python
# Time: O(n)
# Space: O(1)
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        if not nums or len(nums) == 0:
            return -1
        n = len(nums)
        l, r = 0, n-1
        while l <= r:
            mid = (l + r) >> 1
            if nums[mid] == target:
                return mid
            elif nums[mid] < nums[r]:
                if nums[mid] < target <= nums[r]:
                    l = mid + 1
                else:
                    r = mid - 1
            else:
                if nums[l] <= target < nums[mid]:
                    r = mid - 1
                else:
                    l = mid + 1
        return -1
# 196/196 cases passed (44 ms)
# Your runtime beats 83.98 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

　　看到更快的解法，把等于号给独立出来了，其实一样，但是能减少一些计算：

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        low, high = 0, len(nums)-1
        
        while low <= high:
            mid = low + (high - low)//2
            if nums[mid] == target:
                return mid            
            if nums[low] == target:
                return low            
            if nums[high] == target:
                return high
            elif nums[mid] < nums[high]:
                if nums[mid] < target and target < nums[high]:
                    low = mid + 1
                else:
                    high = mid - 1
            else:
                if nums[low] < target and target < nums[mid]:
                    high = mid - 1
                else:
                    low = mid + 1
        
        return -1
```

## References
1. [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
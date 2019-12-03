---
layout: post
title: 153. Find Minimum in Rotated Sorted Array
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Binary Search, Medium]
image: 
comments: true
published: true
---

## Description
Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.

(i.e.,  [0,1,2,4,5,6,7] might become  [4,5,6,7,0,1,2]).

Find the minimum element.

You may assume no duplicate exists in the array.

Example 1:
```
Input: [3,4,5,1,2] 
Output: 1
```

Example 2:
```
Input: [4,5,6,7,0,1,2]
Output: 0
```

## Solutions
　　注意这里是没有重复数值的，如果有重复数值就会有问题，需要看 154 题看有重复的解法。

### 1. Sort
　　看到题目有些懵逼？直接从大到小排序取第一个不就 OK 了？

```python
class Solution(object):
    def partition(self, nums, low, high):
        i = low
        pivot = nums[high]
        for j in range(low, high):
            if nums[j] <= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[high] = nums[high], nums[i]
        return i
    
    def quick_sort(self, nums, low=0, high=None):
        if not high:
            high = len(nums) - 1
        def _quick_sort(nums, low, high):
            if low >= high:
                return
            piovt = self.partition(nums, low, high)
            _quick_sort(nums, low, piovt-1)
            _quick_sort(nums, piovt+1, high)
        
        _quick_sort(nums, low, high)
        return nums
    def findMin(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        return self.quick_sort(nums)[0]
# Runtime: 24 ms, faster than 90.52% of Python online submissions for Find Minimum in Rotated Sorted Array.
# Memory Usage: 12.1 MB, less than 9.23% of Python online submissions for Find Minimum in Rotated Sorted Array.

# Runtime: 916 ms, faster than 11.36% of Python online submissions for Find Minimum in Rotated Sorted Array.
# Memory Usage: 15.4 MB, less than 5.18% of Python online submissions for Find Minimum in Rotated Sorted Array.
```

　　发现直接用 `sorted` 比自己实现快排要快好多……

### 2. Binary Search
　　后来看了下别人的解答，原来是用二分搜索：

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def findMin(self, nums: List[int]) -> int:
        l, r = 0, len(nums)-1
        while l <= r:
            if nums[l] <= nums[r]:
                return nums[l]
            mid = (l + r) >> 1
            if nums[mid] >= nums[r]:
                l = mid + 1
            else:
                r = mid
# 146/146 cases passed (40 ms)
# Your runtime beats 91.62 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

　　当然也可以跟 154 一样，用 mid 跟 left 对比：

```python
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
```

## References
1. [153. Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)
2. [huahua](http://zxi.mytechroad.com/blog/leetcode/leetcode-153-find-minimum-in-rotated-sorted-array/)
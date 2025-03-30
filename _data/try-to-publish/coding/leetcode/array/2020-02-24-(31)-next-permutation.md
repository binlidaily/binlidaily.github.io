---
layout: post
title: 31. Next Permutation
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Array]
image: 
comments: true
published: true
---

## Description

Implement **next permutation**, which rearranges numbers into the lexicographically next greater permutation of numbers.

If such arrangement is not possible, it must rearrange it as the lowest possible order (ie, sorted in ascending order).

The replacement must be **[in-place](http://en.wikipedia.org/wiki/In-place_algorithm)** and use only constant extra memory.

Here are some examples. Inputs are in the left-hand column and its corresponding outputs are in the right-hand column.

```
`1,2,3` → `1,3,2`
`3,2,1` → `1,2,3`
`1,1,5` → `1,5,1
```

## Solutions
### 1. Swap and Reverse
　　想法：
1. 从右往左找到第一个满足 nums[k] < nums[k+1] 的位置：
    1. 如果没找到（k<0），说明整个数组是逆序，reverse 的结果就是下一个排列
    2. 这样找到的 k 能够保证其右边全是降序的（含等于）
2. 然后在 [k+1:n]从右往左找到第一个满足 nums[k] < nums[l]：
    1. 找到的 l 上的数是 k 位置右侧所有大于 nums[k] 数中最小的
3. 交换 nums[k], nums[l] 两个数
    1. 因为 nums[l] > nums[k]，肯定要交换才能构成是后面的排序
    2. 但是还需要对 k 右侧数进行调整，因为之前是降序的，此时已经交换了高位（k 位置上）的数，那么其右侧的数应该是排列中最小的，即升序
4. 将 nums[k+1:] 中的数倒转顺序即可

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        if not nums:
            return
        n = len(nums)
        k = n - 2
        while k >= 0 and nums[k] >= nums[k+1]: # to find the largest k with nums[k] < nums[k+1]
            k -= 1
        if k < 0:
            # nums = nums[::-1]     # This cannot copy, just get object
            nums[:] = nums[::-1]
        else:
            l = n - 1
            while l >= 0 and nums[k] >= nums[l]: # to find the smallest l with nums[k] < nums[l]
                l -= 1
            nums[k], nums[l] = nums[l], nums[k] # smallest l on the right which nums[l] > nums[k]
            # orignal decrecing order should be increasing
            nums[k+1:] = nums[k+1:][::-1]   # to 
        return nums

# 265/265 cases passed (40 ms)
# Your runtime beats 69.22 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [31. Next Permutation](https://leetcode.com/problems/next-permutation/)
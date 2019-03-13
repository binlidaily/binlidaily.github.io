---
layout: post
title: 238. Product of Array Except Self
subtitle:
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

## Description
Given an array nums of n integers where n > 1,  return an array output such that output[i] is equal to the product of all the elements of nums except nums[i].

Example:

Input:  [1,2,3,4]
Output: [24,12,8,6]
Note: Please solve it without division and in O(n).

Follow up:
Could you solve it with constant space complexity? (The output array does not count as extra space for the purpose of space complexity analysis.)

## Solutions
第一反应是先将所有的数乘起来得出一个结果，然后再遍历一遍除去每一个数。但是 Follow Up 说不要用这么方式，而且试了下之后，这种方式要防止分母是零的情况。

另外一种可行的解决方案就是，从头扫遍历相乘到当前位置，然后从尾遍历相乘到当前位置。所以分两个循环来遍历，将两次遍历结果存在一个 product 中，实现对接。
1. 第一个循环遍历的是从头开始一直乘到当前位置，除去当前值
2. 第二个循环遍历的是从尾巴开始一直乘到当前位置，除去当前值

```python
class Solution(object):
    def productExceptSelf(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """
        # start from a base 1
        
        n = len(nums)
        p = 1
        product = []
        for i in range(n):
            product.append(p)
            p *= nums[i]
        
        # operate inplace
        p = 1
        for i in range(n-1, -1, -1):
            product[i] *= p
            p *= nums[i]
            
        return product
```

## References
1. [238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)
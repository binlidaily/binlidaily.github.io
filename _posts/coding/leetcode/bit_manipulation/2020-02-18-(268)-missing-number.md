---
layout: post
title: 268. Missing Number
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Bit Manipulation]
image: 
comments: true
published: true
---

## Description

Given an array containing *n* distinct numbers taken from `0, 1, 2, ..., n`, find the one that is missing from the array.

**Example 1:**

```
Input: [3,0,1]
Output: 2
```

**Example 2:**

```
Input: [9,6,4,2,3,5,7,0,1]
Output: 8
```

**Note**:
Your algorithm should run in linear runtime complexity. Could you implement it using only constant extra space complexity?


## Solutions
### 1. Sum

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        sum_nums = sum(nums)
        sum_full = 0
        for i in range(len(nums)+1):
            sum_full += i
        return sum_full - sum_nums
# 122/122 cases passed (140 ms)
# Your runtime beats 70.74 % of python3 submissions
# Your memory usage beats 83.87 % of python3 submissions (14 MB)
```

### 2. Bit Manipulation

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        n = len(nums)
        xor = 0
        for i in range(n):
            xor = xor ^ i ^ nums[i]
        return xor ^ n

# 122/122 cases passed (136 ms)
# Your runtime beats 85.31 % of python3 submissions
# Your memory usage beats 90.32 % of python3 submissions (14 MB)
```

## References
1. [268. Missing Number](https://leetcode.com/problems/missing-number/)
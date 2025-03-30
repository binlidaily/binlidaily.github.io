---
layout: post
title: 152. Maximum Product Subarray
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DP]
image: 
comments: true
published: true
---

## Description

Given an integer array `nums`, find the contiguous subarray within an array (containing at least one number) which has the largest product.

**Example 1:**

```
Input: [2,3,-2,4]
Output: 6
Explanation: [2,3] has the largest product 6.
```

**Example 2:**

```
Input: [-2,0,-1]
Output: 0
Explanation: The result cannot be 2, because [-2,-1] is not a subarray.
```


## Solutions
### 1. DP
　　当遇到 0 的时候，整个乘积会变成 0；当遇到负数的时候，当前的最大乘积会变成最小乘积，最小乘积会变成最大乘积。因为有政正负值的影响，所以需要考虑最大值和最小值的部分。

```python
# Time: O(n)
# Space: O(2n)
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        if not nums or len(nums) == 0:
            return 0
        n = len(nums)
        max_dp = [0 for _ in range(n)]
        min_dp = [0 for _ in range(n)]
        max_sofar = max_dp[0] = min_dp[0] = nums[0]
        for i in range(1, n):
            max_dp[i] = max(max_dp[i-1] * nums[i], min_dp[i-1] * nums[i], nums[i])
            min_dp[i] = min(max_dp[i-1] * nums[i], min_dp[i-1] * nums[i], nums[i])
            max_sofar = max(max_sofar, max_dp[i])
        return max_sofar
# 184/184 cases passed (80 ms)
# Your runtime beats 7.36 % of python3 submissions
# Your memory usage beats 17.24 % of python3 submissions (14.1 MB)
```

### 2. Space O(1)

```python
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        # store the result that is the max we have found so far
        if not nums or len(nums) == 0:
            return 0
        n = len(nums)
        max_v = min_v = max_sofar = nums[0]
        for i in range(1, n):
            if nums[i] < 0:
                max_v, min_v = min_v, max_v
            max_v = max(nums[i], max_v * nums[i])
            min_v = min(nums[i], min_v * nums[i])
            max_sofar = max(max_sofar, max_v)
        return max_sofar
# 184/184 cases passed (44 ms)
# Your runtime beats 99.46 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13 MB)
```

## References
1. [152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/description/)
---
layout: post
title: 334. Increasing Triplet Subsequence
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Greedy]
image: 
comments: true
published: true
---

## Description

Given an unsorted array return whether an increasing subsequence of length 3 exists or not in the array.

Formally the function should:

> Return true if there exists *i, j, k*
> such that *arr[i]* < *arr[j]* < *arr[k]* given 0 ≤ *i* < *j* < *k* ≤ *n*-1 else return false.

**Note:** Your algorithm should run in O(*n*) time complexity and O(*1*) space complexity.

**Example 1:**

```
Input: [1,2,3,4,5]
Output: true
```

**Example 2:**

```
Input: [5,4,3,2,1]
Output: false
```


## Solutions
### 1. DP

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def increasingTriplet(self, nums: List[int]) -> bool:
        if not nums or len(nums) < 3:
            return False
        n = len(nums)
        dp = [1 for i in range(n)]
        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:
                    dp[i] = max(dp[j] + 1, dp[i])
                    if dp[i] >= 3:
                        return True
        return False
# Time Limit Exceeded
# 61/62 cases passed (N/A)
```

### 2. Greedy

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def increasingTriplet(self, nums: List[int]) -> bool:
        if not nums or len(nums) < 3:
            return False
        n = len(nums)
        first = second = float('inf')
        for i in range(n):
            if nums[i] <= first:
                first = nums[i]
            elif nums[i] <= second:
                second = nums[i]
            else:
                return True
        return False
# 62/62 cases passed (52 ms)
# Your runtime beats 82.14 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.2 MB)
```
## References
1. [334. Increasing Triplet Subsequence](https://leetcode.com/problems/increasing-triplet-subsequence/description/)
---
layout: post
title: 213. House Robber II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DP]
image: 
comments: true
published: true
---

## Description

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are **arranged in a circle.** That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have security system connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.

Given a list of non-negative integers representing the amount of money of each house, determine the maximum amount of money you can rob tonight **without alerting the police**.

**Example 1:**

```
Input: [2,3,2]
Output: 3
Explanation: You cannot rob house 1 (money = 2) and then rob house 3 (money = 2),
             because they are adjacent houses.
```

**Example 2:**

```
Input: [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
             Total amount you can rob = 1 + 3 = 4.
```

## Solutions
### 1. DP

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def rob(self, nums: List[int]) -> int:
        if not nums or len(nums) <= 0:
            return 0
        elif len(nums) == 1:
            return nums[0]
        elif len(nums) == 2:
            return max(nums[0], nums[1])
        n = len(nums)
        dp0 = [0 for _ in range(n+1)]
        dp1 = [0 for _ in range(n+1)]
        dp0[1] = nums[0]
        # dp1[1] = nums[1]
        for i in range(2, n+1):
            dp0[i] = max(dp0[i-1], dp0[i-2]+nums[i-1])
            dp1[i] = max(dp1[i-1], dp1[i-2]+nums[i-1])
        return max(dp0[n-1], dp1[n])
# 74/74 cases passed (32 ms)
# Your runtime beats 83.6 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```

```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        if not nums or len(nums) <= 0:
            return 0
        elif len(nums) == 1:
            return nums[0]
        elif len(nums) == 2:
            return max(nums[0], nums[1])
        n = len(nums)
        dp0 = [0 for _ in range(n)]
        dp1 = [0 for _ in range(n)]
        dp0[0] = nums[0]
        dp0[1] = nums[0]
        dp1[1] = nums[1]
        for i in range(2, n):
            dp0[i] = max(dp0[i-1], dp0[i-2]+nums[i])
            dp1[i] = max(dp1[i-1], dp1[i-2]+nums[i])
        return max(dp0[-2], dp1[-1])
# 74/74 cases passed (32 ms)
# Your runtime beats 83.6 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

　　或者直接在第一题的基础上，传输两个字串，比较大小。


## References
1. [213. House Robber II](https://leetcode.com/problems/house-robber-ii)
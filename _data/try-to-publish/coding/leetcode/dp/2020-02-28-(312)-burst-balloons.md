---
layout: post
title: 312. Burst Balloons
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, DP]
image: 
comments: true
published: true
---

## Description

Given `n` balloons, indexed from `0` to `n-1`. Each balloon is painted with a number on it represented by array `nums`. You are asked to burst all the balloons. If the you burst balloon `i` you will get `nums[left] * nums[i] * nums[right]` coins. Here `left` and `right` are adjacent indices of `i`. After the burst, the `left` and `right` then becomes adjacent.

Find the maximum coins you can collect by bursting the balloons wisely.

**Note:**

- You may imagine `nums[-1] = nums[n] = 1`. They are not real therefore you can not burst them.
- 0 ≤ `n` ≤ 500, 0 ≤ `nums[i]` ≤ 100

**Example:**

```
Input: [3,1,5,8]
Output: 167 
Explanation: nums = [3,1,5,8] --> [3,5,8] -->   [3,8]   -->  [8]  --> []
             coins =  3*1*5      +  3*5*8    +  1*3*8      + 1*8*1   = 167
```


## Solutions
### 1. DP

```python
# Time: O(n^3)
# Space: O(n^2)
class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        nums = [1] + [num for num in nums if num > 0] + [1]
        n = len(nums)
        dp = [[0 for _ in range(n)] for _ in range(n)]
        for s in range(2, n):
            for l in range(n - s):
                r = l + s
                for k in range(l + 1, r):
                    dp[l][r] = max(dp[l][r], nums[l] * nums[k] * nums[r] + dp[l][k] + dp[k][r])
        return dp[0][n-1]
# 70/70 cases passed (432 ms)
# Your runtime beats 82.17 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.2 MB)
```

## References
1. [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/description/)
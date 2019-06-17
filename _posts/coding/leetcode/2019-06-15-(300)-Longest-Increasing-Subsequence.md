---
layout: post
title: 300. Longest Increasing Subsequence
subtitle: 递增字串问题
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given an unsorted array of integers, find the length of longest increasing subsequence.

Example:
```
Input: [10,9,2,5,3,7,101,18]
Output: 4 
Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4. 
```
Note:
```
* There may be more than one LIS combination, it is only necessary for you to return the length.
* Your algorithm should run in O(n2) complexity.
```
Follow up: Could you improve it to O(n log n) time complexity?

## Solutions
　　采用动态规划的解决方法，维护一个 dp 数组，其中 dp[i] 表示以 nums[i] 结尾的最长递增字串长度，对于每一个 nums[i]，我们从第一个数再搜索到 i，如果发现某个数小于 nums[i]，我们就更新 dp[i]，更新方法是 `dp[i] = max(dp[i], dp[j] + 1)`，即比较当前dp[i]的值和那个小于num[i]的数的dp值加1的大小，我们就这样不断的更新dp数组，到最后dp数组中最大的值就是我们要返回的 LIS 的长度。

```python
class Solution(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        n = len(nums)
        dp = [1] * n
        
        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:
                    dp[i] = max(dp[i], dp[j] + 1)
        
        return max(dp) if dp else 0
```

　　对应的可以做一个优化，

## References
1. [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
2. [Longest Increasing Subsequence ](http://bookshadow.com/weblog/2015/11/03/leetcode-longest-increasing-subsequence/)
3. [Longest Increasing Subsequence 最长递增子序列](https://www.cnblogs.com/grandyang/p/4938187.html)
---
layout: post
title: 416. Partition Equal Subset Sum
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DP]
image: 
comments: true
published: true
---

## Description

Given a **non-empty** array containing **only positive integers**, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

**Note:**

1. Each of the array element will not exceed 100.
2. The array size will not exceed 200.

 

**Example 1:**

```
Input: [1, 5, 11, 5]

Output: true

Explanation: The array can be partitioned as [1, 5, 5] and [11].
```

 

**Example 2:**

```
Input: [1, 2, 3, 5]

Output: false

Explanation: The array cannot be partitioned into equal sum subsets.
```


## Solutions
### 1. DP-01 Knapsack
　　要知道怎么转换这个问题，其实该题就是在数组中找到加和为总加和一半的若干个数。

　　dp[i][j] 表示前 i 个数能否组成加和为 j 的组合（可以不用全选前 i 个数）。


```python
# Time: O(mn)
# Space: O(mn)
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        if not nums:
            return False
        sumA = sum(nums)
        # if the sum is odd, return False
        if sumA & 1 == 1:
            return False
        sumA = sumA >> 1
        n = len(nums)
        dp = [[False for _ in range(sumA + 1)] for _ in range(n + 1)]
        dp[0][0] = True
        for i in range(1, n + 1):
            dp[i][0] = True
        for j in range(1, sumA + 1):
            dp[0][j] = False
        for i in range(1, n + 1):
            for j in range(1, sumA + 1):
                if nums[i - 1] <= j:
                    dp[i][j] = dp[i - 1][j] or dp[i - 1][j - nums[i - 1]]
                else:
                    dp[i][j] = dp[i - 1][j]
        return dp[n][sumA]
# Runtime: 2180 ms, faster than 10.05%
# Memory Usage: 16.8 MB, less than 9.09%
```

　　优化，要搞清楚为什么这么优化！

```python
# Time: O(mn)
# Space: O(m)
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        if not nums:
            return False
        sumA = sum(nums)
        # if the sum is odd, return False
        if sumA & 1 == 1:
            return False
        sumA = sumA >> 1
        dp = [False for _ in range(sumA + 1)]
        dp[0] = True
        
        for num in nums:
            for j in range(sumA, -1, -1):
                if num <= j:
                    dp[j] = dp[j] or dp[j - num]
        return dp[sumA]
# Runtime: 884 ms, faster than 42.07%
# Memory Usage: 12.7 MB, less than 100.00% 
```
## References
1. [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/description/)
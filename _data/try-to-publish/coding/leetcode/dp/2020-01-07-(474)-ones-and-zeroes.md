---
layout: post
title: 474. Ones and Zeroes
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DP]
image: 
comments: true
published: true
---

## Description

In the computer world, use restricted resource you have to generate maximum benefit is what we always want to pursue.

For now, suppose you are a dominator of **m** `0s` and **n** `1s` respectively. On the other hand, there is an array with strings consisting of only `0s` and `1s`.

Now your task is to find the maximum number of strings that you can form with given **m** `0s` and **n** `1s`. Each `0` and `1` can be used at most **once**.

**Note:**

1. The given numbers of `0s` and `1s` will both not exceed `100`
2. The size of given string array won't exceed `600`.

 

**Example 1:**

```
Input: Array = {"10", "0001", "111001", "1", "0"}, m = 5, n = 3
Output: 4

Explanation: This are totally 4 strings can be formed by the using of 5 0s and 3 1s, which are “10,”0001”,”1”,”0”
```

 

**Example 2:**

```
Input: Array = {"10", "0", "1"}, m = 1, n = 1
Output: 2

Explanation: You could form "10", but then you'd have nothing left. Better form "0" and "1".
```


## Solutions
### 1. 3D dp-01 knapsack
　　dp[i][j][k] 表示用 j 个 1，k 个 0 能够在前 i 个子串中最多组合多少个子串。


```python
# Time: O(lmn)
# Space: O(lmn)
class Solution:
    def findMaxForm(self, strs: List[str], m: int, n: int) -> int:
        l = len(strs)
        # dp[l+1][m+1][n+1]
        dp = [[[0 for _ in range(n + 1)] for _ in range(m + 1)] for _ in range(l + 1)]
        for i in range(1, l + 1):
            s = strs[i - 1]
            size = len(s)
            zeros = s.count('0')
            ones = size - zeros
            for j in range(0, m + 1):
                for k in range(0, n + 1):
                    if zeros <= j and ones <= k:
                        dp[i][j][k] = max(dp[i - 1][j][k], 1 + dp[i - 1][j - zeros][k - ones])
                    else:
                        dp[i][j][k] = dp[i - 1][j][k]
        return dp[l][m][n]
# Runtime: 5136 ms, faster than 13.59%
# Memory Usage: 61.1 MB, less than 100.00%
```

　　优化：

```python
# Time: O(lmn)
# Space: O(mn)
class Solution:
    def findMaxForm(self, strs: List[str], m: int, n: int) -> int:
        # dp[m+1][n+1]
        dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]
        for s in strs:
            size = len(s)
            zeros = s.count('0')
            ones = size - zeros
            for j in range(m, -1, -1):
                for k in range(n, -1, -1):
                    if zeros <= j and ones <= k:
                        dp[j][k] = max(dp[j][k], 1 + dp[j - zeros][k - ones])
        return dp[m][n]
# Runtime: 3908 ms, faster than 26.48%
# Memory Usage: 12.9 MB, less than 100.00%
```

## References
1. [474. Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes/description/)
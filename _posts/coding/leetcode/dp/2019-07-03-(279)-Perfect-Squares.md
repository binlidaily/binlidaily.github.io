---
layout: post
title: 279. Perfect Squares
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given a positive integer n, find the least number of perfect square numbers (for example, 1, 4, 9, 16, ...) which sum to n.

Example 1:
```
Input: n = 12
Output: 3 
Explanation: 12 = 4 + 4 + 4.
```

Example 2:
```
Input: n = 13
Output: 2
Explanation: 13 = 4 + 9.
```

## Solutions
　　面试中遇到过的题目，当场只给出了思路，还不对，要继续加油啊！查看了下前辈的思路，用动规来做，**我们定义 dp[i] 为整数 i 最少能分解成多少个正整数的平方和**：

```python
dp[i + j * j] = min(dp[i + j * j], dp[i] + 1)
```

<p align="center">
  <img width="" height="" src="/img/media/15621643227158.jpg">
</p>

　　参考下得到这样的结果，也是对照之后才写出来的，还得注意：

```python
class Solution(object):
    def numSquares(self, n):
        """
        :type n: int
        :rtype: int
        """
        if n == 0:
            return 0
        
        dp =  [0x7fffffff] * (n+1)
        dp[0] = 0
        # dp[1] = 1
        
        for i in range(n+1):
            j = 1
            while j * j <= n:
                dp[i] = min(dp[i], dp[i - j * j]+1)
                j += 1
        return dp[n]
# Runtime: 6108 ms, faster than 5.47% of Python online submissions for Perfect Squares.
# Memory Usage: 12 MB, less than 56.39% of Python online submissions for Perfect Squares.
```

## References
1. [279. Perfect Squares](https://leetcode.com/problems/perfect-squares/)
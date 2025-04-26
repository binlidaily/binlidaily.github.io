---
layout: post
title: 926. Flip String to Monotone Increasing
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DP]
image: 
comments: true
published: true
---

## Description

A string of `'0'`s and `'1'`s is *monotone increasing* if it consists of some number of `'0'`s (possibly 0), followed by some number of `'1'`s (also possibly 0.)

We are given a string `S` of `'0'`s and `'1'`s, and we may flip any `'0'` to a `'1'` or a `'1'` to a `'0'`.

Return the minimum number of flips to make `S` monotone increasing.

 

**Example 1:**

```
Input: "00110"
Output: 1
Explanation: We flip the last digit to get 00111.
```

**Example 2:**

```
Input: "010110"
Output: 2
Explanation: We flip to get 011111, or alternatively 000111.
```

**Example 3:**

```
Input: "00011000"
Output: 2
Explanation: We flip to get 00000000.
```

 

**Note:**

1. `1 <= S.length <= 20000`
2. `S` only consists of `'0'` and `'1'` characters.


## Solutions
### 1. Brute Force

```python
# Time: O(n^2)
# Space: O(1)
class Solution:
    def minFlipsMonoIncr(self, S: str) -> int:
        if not S or len(S) == 0:
            return 0
        n = len(S)
        min_flips = float('inf')
        for i in range(n):
            cnt, cnt0, cnt1 = 0, 0, 0
            for j in range(i):
                if S[j] == '1':
                    cnt += 1
            for l in range(i, n):
                if S[l] == '0':
                    cnt += 1
            for m in range(n):
                if S[m] == '0':
                    cnt0 += 1
                else:
                    cnt1 += 1
            min_flips = min(min_flips, cnt, cnt0, cnt1)
        return min_flips
# TLE
```
### 2. 1D-DP
　　从两端扫描。

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def minFlipsMonoIncr(self, S: str) -> int:
        if not S or len(S) == 0:
            return 0
        n = len(S)
        l = [0 for _ in range(n + 1)]
        r = [0 for _ in range(n + 1)]
        l[0] = 1 if S[0] == '1' else 0
        r[n - 1] = 1 if S[n - 1] == '0' else 0
        
        for i in range(1, n):
            l[i] = l[i-1] + (1 if S[i] == '1' else 0)
        
        for i in range(n-2, -1, -1):
            r[i] = r[i+1] + (1 if S[i] == '0' else 0)
        
        min_flips = r[0]
        for i in range(1, n + 1):
            min_flips = min(min_flips, l[i - 1] + r[i])
        return min_flips

# 81/81 cases passed (108 ms)
# Your runtime beats 15.62 % of python3 submissions
# Your memory usage beats 25 % of python3 submissions (14.3 MB)
```

### 2. 2D-DP

```python
# Time: O(n)
# Sapce: O(n)
class Solution:
    def minFlipsMonoIncr(self, S: str) -> int:
        if not S or len(S) == 0:
            return 0
        n = len(S)
        dp = [[0 for _ in range(2)] for _ in range(n + 1)]
        for i in range(1, n+1):
            if S[i - 1] == '1':
                dp[i][0] = dp[i-1][0] + 1
                dp[i][1] = min(dp[i-1][0], dp[i-1][1])
            else:
                dp[i][0] = dp[i-1][0]
                dp[i][1] = min(dp[i-1][0], dp[i - 1][1]) + 1
        return min(dp[n][0], dp[n][1])
# 81/81 cases passed (144 ms)
# Your runtime beats 5.8 % of python3 submissions
# Your memory usage beats 25 % of python3 submissions (15.4 MB)
```

### 3. Optimized DP
　　当 dp[i] 只和 dp[i-1] 有关的话，可以进行降维！
```python
# Time: O(n)
# Sapce: O(n)
class Solution:
    def minFlipsMonoIncr(self, S: str) -> int:
        if not S or len(S) == 0:
            return 0
        n = len(S)
        dp0, dp1 = 0, 0
        for i in range(1, n+1):
            tmp0 = dp0 + (1 if S[i-1] == '1' else 0)
            dp1 = min(dp0, dp1) + (1 if S[i-1] == '0' else 0)
            dp0 = tmp0
        return min(dp0, dp1)
# 81/81 cases passed (144 ms)
# Your runtime beats 5.8 % of python3 submissions
# Your memory usage beats 25 % of python3 submissions (15.4 MB)
```
## References
1. [926. Flip String to Monotone Increasing](https://leetcode.com/problems/flip-string-to-monotone-increasing/description/)
2. [Huahua](https://www.youtube.com/watch?v=D8xa8ZMV7AI)
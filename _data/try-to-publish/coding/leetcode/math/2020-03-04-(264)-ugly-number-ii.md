---
layout: post
title: 264. Ugly Number II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Math, DP]
image: 
comments: true
published: true
---

## Description

Write a program to find the `n`-th ugly number.

Ugly numbers are **positive numbers** whose prime factors only include `2, 3, 5`. 

**Example:**

```
Input: n = 10
Output: 12
Explanation: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 is the sequence of the first 10 ugly numbers.
```

**Note:** 

1. `1` is typically treated as an ugly number.
2. `n` **does not exceed 1690**.


## Solutions
### 1. Brute Force
　　如果直接遍历所有数，并判断每个数是不是丑数，这样就太多重复了，累加时有无效数算是一种重复，再判断每一个数是否为丑数就需要除和取余，又是一种重复，其实可以用之前的已知的丑数，在其基础上乘2、3、5 就好了。

```python
# Time: O(n^3)
# Space: O(n)
class Solution:
    def nthUglyNumber(self, n: int) -> int:
        if n <= 0:
            return 0
        INT_MAX = 2**32-1
        ugly_nums = []
        t2 = t3 = t5 = 1
        while t2 <= INT_MAX:
            t3 = t2
            while t3 <= INT_MAX:
                t5 = t3
                while t5 <= INT_MAX:
                    ugly_nums.append(t5)
                    t5 *= 5
                t3 *= 3
            t2 *= 2
        ugly_nums.sort()
        return ugly_nums[n-1]

# 596/596 cases passed (292 ms)
# Your runtime beats 20.29 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

### 2. DP

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def nthUglyNumber(self, n: int) -> int:
        if n <= 0:
            return 0
        ugly_nums = [1]
        i2, i3, i5 = 0, 0, 0
        for _ in range(n):
            next2 = ugly_nums[i2] * 2
            next3 = ugly_nums[i3] * 3
            next5 = ugly_nums[i5] * 5
            next = min(next2, next3, next5)
            if next == next2:
                i2 += 1
            if next == next3:
                i3 += 1
            if next == next5:
                i5 += 1
            ugly_nums.append(next)
        return ugly_nums[n-1]

# 596/596 cases passed (128 ms)
# Your runtime beats 87.68 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```

## References
1. [264. Ugly Number II](https://leetcode.com/problems/ugly-number-ii/)
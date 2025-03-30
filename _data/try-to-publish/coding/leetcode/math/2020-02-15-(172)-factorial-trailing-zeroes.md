---
layout: post
title: 172. Factorial Trailing Zeroes
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Math]
image: 
comments: true
published: true
---

## Description

Given an integer *n*, return the number of trailing zeroes in *n*!.

**Example 1:**

```
Input: 3
Output: 0
Explanation: 3! = 6, no trailing zero.
```

**Example 2:**

```
Input: 5
Output: 1
Explanation: 5! = 120, one trailing zero.
```

**Note:** Your solution should be in logarithmic time complexity.


## Solutions
### 1. Math
　　直接求阶乘，数零会超时：
```python
# Time: O(n)
# Space: O(1)
class Solution:
    def trailingZeroes(self, n: int) -> int:
        # strs = str(factorial(n))
        prob = 1
        for i in range(1, n+1):
            prob *= i
        strs = str(prob)
        cnt = 0
        for ch in strs[::-1]:
            if ch == '0':
                cnt += 1
            else:
                break
        return cnt

# Time Limit Exceeded
# 500/502 cases passed (N/A)
# Testcase
# 1808548329
```

　　举例子发现，主要是记录连乘的数中，5 的阶乘的倍数有多少个。

```python
# Time: O(logn)
# Space: O(logn)
class Solution:
    def trailingZeroes(self, n: int) -> int:
        return 0 if n < 5 else n // 5 + self.trailingZeroes(n // 5)

# 502/502 cases passed (32 ms)
# Your runtime beats 38.2 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```


## References
1. [172. Factorial Trailing Zeroes](https://leetcode.com/problems/factorial-trailing-zeroes/description/)
2. [huahua](https://zxi.mytechroad.com/blog/math/leetcode-172-factorial-trailing-zeroes/)
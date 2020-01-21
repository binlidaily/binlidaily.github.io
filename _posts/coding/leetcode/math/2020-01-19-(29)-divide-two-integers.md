---
layout: post
title: 29. Divide Two Integers
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Math, Bit Manipulation]
image: 
comments: true
published: true
---

## Description

Given two integers `dividend` and `divisor`, divide two integers without using multiplication, division and mod operator.

Return the quotient after dividing `dividend` by `divisor`.

The integer division should truncate toward zero.

**Example 1:**

```
Input: dividend = 10, divisor = 3
Output: 3
```

**Example 2:**

```
Input: dividend = 7, divisor = -3
Output: -2
```

**Note:**

- Both dividend and divisor will be 32-bit signed integers.
- The divisor will never be 0.
- Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−231,  231 − 1]. For the purpose of this problem, assume that your function returns 231 − 1 when the division result overflows.


## Solutions
### 1. Bit Manipulation

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def divide(self, dividend: int, divisor: int) -> int:
        sigal = (dividend < 0) == (divisor < 0)
        dividend, divisor, res = abs(dividend), abs(divisor), 0
        while dividend >= divisor:
            shift = 0
            while dividend >= divisor << shift:
                shift += 1
            res += (1 << (shift - 1))
            dividend -= (divisor << (shift - 1))
        return min(res if sigal else -res, 2147483647)
# 989/989 cases passed (32 ms)
# Your runtime beats 56.52 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```
## References
1. [29. Divide Two Integers](https://leetcode.com/problems/divide-two-integers/)
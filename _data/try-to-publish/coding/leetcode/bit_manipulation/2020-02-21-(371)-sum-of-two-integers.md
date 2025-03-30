---
layout: post
title: 371. Sum of Two Integers
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Bit Manipulation]
image: 
comments: true
published: true
---

## Description

Calculate the sum of two integers *a* and *b*, but you are **not allowed** to use the operator `+` and `-`.

**Example 1:**

```
Input: a = 1, b = 2
Output: 3
```

**Example 2:**

```
Input: a = -2, b = 3
Output: 1
```


## Solutions
### 1. Bit Manipulation

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def getSum(self, a: int, b: int) -> int:
        # return a if b == 0 else self.getSum(a ^ b, (a & b) << 1)
        
        # 32 bits integer max
        MAX = 0x7FFFFFFF
        # 32 bits interger min
        # MIN = 0x80000000
        # mask to get last 32 bits
        mask = 0xFFFFFFFF
        while b != 0:
            # ^ get different bits and & gets double 1s, << moves carry
            a, b = (a ^ b) & mask, ((a & b) << 1) & mask
        # if a is negative, get a's 32 bits complement positive first
        # then get 32-bit positive's Python complement negative
        return a if a <= MAX else ~(a ^ mask)

# 13/13 cases passed (24 ms)
# Your runtime beats 84.85 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [371. Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/description/)
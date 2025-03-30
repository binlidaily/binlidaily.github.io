---
layout: post
title: 869. Reordered Power of 2
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Hash Table]
image: 
comments: true
published: true
---

## Description

Starting with a positive integer `N`, we reorder the digits in any order (including the original order) such that the leading digit is not zero.

Return `true` if and only if we can do this in a way such that the resulting number is a power of 2.

 


**Example 1:**

```
Input: 1
Output: true
```

**Example 2:**

```
Input: 10
Output: false
```

**Example 3:**

```
Input: 16
Output: true
```

**Example 4:**

```
Input: 24
Output: false
```

**Example 5:**

```
Input: 46
Output: true
```

 

**Note:**

1. `1 <= N <= 10^9`


## Solutions
### 1. Hash Table

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def reorderedPowerOf2(self, N: int) -> bool:
        key = self.counter(N)
        for i in range(32):
            if self.counter(1 << i) == key:
                return True
        return False
    
    def counter(self, num):
        res = 0
        while num != 0:
            res += pow(10, num % 10)
            num //= 10
        return res
# 135/135 cases passed (32 ms)
# Your runtime beats 56.63 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [869. Reordered Power of 2](https://leetcode.com/problems/reordered-power-of-2/)
---
layout: post
title: 633. Sum of Square Numbers
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given a non-negative integer c, your task is to decide whether there're two integers a and b such that a2 + b2 = c.

Example 1:
```
Input: 5
Output: True
Explanation: 1 * 1 + 2 * 2 = 5
```

Example 2:
```
Input: 3
Output: False
```

## Solutions
　　第一想法写出来的代码时间复杂度是 $O(n^2)$，过不了时间限制：
```python
class Solution(object):        
    def judgeSquareSum(self, c):
        """
        :type c: int
        :rtype: bool
        """
        from math import sqrt

        if c == 0 or c == 1:
            return True
        
        n = int(sqrt(c))
        for i in range(n+1):
            res = c - i ** 2
            n_res = int(sqrt(res))
            for j in range(n_res+1):
                if j **2 == res:
                    return True
        return False
```

　　参考了别人做法，确实快好多。
```python
class Solution(object):        
    def judgeSquareSum(self, c):
        """
        :type c: int
        :rtype: bool
        """
        from math import sqrt
        left, right = 0, int(sqrt(c))
        while left <= right:
            squre_sum = left * left + right * right
            if squre_sum < c:
                left += 1
            elif squre_sum > c:
                right -= 1
            else:
                return True
        return False
# Runtime: 76 ms, faster than 95.89% of Python online submissions for Sum of Square Numbers.
# Memory Usage: 11.7 MB, less than 83.97% of Python online submissions for Sum of Square Numbers.
```

## References
1. [633. Sum of Square Numbers](https://leetcode.com/problems/sum-of-square-numbers/)
---
layout: post
title: 7. Reverse Integer
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Math]
image: 
comments: true
published: true
---

## Description

Given a 32-bit signed integer, reverse digits of an integer.

**Example 1:**

```
Input: 123
Output: 321
```

**Example 2:**

```
Input: -123
Output: -321
```

**Example 3:**

```
Input: 120
Output: 21
```

**Note:**
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−231, 231 − 1]. For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.


## Solutions
### 1. Brute Force

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def reverse(self, x: int) -> int:
        strx = list(str(x))
        sign = -1 if strx[0] == '-' else 1
        if strx[0] == '-':
            strx = strx[1:]
        n = len(strx)
        l, r = 0, n-1
        while l < r:
            strx[l], strx[r] = strx[r], strx[l]
            l += 1
            r -= 1
        res = sign * int(''.join(strx))
        return res if -2147483648 <= res <= 2147483647 else 0
# 1032/1032 cases passed (36 ms)
# Your runtime beats 18.79 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

### 2. Math
　　Python 对负数取模结果是正数，弄了半天！

```python
# Time: O(n)
# Time: O(1)
class Solution:
    def reverse(self, x: int) -> int:
        rev = 0
        sign = -1 if x < 0 else 1
        x = abs(x)
        while x != 0:
            # x, mod = divmod(x, 10)
            # rev = rev * 10 + mod
            rev = rev * 10 + x % 10
            x = x // 10
            # overflow
            # if rev > 2147483647 or rev < -2147483648:
            #     return 0
        rev *= sign
        if rev > 2147483647 or rev < -2147483648:
            return 0
        return rev
# 1032/1032 cases passed (28 ms)
# Your runtime beats 78.3 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```
## References
1. [7. Reverse Integer](https://leetcode.com/problems/reverse-integer/)
2. [My accepted 15 lines of code for Java](https://leetcode.com/problems/reverse-integer/discuss/4060/My-accepted-15-lines-of-code-for-Java)

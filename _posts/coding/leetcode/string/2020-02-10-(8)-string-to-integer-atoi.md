---
layout: post
title: 8. String to Integer (atoi)
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, String]
image: 
comments: true
published: true
---

## Description

Implement `atoi` which converts a string to an integer.

The function first discards as many whitespace characters as necessary until the first non-whitespace character is found. Then, starting from this character, takes an optional initial plus or minus sign followed by as many numerical digits as possible, and interprets them as a numerical value.

The string can contain additional characters after those that form the integral number, which are ignored and have no effect on the behavior of this function.

If the first sequence of non-whitespace characters in str is not a valid integral number, or if no such sequence exists because either str is empty or it contains only whitespace characters, no conversion is performed.

If no valid conversion could be performed, a zero value is returned.

**Note:**

- Only the space character `' '` is considered as whitespace character.
- Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−231, 231 − 1]. If the numerical value is out of the range of representable values, INT_MAX (231 − 1) or INT_MIN (−231) is returned.

**Example 1:**

```
Input: "42"
Output: 42
```

**Example 2:**

```
Input: "   -42"
Output: -42
Explanation: The first non-whitespace character is '-', which is the minus sign.
             Then take as many numerical digits as possible, which gets 42.
```

**Example 3:**

```
Input: "4193 with words"
Output: 4193
Explanation: Conversion stops at digit '3' as the next character is not a numerical digit.
```

**Example 4:**

```
Input: "words and 987"
Output: 0
Explanation: The first non-whitespace character is 'w', which is not a numerical 
             digit or a +/- sign. Therefore no valid conversion could be performed.
```

**Example 5:**

```
Input: "-91283472332"
Output: -2147483648
Explanation: The number "-91283472332" is out of the range of a 32-bit signed integer.
             Thefore INT_MIN (−231) is returned.
```


## Solutions
### 1. String

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def myAtoi(self, str: str) -> int:
        if not str or str == '':
            return 0
        chars = 'abcdefghijklmnopqrstuvwxyz'
        keys = list('0123456789')
        values = range(10)
        chardic = dict(zip(keys, values))
        strlst = list(str)
        digit = []
        for ch in strlst:
            if not digit and (ch in chars or ch == '.'):
                return 0
            if not digit and (ch == '+' or ch == '-' or ch.isdigit()):
                digit.append(ch)
            elif digit and ch.isdigit():
                digit.append(ch)
            elif digit and not ch.isdigit():
                break
        res = 0
        if not digit:
            return 0
        sign = -1 if digit[0] == '-' else 1
        for d in digit:
            if d == '-' or d == '+':
                continue
            elif not res:
                res = chardic[d]
            else:
                res = res * 10 + chardic[d]
        res = res * sign
        if res > 2 ** 31 - 1:
            res = 2 ** 31 - 1
        elif res < -2 ** 31:
            res = -2 ** 31
        return res

# 1079/1079 cases passed (48 ms)
# Your runtime beats 8.94 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [8. String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/description/)
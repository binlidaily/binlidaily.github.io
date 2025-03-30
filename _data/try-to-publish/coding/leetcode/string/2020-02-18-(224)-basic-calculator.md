---
layout: post
title: 224. Basic Calculator
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, String, Stack]
image: 
comments: true
published: true
---

## Description

Implement a basic calculator to evaluate a simple expression string.

The expression string may contain open `(` and closing parentheses `)`, the plus `+` or minus sign `-`, **non-negative** integers and empty spaces ``.

**Example 1:**

```
Input: "1 + 1"
Output: 2
```

**Example 2:**

```
Input: " 2-1 + 2 "
Output: 3
```

**Example 3:**

```
Input: "(1+(4+5+2)-3)+(6+8)"
Output: 23
```

**Note:**

- You may assume that the given expression is always valid.
- **Do not** use the `eval` built-in library function.


## Solutions
### 1. Stack

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def calculate(self, s: str) -> int:
        res, val, sign, stack = 0, 0, 1, []
        for ch in s:
            if ch.isdigit():
                val = 10 * val + int(ch)
            elif ch in '-+':
                res += sign * val
                val = 0
                sign =[-1, 1][ch == '+']
            elif ch == '(':
                stack.append(res)
                stack.append(sign)
                sign, res = 1, 0
            elif ch == ')':
                res += sign * val
                res *= stack.pop()
                res += stack.pop()
                val = 0
        return res + val * sign

# 37/37 cases passed (72 ms)
# Your runtime beats 92.26 % of python3 submissions
# Your memory usage beats 7.14 % of python3 submissions (14.2 MB)
```

### 2. Recursion

```Python
# Time: O(n)
# Space: O(n)
class Solution:
    def calculate(self, s: str) -> int:
        arr = []
        for c in s:
            arr.append(c)
        return self.helper(arr)

    def helper(self, arr):
        stack = []
        sign = '+'
        num = 0
        while len(arr) > 0:
            c = arr.pop(0)
            if c.isdigit():
                num = num*10 + int(c)
            if c == '(':
                num = self.helper(arr)
            if c == '+' or c == '-' or c == ')' or len(arr) == 0:
                if sign == '+':
                    stack.append(num)
                elif sign == '-':
                    stack.append(-num)
                sign = c
                num = 0
                if c == ')':
                    break
        return sum(stack)

# 37/37 cases passed (4300 ms)
# Your runtime beats 5.1 % of python3 submissions
# Your memory usage beats 7.14 % of python3 submissions (16.4 MB)
```
## References
1. [224. Basic Calculator](https://leetcode.com/problems/basic-calculator/description/)
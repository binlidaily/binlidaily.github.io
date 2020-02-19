---
layout: post
title: 227. Basic Calculator II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Stack, String]
image: 
comments: true
published: true
---

## Description

Implement a basic calculator to evaluate a simple expression string.

The expression string contains only **non-negative** integers, `+`, `-`, `*`, `/` operators and empty spaces ``. The integer division should truncate toward zero.

**Example 1:**

```
Input: "3+2*2"
Output: 7
```

**Example 2:**

```
Input: " 3/2 "
Output: 1
```

**Example 3:**

```
Input: " 3+5 / 2 "
Output: 5
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
        stack = []
        res = 0
        sign = '+'
        val = 0
        for i, ch in enumerate(s):
            if ch.isdigit():
                val = val * 10 + int(ch)
            if (not ch.isdigit() and ch != ' ') or len(s) - 1== i:
                if sign == '+':
                    stack.append(val)
                elif sign == '-':
                    stack.append(-val)
                elif sign == '/':
                    if stack[-1] > 0:
                        stack.append(stack.pop() // val)
                    else:
                        stack.append(int(stack.pop() / val))
                elif sign == '*':
                    stack.append(stack.pop() * val)
                sign = ch
                val = 0
        for num in stack:
            res += num
        return res

# 109/109 cases passed (96 ms)
# Your runtime beats 62.52 % of python3 submissions
# Your memory usage beats 88.89 % of python3 submissions (14.4 MB)
```

## References
1. [227. Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/description/)
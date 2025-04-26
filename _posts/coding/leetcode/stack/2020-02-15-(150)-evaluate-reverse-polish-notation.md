---
layout: post
title: 150. Evaluate Reverse Polish Notation
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Stack]
image: 
comments: true
published: true
---

## Description

Evaluate the value of an arithmetic expression in [Reverse Polish Notation](http://en.wikipedia.org/wiki/Reverse_Polish_notation).

Valid operators are `+`, `-`, `*`, `/`. Each operand may be an integer or another expression.

**Note:**

- Division between two integers should truncate toward zero.
- The given RPN expression is always valid. That means the expression would always evaluate to a result and there won't be any divide by zero operation.

**Example 1:**

```
Input: ["2", "1", "+", "3", "*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9
```

**Example 2:**

```
Input: ["4", "13", "5", "/", "+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6
```

**Example 3:**

```
Input: ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]
Output: 22
Explanation: 
  ((10 * (6 / ((9 + 3) * -11))) + 17) + 5
= ((10 * (6 / (12 * -11))) + 17) + 5
= ((10 * (6 / -132)) + 17) + 5
= ((10 * 0) + 17) + 5
= (0 + 17) + 5
= 17 + 5
= 22
```


## Solutions
### 1. Stack

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        operand = set({'+', '-', '*', '/'})
        res = None
        if len(tokens) == 1:
            return int(tokens[0])

        for ch in tokens:
            if stack and ch in operand:
                second = int(stack.pop())
                if not stack:
                    return None
                first = int(stack.pop())
                if ch == '+':
                    tmp = first + second
                elif ch == '-':
                    tmp = first - second
                elif ch == '*':
                    tmp = first * second
                else:
                    if (first >= 0 and second < 0) or (first <= 0 and second > 0):
                        tmp = abs(first) // abs(second)
                        tmp = -tmp
                    else:
                        tmp = first // second
                res = tmp
                stack.append(tmp)
            else:
                stack.append(ch)
        return res

# 20/20 cases passed (68 ms)
# Your runtime beats 64.81 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

## References
1. [150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/description/)
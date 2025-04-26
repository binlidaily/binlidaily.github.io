---
layout: post
title: 20. Valid Parentheses
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, String, Stack]
image: 
comments: true
published: true
---

## Description

Given a string containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Note that an empty string is also considered valid.

**Example 1:**

```
Input: "()"
Output: true
```

**Example 2:**

```
Input: "()[]{}"
Output: true
```

**Example 3:**

```
Input: "(]"
Output: false
```

**Example 4:**

```
Input: "([)]"
Output: false
```

**Example 5:**

```
Input: "{[]}"
Output: true
```

## Solutions
### 1. Stack-先进后出
　　一般来讲这种匹配问题会涉及到先进后出的过程，很明显用 Stack，然而第一次手写果然还是很不优雅啊：


```python
class Solution:
    def isValid(self, s: str) -> bool:
        if not s:
            return True
        stack = []
        for c in s:
            if not stack and (c == ')' or c == ']' or c == '}'):
                return False
            if c == '(' or c == '[' or c == '{':
                stack.append(c)
            else:
                if c == ')' and stack[-1] == '(':
                    stack.pop()
                    continue
                if c == ']' and stack[-1] == '[':
                    stack.pop() 
                    continue
                if c == '}' and stack[-1] == '{':
                    stack.pop()
                    continue
                stack.append(c)
        if stack:
            return False
        else:
            return True
# 76/76 cases passed (32 ms)
# Your runtime beats 79.89 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

　　这种写法真是优雅，用上了字典！


```python
class Solution:
    def isValid(self, s: str) -> bool:
        valid = dict(zip([')',"]","}"],["(","[","{"]))
        s = list(s)
        stack = list()
        for i in range(len(s)):
            if s[i] in valid.values():
                stack.append(s[i])
            elif stack==[] or valid[s[i]]!=stack.pop():
                return False
        return not stack
# 76/76 cases passed (28 ms)
# Your runtime beats 92.12 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses)
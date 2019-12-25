---
layout: post
title: 796. Rotate String
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, String]
image: 
comments: true
published: true
---

## Description

We are given two strings, `A` and `B`.

A *shift on `A`* consists of taking string `A` and moving the leftmost character to the rightmost position. For example, if `A = 'abcde'`, then it will be `'bcdea'` after one shift on `A`. Return `True` if and only if `A` can become `B` after some number of shifts on `A`.

```
Example 1:
Input: A = 'abcde', B = 'cdeab'
Output: true

Example 2:
Input: A = 'abcde', B = 'abced'
Output: false
```

**Note:**

- `A` and `B` will have length at most `100`.

## Solutions
### 1. KMP

　　得复习一下 KMP 了……
```python
# Time: O(n)
# Space: O(n)
class Solution:
    def rotateString(self, A: str, B: str) -> bool:
        if not A and not B:
            return True
        if not A or not B or len(A) != len(B):
            return False
        return B in A + A
# 45/45 cases passed (24 ms)
# Your runtime beats 93.96 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [796. Rotate String](https://leetcode.com/problems/rotate-string/description/)
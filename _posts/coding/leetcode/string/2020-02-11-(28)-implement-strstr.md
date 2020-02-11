---
layout: post
title: 28. Implement strStr()
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, String, Array]
image: 
comments: true
published: true
---

## Description

Implement [strStr()](http://www.cplusplus.com/reference/cstring/strstr/).

Return the index of the first occurrence of needle in haystack, or **-1** if needle is not part of haystack.

**Example 1:**

```
Input: haystack = "hello", needle = "ll"
Output: 2
```

**Example 2:**

```
Input: haystack = "aaaaa", needle = "bba"
Output: -1
```

**Clarification:**

What should we return when `needle` is an empty string? This is a great question to ask during an interview.

For the purpose of this problem, we will return 0 when `needle` is an empty string. This is consistent to C's [strstr()](http://www.cplusplus.com/reference/cstring/strstr/) and Java's [indexOf()](https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#indexOf(java.lang.String)).


## Solutions
### 1. Array

```python
# Time: O(mn)
# Space: O(1)
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
        h = len(haystack)
        n = len(needle)
        if h < n:
            return -1
        for i in range(h - n + 1):
            if haystack[i] == needle[0]:
                idx = i
                j = 0
                while j < n:
                    if haystack[idx] != needle[j]:
                        break
                    j += 1
                    idx += 1
                if j == n:
                    return i
        return -1

# 74/74 cases passed (36 ms)
# Your runtime beats 37.85 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [28. Implement strStr()](https://leetcode.com/problems/implement-strstr/)
---
layout: post
title: 205. Isomorphic Strings
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Hash Table]
image: 
comments: true
published: true
---

## Description

Given two strings ***s\*** and ***t\***, determine if they are isomorphic.

Two strings are isomorphic if the characters in ***s\*** can be replaced to get ***t\***.

All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character but a character may map to itself.

**Example 1:**

```
Input: s = "egg", t = "add"
Output: true
```

**Example 2:**

```
Input: s = "foo", t = "bar"
Output: false
```

**Example 3:**

```
Input: s = "paper", t = "title"
Output: true
```

**Note:**
You may assume both ***s\*** and ***t\*** have the same length.


## Solutions
### 1. Hash Table

```python
# Time: O(n)
# Space: O(2n)
class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        if (not s and t) or (s and not s) or len(s) != len(t):
            return False
        n = len(s)
        hash_s = collections.defaultdict()
        hash_t = collections.defaultdict()
        for i in range(n):
            if s[i] in hash_s:
                if hash_s[s[i]] != t[i]:
                    return False
            else:
                hash_s[s[i]] = t[i]
            if t[i] in hash_t:
                if hash_t[t[i]] != s[i]:
                    return False
            else:
                hash_t[t[i]] = s[i]
        return True
# 30/30 cases passed (40 ms)
# Your runtime beats 57.07 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [205. Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings/description/)

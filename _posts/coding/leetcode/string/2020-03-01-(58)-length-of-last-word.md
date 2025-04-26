---
layout: post
title: 58. Length of Last Word
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, String]
image: 
comments: true
published: true
---

## Description

Given a string *s* consists of upper/lower-case alphabets and empty space characters `' '`, return the length of last word (last word means the last appearing word if we loop from left to right) in the string.

If the last word does not exist, return 0.

**Note:** A word is defined as a **maximal substring** consisting of non-space characters only.

**Example:**

```
Input: "Hello World"
Output: 5
```

## Solutions
### 1. String

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        if not s:
            return 0
        n = len(s)
        start = None
        for i in range(n - 1, -1, -1):
            if not start and s[i] != ' ':
                start = i
            if start and s[i] == ' ':
                return start - i
        return start + 1 if start is not None else 0

# 59/59 cases passed (16 ms)
# Your runtime beats 99.57 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [58. Length of Last Word](https://leetcode.com/problems/length-of-last-word/description/)
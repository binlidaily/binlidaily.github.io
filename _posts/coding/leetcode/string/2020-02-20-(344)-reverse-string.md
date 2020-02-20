---
layout: post
title: 344. Reverse String
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy]
image: 
comments: true
published: true
---

## Description

Write a function that reverses a string. The input string is given as an array of characters `char[]`.

Do not allocate extra space for another array, you must do this by **modifying the input array [in-place](https://en.wikipedia.org/wiki/In-place_algorithm)** with O(1) extra memory.

You may assume all the characters consist of [printable ascii characters](https://en.wikipedia.org/wiki/ASCII#Printable_characters).

 

**Example 1:**

```
Input: ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
```

**Example 2:**

```
Input: ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]
```


## Solutions
### 1. Two Pointers

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def reverseString(self, s: List[str]) -> None:
        """
        Do not return anything, modify s in-place instead.
        """
        if not s:
            return
        l, r = 0, len(s) - 1
        while l < r:
            s[l], s[r] = s[r], s[l]
            l += 1
            r -= 1
        # return s

# 478/478 cases passed (200 ms)
# Your runtime beats 97.93 % of python3 submissions
# Your memory usage beats 98.84 % of python3 submissions (17.2 MB)
```

## References
1. [344. Reverse String](https://leetcode.com/problems/reverse-string/description/)
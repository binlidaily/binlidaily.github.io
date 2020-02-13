---
layout: post
title: 125. Valid Palindrome
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, String]
image: 
comments: true
published: true
---

## Description

Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.

**Note:** For the purpose of this problem, we define empty string as valid palindrome.

**Example 1:**

```
Input: "A man, a plan, a canal: Panama"
Output: true
```

**Example 2:**

```
Input: "race a car"
Output: false
```

## Solutions
### 1. String

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def isPalindrome(self, s: str) -> bool:
        strs = ''
        alphet = list('abcdefghijklmnopqrstuvwxyz0123456789')
        s = s.lower()
        for ch in s:
            if ch in alphet:
                strs += ch
        
        n = len(strs)
        l, r = n // 2, n // 2
        if n % 2 == 0:
            l -= 1
        while l >= 0 and r < n:
            if strs[l] != strs[r]:
                return False
            l -= 1
            r += 1
        return True

# 476/476 cases passed (80 ms)
# Your runtime beats 9.19 % of python3 submissions
# Your memory usage beats 84.52 % of python3 submissions (13.3 MB)
```

　　不要非要从中间开始遍历嘛，这样要使用到除法以及取模操作，两个指针从两边出发往中间行进也是可以的啊。


```python
# Time: O(n)
# Space: O(n)
class Solution:
    def isPalindrome(self, s: str) -> bool:
        l, r = 0, len(s) - 1
        while l < r:
            while l < r and not s[l].isalnum():
                l += 1
            while l < r and not s[r].isalnum():
                r -= 1

            if s[l].lower() != s[r].lower():
                return False
            l += 1
            r -= 1
        return True

# 476/476 cases passed (48 ms)
# Your runtime beats 61.55 % of python3 submissions
# Your memory usage beats 76.19 % of python3 submissions (13.3 MB)
```
## References
1. [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)

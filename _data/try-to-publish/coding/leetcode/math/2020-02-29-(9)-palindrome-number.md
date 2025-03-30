---
layout: post
title: 9. Palindrome Number
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy]
image: 
comments: true
published: true
---

## Description

Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.

**Example 1:**

```
Input: 121
Output: true
```

**Example 2:**

```
Input: -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
```

**Example 3:**

```
Input: 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
```

**Follow up:**

Could you solve it without converting the integer to a string?


## Solutions
### 1. Convert to String

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def isPalindrome(self, x: int) -> bool:
        return self._isPalindrome(str(x))
    
    def _isPalindrome(self, s):
        if not s:
            return True
        n = len(s)
        l, r = 0, n - 1
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1
        return True

# 11509/11509 cases passed (72 ms)
# Your runtime beats 31.57 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

### 2. Divmod
　　通过除 10 和模 10，将数颠倒过来，然后看是否与原数相等。x 对 10 取余为 0 的肯定不满足。


```python
# Time: O(n)
# Space: O(1)
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0 or (x % 10 == 0 and x != 0):
            return False
        val = 0
        tmp = x
        while tmp != 0:
            tmp, mod = divmod(tmp, 10)
            val = val * 10 + mod
        return x == val

# 11509/11509 cases passed (64 ms)
# Your runtime beats 52.03 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [9. Palindrome Number](https://leetcode.com/problems/palindrome-number/)
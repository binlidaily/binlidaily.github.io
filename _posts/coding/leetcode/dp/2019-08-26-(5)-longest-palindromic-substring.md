---
layout: post
title: 5. Longest Palindromic Substring
subtitle: 最长回文子串 (Medium)
author: Bin Li
tags: [Coding, LeetCode, String, DP, Greedy, Medium]
image: 
comments: true
published: true
---

## Description

Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.

Example 1:
```
Input: "babad"
Output: "bab"
Note: "aba" is also a valid answer.
```
Example 2:
```
Input: "cbbd"
Output: "bb"
```

## Solutions
　　回文子串是比较常见的动规问题。

### 1. Greedy
　　比较直接的解法，从每个位置开始，以当前位置的字符为中心或者以当前位置和其相邻一个位置的两个字符为中心，向两边拓展，找到最大的回文串。

```python
# Time: O(n^2)
# Sapce: O(n)
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if not s:
            return ''
        n = len(s)
        res = ''
        for i in range(n):
            single = self.get_max_substr(s, i, i)
            double = self.get_max_substr(s, i, i+1)
            bigger = None
            if len(single) > len(double):
                bigger = single
            else:
                bigger = double
            if len(bigger) > len(res):
                res = bigger
        return res
    
    def get_max_substr(self, strs, l, r):
        res = ''
        n = len(strs)
        while l >= 0 and r < n and strs[l] == strs[r]:
            if len(res) < len(strs[l:r+1]):
                res = strs[l:r+1]
            l -= 1
            r += 1
        return res
# Runtime: 2376 ms, faster than 43.70% of Python3 online submissions for Longest Palindromic Substring.
# Memory Usage: 12.7 MB, less than 100.00% of Python3 online submissions for Longest Palindromic Substring.
```

　　写的时候就发现代码不够精简，Python 要写出这么多 if-else 就不合适了。参考了一下，原来 max 还有 key 的这种做法：

```python
# Time: O(n^2)
# Sapce: O(n)
class Solution(object):
    def longestPalindrome(self, s):
        """
        :type s: str
        :rtype: str
        """
        res = ""
        for i in range(len(s)):
            res = max(self.max_substr(s, i, i), self.max_substr(s, i, i + 1), res, key=len)
        return res
    
    def max_substr(self, s, l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return s[l+1:r]
# Runtime: 856 ms, faster than 63.53% of Python online submissions for Longest Palindromic Substring.
# Memory Usage: 11.9 MB, less than 57.53% of Python online submissions for Longest Palindromic Substring.
```

　　在其上还能做一点优化，用两个指针记录字串起始位置，减少了存储字符字串的空间消耗，并且减少了过多比较的时间消耗。

```python
# Time: O(n^2)
# Sapce: O(n)
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if not s:
            return ''
        n = len(s)
        l, r = 0, 0
        for i in range(n):
            if i + ((r - l) >> 1) > n:
                break
            dist = max(self.max_len(s, i, i), self.max_len(s, i, i+1))
            if dist > r - l:
                l = i - ((dist - 1) >> 1)
                r = l + dist
        return s[l:r]
    
    def max_len(self, strs, l, r):
        n = len(strs)
        if r >= n or strs[l] != strs[r]:
            return 1
        while l >= 0 and r < n and strs[l] == strs[r]:
            l -= 1
            r += 1
        return r - l - 1
# Runtime: 464 ms, faster than 91.19% of Python3 online submissions for Longest Palindromic Substring.
# Memory Usage: 12.7 MB, less than 100.00% of Python3 online submissions for Longest Palindromic Substring.
```


### 2. DP
　　首先要搞清楚 dp 是几维度，然后对应的含义是什么。这里二维的 dp，dp[i][j] 表示从 i 到 j 的字串是否为回文字串。

```python
# Time: O(n^2)
# Sapce: O(n^2)
class Solution(object):
    def longestPalindrome(self, s):
        dp = [[False for _ in range(len(s))] for _ in range(len(s))]
        l, r = 0, 0
        
        for i in range(len(s)):
            start = i
            end = i
            while start >= 0:
                # only one center number
                if start == end:
                    dp[start][end] = True
                # two center numbers
                elif start + 1 == end:
                    dp[start][end] = s[start] == s[end]
                # state transformation equation
                else:
                    dp[start][end] = dp[start + 1][end - 1] and (s[start] == s[end])
                
                if dp[start][end] and (end - start + 1) > (r - l + 1):
                    l = start
                    r = end
                start = start - 1
        return s[l:r + 1]
# Runtime: 6452 ms, faster than 12.86% of Python3 online submissions
# Memory Usage: 21.4 MB, less than 9.25% of Python3 online submissions
```

### 3. 神奇的做法 - Manacher's Algorithm

```python
# Time: O(n)
# Sapce: O(1)
class Solution:
    def longestPalindrome(self, s: str) -> str:
        strlen = len(s)
        # if length of string < 2 or s is palindrome already
        if strlen < 2 or s == s[::-1]:
            return s

        start, maxlen = 0, 1

        for i in range(strlen):
            oddstart  = i - maxlen - 1
            evenstart = i - maxlen
            odd  = s[oddstart:i+1]  # len(odd)  = maxlen + 2
            even = s[evenstart:i+1] # len(even) = maxlen + 1
                #i = 2
                #maxlen = 1
                #start = 0
                #odd = s[2-1-1:3]….bab
                #even = s[1:3]…ab
            if oddstart >= 0 and odd == odd[::-1]:
                start = oddstart
                maxlen += 2
            elif evenstart >= 0 and even == even[::-1]:
                start = evenstart
                maxlen += 1
        return s[start:start+maxlen]
# 103/103 cases passed (40 ms)
# Your runtime beats 99.98 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)
2. [Python solution by using Dynamic programming](https://leetcode.com/problems/longest-palindromic-substring/discuss/288371/Python-solution-by-using-Dynamic-programming)
3. [花花酱 LeetCode 5. Longest Palindromic Substring](https://zxi.mytechroad.com/blog/greedy/leetcode-5-longest-palindromic-substring/)
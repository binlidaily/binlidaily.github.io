---
layout: post
title: 5. Longest Palindromic Substring
subtitle: 最长回文子串
author: Bin Li
tags: [Coding, LeetCode, DP]
image: 
comments: true
published: true
---

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
### DP
　　首先要搞清楚 dp 是几维度，然后对应的含义是什么。这里二维的 dp，dp[i][j] 表示从 i 到 j 的字串是否为回文字串。

```python
class Solution(object):
    def longestPalindrome(self, s):
        """
        :type s: str
        :rtype: str
        """
        dp = [[False for _ in range(len(s))] for _ in range(len(s))]
        
        lcs_start = 0
        lcs_end = 0
        
        for i in range(len(s)):
            start = i
            end = i
            while start >= 0:
                if start == end:
                    dp[start][end] = True
                elif start + 1 == end:
                    dp[start][end] = s[start] == s[end]
                else:
                    dp[start][end] = dp[start + 1][end - 1] and (s[start] == s[end])
                
                if dp[start][end] and (end - start + 1) > (lcs_end - lcs_start + 1):
                    lcs_start = start
                    lcs_end = end
                
                start = start - 1
        return s[lcs_start:lcs_end + 1]
# Runtime: 5552 ms, faster than 11.55% of Python online submissions for Longest Palindromic Substring.
# Memory Usage: 20.6 MB, less than 5.48% of Python online submissions for Longest Palindromic Substring.
```

### Greedy
　　解法如下：

```python
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

　　在其上做了一点优化：

```python
class Solution(object):
    def longestPalindrome(self, s):
        start, end = 0, 0
        for i in range(0, len(s)):
            if i + (end - start) // 2 > len(s): 
                break
            l = max(self.getLen(s, i, i), self.getLen(s, i, i + 1))      
            if l > end - start:        
                start = i - (l - 1) // 2
                end = start + l
        return s[start:end]

    def getLen(self, s, l, r):
        if r >= len(s) or s[l] != s[r]:
            return 1
        while l >= 0 and r <= len(s) - 1 and s[l] == s[r]:
            l -= 1
            r += 1
        return r - l - 1
# Runtime: 496 ms, faster than 89.22% of Python online submissions for Longest Palindromic Substring.
# Memory Usage: 11.7 MB, less than 93.15% of Python online submissions for Longest Palindromic Substring.
```

## References
1. [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)
2. [Python solution by using Dynamic programming](https://leetcode.com/problems/longest-palindromic-substring/discuss/288371/Python-solution-by-using-Dynamic-programming)
3. [花花酱 LeetCode 5. Longest Palindromic Substring](https://zxi.mytechroad.com/blog/greedy/leetcode-5-longest-palindromic-substring/)
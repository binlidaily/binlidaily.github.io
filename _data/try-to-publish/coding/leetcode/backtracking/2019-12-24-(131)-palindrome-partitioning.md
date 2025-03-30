---
layout: post
title: 131. Palindrome Partitioning
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Backtracking]
image: 
comments: true
published: true
---

## Description

Given a string *s*, partition *s* such that every substring of the partition is a palindrome.

Return all possible palindrome partitioning of *s*.

**Example:**

```
Input: "aab"
Output:
[
  ["aa","b"],
  ["a","a","b"]
]
```


## Solutions
### 1. Backtracking

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def partition(self, s: str) -> List[List[str]]:
        if not s:
            return []
        res = []
        self.dfs(s, [], res)
        return res
    
    def dfs(self, strs, path, res):
        if not strs:
            res.append(path)
            return
        
        n = len(strs)
        for i in range(n):
            if strs[:i+1] and self.is_palindrome(strs[:i+1]):
                # print(i, strs, path)
                # print(i, strs[i+1:], path+[strs[:i+1]])
                self.dfs(strs[i+1:], path+[strs[:i+1]], res)

    def is_palindrome(self, strs):
        if not strs:
            return True
        
        n = len(strs)
        l, r = 0, n-1
        while l <= r:
            if strs[l] != strs[r]:
                return False
            l += 1
            r -= 1
        return True
# 22/22 cases passed (104 ms)
# Your runtime beats 23.4 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

　　更加精简的写法：


```python
class Solution:
    def partition(self, s):
        res = []
        self.dfs(s, [], res)
        return res

    def dfs(self, s, path, res):
        if not s: # backtracking
            res.append(path)
        for i in range(1, len(s)+1):
            if self.isPar(s[:i]):
                self.dfs(s[i:], path+[s[:i]], res)

    def isPar(self, s):
        return s == s[::-1]
# 22/22 cases passed (88 ms)
# Your runtime beats 61.88 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13 MB)
```

### 2. DP
　　膜拜一下：


```python
class Solution:
    def partition(self, s):
        if not s:
            return [[]]
        dp = {0:[[]], 1:[[s[0]]]}
        for ii in range(1, len(s)):
            dp[ii+1] = []
            for jj in range(0, ii+1):
                string = s[jj:ii+1]
                if string == string[::-1]:
                    for sol in dp[jj]:
                        dp[ii+1].append(sol+[s[jj:ii+1]])
        return dp[len(s)]
# 22/22 cases passed (60 ms)
# Your runtime beats 97.73 % of python3 submissions
# Your memory usage beats 5.88 % of python3 submissions (14.1 MB)
```
## References
1. [131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/description/)
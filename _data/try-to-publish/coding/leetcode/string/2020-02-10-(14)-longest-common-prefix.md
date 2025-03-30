---
layout: post
title: 14. Longest Common Prefix
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, String]
image: 
comments: true
published: true
---

## Description

Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string `""`.

**Example 1:**

```
Input: ["flower","flow","flight"]
Output: "fl"
```

**Example 2:**

```
Input: ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.
```

**Note:**

All given inputs are in lowercase letters `a-z`.


## Solutions
### 1. String

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ''
        res = []
        n = len(strs[0])
        for i in range(n):
            cur = strs[0][i]
            for s in strs:
                if i >= len(s) or cur != s[i]:
                    return ''.join(res)
            res.append(cur)
        return ''.join(res)

# 118/118 cases passed (44 ms)
# Your runtime beats 14.71 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13 MB)
```

## References
1. [14. Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix)

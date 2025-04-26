---
layout: post
title: 132. Palindrome Partitioning II
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, DP]
image: 
comments: true
published: true
---

## Description

Given a string *s*, partition *s* such that every substring of the partition is a palindrome.

Return the minimum cuts needed for a palindrome partitioning of *s*.

**Example:**

```
Input: "aab"
Output: 1
Explanation: The palindrome partitioning ["aa","b"] could be produced using 1 cut.
```

## Solutions
### 1. DP

```python
a   b   a   |   c  c
                j  i
       j-1  |  [j, i] is palindrome
    dp(j-1) +  1
```

1. 如果字串 [j, i] 是回文串，那么有 dp[i] = min(dp[j - 1] + 1)，其中 (j <= i)
2. 还有一个值得注意的是，如果字串 [j, i] 是回文串，那么 [j + 1, i - 1] 也是回文串, 并且 c[j] == c[i]。

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def minCut(self, s: str) -> int:
        if not s:
            return 0
        n = len(s)
        dp = [0 for _ in range(n)]
        is_pal = [[False for _ in range(n)] for _ in range(n)]
        for i in range(n):
            min_cuts = i
            j = 0
            while j <= i:
                if s[j] == s[i] and (i - j < 2 or is_pal[j + 1][i - 1]):
                    is_pal[j][i] = True
                    min_cuts = 0 if j == 0 else min(min_cuts, dp[j - 1] + 1)
                j += 1
            dp[i] = min_cuts
        return dp[-1]
# 29/29 cases passed (540 ms)
# Your runtime beats 41.7 % of python3 submissions
# Your memory usage beats 80 % of python3 submissions (31.1 MB)
```

## References
1. [132. Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/description/)
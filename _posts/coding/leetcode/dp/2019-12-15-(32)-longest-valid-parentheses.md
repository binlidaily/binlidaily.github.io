---
layout: post
title: 32. Longest Valid Parentheses
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, DP]
image: 
comments: true
published: true
---

## Description

Given a string containing just the characters `'('` and `')'`, find the length of the longest valid (well-formed) parentheses substring.

**Example 1:**

```
Input: "(()"
Output: 2
Explanation: The longest valid parentheses substring is "()"
```

**Example 2:**

```
Input: ")()())"
Output: 4
Explanation: The longest valid parentheses substring is "()()"
```

## Solutions
### 1. DP
　　主要看动态转移方程怎么写，dp[i] 表示以 i 结尾的字串组成**有效**字串的最大长度，无效就是 0！那么i 位置的字符如果是`(`，dp[i]就是 0。所以在遍历时主要考虑当前字符为 `)`的情况。

　　括号可以分成好多段，例如字串 `()(())` 长度为 6，被分成了两端。当 i=5 时，要计算最长有效字串，其实分成了两个部分，第一个部分是 dp[i-dp[i-1]-2]，第二个部分是 dp[i-1]+2，这里的 2 是下标为 2 和 5 位置对应的`(`和`)`，要形成有效子串，那么这两个位置必须是对应的，5 是当前位置 i，也就是说对应的 i-dp[i-1]-1 位置上必须要是 `(`才可以！

　　当然，也有字串不会分成好多段，但是也都可以这么算，只要将第一部分视作空串即可。


```python
# Time: O(n)
# Space: O(n)
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        if not s or s == '':
            return 0
        n = len(s)
        # dp[i] stands for the lenght of longest substring ends with s[i]
        dp = [0 for _ in range(n)]
        for i in range(1, n):
            if s[i] == ')':
                if s[i-1] == '(':
                    if i - 2 >= 0:
                        dp[i] = dp[i-2] + 2
                    else:
                        dp[i] = 2
                else: # if s[i-1] == ')', combine the previous length.
                    if i-dp[i-1]-1 >= 0 and s[i-dp[i-1]-1] == '(':
                        if i-dp[i-1]-2 >= 0:
                            dp[i] = dp[i-1] + 2 + dp[i-dp[i-1]-2]
                        else:
                            dp[i] = dp[i-1] + 2
            else:
                continue
        return max(dp)
# Runtime: 56 ms, faster than 37.73%
# Memory Usage: 12.9 MB, less than 100.00%
```

### 2. Stack
　　还有直接用栈解决的方法，厉害：


```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        stack, res, s = [0], 0, ')'+s
        n = len(s)
        for i in range(1, n):
            if s[i] == ')' and s[stack[-1]] == '(':
                stack.pop()
                res = max(res, i - stack[-1])
            else:
                stack.append(i)
        return res
# Runtime: 36 ms, faster than 97.61%
# Memory Usage: 13.4 MB, less than 61.11%
```

## References
1. [32. Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/)
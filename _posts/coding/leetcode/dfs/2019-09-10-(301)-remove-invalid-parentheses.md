---
layout: post
title: 301. Remove Invalid Parentheses
subtitle:
author: Bin Li
tags: [Coding, LeetCode, DFS]
image: 
comments: true
published: true
---


Remove the minimum number of invalid parentheses in order to make the input string valid. Return all possible results.

Note: The input string may contain letters other than the parentheses ( and ).

Example 1:
```
Input: "()())()"
Output: ["()()()", "(())()"]
```
Example 2:
```
Input: "(a)())()"
Output: ["(a)()()", "(a())()"]
```
Example 3:
```
Input: ")("
Output: [""]
```
## Solutions
　　DFS+剪枝，写不出来，这辈子是写不出来了。
```python
class Solution(object):
    def removeInvalidParentheses(self, s):
        """
        :type s: str
        :rtype: List[str]
        """
        res = []
        # avoid same result
        self.visited = set([s])
        self.dfs(s, self.invalid(s), res)
        return res
    
    def dfs(self, s, n, res):
        if n == 0:
            res.append(s)
            return
        for i in range(len(s)):
            if s[i] in ['(', ')']:
                s_new = s[:i] + s[i+1:]
                if not s_new in self.visited and self.invalid(s_new) < n:
                    self.visited.add(s_new)
                    self.dfs(s_new, self.invalid(s_new), res)
    
    def invalid(self, s):
        # invalid part of left and right parentheses
        plus = minus = 0
        memo = {"(": 1, ")": -1}
        for c in s:
            plus += memo.get(c, 0)
            minus += 1 if plus < 0 else 0
            plus = max(0, plus)
        return plus + minus
# Runtime: 188 ms, faster than 53.01% of Python online submissions for Remove Invalid Parentheses.
# Memory Usage: 11.9 MB, less than 63.16% of Python online submissions for Remove Invalid Parentheses.
```
## References
1. [301. Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses/)
2. [Python DFS Solution](https://leetcode.com/problems/remove-invalid-parentheses/discuss/75090/Python-DFS-Solution)
3. [花花酱 LeetCode 301. Remove Invalid Parentheses](https://zxi.mytechroad.com/blog/searching/leetcode-301-remove-invalid-parentheses/)
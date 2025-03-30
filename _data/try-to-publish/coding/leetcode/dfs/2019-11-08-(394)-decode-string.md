---
layout: post
title: 394. Decode String
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, DFS, Medium]
image: 
comments: true
published: true
---

Given an encoded string, return its decoded string.

The encoding rule is: `k[encoded_string]`, where the *encoded_string* inside the square brackets is being repeated exactly *k* times. Note that *k* is guaranteed to be a positive integer.

You may assume that the input string is always valid; No extra white spaces, square brackets are well-formed, etc.

Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, *k*. For example, there won't be input like `3a` or `2[4]`.

**Examples:**

```
s = "3[a]2[bc]", return "aaabcbc".
s = "3[a2[c]]", return "accaccacc".
s = "2[abc]3[cd]ef", return "abcabccdcdcdef".
```

 

## Solutions

### 1. 递归
　　采用递归的方法，主要得分析清楚怎么去找 start 和 end。

```python
# Time Complexity: O(n^2)
# Space Complexity: O(n)
class Solution:
    def decodeString(self, s: str) -> str:
        if not s or len(s) == 0:
            return ''
        
        if not s[0].isdigit():
            return s[0] + self.decodeString(s[1:])
        
        loop = 0
        start, end = 0, 0
        n = len(s)
        #  3   [   a   ]   2   [   b   c   ]
        #    start    end
        for i in range(n):
            if s[i] == '[':
                if loop == 0:
                    start = i
                loop += 1
            if s[i] == ']':
                loop -= 1
                if loop == 0:
                    end = i
                    break
        
        res = ''
        # repeat substring
        times = int(s[:start])
        for i in range(times):
            res += self.decodeString(s[start+1:end])
        return res + self.decodeString(s[end+1:])
# Runtime: 28 ms, faster than 97.31% of Python3 online submissions for Decode String.
# Memory Usage: 12.7 MB, less than 100.00% of Python3 online submissions for Decode String.
```

### 2. Stack
　　当然也可以用两个 stack 来实现，分别存数字和字串，这里用一个 stack 也能实现同样的功能。
```python
# Time Complexity: O(n)
# Space Complexity: O(n)
class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        curnum, curstr = 0, ''
        for c in s:
            if c.isdigit():
                curnum = curnum * 10 + int(c)
            elif c == '[':
                stack.append(curnum)
                stack.append(curstr)
                curstr = ''
                curnum = 0
            elif c == ']':
                prestr = stack.pop()
                prenum = stack.pop()
                curstr = prestr + curstr * prenum
            else:
                curstr += c
        return curstr

# Runtime: 28 ms, faster than 97.31% of Python3 online submissions for Decode String.
# Memory Usage: 12.8 MB, less than 100.00% of Python3 online submissions for Decode String.
```

## References
1. [394. Decode String ](  https://leetcode.com/problems/decode-string/ )
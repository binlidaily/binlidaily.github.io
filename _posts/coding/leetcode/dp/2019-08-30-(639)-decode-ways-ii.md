---
layout: post
title: 639. Decode Ways II
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, DP]
image: 
comments: true
published: true
---

## Description

A message containing letters from `A-Z` is being encoded to numbers using the following mapping way:

```
'A' -> 1
'B' -> 2
...
'Z' -> 26
```

Beyond that, now the encoded string can also contain the character '*', which can be treated as one of the numbers from 1 to 9.

Given the encoded message containing digits and the character '*', return the total number of ways to decode it.

Also, since the answer may be very large, you should return the output mod 10^9 + 7.

**Example 1:**

```
Input: "*"
Output: 9
Explanation: The encoded message can be decoded to the string: "A", "B", "C", "D", "E", "F", "G", "H", "I".
```



**Example 2:**

```
Input: "1*"
Output: 9 + 9 = 18
```



**Note:**

1. The length of the input string will fit in range [1, 10^5].
2. The input string will only contain the character '*' and digits '0' - '9'.


## Solutions
　　给定一串数字，其中含有星号，星号可以表示 0 到 9 任何一个数字，统计该串数字找出最多的字母组合。

### 1. DP-迭代

```python
class Solution:
    def numDecodings(self, s: str) -> int:
        MOD = 10**9 + 7
        e0, e1, e2 = 1, 0, 0
        for c in s:
            if c == '*':
                f0 = 9*e0 + 9*e1 + 6*e2
                f1 = e0
                f2 = e0
            else:
                f0 = (c > '0') * e0 + e1 + (c <= '6') * e2
                f1 = (c == '1') * e0
                f2 = (c == '2') * e0
            e0, e1, e2 = f0 % MOD, f1, f2
        return e0
# 195/195 cases passed (368 ms)
# Your runtime beats 83.68 % of python3 submissions
# Your memory usage beats 50 % of python3 submissions (13.7 MB)
```

### 2. DP-递归

```python
class Solution:
    def numDecodings(self, s: str) -> int:
        if not s or s.startswith('0'):
            return 0
        n = len(s)
        dp = [0]*n
        dp[0] = self.ways(s[0])
        if n<2:
            return dp[0]
        dp[1] = self.ways(s[0], s[1]) + self.ways(s[1])*dp[0]
        
        for i in range(2, len(s)):
            dp[i] = (self.ways(s[i])*dp[i-1] + self.ways(s[i-1], s[i]) * dp[i-2])%(1000000007)
        return dp[-1]

    def ways(self, first, second = None):
        if first == '0' : return 0
        if not second:
            return 9 if first=='*' else 1
        if first>'2': return 0
        if first=='*':
            return 15 if second=='*' else 2 if second<='6' else 1
        elif first == '1': 
            return 9 if second=='*' else 1
        elif first =='2':
            return 6 if second=='*' else 0 if second>'6' else 1
# 195/195 cases passed (676 ms)
# Your runtime beats 51.84 % of python3 submissions
# Your memory usage beats 50 % of python3 submissions (17.5 MB)
```

### 3. 神奇解法

```python
one = {'1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1, '*': 9}
two = {'10': 1, '11': 1, '12': 1, '13': 1, '14': 1, '15': 1, '16': 1, '17': 1, '18': 1, '19': 1, '20': 1, '21': 1,
       '22': 1, '23': 1, '24': 1, '25': 1, '26': 1, '*0': 2, '*1': 2, '*2': 2, '*3': 2, '*4': 2, '*5': 2, '*6': 2,
       '*7': 1, '*8': 1, '*9': 1, '1*': 9, '2*': 6, '**': 15}

def numDecodings(self, s):
    """
    :type s: str
    :rtype: int
    """        
    dp = 1, one.get(s[:1], 0)
    
    for i in xrange(1, len(s)):
        dp = dp[1], (one.get(s[i], 0) * dp[1] + two.get(s[i-1: i+1], 0) * dp[0]) % 1000000007
    
    return dp[-1]
```

## References
1. [639. Decode Ways II](https://leetcode.com/problems/decode-ways-ii/)
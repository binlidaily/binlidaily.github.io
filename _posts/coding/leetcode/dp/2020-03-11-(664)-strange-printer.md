---
layout: post
title: 664. Strange Printer
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, DP, Hard]
image: 
comments: true
published: true
---

## Description

There is a strange printer with the following two special requirements:

1. The printer can only print a sequence of the same character each time.
2. At each turn, the printer can print new characters starting from and ending at any places, and will cover the original existing characters.


Given a string consists of lower English letters only, your job is to count the minimum number of turns the printer needed in order to print it.

**Example 1:**

```
Input: "aaabbb"
Output: 2
Explanation: Print "aaa" first and then print "bbb".
```



**Example 2:**

```
Input: "aba"
Output: 2
Explanation: Print "aaa" first and then print "b" from the second place of the string, which will cover the existing character 'a'.
```



**Hint**: Length of the given string will not exceed 100.


## Solutions
　　打印机每次只能连续打同一个字符，打印机可以来回移动，从任何位置开始打印，即可以覆盖原来已经打过的地方，找到需要打印给定字符串打印机最小打印次数。

### 1. DP
　　基本上找这种最小的提醒，都是 Fucking DP 吧，想不出来。想起了王小波的名言：人的一切痛苦, 本质上都是对自己无能的愤怒！


```python
# Time: O(n^3)
# Space: O(n^3)
class Solution:
    def strangePrinter(self, s: str) -> int:
        n = len(s)
        dp = [[0 for _ in range(n)] for _ in range(n)]
        for i in range(n-1, -1, -1):
            for j in range(i, n):
                dp[i][j] = 1 if i == j else dp[i+1][j] + 1
                for k in range(i+1, j+1):
                    if s[i] == s[k]:
                        dp[i][j] = min(dp[i][j], dp[i+1][k-1] + dp[k][j])
        return 0 if n == 0 else dp[0][n-1]

# 201/201 cases passed (688 ms)
# Your runtime beats 60.24 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

## References
1. [664. Strange Printer](https://leetcode.com/problems/strange-printer/)
2. [Huahua](https://zxi.mytechroad.com/blog/dynamic-programming/leetcode-664-strange-printer/)
3. [Strange Printer 奇怪的打印机](https://www.cnblogs.com/grandyang/p/8319913.html)
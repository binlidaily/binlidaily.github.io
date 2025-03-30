---
layout: post
title: 87. Scramble String
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, DP, Recursion]
image: 
comments: true
published: true
---

## Description

Given a string *s1*, we may represent it as a binary tree by partitioning it to two non-empty substrings recursively.

Below is one possible representation of *s1* = `"great"`:

```
    great
   /    \
  gr    eat
 / \    /  \
g   r  e   at
           / \
          a   t
```

To scramble the string, we may choose any non-leaf node and swap its two children.

For example, if we choose the node `"gr"` and swap its two children, it produces a scrambled string `"rgeat"`.

```
    rgeat
   /    \
  rg    eat
 / \    /  \
r   g  e   at
           / \
          a   t
```

We say that `"rgeat"` is a scrambled string of `"great"`.

Similarly, if we continue to swap the children of nodes `"eat"` and `"at"`, it produces a scrambled string `"rgtae"`.

```
    rgtae
   /    \
  rg    tae
 / \    /  \
r   g  ta  e
       / \
      t   a
```

We say that `"rgtae"` is a scrambled string of `"great"`.

Given two strings *s1* and *s2* of the same length, determine if *s2* is a scrambled string of *s1*.

**Example 1:**

```
Input: s1 = "great", s2 = "rgeat"
Output: true
```

**Example 2:**

```
Input: s1 = "abcde", s2 = "caebd"
Output: false
```


## Solutions
### 1. Recursion
　　s1 分成两个子串 s11 和 s12，s2 分成两个子串 s21 和 s22，如果是  Scramble string，那么要不是 (s11, s21)和 (s12, s22) 两组对应互为 scramble string，就是 (s11, s22) 和 (s12, s21) 两组互为子串。
```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def isScramble(self, s1: str, s2: str) -> bool:
        n1, n2 = len(s1), len(s2)
        if n1 != n2:
            return False
        if s1 == s2:
            return True
        str1 = sorted(s1)
        str2 = sorted(s2)
        # print(str1, str2)
        if str1 != str2:
            return False

        for i in range(1, n1):
            s11 = s1[:i]
            s12 = s1[i:]
            s21 = s2[:i]
            s22 = s2[i:]
            if self.isScramble(s11, s21) and self.isScramble(s12, s22):
                return True
            s21 = s2[-i:]
            s22 = s2[:-i]
            if self.isScramble(s11, s21) and self.isScramble(s12, s22):
                return True
        return False
        
# 283/283 cases passed (32 ms)
# Your runtime beats 98.75 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```

### 2. 3D-DP

```python
# Time: O(n^3)
# Space: O(n^3)
class Solution:
    def isScramble(self, s1: str, s2: str) -> bool:
        n1, n2 = len(s1), len(s2)
        if n1 != n2:
            return False
        # /**
		#  * Let F(i, j, k) = whether the substring S1[i..i + k - 1] is a scramble of S2[j..j + k - 1] or not
		#  * Since each of these substrings is a potential node in the tree, we need to check for all possible cuts.
		#  * Let q be the length of a cut (hence, q < k), then we are in the following situation:
		#  * 
		#  * S1 [   x1    |         x2         ]
		#  *    i         i + q                i + k - 1
		#  * 
		#  * here we have two possibilities:
		#  *      
		#  * S2 [   y1    |         y2         ]
		#  *    j         j + q                j + k - 1
		#  *    
		#  * or 
		#  * 
		#  * S2 [       y1        |     y2     ]
		#  *    j                 j + k - q    j + k - 1
		#  * 
		#  * which in terms of F means:
		#  * 
		#  * F(i, j, k) = for some 1 <= q < k we have:
		#  *  (F(i, j, q) AND F(i + q, j + q, k - q)) OR (F(i, j + k - q, q) AND F(i + q, j, k - q))
		#  *  
		#  * Base case is k = 1, where we simply need to check for S1[i] and S2[j] to be equal 
		#  * */
        dp = [[[False for _ in range(n1+1)] for _ in range(n1)]for _ in range(n1)]
        for k in range(1, n1 + 1):
            i = 0
            while i + k <= n1:
                j = 0
                while j + k <= n1:
                    if k == 1:
                        dp[i][j][k] = s1[i] == s2[j]
                    else:
                        q = 1
                        while q < k and not dp[i][j][k]:
                            dp[i][j][k] = (dp[i][j][q] and dp[i + q][j + q][k - q]) or \
                                (dp[i][j + k - q][q] and dp[i + q][j][k - q])
                            q += 1
                    j += 1
                i += 1
        return dp[0][0][n1]
# 283/283 cases passed (548 ms)
# Your runtime beats 5.14 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [87. Scramble String](https://leetcode.com/problems/scramble-string/)
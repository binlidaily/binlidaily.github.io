---
layout: post
title: 72. Edit Distance
subtitle: 编辑距离 (Hard)
author: Bin Li
tags: [Coding, LeetCode, Hard, DP]
image: 
comments: true
published: true
---

## Description
Given two words word1 and word2, find the minimum number of operations required to convert word1 to word2.

You have the following 3 operations permitted on a word:

1. Insert a character
2. Delete a character
3. Replace a character

Example 1:
```
Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation: 
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
```
Example 2:
```
Input: word1 = "intention", word2 = "execution"
Output: 5
Explanation: 
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')
```

## Solutions
### 1. DP-记忆化递归
　　还是比较难，得搞清楚 min 那里面对应的三个操作是什么。dp[i][j] 表示从 i 的左字串编辑到 j 个右字串最少需要的编辑次数。

```python
# Time Complextiy: O(nm)
# Space Complextiy: O(nm)
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        l1, l2 = len(word1), len(word2)
        self.dp = [[-1 for _ in range(l2+1)] for _ in range(l1+1)]
        return self.min_dist(word1, word2, l1, l2)
    
    def min_dist(self, word1, word2, l1, l2):
        if l1 == 0:
            return l2
        if l2 == 0:
            return l1
        if self.dp[l1][l2] >= 0:
            return self.dp[l1][l2]

        if word1[l1-1] == word2[l2-1]:
            ret = self.min_dist(word1, word2, l1-1, l2-1)
        else:
            ret = 1 + min(self.min_dist(word1, word2, l1-1, l2-1), # replace
                         self.min_dist(word1, word2, l1, l2-1),    # add / insert
                         self.min_dist(word1, word2, l1-1, l2))    # delete
        self.dp[l1][l2] = ret
        return ret
# Runtime: 112 ms, faster than 93.16% of Python3 online submissions for Edit Distance.
# Memory Usage: 16.3 MB, less than 80.77% of Python3 online submissions for Edit Distance.
```

### 2. DP-迭代/递推
　　注意状态转移方程有两个部分！！！

```python
# Time: O(mn)
# Space: O(mn)
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        n1, n2 = len(word1), len(word2)
        dp = [[0 for _ in range(n2 + 1)] for _ in range(n1 + 1)]
        dp[0][0] = 0
        for i in range(1, n1 + 1):
            dp[i][0] = dp[i - 1][0] + 1
        for i in range(1, n2 + 1):
            dp[0][i] = dp[0][i - 1] + 1
        for i in range(1, n1 + 1):
            for j in range(1, n2 + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i-1][j-1],  # replace
                                      dp[i-1][j],     # delete
                                      dp[i][j-1])     # insert
        return dp[n1][n2]
# Runtime: 188 ms, faster than 60.15% 
# Memory Usage: 16.4 MB, less than 80.77%
```

## References
1. [72. Edit Distance](https://leetcode.com/problems/edit-distance/)
2. [花花酱](https://www.youtube.com/watch?v=Q4i_rqON2-E)
3. [不同操作不用权重的编辑距离问题](https://binlidaily.github.io/2020-01-06-(12-9)-最优编辑)
---
layout: post
title: 96. Unique Binary Search Trees
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, DP, Medium]
image: 
comments: true
published: true
---

## Description

Given *n*, how many structurally unique **BST's** (binary search trees) that store values 1 ... *n*?

**Example:**

```
Input: 3
Output: 5
Explanation:
Given n = 3, there are a total of 5 unique BST's:

   1         3     3      2      1
    \       /     /      / \      \
     3     2     1      1   3      2
    /     /       \                 \
   2     1         2                 3
```

## Solutions
### 1. DP

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def numTrees(self, n: int) -> int:
        if n <= 0:
            return 0
        G = [0 for _ in range(n+1)]
        G[0], G[1] = 1, 1
        # G(n) = F(1, n) + F(2, n) + ... + F(n, n). 
        # F(i, n) = G(i-1) * G(n-i)	1 <= i <= n 
        for i in range(2, n+1):
            for j in range(i+1):
                G[i] += G[j-1] * G[i-j]
        return G[n]
# 19/19 cases passed (28 ms)
# Your runtime beats 79.88 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [96. Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees)
2. [DP Solution in 6 lines with explanation. F(i, n) = G(i-1) * G(n-i)](https://leetcode.com/problems/unique-binary-search-trees/discuss/31666/DP-Solution-in-6-lines-with-explanation.-F(i-n)-G(i-1)-*-G(n-i))
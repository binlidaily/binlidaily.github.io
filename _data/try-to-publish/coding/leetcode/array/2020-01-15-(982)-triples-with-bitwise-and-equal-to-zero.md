---
layout: post
title: 982. Triples with Bitwise AND Equal To Zero
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Array]
image: 
comments: true
published: true
---

## Description

Given an array of integers `A`, find the number of triples of indices (i, j, k) such that:

- `0 <= i < A.length`
- `0 <= j < A.length`
- `0 <= k < A.length`
- `A[i] & A[j] & A[k] == 0`, where `&` represents the bitwise-AND operator.


**Example 1:**

```
Input: [2,1,3]
Output: 12
Explanation: We could choose the following i, j, k triples:
(i=0, j=0, k=1) : 2 & 2 & 1
(i=0, j=1, k=0) : 2 & 1 & 2
(i=0, j=1, k=1) : 2 & 1 & 1
(i=0, j=1, k=2) : 2 & 1 & 3
(i=0, j=2, k=1) : 2 & 3 & 1
(i=1, j=0, k=0) : 1 & 2 & 2
(i=1, j=0, k=1) : 1 & 2 & 1
(i=1, j=0, k=2) : 1 & 2 & 3
(i=1, j=1, k=0) : 1 & 1 & 2
(i=1, j=2, k=0) : 1 & 3 & 2
(i=2, j=0, k=1) : 3 & 2 & 1
(i=2, j=1, k=0) : 3 & 1 & 2
```

 

**Note:**

1. `1 <= A.length <= 1000`
2. `0 <= A[i] < 2^16`


## Solutions
### DP

```python
class Solution:
    def countTriplets(self, A: List[int]) -> int:
        n = 1 << 16
        m = 3
        dp = [[0 for _ in range(n)] for _ in range(m + 1)]
        for a in A:
            dp[1][a] += 1
        for i in range(1, m):
            for j in range(n):
                if dp[i][j]:
                    for a in A:
                        dp[i + 1][j & a] += dp[i][j]
        return dp[m][0]
# 25/25 cases passed (11348 ms)
# Your runtime beats 7.14 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14.9 MB)
```

## References
1. [982. Triples with Bitwise AND Equal To Zero](https://leetcode.com/problems/triples-with-bitwise-and-equal-to-zero/description/)
2. [Java DP O(3 * 2^16 * n) time O(2^16) space](https://leetcode.com/problems/triples-with-bitwise-and-equal-to-zero/discuss/226721/Java-DP-O(3-*-216-*-n)-time-O(216)-space)
---
layout: post
title: 795. Number of Subarrays with Bounded Maximum
subtitle:
author: Bin Li
tags: [Coding]
image: 
comments: true
published: true
---

## Description
We are given an array A of positive integers, and two positive integers L and R (L <= R).

Return the number of (contiguous, non-empty) subarrays such that the value of the maximum array element in that subarray is at least L and at most R.

```python
Example :
Input: 
A = [2, 1, 4, 3]
L = 2
R = 3
Output: 3

Explanation: There are three subarrays that meet the requirements: [2], [2, 1], [3].
```
Note:
```
L, R  and A[i] will be an integer in the range [0, 10^9].
The length of A will be in the range of [1, 50000].
```

## Solutions
　　这个解法没看懂……：
```python
class Solution(object):
    def numSubarrayBoundedMax(self, A, L, R):
        """
        :type A: List[int]
        :type L: int
        :type R: int
        :rtype: int
        """
        res = 0
        left = right = -1
        for i in range(len(A)):
            if A[i] >= L:
                right = i
            if A[i] > R:
                left = i
            res += (right - left)
        return res
# Runtime: 304 ms, faster than 81.41% of Python online submissions for Number of Subarrays with Bounded Maximum.
# Memory Usage: 14.1 MB, less than 45.45% of Python online submissions for Number of Subarrays with Bounded Maximum.
```

动规似乎好懂一些：

```python
class Solution(object):
    def numSubarrayBoundedMax(self, A, L, R):
        """
        :type A: List[int]
        :type L: int
        :type R: int
        :rtype: int
        """
        res, dp = 0, 0
        prev = -1
        for i in range(len(A)):
            if A[i] < L and i > 0:
                res += dp
            if A[i] > R:
                dp = 0
                prev = i
            if L <= A[i] <= R:
                dp = i - prev
                res += dp
        return res
# Runtime: 304 ms, faster than 81.41% of Python online submissions for Number of Subarrays with Bounded Maximum.
# Memory Usage: 14.4 MB, less than 18.18% of Python online submissions for Number of Subarrays with Bounded Maximum.
```
## References
1. [795. Number of Subarrays with Bounded Maximum](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/)
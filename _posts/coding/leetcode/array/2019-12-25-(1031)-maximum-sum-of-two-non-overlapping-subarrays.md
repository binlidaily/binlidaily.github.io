---
layout: post
title: 1031. Maximum Sum of Two Non-Overlapping Subarrays
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Array]
image: 
comments: true
published: true
---

## Description

Given an array `A` of non-negative integers, return the maximum sum of elements in two non-overlapping (contiguous) subarrays, which have lengths `L` and `M`. (For clarification, the `L`-length subarray could occur before or after the `M`-length subarray.)

Formally, return the largest `V` for which `V = (A[i] + A[i+1] + ... + A[i+L-1]) + (A[j] + A[j+1] + ... + A[j+M-1])` and either:

- `0 <= i < i + L - 1 < j < j + M - 1 < A.length`, **or**
- `0 <= j < j + M - 1 < i < i + L - 1 < A.length`.

 



**Example 1:**

```
Input: A = [0,6,5,2,2,5,1,9,4], L = 1, M = 2
Output: 20
Explanation: One choice of subarrays is [9] with length 1, and [6,5] with length 2.
```

**Example 2:**

```
Input: A = [3,8,1,3,2,1,8,9,0], L = 3, M = 2
Output: 29
Explanation: One choice of subarrays is [3,8,1] with length 3, and [8,9] with length 2.
```

**Example 3:**

```
Input: A = [2,1,5,6,0,9,5,0,3,8], L = 4, M = 3
Output: 31
Explanation: One choice of subarrays is [5,6,0,9] with length 4, and [3,8] with length 3.
```

 

**Note:**

1. `L >= 1`
2. `M >= 1`
3. `L + M <= A.length <= 1000`
4. `0 <= A[i] <= 1000`


## Solutions
### 1. Array
　　第一次做还是比较棘手的，比较多数组的操作！

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def maxSumTwoNoOverlap(self, A: List[int], L: int, M: int) -> int:
        res = Lsum = Lmax = Msum = Mmax = 0
        n = len(A)
        # L left, M right
        for i in range(n):
            # add number value to M part
            Msum += A[i]
            # Keep M numbers
            if i - M >= 0:
                Msum -= A[i - M]
            # add number value to L part
            if i - M >= 0:
                Lsum += A[i - M]
            # Keep L numbers
            if i - M - L >= 0:
                Lsum -= A[i - M - L]
            # L find max, M move forward
            Lmax = max(Lmax, Lsum)
            res = max(res, Lmax + Msum)
        Lsum = Lmax = Msum = Mmax = 0
        # M left, L right
        for i in range(n):
            # add number to L part
            Lsum += A[i]
            # keep L numbers
            if i - L >= 0:
                Lsum -= A[i - L]
            if i - L >= 0:
                Msum += A[i - L]
            if i - L - M >= 0:
                Msum -= A[i - L - M]
            Mmax = max(Mmax, Msum)
            res = max(res, Mmax + Lsum)
        return res
# 51/51 cases passed (72 ms)
# Your runtime beats 37.21 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [1031. Maximum Sum of Two Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/description/)
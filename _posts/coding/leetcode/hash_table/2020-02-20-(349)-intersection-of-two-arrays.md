---
layout: post
title: 349. Intersection of Two Arrays
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Hash Table]
image: 
comments: true
published: true
---

## Description


Given two arrays, write a function to compute their intersection.

**Example 1:**

```
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2]
```

**Example 2:**

```
Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [9,4]
```

**Note:**

- Each element in the result must be unique.
- The result can be in any order.


## Solutions
### 1. Hash Table

```python
# Time: O(n+m)
# Space: O(n)
class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        set1 = set()
        for num in nums1:
            if num not in set1:
                set1.add(num)
        res = set()
        for num in nums2:
            if num in set1 and num not in res:
                res.add(num)
        return list(res)

# 60/60 cases passed (40 ms)
# Your runtime beats 90.67 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

## References
1. [349. Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/description/)
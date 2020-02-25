---
layout: post
title: 448. Find All Numbers Disappeared in an Array
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Array]
image: 
comments: true
published: true
---

## Description

Given an array of integers where 1 ≤ a[i] ≤ *n* (*n* = size of array), some elements appear twice and others appear once.

Find all the elements of [1, *n*] inclusive that do not appear in this array.

Could you do it without extra space and in O(*n*) runtime? You may assume the returned list does not count as extra space.

**Example:**

```
Input:
[4,3,2,7,8,2,3,1]

Output:
[5,6]
```


## Solutions
### 1. Index Trick

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def findDisappearedNumbers(self, nums: List[int]) -> List[int]:
        n = len(nums)
        for i in range(n):
            idx = abs(nums[i]) - 1
            nums[idx] = - abs(nums[idx])
        return [i + 1 for i in range(n) if nums[i] > 0]

# 34/34 cases passed (412 ms)
# Your runtime beats 40.21 % of python3 submissions
# Your memory usage beats 46.43 % of python3 submissions (20.5 MB)
```

### 2. Set

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def findDisappearedNumbers(self, nums: List[int]) -> List[int]:
        n = len(nums)
        nums_set = set(nums)
        res = []
        for i in range(1, n+1):
            if i not in nums_set:
                res.append(i)
        return res

# 34/34 cases passed (356 ms)
# Your runtime beats 94.57 % of python3 submissions
# Your memory usage beats 7.14 % of python3 submissions (22.8 MB)
```

## References
1. [448. Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/description/)
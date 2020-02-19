---
layout: post
title: 217. Contains Duplicate
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Hash Table]
image: 
comments: true
published: true
---

## Description

Given an array of integers, find if the array contains any duplicates.

Your function should return true if any value appears at least twice in the array, and it should return false if every element is distinct.

**Example 1:**

```
Input: [1,2,3,1]
Output: true
```

**Example 2:**

```
Input: [1,2,3,4]
Output: false
```

**Example 3:**

```
Input: [1,1,1,3,3,4,3,2,4,2]
Output: true
```


## Solutions
### 1. Hash Table

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        set_num = set(nums)
        if len(nums) > len(set_num):
            return True
        else:
            return False

# 18/18 cases passed (128 ms)
# Your runtime beats 67.09 % of python3 submissions
# Your memory usage beats 88.68 % of python3 submissions (18.1 MB)
```

## References
1. [217. Contains Duplicate](https://leetcode.com/problems/contains-duplicate/)
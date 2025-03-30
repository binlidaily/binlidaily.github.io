---
layout: post
title: 41. First Missing Positive
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Array, TODO]
image: 
comments: true
published: true
---

## Description

Given an unsorted integer array, find the smallest missing positive integer.

**Example 1:**

```
Input: [1,2,0]
Output: 3
```

**Example 2:**

```
Input: [3,4,-1,1]
Output: 2
```

**Example 3:**

```
Input: [7,8,9,11,12]
Output: 1
```

**Note:**

Your algorithm should run in *O*(*n*) time and uses constant extra space.


## Solutions
### 1. Hash Table?

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        i, n = 0, len(nums)
        while i < n:
            if nums[i] != i + 1 and nums[i] > 0 and nums[i] <= n and nums[i] != nums[nums[i]-1]:
                nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]
            else:
                i += 1

        for i in range(n):
            if nums[i] != i + 1:
                return i+1
        return n + 1

# 165/165 cases passed (32 ms)
# Your runtime beats 79.23 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

### 2. Max

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        if len(nums) == 0:
            return 1
        
        large = max(nums)
        
        if large < 0:
            return 1
        
        for i in range(1, large + 1):
            if i not in nums:
                return i
        return large + 1
# 165/165 cases passed (36 ms)
# Your runtime beats 48.81 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [41. First Missing Positive](https://leetcode.com/problems/first-missing-positive/description/)
2. [First Missing Positive](http://bangbingsyb.blogspot.com/2014/11/leetcode-first-missing-positive.html)
3. [Hash Table](https://www.cnblogs.com/grandyang/p/4395963.html)
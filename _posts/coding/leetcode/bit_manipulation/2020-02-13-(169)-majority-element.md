---
layout: post
title: 169. Majority Element
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Bit Manipulation]
image: 
comments: true
published: true
---

## Description

Given an array of size *n*, find the majority element. The majority element is the element that appears **more than** `⌊ n/2 ⌋` times.

You may assume that the array is non-empty and the majority element always exist in the array.

**Example 1:**

```
Input: [3,2,3]
Output: 3
```

**Example 2:**

```
Input: [2,2,1,1,1,2,2]
Output: 2
```


## Solutions
### 1. Sort

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        nums.sort()
        return nums[len(nums) // 2]

# 44/44 cases passed (172 ms)
# Your runtime beats 85.91 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14 MB)
```

### 2. Bit Manipulation

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        n = len(nums)
        majority = 0
        for i in range(32):
            mask = 1 << i
            count = 0
            for num in nums:
                if num & mask:
                    count += 1
            if count > n // 2:
                majority |= mask
        return majority if majority >> 31 == 0 else majority - (1 << 32)

# 44/44 cases passed (172 ms)
# Your runtime beats 85.91 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14 MB)
```

## References
1. [169. Majority Element](https://leetcode.com/problems/majority-element/description/)
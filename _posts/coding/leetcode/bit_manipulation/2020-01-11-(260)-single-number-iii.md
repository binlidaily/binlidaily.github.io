---
layout: post
title: 260. Single Number III
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Bit Manipulation]
image: 
comments: true
published: true
---

## Description

Given an array of numbers `nums`, in which exactly two elements appear only once and all the other elements appear exactly twice. Find the two elements that appear only once.

**Example:**

```
Input:  [1,2,1,3,2,5]
Output: [3,5]
```

**Note**:

1. The order of the result is not important. So in the above example, `[5, 3]` is also correct.
2. Your algorithm should run in linear runtime complexity. Could you implement it using only constant space complexity?


## Solutions
### 1. Manipulation

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def singleNumber(self, nums: List[int]) -> List[int]:
        code = 0
        for num in nums:
            code ^= num
        code &= -code # get contain last 1 number
        a, b = 0, 0
        for num in nums:
            if num & code != 0:
                a ^= num
            else:
                b ^= num
        return [a, b]
# Runtime: 72 ms, faster than 11.80%
# Memory Usage: 14.4 MB, less than 100.00% 
```

## References
1. [260. Single Number III](https://leetcode.com/problems/single-number-iii/description/)
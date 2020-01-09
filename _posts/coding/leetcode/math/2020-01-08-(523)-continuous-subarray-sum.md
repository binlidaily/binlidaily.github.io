---
layout: post
title: 523. Continuous Subarray Sum
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Math]
image: 
comments: true
published: true
---

## Description

Given a list of **non-negative** numbers and a target **integer** k, write a function to check if the array has a continuous subarray of size at least 2 that sums up to a multiple of **k**, that is, sums up to n*k where n is also an **integer**.


**Example 1:**

```
Input: [23, 2, 4, 6, 7],  k=6
Output: True
Explanation: Because [2, 4] is a continuous subarray of size 2 and sums up to 6.
```

**Example 2:**

```
Input: [23, 2, 6, 4, 7],  k=6
Output: True
Explanation: Because [23, 2, 6, 4, 7] is an continuous subarray of size 5 and sums up to 42.
```

**Note:**

1. The length of the array won't exceed 10,000.
2. You may assume the sum of all the numbers is in the range of a signed 32-bit integer.


## Solutions
### 1. Dict+Math

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def checkSubarraySum(self, nums: List[int], k: int) -> bool:
        n = len(nums)
        if k == 0 :
            for i in range(1, n):
                if nums[i] == nums[i - 1] and nums[i] == 0:
                    return True
            return False
        k = abs(k)
        if n >= 2 * k:
            return True
        sum = [0]
        for num in nums:
            sum.append((sum[-1] + num) % k)
        
        dic = {}
        for i in range(len(sum)):
            if sum[i] in dic:
                if i - dic[sum[i]] >= 2:
                    return True
            else:
                dic[sum[i]] = i
        return False
# Runtime: 220 ms, faster than 93.30%
# Memory Usage: 13.3 MB, less than 71.43%
```

## References
1. [523. Continuous Subarray Sum](https://leetcode.com/problems/continuous-subarray-sum/description/)
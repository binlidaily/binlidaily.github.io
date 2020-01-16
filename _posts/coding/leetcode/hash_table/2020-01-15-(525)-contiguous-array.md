---
layout: post
title: 525. Contiguous Array
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

## Description

Given a binary array, find the maximum length of a contiguous subarray with equal number of 0 and 1.

**Example 1:**

```
Input: [0,1]
Output: 2
Explanation: [0, 1] is the longest contiguous subarray with equal number of 0 and 1.
```



**Example 2:**

```
Input: [0,1,0]
Output: 2
Explanation: [0, 1] (or [1, 0]) is a longest contiguous subarray with equal number of 0 and 1.
```



**Note:** The length of the given binary array will not exceed 50,000.


## Solutions
### Hash Table

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def findMaxLength(self, nums: List[int]) -> int:
        if not nums:
            return 0
        cur_sum = 0
        max_length = 0
        table = {0 : 0}
        for i, num in enumerate(nums, 1):
            if num == 0:
                cur_sum += -1
            else:
                cur_sum += 1
            if cur_sum in table:
                max_length = max(max_length, i - table[cur_sum])
            else:
                table[cur_sum] = i
        return max_length
# 555/555 cases passed (956 ms)
# Your runtime beats 28.19 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (17.1 MB)
```

## References
1. [525. Contiguous Array](https://leetcode.com/problems/contiguous-array/description/)
2. [huahua](https://www.youtube.com/watch?v=uAGt1QoAoMU)
---
layout: post
title: 136. Single Number
subtitle:
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given a non-empty array of integers, every element appears twice except for one. Find that single one.

Note:
> Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?

Example 1:
```
Input: [2,2,1]
Output: 1
```
Example 2:
```
Input: [4,1,2,1,2]
Output: 4
```

## Solutions
这个在刷《剑指 offer》的时候接触过，用异或就能搞定了，比较简单。但是值得总结一下所有的处理方式。

```python
class Solution(object):
    def singleNumber(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        res = 0
        for num in nums:
            res ^= num
        return res
# Runtime: 68 ms, faster than 69.68% of Python online submissions for Single Number.
# Memory Usage: 13.6 MB, less than 72.07% of Python online submissions for Single Number.
```

```python
class Solution(object):
    def singleNumber(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        dic = {}
        for num in nums:
            dic[num] = dic.get(num, 0)+1
        for key, val in dic.items():
            if val == 1:
                return key
# Runtime: 72 ms, faster than 62.26% of Python online submissions for Single Number.
# Memory Usage: 15 MB, less than 5.20% of Python online submissions for Single Number.
```

```python
class Solution(object):
    def singleNumber(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        return 2*sum(set(nums))-sum(nums)
# Runtime: 68 ms, faster than 69.68% of Python online submissions for Single Number.
# Memory Usage: 13.8 MB, less than 39.18% of Python online submissions for Single Number.
```

```python
class Solution(object):
    def singleNumber(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        return reduce(lambda x, y: x ^ y, nums)
# Runtime: 88 ms, faster than 33.36% of Python online submissions for Single Number.
# Memory Usage: 13.5 MB, less than 92.87% of Python online submissions for Single Number.
```

```python
class Solution(object):
    def singleNumber(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        return reduce(operator.xor, nums)
# Runtime: 88 ms, faster than 33.36% of Python online submissions for Single Number.
# Memory Usage: 13.6 MB, less than 66.20% of Python online submissions for Single Number.
```

## References
1. [136. Single Number](https://leetcode.com/problems/single-number/submissions/)
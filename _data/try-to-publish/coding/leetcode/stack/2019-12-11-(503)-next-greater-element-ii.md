---
layout: post
title: 503. Next Greater Element II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium]
image: 
comments: true
published: true
---

## Description

Given a circular array (the next element of the last element is the first element of the array), print the Next Greater Number for every element. The Next Greater Number of a number x is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn't exist, output -1 for this number.

**Example 1:**

```
Input: [1,2,1]
Output: [2,-1,2]
Explanation: The first 1's next greater number is 2; 
The number 2 can't find next greater number; 
The second 1's next greater number needs to search circularly, which is also 2.
```



**Note:** The length of given array won't exceed 10000.

## Solutions
### 1. Brute Force
　　这种有环的操作，记得可以用取余（%）的操作啊！

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        if not nums:
            return []
        n = len(nums)
        res = [-1 for _ in range(n)]
        for i in range(n):
            j = i + 1
            while j % n != i:
                if nums[i] < nums[j % n]:
                    res[i] = nums[j % n]
                    break
                j += 1
        return res
# Time Limit Exceeded
# 223/224 cases passed (N/A)
```

### 2. Stack
　　可以遍历两次数组，并对下标取模！

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        if not nums:
            return []
        n = len(nums)
        stack = []
        res = [-1 for _ in range(n)]
        for i in range(2*n):
            j = i % n
            while stack and nums[stack[-1]] < nums[j]:
                res[stack.pop()] = nums[j]
            stack.append(j)
        return res
# 224/224 cases passed (232 ms)
# Your runtime beats 86.03 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14.2 MB)
```

## References
1. [503. Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii)
---
layout: post
title: 26. Remove Duplicates from Sorted Array
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Array]
image: 
comments: true
published: true
---

## Description

Given a sorted array *nums*, remove the duplicates [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm) such that each element appear only *once* and return the new length.

Do not allocate extra space for another array, you must do this by **modifying the input array [in-place](https://en.wikipedia.org/wiki/In-place_algorithm)** with O(1) extra memory.

**Example 1:**

```
Given nums = [1,1,2],

Your function should return length = 2, with the first two elements of nums being 1 and 2 respectively.

It doesn't matter what you leave beyond the returned length.
```

**Example 2:**

```
Given nums = [0,0,1,1,1,2,2,3,3,4],

Your function should return length = 5, with the first five elements of nums being modified to 0, 1, 2, 3, and 4 respectively.

It doesn't matter what values are set beyond the returned length.
```

**Clarification:**

Confused why the returned value is an integer but your answer is an array?

Note that the input array is passed in by **reference**, which means modification to the input array will be known to the caller as well.

Internally you can think of this:

```
// nums is passed in by reference. (i.e., without making a copy)
int len = removeDuplicates(nums);

// any modification to nums in your function would be known by the caller.
// using the length returned by your function, it prints the first len elements.
for (int i = 0; i < len; i++) {
    print(nums[i]);
}
```


## Solutions
### 1. Array

```python
# Time: O(n)
# Space: O(1)

# class Solution:
#     def removeDuplicates(self, nums: List[int]) -> int:
#         i = 0
#         while i < len(nums):
#             if i > 0 and nums[i-1] == nums[i]:
#                 nums = nums[:i] + nums[i+1:]
#             else:
#                 i += 1
#         return len(nums)

class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        tail = 0
        n = len(nums)
        for i in range(1, n):
            # Override
            if nums[i] != nums[tail]:
                tail += 1
                nums[tail] = nums[i]
        return tail + 1

# 161/161 cases passed (84 ms)
# Your runtime beats 77.76 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14.3 MB)
```

## References
1. [26. Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
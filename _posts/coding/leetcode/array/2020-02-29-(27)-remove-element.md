---
layout: post
title: 27. Remove Element
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Array, Two Pointers]
image: 
comments: true
published: true
---

## Description

Given an array *nums* and a value *val*, remove all instances of that value [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm) and return the new length.

Do not allocate extra space for another array, you must do this by **modifying the input array [in-place](https://en.wikipedia.org/wiki/In-place_algorithm)** with O(1) extra memory.

The order of elements can be changed. It doesn't matter what you leave beyond the new length.

**Example 1:**

```
Given nums = [3,2,2,3], val = 3,

Your function should return length = 2, with the first two elements of nums being 2.

It doesn't matter what you leave beyond the returned length.
```

**Example 2:**

```
Given nums = [0,1,2,2,3,0,4,2], val = 2,

Your function should return length = 5, with the first five elements of nums containing 0, 1, 3, 0, and 4.

Note that the order of those five elements can be arbitrary.

It doesn't matter what values are set beyond the returned length.
```

**Clarification:**

Confused why the returned value is an integer but your answer is an array?

Note that the input array is passed in by **reference**, which means modification to the input array will be known to the caller as well.

Internally you can think of this:

```
// nums is passed in by reference. (i.e., without making a copy)
int len = removeElement(nums, val);

// any modification to nums in your function would be known by the caller.
// using the length returned by your function, it prints the first len elements.
for (int i = 0; i < len; i++) {
    print(nums[i]);
}
```


## Solutions
### 1. Built-in del function

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        if not nums:
            return 0
        i = 0
        while i < len(nums):
            if nums[i] == val:
                del nums[i]
            else:
                i += 1
        return len(nums)

# 113/113 cases passed (32 ms)
# Your runtime beats 58.17 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

### 2. Two Pointers

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        if not nums:
            return 0
        fast, slow = 0, 0
        n = len(nums)
        while fast < n:
            if nums[fast] != val:
                nums[slow] = nums[fast]
                slow += 1
            fast += 1
        return slow

# 113/113 cases passed (28 ms)
# Your runtime beats 84.6 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```
## References
1. [27. Remove Element](https://leetcode.com/problems/remove-element/)
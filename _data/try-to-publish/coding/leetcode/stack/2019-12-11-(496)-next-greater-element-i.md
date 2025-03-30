---
layout: post
title: 496. Next Greater Element I
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

## Description

You are given two arrays **(without duplicates)** `nums1` and `nums2` where `nums1`’s elements are subset of `nums2`. Find all the next greater numbers for `nums1`'s elements in the corresponding places of `nums2`.

The Next Greater Number of a number **x** in `nums1` is the first greater number to its right in `nums2`. If it does not exist, output -1 for this number.

**Example 1:**

```
Input: nums1 = [4,1,2], nums2 = [1,3,4,2].
Output: [-1,3,-1]
Explanation:
    For number 4 in the first array, you cannot find the next greater number for it in the second array, so output -1.
    For number 1 in the first array, the next greater number for it in the second array is 3.
    For number 2 in the first array, there is no next greater number for it in the second array, so output -1.
```



**Example 2:**

```
Input: nums1 = [2,4], nums2 = [1,2,3,4].
Output: [3,-1]
Explanation:
    For number 2 in the first array, the next greater number for it in the second array is 3.
    For number 4 in the first array, there is no next greater number for it in the second array, so output -1.
```



**Note:**

1. All elements in `nums1` and `nums2` are unique.
2. The length of both `nums1` and `nums2` would not exceed 1000.

## Solutions
### 1. Brute Force
　　最暴力的办法：

```python
# Time: O(nm)
# Space: O(n)
class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        n1, n2 = len(nums1), len(nums2)
        res = [-1 for _ in range(n1)]
        for i in range(n1):
            j = 0
            while j < n2:
                if nums1[i] == nums2[j]:
                    break
                j += 1
            
            for k in range(j+1, n2):
                if nums2[k] > nums2[j]:
                    res[i] = nums2[k]
                    break
        return res
# 17/17 cases passed (320 ms)
# Your runtime beats 5 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

　　用字典快了一点：

```python
# Time: O(nm)
# Space: O(n)
class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        n1, n2 = len(nums1), len(nums2)
        dic = collections.defaultdict()
        res = [-1 for _ in range(n1)]
        for i in range(n2):
            dic[nums2[i]] = i
        for i in range(n1):
            j = dic[nums1[i]]
            for k in range(j+1, n2):
                if nums2[k] > nums2[j]:
                    res[i] = nums2[k]
                    break
        return res
# 17/17 cases passed (44 ms)
# Your runtime beats 95.31 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

### 2. Hash Table + Stack
　　利用哈希表和栈来解决这个问题，哈希表中存下nums2 这个数组中每个数和下一个比之大的数之间的映射。然后遍历 nums1，看对于每一个数在 nums2 中是否有这样的映射，没有的话就是-1.

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        if not nums1:
            return []
        if not nums2:
            return [-1] * len(nums1)
        stack = []
        greater = {}
        res = []
        for num in nums2:
            while stack and stack[-1] < num:
                greater[stack.pop()] = num
            stack.append(num)
        
        for num in nums1:
            res.append(greater.get(num, -1))
        return res
# 17/17 cases passed (64 ms)
# Your runtime beats 38.05 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```
## References
1. [496. Next Greater Element I](https://leetcode.com/problems/next-greater-element-i)
---
layout: post
title: 350. Intersection of Two Arrays II
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Hash Table]
image: 
comments: true
published: true
---

## Description

Given two arrays, write a function to compute their intersection.

**Example 1:**

```
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2,2]
```

**Example 2:**

```
Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [4,9]
```

**Note:**

- Each element in the result should appear as many times as it shows in both arrays.
- The result can be in any order.

**Follow up:**

- What if the given array is already sorted? How would you optimize your algorithm?
- What if *nums1*'s size is small compared to *nums2*'s size? Which algorithm is better?
- What if elements of *nums2* are stored on disk, and the memory is limited such that you cannot load all elements into the memory at once?


## Solutions
### 1. Hash Table

```python
# Time: O(n+m)
# Space: O(n)
class Solution:
    def intersect(self, nums1: List[int], nums2: List[int]) -> List[int]:
        hash_map = collections.Counter(nums1)
        res = []
        for num in nums2:
            if num in hash_map and hash_map[num] > 0:
                res.append(num)
                hash_map[num] -= 1
        return res
        
# 61/61 cases passed (48 ms)
# Your runtime beats 56.08 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## Follow Up
### 1. What if the given array is already sorted? How would you optimize your algorithm?

　　如果已经排好序了，那么可以用双指针来进行操作。


```python
class Solution(object):
    def intersect(self, nums1, nums2):

        nums1, nums2 = sorted(nums1), sorted(nums2)
        pt1 = pt2 = 0
        res = []

        while True:
            try:
                if nums1[pt1] > nums2[pt2]:
                    pt2 += 1
                elif nums1[pt1] < nums2[pt2]:
                    pt1 += 1
                else:
                    res.append(nums1[pt1])
                    pt1 += 1
                    pt2 += 1
            except IndexError:
                break

        return res
```

### 2. What if nums1's size is small compared to nums2's size? Which algorithm is better?
　　同第三个。

### 3. What if elements of nums2 are stored on disk, and the memory is limited such that you cannot load all elements into the memory at once?
* 如果 nums1 能够放进去，那么用哈希表存下 nums1 的结果，然后分块取 nums2 的结果计算交集
* 如果两个都放不进内存，那么先分别在外部排序，然后利用两个指针的方式，每次取两个数组的部分来算交集

## References
1. [350. Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii/)
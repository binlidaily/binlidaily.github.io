---
layout: post
title: 11. Container With Most Water
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Two Pointers]
image: 
comments: true
published: true
---

## Description

Given *n* non-negative integers *a1*, *a2*, ..., *an* , where each represents a point at coordinate (*i*, *ai*). *n* vertical lines are drawn such that the two endpoints of line *i* is at (*i*, *ai*) and (*i*, 0). Find two lines, which together with x-axis forms a container, such that the container contains the most water.

**Note:** You may not slant the container and *n* is at least 2.

 
![](/img/media/15733694874124.jpg)



The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

 

**Example:**

```
Input: [1,8,6,2,5,4,8,3,7]
Output: 49
```

## Solutions
　　最开始可能会想到暴力，但是连测试都过不了，超时了。

```python
# Time Complexity: O(n^2)
# Space Complexity: O(n)
class Solution:
    def maxArea(self, height: List[int]) -> int:
        if not height:
            return 0
        n = len(height)
        res = 0
        for i in range(n-1):
            for j in range(i+1, n):
                res = max(res, min(height[i], height[j])*(j-i))
        return res
# Timeout
```
### 1. 双指针方式
　　两个指针刚开始指向最两端，然后比较，挪动较矮的那根指针。


```python
# Time Complexity: O(n)
# Space Complexity: O(1)
class Solution:
    def maxArea(self, height: List[int]) -> int:
        if not height:
            return 0
        n = len(height)
        l, r = 0, n - 1
        res = 0
        while l < r:
            if height[l] > height[r]:
                area = (r-l) * height[r]
                r -= 1
            else:
                area = (r-l) * height[l]
                l += 1
            res = max(res, area)
        return res
# Runtime: 120 ms, faster than 99.78% of Python3 online submissions for Container With Most Water.
# Memory Usage: 14.4 MB, less than 74.74% of Python3 online submissions for Container With Most Water.
```

## References
1. [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/)
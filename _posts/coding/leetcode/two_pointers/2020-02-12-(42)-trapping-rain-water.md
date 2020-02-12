---
layout: post
title: 42. Trapping Rain Water
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Two Pointers]
image: 
comments: true
published: true
---

## Description

Given *n* non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.

![](/img/media/15814729342190.jpg)


The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped. **Thanks Marcos** for contributing this image!

**Example:**

```
Input: [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
```

## Solutions
### 1. Brute Force

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def trap(self, height: List[int]) -> int:
        res = 0
        n = len(height)
        for i in range(n):
            if not height[:i] or not height[i+1:]:
                continue
            lower = min(max(height[:i]), max(height[i:]))
            if lower < height[i]:
                continue
            res += lower - height[i]
        return res
# 315/315 cases passed (2636 ms)
# Your runtime beats 5.01 % of python3 submissions
# Your memory usage beats 88.37 % of python3 submissions (13.4 MB)
```

## 2. DP

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        l = [0] * n
        r = [0] * n
        for i in range(n):
            l[i] = height[i] if i == 0 else max(l[i - 1], height[i])
        for i in range(n-1, -1, -1):
            r[i] = height[i] if i == n - 1 else max(r[i + 1], height[i])
        res = 0
        for i in range(n):
            res += min(l[i], r[i]) - height[i]
        return res

# 315/315 cases passed (48 ms)
# Your runtime beats 85.43 % of python3 submissions
# Your memory usage beats 90.7 % of python3 submissions (13.4 MB)
```

### 3. Two Pointers

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        if n == 0:
            return 0
        l, r = 0, n - 1
        max_l, max_r = height[0], height[r]
        res = 0
        while l < r:
            if max_l < max_r:
                res += max_l - height[l]
                l += 1
                max_l = max(max_l,height[l])
            else:
                res += max_r - height[r]
                r -= 1
                max_r = max(max_r, height[r])
        return res

# 315/315 cases passed (52 ms)
# Your runtime beats 66.24 % of python3 submissions
# Your memory usage beats 97.67 % of python3 submissions (13.4 MB)
```

## References
1. [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/description/)
2. [huahua](https://zxi.mytechroad.com/blog/dynamic-programming/leetcode-42-trapping-rain-water/)
3. [basketwangCoding](https://www.youtube.com/watch?v=8BHqSdwyODs)
---
layout: post
title: 56. Merge Intervals
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Sort, Array]
image: 
comments: true
published: true
---

## Description

Given a collection of intervals, merge all overlapping intervals.

**Example 1:**

```
Input: [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].
```

**Example 2:**

```
Input: [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.
```

**NOTE:** input types have been changed on April 15, 2019. Please reset to default code definition to get new method signature.


## Solutions
　　合并不同的区间。

### 1. Sort

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        if not intervals:
            return []
        res = []
        intervals = sorted(intervals, key=lambda x: x[0])

        for item in intervals:
            if res and item[0] <= res[-1][1]:
                # res[-1][1] = item[1]
                res[-1][1] = max(res[-1][1], item[1])
            else:
                res.append(item)
        return res
# 169/169 cases passed (104 ms)
# Your runtime beats 18.37 % of python3 submissions
# Your memory usage beats 6.52 % of python3 submissions (14.8 MB)
```

　　注意 for 循环中注释哪一样容易缺！

## References
1. [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/)
---
layout: post
title: 812. Largest Triangle Area
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Math]
image: 
comments: true
published: true
---

## Description

You have a list of points in the plane. Return the area of the largest triangle that can be formed by any 3 of the points.

```
Example:
Input: points = [[0,0],[0,1],[1,0],[0,2],[2,0]]
Output: 2
Explanation: 
The five points are show in the figure below. The red triangle is the largest.
```

![](/img/media/15782165009474.jpg)


**Notes:**

- `3 <= points.length <= 50`.
- No points will be duplicated.
-  `-50 <= points[i][j] <= 50`.
- Answers within `10^-6` of the true value will be accepted as correct.

 


## Solutions
### 1. Backtracking
```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def largestTriangleArea(self, points: List[List[int]]) -> float:
        if not points or len(points) <= 2:
            return 0
        res = [-1]
        self.dfs(points, 0, [], res)
        return res[0]
    
    def dfs(self, points, start, path, res):
        if path and len(path) >= 3:
            s = 0.5 * abs(path[0][0] * path[1][1] + path[1][0] * path[2][1] + path[2][0] * path[0][1] - path[0][0] * path[2][1] -  path[2][0] * path[1][1] - path[1][0] * path[0][1])
            res[0] = max(s, res[0])
            return
        n = len(points)
        for i in range(start, n):
            self.dfs(points, i+1, path+[points[i]], res)
# 57/57 cases passed (268 ms)
# Your runtime beats 29.53 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

### 2. Math

```python
class Solution:
    def largestTriangleArea(self, points: List[List[int]]) -> float:
        return max(0.5 * abs(i[0] * j[1] + j[0] * k[1] + k[0] * i[1]- j[0] * i[1] - k[0] * j[1] - i[0] * k[1])
            for i, j, k in itertools.combinations(points, 3))
# 57/57 cases passed (136 ms)
# Your runtime beats 77.17 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

## References
1. [812. Largest Triangle Area](https://leetcode.com/problems/largest-triangle-area/)
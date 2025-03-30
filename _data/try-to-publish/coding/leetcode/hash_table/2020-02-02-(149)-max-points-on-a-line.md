---
layout: post
title: 149. Max Points on a Line
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Math, Hash Table]
image: 
comments: true
published: true
---

## Description
Given *n* points on a 2D plane, find the maximum number of points that lie on the same straight line.

**Example 1:**

```
Input: [[1,1],[2,2],[3,3]]
Output: 3
Explanation:
^
|
|        o
|     o
|  o  
+------------->
0  1  2  3  4
```

**Example 2:**

```
Input: [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]
Output: 4
Explanation:
^
|
|  o
|     o        o
|        o
|  o        o
+------------------->
0  1  2  3  4  5  6
```

**NOTE:** input types have been changed on April 15, 2019. Please reset to default code definition to get new method signature.


## Solutions
　　找到在同一条线上的最多点的个数

### 1. Hash Table
　　利用斜率来算，斜率先化简分数，还要记录重叠在一起的点。
* 遍历每个点 i，然后 j 从 i+1 开始，在每一次 i 遍历的时候比较，看是否跟 i 点重复，如果重复的话就要加 1
* 除了重复外就要用字典记录斜率一样的数的个数

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def maxPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        res = 0
        for i in range(n):
            lines = collections.defaultdict(int)
            duplicates = 1
            for j in range(i+1, n):
                if points[i][0] == points[j][0] and \
                    points[i][1] == points[j][1]:
                    duplicates += 1
                    continue
                dx = points[i][0] - points[j][0]
                dy = points[i][1] - points[j][1]
                delta = self.gcd(dx, dy)
                lines[(dx / delta, dy / delta)] += 1
            res = max(res, (max(lines.values()) if lines else 0) + duplicates)
        return res

    def gcd(self, x, y):
        return x if y == 0 else self.gcd(y, x % y)
# 37/37 cases passed (68 ms)
# Your runtime beats 70.54 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [149. Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line/description/)
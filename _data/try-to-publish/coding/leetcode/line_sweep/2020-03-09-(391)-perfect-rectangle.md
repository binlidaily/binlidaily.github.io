---
layout: post
title: 391. Perfect Rectangle
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Line Sweep, Hash Table]
image: 
comments: true
published: true
---

## Description

Given N axis-aligned rectangles where N > 0, determine if they all together form an exact cover of a rectangular region.

Each rectangle is represented as a bottom-left point and a top-right point. For example, a unit square is represented as [1,1,2,2]. (coordinate of bottom-left point is (1, 1) and top-right point is (2, 2)).

![](/img/media/15837648851524.jpg)


**Example 1:**

```
rectangles = [
  [1,1,3,3],
  [3,1,4,2],
  [3,2,4,4],
  [1,3,2,4],
  [2,3,3,4]
]

Return true. All 5 rectangles together form an exact cover of a rectangular region.
```

 
![](/img/media/15837648984588.jpg)


**Example 2:**

```
rectangles = [
  [1,1,2,3],
  [1,3,2,4],
  [3,1,4,2],
  [3,2,4,4]
]

Return false. Because there is a gap between the two rectangular regions.
```

 

 
![](/img/media/15837649101020.jpg)

**Example 3:**

```
rectangles = [
  [1,1,3,3],
  [3,1,4,2],
  [1,3,2,4],
  [3,2,4,4]
]

Return false. Because there is a gap in the top center.
```

 
![](/img/media/15837649153322.jpg)

 


**Example 4:**

```
rectangles = [
  [1,1,3,3],
  [3,1,4,2],
  [1,3,2,4],
  [2,2,4,4]
]

Return false. Because two of the rectangles overlap with each other.
```


## Solutions
　　每一个矩形用左下角和右上角的坐标来表示，原点是左下角的位置，每四个坐标为一组表示一个矩形，看这几组坐标是否能构成一个矩形。

### 1. Hash Table

```python
class Solution:
    def isRectangleCover(self, rectangles: List[List[int]]) -> bool:
        #除了四个顶点之外小矩形的顶点成对出现
        lookup = set()
        area = 0
        x_min, y_min, x_max, y_max = float('inf'), float('inf'), -float('inf'), -float('inf')
        for x1, y1, x2, y2 in rectangles:
            x_min = min(x_min, x1)
            y_min = min(y_min, y1)
            x_max = max(x_max, x2)
            y_max = max(y_max, y2)
            area += (y2 - y1) * (x2 - x1)
            for point in [(x1, y1), (x1, y2), (x2, y1), (x2, y2)]:
                if point in lookup:
                    lookup.remove(point)
                else:
                    lookup.add(point)
        if len(lookup) != 4 or (x_min, y_min) not in lookup or (x_min, y_max) not in lookup \
        or (x_max, y_min) not in lookup or (x_max, y_max) not in lookup:
            return False
        return area == (y_max - y_min) * (x_max - x_min)

# 46/46 cases passed (372 ms)
# Your runtime beats 81.42 % of python3 submissions
# Your memory usage beats 50 % of python3 submissions (19.7 MB)
```

### 2. Line Sweep
　　

## References
1. [391. Perfect Rectangle](https://leetcode.com/problems/perfect-rectangle/description/)
2. [扫描线算法，含动画图解](https://leetcode-cn.com/problems/perfect-rectangle/solution/sao-miao-xian-suan-fa-han-dong-hua-tu-jie-by-wotxd/)
3. [Huahua](https://zxi.mytechroad.com/blog/geometry/leetcode-391-perfect-rectangle/)
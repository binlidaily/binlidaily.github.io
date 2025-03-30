---
layout: post
title: 406. Queue Reconstruction by Height
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Greedy]
image: 
comments: true
published: true
---

## Description

Suppose you have a random list of people standing in a queue. Each person is described by a pair of integers `(h, k)`, where `h` is the height of the person and `k` is the number of people in front of this person who have a height greater than or equal to `h`. Write an algorithm to reconstruct the queue.

**Note:**
The number of people is less than 1,100.

 

**Example**

```
Input:
[[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]]

Output:
[[5,0], [7,0], [5,2], [6,1], [4,4], [7,1]]
```


## Solutions
### 1. Greedy

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def reconstructQueue(self, people: List[List[int]]) -> List[List[int]]:
        people = sorted(people, key = lambda x: (-x[0], x[1]))

        res = []
        for p in people:
            res.insert(p[1], p)
        return res

# 37/37 cases passed (96 ms)
# Your runtime beats 84.54 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13 MB)
```


## References
1. [406. Queue Reconstruction by Height](https://leetcode.com/problems/queue-reconstruction-by-height/)
2. [Easy concept with Python/C++/Java Solution](https://leetcode.com/problems/queue-reconstruction-by-height/discuss/89345/Easy-concept-with-PythonC%2B%2BJava-Solution)
3. [Python Solution](https://leetcode.com/problems/queue-reconstruction-by-height/discuss/167308/Python-solution)
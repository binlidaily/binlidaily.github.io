---
layout: post
title: 621. Task Scheduler
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Greedy]
image: 
comments: true
published: true
---

## Description

Given a char array representing tasks CPU need to do. It contains capital letters A to Z where different letters represent different tasks. Tasks could be done without original order. Each task could be done in one interval. For each interval, CPU could finish one task or just be idle.

However, there is a non-negative cooling interval **n** that means between two **same tasks**, there must be at least n intervals that CPU are doing different tasks or just be idle.

You need to return the **least** number of intervals the CPU will take to finish all the given tasks.

 

**Example:**

```
Input: tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
Explanation: A -> B -> idle -> A -> B -> idle -> A -> B.
```

 

**Note:**

1. The number of tasks is in the range [1, 10000].
2. The integer n is in the range [0, 100].


## Solutions
### 1. Greedy

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        hash_map = collections.defaultdict()
        for item in tasks:
            hash_map[item] = hash_map.get(item, 0) + 1
        values = list(hash_map.values())
        max_v = max(values)
        max_cnt = values.count(max_v)
        return max(len(tasks), (max_v - 1) * (n + 1) + max_cnt)
# 64/64 cases passed (440 ms)
# Your runtime beats 64.19 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

　　内置函数：


```python
# Time: O(n)
# Space: O(n)
class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        tasks_cnts = collections.Counter(tasks).values()
        max_task_cnts = max(tasks_cnts)
        max_size = list(tasks_cnts).count(max_task_cnts)
        return max(len(tasks), (max_task_cnts - 1) * (n + 1) + max_size)
# 64/64 cases passed (440 ms)
# Your runtime beats 99.19 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```
## References
1. [621. Task Scheduler](https://leetcode.com/problems/task-scheduler/description/)
2. [huahua](https://www.youtube.com/watch?v=YCD_iYxyXoo)
3. [Greedy](https://leetcode.com/problems/task-scheduler/discuss/104507/Python-Straightforward-with-Explanation)
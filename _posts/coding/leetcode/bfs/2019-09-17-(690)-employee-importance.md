---
layout: post
title: 690. Employee Importance
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, DFS, BFS, Easy]
image: 
comments: true
published: true
---

## Description

You are given a data structure of employee information, which includes the employee's **unique id**, his **importance value** and his **direct** subordinates' id.

For example, employee 1 is the leader of employee 2, and employee 2 is the leader of employee 3. They have importance value 15, 10 and 5, respectively. Then employee 1 has a data structure like [1, 15, [2]], and employee 2 has [2, 10, [3]], and employee 3 has [3, 5, []]. Note that although employee 3 is also a subordinate of employee 1, the relationship is **not direct**.

Now given the employee information of a company, and an employee id, you need to return the total importance value of this employee and all his subordinates.

**Example 1:**

```
Input: [[1, 5, [2, 3]], [2, 3, []], [3, 3, []]], 1
Output: 11
Explanation:
Employee 1 has importance value 5, and he has two direct subordinates: employee 2 and employee 3. They both have importance value 3. So the total importance value of employee 1 is 5 + 3 + 3 = 11.
```

 

**Note:**

1. One employee has at most one **direct** leader and may have several subordinates.
2. The maximum number of employees won't exceed 2000.


## Solutions
　　理解题意，查找员工从属关系，将其看成**森林**，然后从给定 ID 的员工开始遍历整棵树，因为要很快的通过结点查找，那么可以采用字典存 ID 和员工的对应关系，因为 ID 是唯一的。

### 1. DFS

```python
# Time: O(3^n)
# Space: O(n)
import collections
from typing import List
class Solution:
    def getImportance(self, employees: List['Employee'], id: int) -> int:
        hash_table = collections.defaultdict()
        for employee in employees:
            hash_table[employee.id] = employee
        
        return self.dfs(hash_table, id)
    
    def dfs(self, hash_table, id):
        if not hash_table or id not in hash_table:
            return 0
        importance = hash_table[id].importance
        for sub_id in hash_table[id].subordinates:
            importance += self.dfs(hash_table, sub_id)
        return importance

# 108/108 cases passed (152 ms)
# Your runtime beats 95.66 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14 MB)
```

### 2. BFS
　　BFS 因为没有重复调用函数，出栈进栈的操作，所以会快一丢丢：

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def getImportance(self, employees: List['Employee'], id: int) -> int:
        hash_table = collections.defaultdict()
        for employee in employees:
            hash_table[employee.id] = employee
        queue = collections.deque()
        queue.append(id)
        importance = 0
        while queue:
            id = queue.popleft()
            if id not in hash_table:
                continue
            importance += hash_table[id].importance
            for sub_id in hash_table[id].subordinates:
                queue.append(sub_id)
        return importance

# 108/108 cases passed (164 ms)
# Your runtime beats 51.94 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.9 MB)
```

## References
1. [690. Employee Importance](https://leetcode.com/problems/employee-importance/)
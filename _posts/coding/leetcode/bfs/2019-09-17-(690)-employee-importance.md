---
layout: post
title: 690. Employee Importance
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, DFS, BFS]
image: 
comments: true
published: true
---

You are given a data structure of employee information, which includes the employee's unique id, his importance value and his direct subordinates' id.

For example, employee 1 is the leader of employee 2, and employee 2 is the leader of employee 3. They have importance value 15, 10 and 5, respectively. Then employee 1 has a data structure like [1, 15, [2]], and employee 2 has [2, 10, [3]], and employee 3 has [3, 5, []]. Note that although employee 3 is also a subordinate of employee 1, the relationship is not direct.

Now given the employee information of a company, and an employee id, you need to return the total importance value of this employee and all his subordinates.

Example 1:
```
Input: [[1, 5, [2, 3]], [2, 3, []], [3, 3, []]], 1
Output: 11
Explanation:
Employee 1 has importance value 5, and he has two direct subordinates: employee 2 and employee 3. They both have importance value 3. So the total importance value of employee 1 is 5 + 3 + 3 = 11.
```

Note:

1. One employee has at most one direct leader and may have several subordinates.
2. The maximum number of employees won't exceed 2000.

## Solutions
### 1. DFS
　　理解题意，查找员工从属关系，将其看成**森林**，然后从给定 ID 的员工开始遍历整棵树，因为要很快的通过结点查找，那么可以采用字典存 ID 和员工的对应关系，因为 ID 是唯一的。

```python
"""
# Employee info
class Employee:
    def __init__(self, id, importance, subordinates):
        # It's the unique id of each node.
        # unique id of this employee
        self.id = id
        # the importance value of this employee
        self.importance = importance
        # the id of direct subordinates
        self.subordinates = subordinates
"""
class Solution:
    def getImportance(self, employees, id):
        """
        :type employees: Employee
        :type id: int
        :rtype: int
        """
        map_ = {}
        for em in employees:
            map_[em.id] = em
        return self.dfs(map_, id)
    
    def dfs(self, map_, id):
        sum = map_[id].importance
        for sub_id in map_[id].subordinates:
            sum += self.dfs(map_, sub_id)
        return sum
# Runtime: 184 ms, faster than 57.70% of Python3 online submissions for Employee Importance.
# Memory Usage: 14.8 MB, less than 8.33% of Python3 online submissions for Employee Importance.
```

### 2. BFS
　　BFS 因为没有重复调用函数，出栈进栈的操作，所以会快一丢丢：

```python
"""
# Employee info
class Employee:
    def __init__(self, id, importance, subordinates):
        # It's the unique id of each node.
        # unique id of this employee
        self.id = id
        # the importance value of this employee
        self.importance = importance
        # the id of direct subordinates
        self.subordinates = subordinates
"""
class Solution:
    def getImportance(self, employees, id):
        """
        :type employees: Employee
        :type id: int
        :rtype: int
        """
        map_ = {}
        for em in employees:
            map_[em.id] = em
        queue = [map_[id]]
        sum = 0
        while queue:
            node = queue.pop()
            sum += node.importance
            for sub_id in node.subordinates:
                queue.insert(0, map_[sub_id])
        return sum
# Runtime: 180 ms, faster than 79.67% of Python3 online submissions for Employee Importance.
# Memory Usage: 14.7 MB, less than 8.33% of Python3 online submissions for Employee Importance.
```

## References
1. [690. Employee Importance](https://leetcode.com/problems/employee-importance/)
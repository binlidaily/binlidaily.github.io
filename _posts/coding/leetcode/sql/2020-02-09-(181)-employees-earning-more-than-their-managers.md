---
layout: post
title: 181. Employees Earning More Than Their Managers
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, SQL]
image: 
comments: true
published: true
---

## Description
SQL Schema

The `Employee` table holds all employees including their managers. Every employee has an Id, and there is also a column for the manager Id.

```
+----+-------+--------+-----------+
| Id | Name  | Salary | ManagerId |
+----+-------+--------+-----------+
| 1  | Joe   | 70000  | 3         |
| 2  | Henry | 80000  | 4         |
| 3  | Sam   | 60000  | NULL      |
| 4  | Max   | 90000  | NULL      |
+----+-------+--------+-----------+
```

Given the `Employee` table, write a SQL query that finds out employees who earn more than their managers. For the above table, Joe is the only employee who earns more than his manager.

```
+----------+
| Employee |
+----------+
| Joe      |
+----------+
```


## Solutions
### 1. join or direct

```mysql
-- select e.name Employee
-- from Employee e join Employee m on e.ManagerId = m.Id
-- where e.Salary > m.Salary;

-- 14/14 cases passed (459 ms)
-- Your runtime beats 86.71 % of mysql submissions
-- Your memory usage beats 100 % of mysql submissions (0B)

select e.name Employee
from Employee e, Employee m
where e.ManagerId = m.Id and e.Salary > m.Salary;

-- 14/14 cases passed (1373 ms)
-- Your runtime beats 5 % of mysql submissions
-- Your memory usage beats 100 % of mysql submissions (0B)
```

## References
1. [181. Employees Earning More Than Their Managers](https://leetcode.com/problems/employees-earning-more-than-their-managers/)
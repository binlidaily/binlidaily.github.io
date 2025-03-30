---
layout: post
title: 177. Nth Highest Salary
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, SQL]
image: 
comments: true
published: true
---

## Description

Write a SQL query to get the *n*th highest salary from the `Employee` table.

```
+----+--------+
| Id | Salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+
```

For example, given the above Employee table, the *n*th highest salary where *n* = 2 is `200`. If there is no *n*th highest salary, then the query should return `null`.

```
+------------------------+
| getNthHighestSalary(2) |
+------------------------+
| 200                    |
+------------------------+
```


## Solutions
### 1. Limit

```mysql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
DECLARE M INT DEFAULT N-1;
-- DECLARE M INT;
-- SET M=N-1;
  RETURN (
      # Write your MySQL query statement below.
      SELECT ( SELECT DISTINCT Salary
      FROM Employee
      ORDER by Salary DESC
      -- LIMIT 1 offset M
      LIMIT M, 1
      )
  );
END

-- 14/14 cases passed (184 ms)
-- Your runtime beats 97.82 % of mysql submissions
-- Your memory usage beats 100 % of mysql submissions (0B)
```

## References
1. [177. Nth Highest Salary](https://leetcode.com/problems/nth-highest-salary/)

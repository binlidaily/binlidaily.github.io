---
layout: post
title: 176. Second Highest Salary
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, SQL]
image: 
comments: true
published: true
---

## Description

SQL Schema

Write a SQL query to get the second highest salary from the `Employee` table.

```
+----+--------+
| Id | Salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+
```

For example, given the above Employee table, the query should return `200` as the second highest salary. If there is no second highest salary, then the query should return `null`.

```
+---------------------+
| SecondHighestSalary |
+---------------------+
| 200                 |
+---------------------+
```


## Solutions
### 1. Limit offset
　　注意 null 的处理，要都用一层 select，将空几何转换为 NULL 的结果。
```mysql
select (select distinct Salary
from Employee
order by Salary desc
limit 1 offset 1) as SecondHighestSalary;

-- 7/7 cases passed (296 ms)
-- Your runtime beats 72.84 % of mysql submissions
-- Your memory usage beats 100 % of mysql submissions (0B)
```

　　或者写成：

```mysql
select (select distinct Salary
from Employee
order by Salary desc
limit 1, 1) as SecondHighestSalary;
```

### 2. 两次 max

```mysql
SELECT max(Salary) as SecondHighestSalary
FROM Employee
WHERE Salary < (SELECT max(Salary) FROM Employee);

-- 7/7 cases passed (319 ms)
-- Your runtime beats 56.84 % of mysql submissions
-- Your memory usage beats 100 % of mysql submissions (0B)
```
## References
1. [176. Second Highest Salary](https://leetcode.com/problems/second-highest-salary/)
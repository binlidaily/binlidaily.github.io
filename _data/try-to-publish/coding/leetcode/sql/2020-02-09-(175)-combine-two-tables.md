---
layout: post
title: 175. Combine Two Tables
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, SQL]
image: 
comments: true
published: true
---

## Description

SQL Schema

Table: `Person`

```
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| PersonId    | int     |
| FirstName   | varchar |
| LastName    | varchar |
+-------------+---------+
PersonId is the primary key column for this table.
```

Table: `Address`

```
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| AddressId   | int     |
| PersonId    | int     |
| City        | varchar |
| State       | varchar |
+-------------+---------+
AddressId is the primary key column for this table.
```

 

Write a SQL query for a report that provides the following information for each person in the Person table, regardless if there is an address for each of those people:

```
FirstName, LastName, City, State
```


## Solutions
### 1. Left Join

```mysql
select p.FirstName, p.LastName, a.City, a.State
from Person p left join Address a on p.PersonId = a.PersonId;

-- 7/7 cases passed (478 ms)
-- Your runtime beats 72.49 % of mysql submissions
-- Your memory usage beats 100 % of mysql submissions (0B)
```



basic left join: 902ms.



```mysql
SELECT FirstName, LastName, City, State
FROM Person
LEFT JOIN Address
ON Person.PersonId = Address.PersonId;
```



left join + using: 907ms



```mysql
SELECT FirstName, LastName, City, State
FROM Person
LEFT JOIN Address
USING(PersonId);
```



natural left join: 940ms



```mysql
SELECT FirstName, LastName, City, State
FROM Person
NATURAL LEFT JOIN Address;
```



left join is the fastest compare to the two others.

## References
1. [175. Combine Two Tables](https://leetcode.com/problems/combine-two-tables/)
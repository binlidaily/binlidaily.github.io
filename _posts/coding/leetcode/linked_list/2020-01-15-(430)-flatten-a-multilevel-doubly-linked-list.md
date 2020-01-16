---
layout: post
title: 430. Flatten a Multilevel Doubly Linked List
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Linked List]
image: 
comments: true
published: true
---

## Description

You are given a doubly linked list which in addition to the next and previous pointers, it could have a child pointer, which may or may not point to a separate doubly linked list. These child lists may have one or more children of their own, and so on, to produce a multilevel data structure, as shown in the example below.

Flatten the list so that all the nodes appear in a single-level, doubly linked list. You are given the head of the first level of the list.

 

**Example 1:**

```
Input: head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
Output: [1,2,3,7,8,11,12,9,10,4,5,6]
Explanation:
```

The multilevel linked list in the input is as follows:

![](/img/media/15790535300316.jpg)


After flattening the multilevel linked list it becomes:

430. Flatten a Multilevel Doubly Linked List

**Example 2:**

```
Input: head = [1,2,null,3]
Output: [1,3,2]
Explanation:

The input multilevel linked list is as follows:

  1---2---NULL
  |
  3---NULL
```

**Example 3:**

```
Input: head = []
Output: []
```

 

**How multilevel linked list is represented in test case:**

We use the multilevel linked list from **Example 1** above:

```
 1---2---3---4---5---6--NULL
         |
         7---8---9---10--NULL
             |
             11--12--NULL
```

The serialization of each level is as follows:

```
[1,2,3,4,5,6,null]
[7,8,9,10,null]
[11,12,null]
```

To serialize all levels together we will add nulls in each level to signify no node connects to the upper node of the previous level. The serialization becomes:

```
[1,2,3,4,5,6,null]
[null,null,7,8,9,10,null]
[null,11,12,null]
```

Merging the serialization of each level and removing trailing nulls we obtain:

```
[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
```

 

**Constraints:**

- Number of Nodes will not exceed 1000.
- `1 <= Node.val <= 10^5`


## Solutions
### 1. Coding Skill

```python
# Time: O(n)
# Space: O(1)
"""
# Definition for a Node.
class Node:
    def __init__(self, val, prev, next, child):
        self.val = val
        self.prev = prev
        self.next = next
        self.child = child
"""
class Solution:
    def flatten(self, head: 'Node') -> 'Node':
        if not head:
            return head
        cur = head
        while cur:
            # CASE 1: if no child, proceed
            if not cur.child:
                cur = cur.next
                continue
            # CASE 2: got child, find the tail of the child and link it to cur.next
            tmp = cur.child
            # find the tail of the child
            while tmp.next:
                tmp = tmp.next
            # connect tail with cur.next, if it is not None
            tmp.next = cur.next
            if cur.next:
                cur.next.prev = tmp
            cur.next = cur.child
            cur.child.prev = cur
            cur.child = None
        return head
# 22/22 cases passed (36 ms)
# Your runtime beats 72.4 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

### 2. Stack

```python
class Solution:
    def flatten(self, head: 'Node') -> 'Node':
        if not head:
            return head
        stack = [head]
        prev = Node(0)
        while stack:
            node = stack.pop()
            node.prev = prev
            prev.next = node
            prev = node
            if node.next:
                stack.append(node.next)
            if node.child:
                stack.append(node.child)
                node.child = None
        head.prev = None
        return head
# 22/22 cases passed (32 ms)
# Your runtime beats 87.74 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [430. Flatten a Multilevel Doubly Linked List](https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/description/)
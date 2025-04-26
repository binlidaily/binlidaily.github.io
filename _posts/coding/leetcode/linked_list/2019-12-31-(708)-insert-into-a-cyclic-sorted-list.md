---
layout: post
title: 708. Insert into a Cyclic Sorted List
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, LintCode, Linked List]
image: 
comments: true
published: true
---

## Description
Given a node from a cyclic linked list which has been sorted, write a function to insert a value into the list such that it remains a cyclic sorted list. The given node can be any single node in the list. Return the inserted new node.

Example 1:

```
Input:
3->5->1
4
Output:
5->1->3->4
```

Example 2:

```
Input:
2->2->2
3
Output:
3->2->2->2
```

## Solutions
### 1. Direct

```python
"""
Definition of ListNode
class ListNode(object):
    def __init__(self, val, next=None):
        self.val = val
        self.next = next
"""

class Solution:
    """
    @param: node: a list node in the list
    @param: x: An integer
    @return: the inserted new list node
    """
    def insert(self, head, val):
        # write your code here
        if not head:
            head = ListNode(val)
            head.next = head
            return head
        cur, next = head, head.next
        while 1:
            # case 2: cur.val <= val <= next.val
            if cur.val <= val <= next.val:
                break
            # case 3: cur.val > next.val and val < next.val or cur.val < next
            elif cur.val > next.val and (val <= next.val or cur.val <= val):
                break
            cur, next = cur.next, next.next
            # case 4: cur == head
            if cur == head: # in case of all nodes have same value that are > val 
                break
        # insert node between cur and next
        cur.next = ListNode(val)
        cur.next.next = next
        return head
```

## References
1. [708. Insert into a Cyclic Sorted List](https://www.lintcode.com/problem/insert-into-a-cyclic-sorted-list/description)
---
layout: post
title: 24. Swap Nodes in Pairs
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Linked List]
image: 
comments: true
published: true
---

## Description

Given a linked list, swap every two adjacent nodes and return its head.

You may **not** modify the values in the list's nodes, only nodes itself may be changed.

 

**Example:**

```
Given 1->2->3->4, you should return the list as 2->1->4->3.
```


## Solutions
### 1. 递归

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        if not head or not head.next:
            return head
        first, second = head, head.next
        head = second.next
        second.next = first
        first.next = self.swapPairs(head)
        return second

# 55/55 cases passed (24 ms)
# Your runtime beats 91.6 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```


### 2. Iterative

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        if not head or not head.next:
            return head
        dummy = ListNode(0)
        dummy.next = head
        head = dummy
        while head.next and head.next.next:
            first, second = head.next, head.next.next
            first.next = second.next
            second.next = first
            head.next = second
            head = first
        return dummy.next

# 55/55 cases passed (24 ms)
# Your runtime beats 91.6 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [24. Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/description/)
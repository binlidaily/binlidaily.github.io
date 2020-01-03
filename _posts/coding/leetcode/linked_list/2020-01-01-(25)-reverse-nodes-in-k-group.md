---
layout: post
title: 25. Reverse Nodes in k-Group
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Linked List]
image: 
comments: true
published: true
---

## Description


Given a linked list, reverse the nodes of a linked list *k* at a time and return its modified list.

*k* is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of *k* then left-out nodes in the end should remain as it is.



**Example:**

Given this linked list: `1->2->3->4->5`

For *k* = 2, you should return: `2->1->4->3->5`

For *k* = 3, you should return: `3->2->1->4->5`

**Note:**

- Only constant extra memory is allowed.
- You may not alter the values in the list's nodes, only nodes itself may be changed.


## Solutions
### 0. 错误代码
　　要知道错在那里！
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        if not head:
            return None
        if k < 2:
            return head
        stack = []
        node = head
        for _ in range(k):
            if not node:
                return head
            stack.append(node)
            node = node.next
        new_head = stack.pop()
        new_node = new_head
        for _ in range(k-1):
            new_node.next = stack.pop()
            new_node = new_node.next

        while node:
            cur = node
            for _ in range(k):
                if not cur:
                    new_node.next = node
                    return new_head
                stack.append(cur)
                cur = cur.next
            new_cur = stack.pop()
            cur_node = new_cur
            for _ in range(k-1):
                cur_node.next = stack.pop()
                cur_node = cur_node.next
            new_node.next = new_cur
            new_node = new_node.next
            node = cur
        return new_head
# Wrong Answer
# Runtime: 32 ms
# Your input
# [1,2,3,4,5]
# 2
# Output
# [2,1,4,5]
# Expected
# [2,1,4,3,5]
```

### 1. Recursion + Stack

```python
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        if not head:
            return None
        if k < 2:
            return head
        stack = []
        node = head
        for _ in range(k):
            if not node:
                return head
            stack.append(node)
            node = node.next
        new_head = stack.pop()
        new_node = new_head
        for _ in range(k-1):
            new_node.next = stack.pop()
            new_node = new_node.next
        new_node.next = self.reverseKGroup(node, k)
        return new_head
# 81/81 cases passed (48 ms)
# Your runtime beats 75.41 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.7 MB)
```

### 2. Direct
　　反转硬刚。
```python
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        if head is None or k < 2:
            return head
    
        next_head = head
        for i in range(k - 1):
            next_head = next_head.next
            if next_head is None:
                return head
        ret = next_head

        current = head
        while next_head:
            tail = current
            prev = None
            for i in range(k):
                if next_head:
                    next_head = next_head.next
                _next = current.next
                current.next = prev
                prev = current
                current = _next
            tail.next = next_head or current
        return ret
# 81/81 cases passed (44 ms)
# Your runtime beats 89.73 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.8 MB)
```
## References
1. [25. Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/description/)
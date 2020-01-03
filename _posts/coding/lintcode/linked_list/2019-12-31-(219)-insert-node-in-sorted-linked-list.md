---
layout: post
title: 219. Insert Node in Sorted Linked List
subtitle: 
author: Bin Li
tags: [Coding, LintCode, Linked List]
image: 
comments: true
published: true
---

## Description
Insert a node in a sorted linked list.

**Example 1:**

```
Input: head = 1->4->6->8->null, val = 5
Output: 1->4->5->6->8->null
```

**Example 2:**

```
Input: head = 1->null, val = 2
Output: 1->2->null
```

## Solutions
### 1. Coding Skill
　　考察 bug free 的能力：

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
    @param head: The head of linked list.
    @param val: An integer.
    @return: The head of new linked list.
    """
    def insertNode(self, head, val):
        # write your code here
        if not head:
            return ListNode(val)
        if head.val >= val:
            node = ListNode(val)
            node.next = head
            return node
        node = head
        is_change = False
        while node:
            if node.next and node.val < val and node.next.val >= val:
                next = node.next
                node.next = ListNode(val)
                node.next.next = next
                is_change = True
            if not node.next and not is_change:
                node.next = ListNode(val)
                break
            node = node.next
        return head
```

## References
1. [219. Insert Node in Sorted Linked List](https://www.lintcode.com/problem/insert-node-in-sorted-linked-list/description)
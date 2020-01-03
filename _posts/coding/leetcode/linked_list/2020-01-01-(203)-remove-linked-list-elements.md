---
layout: post
title: 203. Remove Linked List Elements
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Linked List, Easy]
image: 
comments: true
published: true
---

## Description

Remove all elements from a linked list of integers that have value ***val\***.

**Example:**

```
Input:  1->2->6->3->4->5->6, val = 6
Output: 1->2->3->4->5
```


## Solutions
### 1. Direct

```python
# Time: O(n)
# Space: O(1)
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def removeElements(self, head: ListNode, val: int) -> ListNode:
        if not head:
            return None

        while head and head.val == val:
            head = head.next
        node = head
        while node and node.next:
            if node.next.val == val:
                if node.next.next:
                    node.next = node.next.next
                    continue
                else:
                    node.next = None
                    break
            node = node.next
        return head
```

## References
1. [203. Remove Linked List Elements](https://leetcode.com/problems/remove-linked-list-elements/)
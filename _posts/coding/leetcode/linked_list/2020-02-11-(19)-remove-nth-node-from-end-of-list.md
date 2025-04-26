---
layout: post
title: 19. Remove Nth Node From End of List
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Linked List]
image: 
comments: true
published: true
---

## Description

Given a linked list, remove the *n*-th node from the end of list and return its head.

**Example:**

```
Given linked list: 1->2->3->4->5, and n = 2.

After removing the second node from the end, the linked list becomes 1->2->3->5.
```

**Note:**

Given *n* will always be valid.

**Follow up:**

Could you do this in one pass?


## Solutions
### 1. Fast and slow pointers

```python
# Time: O(n)
# Space: O(1)
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        fast, slow = head, head
        for _ in range(n):
            # if not fast.next:
            #     return None
            fast = fast.next
        while fast and fast.next:
            fast = fast.next
            slow = slow.next
        if not fast:
            return slow.next
        else:
            slow.next = slow.next.next
        return head

# 208/208 cases passed (32 ms)
# Your runtime beats 58.65 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/)
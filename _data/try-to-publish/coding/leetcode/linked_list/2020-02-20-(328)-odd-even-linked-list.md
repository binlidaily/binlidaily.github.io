---
layout: post
title: 328. Odd Even Linked List
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Linked List]
image: 
comments: true
published: true
---

## Description

Given a singly linked list, group all odd nodes together followed by the even nodes. Please note here we are talking about the node number and not the value in the nodes.

You should try to do it in place. The program should run in O(1) space complexity and O(nodes) time complexity.

**Example 1:**

```
Input: 1->2->3->4->5->NULL
Output: 1->3->5->2->4->NULL
```

**Example 2:**

```
Input: 2->1->3->5->6->4->7->NULL
Output: 2->3->6->7->1->5->4->NULL
```

**Note:**

- The relative order inside both the even and odd groups should remain as it was in the input.
- The first node is considered odd, the second node even and so on ...


## Solutions
### 1. Two head

```python
# Time: O(n)
# Space: O(1)
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def oddEvenList(self, head: ListNode) -> ListNode:
        if not head or not head.next:
            return head
        odd, even = ListNode(0), ListNode(0)
        odd_head, even_head = odd, even
        idx = 0
        while head:
            if idx & 1 == 0:
                odd.next = head
                odd = odd.next
            else:
                even.next = head
                even = even.next
            head = head.next
            idx += 1
        even.next = None
        odd.next = even_head.next
        return odd_head.next

# 71/71 cases passed (44 ms)
# Your runtime beats 51.11 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14.6 MB)
```

## References
1. [328. Odd Even Linked List](https://leetcode.com/problems/odd-even-linked-list/description/)
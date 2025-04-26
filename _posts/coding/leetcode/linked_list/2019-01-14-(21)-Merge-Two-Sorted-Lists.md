---
layout: post
title: 21. Merge Two Sorted Lists
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Linked List]
image: 
comments: true
published: true
---


## Description
Merge two sorted linked lists and return it as a new list. The new list should be made by splicing together the nodes of the first two lists.

Example:

```
Input: 1->2->4, 1->3->4
Output: 1->1->2->3->4->4
```

## Solutions
### 迭代实现
```python
# Time: O(n)
# Space: O(1)
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        dummy = ListNode(0)
        node = dummy
        while l1 and l2:
            if l1.val <= l2.val:
                node.next = l1
                l1 = l1.next
            else:
                node.next = l2
                l2 = l2.next
            node = node.next
        if l1:
            node.next = l1
        if l2:
            node.next = l2
        # if l1 or l2:
        #     node.next = l1 or l2
        return dummy.next

# 208/208 cases passed (32 ms)
# Your runtime beats 85.62 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

### 2. 递归方式
　　注意返回的时候要选什么。
```python
# Time: O(n)
# Space: O(121)
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        if not l1 or not l2:
            return l2 or l1
        if l1.val <= l2.val:
            l1.next = self.mergeTwoLists(l1.next, l2)
            return l1
        else:
            l2.next = self.mergeTwoLists(l1, l2.next)
            return l2

# 208/208 cases passed (36 ms)
# Your runtime beats 62.62 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

### 3. 原地迭代
尚没有细看：
```python
# in-place, iteratively        
def mergeTwoLists(self, l1, l2):
    if None in (l1, l2):
        return l1 or l2
    dummy = cur = ListNode(0)
    dummy.next = l1
    while l1 and l2:
        if l1.val < l2.val:
            l1 = l1.next
        else:
            nxt = cur.next
            cur.next = l2
            tmp = l2.next
            l2.next = nxt
            l2 = tmp
        cur = cur.next
    cur.next = l1 or l2
    return dummy.next
```

## References
1. [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)
---
layout: post
title: 83. Remove Duplicates from Sorted List
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Linked List]
image: 
comments: true
published: true
---

## Description

Given a sorted linked list, delete all duplicates such that each element appear only *once*.

**Example 1:**

```
Input: 1->1->2
Output: 1->2
```

**Example 2:**

```
Input: 1->1->2->3->3
Output: 1->2->3
```


## Solutions
### 1. Direct

```python
# Time: O(n)
# Space: O(1)
# Definition for singly-linked list.
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def deleteDuplicates(self, head: ListNode) -> ListNode:
        node = head
        while node:
            if node.next and node.next.val == node.val:
                node.next = node.next.next
                continue
            node = node.next
        return head

# 165/165 cases passed (32 ms)
# Your runtime beats 97.89 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [83. Remove Duplicates from Sorted List](https://leetcode.com/problems/remove-duplicates-from-sorted-list/description/)
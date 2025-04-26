---
layout: post
title: 86. Partition List
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Linked List]
image: 
comments: true
published: true
---

## Description

Given a linked list and a value *x*, partition it such that all nodes less than *x* come before nodes greater than or equal to *x*.

You should preserve the original relative order of the nodes in each of the two partitions.

**Example:**

```
Input: head = 1->4->3->2->5->2, x = 3
Output: 1->2->2->4->3->5
```

## Solutions
### 1. Direct

```python
# Time: O(n)
# Space: O(1)
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def partition(self, head: ListNode, x: int) -> ListNode:
        if not head:
            return None
        less, gt_eq = None, None
        left, right = None, None
        node = head
        while node:
            if node.val < x:
                if not less:
                    left = node
                else:
                    less.next = node
                less = node
            else: # node.val >= x
                if not gt_eq:
                    right = node
                else:
                    gt_eq.next = node
                gt_eq = node
            node = node.next
        if not less or not gt_eq:
            return right or left
        else:
            less.next = right
            gt_eq.next = None
            return left
# 166/166 cases passed (28 ms)
# Your runtime beats 94.34 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```

## References
1. [86. Partition List](https://leetcode.com/problems/86/)
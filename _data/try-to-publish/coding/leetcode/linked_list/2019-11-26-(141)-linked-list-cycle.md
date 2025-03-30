---
layout: post
title: 141. Linked List Cycle
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Two Pointers, Easy, Linked List]
image: 
comments: true
published: true
---

## Description

Given a linked list, determine if it has a cycle in it.

To represent a cycle in the given linked list, we use an integer `pos` which represents the position (0-indexed) in the linked list where tail connects to. If `pos` is `-1`, then there is no cycle in the linked list.

 

**Example 1:**

```
Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where tail connects to the second node.
```

![](/img/media/15747668701058.jpg)


**Example 2:**

```
Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where tail connects to the first node.
```

![](/img/media/15747668777127.jpg)


**Example 3:**

```
Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.
```

![](/img/media/15747669489345.jpg)
 

**Follow up:**

Can you solve it using *O(1)* (i.e. constant) memory?

## Solutions
### 1. Two Pointers

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None
# Time: O(n)
# Space: O(1)
class Solution:
    def hasCycle(self, head: ListNode) -> bool:
        if not head or not head.next:
            return False
        faster, slower = head, head
        while faster and slower:
            if faster.next:
                faster = faster.next.next
            else:
                faster = None
            slower = slower.next
            if faster == slower:
                return True
        return False
# 17/17 cases passed (48 ms)
# Your runtime beats 89.92 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (16 MB)
```

## References
1. [141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/description/)
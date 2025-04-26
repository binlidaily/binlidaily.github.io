---
layout: post
title: 160. Intersection of Two Linked Lists
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Linked List]
image: 
comments: true
published: true
---

## Description
Write a program to find the node at which the intersection of two singly linked lists begins.

For example, the following two linked lists:

![](/img/media/15779550577747.jpg)


begin to intersect at node c1.

 

Example 1:
![](/img/media/15779550698126.jpg)


Input: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
Output: Reference of the node with value = 8
Input Explanation: The intersected node's value is 8 (note that this must not be 0 if the two lists intersect). From the head of A, it reads as [4,1,8,4,5]. From the head of B, it reads as [5,0,1,8,4,5]. There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B.
 

Example 2:
![](/img/media/15779550769417.jpg)


Input: intersectVal = 2, listA = [0,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
Output: Reference of the node with value = 2
Input Explanation: The intersected node's value is 2 (note that this must not be 0 if the two lists intersect). From the head of A, it reads as [0,9,1,2,4]. From the head of B, it reads as [3,2,4]. There are 3 nodes before the intersected node in A; There are 1 node before the intersected node in B.
 

Example 3:
![](/img/media/15779550851512.jpg)


Input: intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
Output: null
Input Explanation: From the head of A, it reads as [2,6,4]. From the head of B, it reads as [1,5]. Since the two lists do not intersect, intersectVal must be 0, while skipA and skipB can be arbitrary values.
Explanation: The two lists do not intersect, so return null.
 

Notes:

If the two linked lists have no intersection at all, return null.
The linked lists must retain their original structure after the function returns.
You may assume there are no cycles anywhere in the entire linked structure.
Your code should preferably run in O(n) time and use only O(1) memory.

## Solutions
### 1. Long go first

```python
# Time: O(n)
# Space: O(1)
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> ListNode:
        if not headA or not headB:
            return None
        size_a, size_b = 0, 0
        nodeA, nodeB = headA, headB
        while nodeA:
            size_a += 1
            nodeA = nodeA.next
        while nodeB:
            size_b += 1
            nodeB = nodeB.next
        nodeA, nodeB = headA, headB
        if size_a == size_b:
            pass
        elif size_a > size_b:
            steps = size_a - size_b
            for _ in range(steps):
                nodeA = nodeA.next
        else:
            steps = size_b - size_a
            for _ in range(steps):
                nodeB = nodeB.next
        while nodeA and nodeB:
            if nodeA == nodeB:
                return nodeA
            nodeA = nodeA.next
            nodeB = nodeB.next
        return None
# 45/45 cases passed (168 ms)
# Your runtime beats 57.54 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (27.8 MB)
```

## References
1. [160. Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/)
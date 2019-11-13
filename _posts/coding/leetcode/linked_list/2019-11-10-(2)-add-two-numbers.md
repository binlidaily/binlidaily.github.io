---
layout: post
title: 
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

## Description

You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order** and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Example:**

```
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8
Explanation: 342 + 465 = 807.
```

## Solutions
　　看清题意，这里用链表表示的数是反序的，不是从高位开始，不需要考虑数位不对等问题。再者就是，考虑为什么会出现这样的加法？难道对于大数的四则运算就是这么实现的？

### 1. 迭代
　　注意进位的处理！
```python
# Time Complexity: O(n)
# Space Complexity: O(1)
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        tmp = ListNode(0)
        res = tmp
        carry = 0
        while l1 or l2 or carry:
            if l1:
                carry += l1.val
                l1 = l1.next
            if l2:
                carry += l2.val
                l2 = l2.next
            carry, mod = divmod(carry, 10)
            tmp.next = ListNode(mod)
            tmp = tmp.next
        return res.next
# Runtime: 56 ms, faster than 99.76% of Python3 online submissions for Add Two Numbers.
# Memory Usage: 12.8 MB, less than 100.00% of Python3 online submissions for Add Two Numbers.
```

## References
1. [2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/)
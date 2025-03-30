---
layout: post
title: 142. Linked List Cycle II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Two Pointers, Medium, Linked List]
image: 
comments: true
published: true
---


## Description

Given a linked list, return the node where the cycle begins. If there is no cycle, return `null`.

To represent a cycle in the given linked list, we use an integer `pos` which represents the position (0-indexed) in the linked list where tail connects to. If `pos` is `-1`, then there is no cycle in the linked list.

**Note:** Do not modify the linked list.

 

**Example 1:**

```
Input: head = [3,2,0,-4], pos = 1
Output: tail connects to node index 1
Explanation: There is a cycle in the linked list, where tail connects to the second node.
```

![](/img/media/15747668701058.jpg)

**Example 2:**

```
Input: head = [1,2], pos = 0
Output: tail connects to node index 0
Explanation: There is a cycle in the linked list, where tail connects to the first node.
```

![](/img/media/15747668777127.jpg)

**Example 3:**

```
Input: head = [1], pos = -1
Output: no cycle
Explanation: There is no cycle in the linked list.
```

![](/img/media/15747669489345.jpg)

 
**Follow-up**:
Can you solve it without using extra space?


## Solutions
### 1. Two Pointers
　　主要在捋清楚关系，其实不需要知道具体快指针和慢指针绕着环转了多少圈，以及第二次相遇（第二次肯定在入口处，因为两个指针在第二次都是一次一步，如果在入口没有遇到，以后肯定不可能再遇到了）在环中的指针在环中又走了多少圈，这些可以不考虑，只要代码检查到有两次相遇了，第二次相遇点肯定就是入口！


```python
# Time: O(n)
# Space: O(1)
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def detectCycle(self, head: ListNode) -> ListNode:
        if not head:
            return None
        fast, slow = head, head
        while fast and slow:
            if fast.next:
                fast = fast.next.next
            else:
                return None
            slow = slow.next
            if fast == slow:
                break
        
        if not fast or not slow:
            return None
        
        restart = head
        while restart != slow:
            restart = restart.next
            slow = slow.next
        return slow
# 16/16 cases passed (52 ms)
# Your runtime beats 81.56 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (15.9 MB)
```

## References
1. [142. Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii)
---
layout: post
title: 23. Merge k Sorted Lists
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Linked List, Hard, Heap]
image: 
comments: true
published: true
---

## Description

Merge *k* sorted linked lists and return it as one sorted list. Analyze and describe its complexity.

**Example:**

```
Input:
[
  1->4->5,
  1->3->4,
  2->6
]
Output: 1->1->2->3->4->4->5->6
```

## Solutions
### 1. 挨个比较取最小-超时

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def mergeKLists(self, lists: List[ListNode]) -> ListNode:
        if not lists:
            return None
        res = None
        while any(lists):
            small = lists[0]
            for ll in lists:
                if ll and small.val > ll.val:
                    small = ll
            if not res:
                res = small
            else:
                res.next = small
            small = small.next
        return res
# Time Limit Exceeded
```

### 2. Min Heap

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None
import heapq


# overwrite the compare function 
# so that we can directly put ListNode into heapq
ListNode.__lt__ = lambda x, y: (x.val < y.val)


class Solution:
    """
    @param lists: a list of ListNode
    @return: The head of one sorted list.
    """
    def mergeKLists(self, lists):
        if not lists:
            return None
        
        dummy = ListNode(0)
        tail = dummy
        heap = []
        for head in lists:
            if head:
                heapq.heappush(heap, head)
                
        while heap:
            head = heapq.heappop(heap)
            tail.next = head
            tail = head
            if head.next:
                heapq.heappush(heap, head.next)
                    
        return dummy.next
```

### 3. Divide and conquer - 归并

```python
"""
Definition of ListNode
class ListNode(object):

    def __init__(self, val, next=None):
        self.val = val
        self.next = next
"""
class Solution:
    """
    @param lists: a list of ListNode
    @return: The head of one sorted list.
    """
    def mergeKLists(self, lists):
        if not lists:
            return None
        
        while len(lists) > 1:
            next_lists = []
            for i in range(0, len(lists), 2):
                if i + 1 < len(lists):
                    new_list = self.merge_two_lists(lists[i], lists[i + 1])
                else:
                    new_list = lists[i]
                next_lists.append(new_list)
                
            lists = next_lists
            
        return lists[0]
        
    def merge_two_lists(self, head1, head2):
        tail = dummy = ListNode(0)
        while head1 and head2:
            if head1.val < head2.val:
                tail.next = head1
                head1 = head1.next
            else:
                tail.next = head2
                head2 = head2.next
            tail = tail.next
            
        if head1:
            tail.next = head1
        if head2:
            tail.next = head2
        
        return dummy.next
# Runtime: 116 ms, faster than 65.45%.
# Memory Usage: 15.6 MB, less than 100.00%.
```

## References
1. [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/description/)
2. [huahua](https://www.youtube.com/watch?v=XqA8bBoEdIY)
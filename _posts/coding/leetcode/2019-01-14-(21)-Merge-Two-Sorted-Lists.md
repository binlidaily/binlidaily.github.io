---
layout: post
title: 21. Merge Two Sorted Lists
subtitle:
author: Bin Li
tags: [Coding, LeetCode]
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
```python
# Definition for singly-linked list.
# class ListNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.next = None

# Input: 1->2->4, 1->3->4
# Output: 1->1->2->3->4->4
    
class Solution(object):
    def mergeTwoLists(self, l1, l2):
        """
        :type l1: ListNode
        :type l2: ListNode
        :rtype: ListNode
        """
        if l1 is None and l2 is not None:
            return l2
        
        if l2 is None and l1 is not None:
            return l1
        
        if l1 is None and l2 is None:
            return None
        
        iter_node = None
        res_node = None
        while l1 is not None and l2 is not None:
            min_val = None
            if l1.val <= l2.val:
                min_val = l1.val
                l1 = l1.next
            else:
                min_val = l2.val
                l2 = l2.next

            if res_node is None:
                res_node = ListNode(min_val)
                iter_node = res_node
            else:
                iter_node.next = ListNode(min_val)
                iter_node = iter_node.next
        
        while l1 is not None:
            iter_node.next = ListNode(l1.val)
            iter_node = iter_node.next
            l1 = l1.next
        
        while l2 is not None:
            iter_node.next = ListNode(l2.val)
            iter_node = iter_node.next
            l2 = l2.next
        return res_node
```

这样写出来的代码似乎不是很优雅，对比了别人实现的版本，有好多提升。

### 迭代实现
这里跟我实现的版本差不多，但是在代码方式上回优雅很多。
```python
def mergeTwoLists(self, l1, l2):
    """
    :type l1: ListNode
    :type l2: ListNode
    :rtype: ListNode
    """
    # define a unused Node as the start node
    res_node = iter_node = ListNode(0)
    while l1 and l2:
        if l1.val <= l2.val:
            iter_node.next = l1
            l1 = l1.next
        else:
            iter_node.next = l2
            l2 = l2.next
        iter_node = iter_node.next
    
    # if l1:
    #     iter_node.next = l1
    # if l2:
    #     iter_node.next = l2
    if l1 or l2:
        iter_node.next = l1 or l2
    return res_node.next
```

可以看到，应该先假设邻接条件都满足的情况下来实现代码，我在前后都做了链表为空的判断，明显是重复了！而且在后面判断l1和l2是否空值时，可以用 or 的这种方式来表达，实在很简洁！

### 递归方式
这种方法尚没有想清楚一个很清晰的思路去实现，尝试如此描述下：这个对比过程其实是重复的，即先假设两个链表都是重复的情况，那么每次都是从两个链表中取出一个结点进行比较，取较小的那个，然后那个链表往后挪一个位置后，又重复这个对比过程。那么递归的部分是针对两个链表结点来说的，首先这两个结点比较大小，每一次递归肯定要有一个返回的操作，所以这里就是返回最小的那个结点。再返回之前需要做一点操作，即调用下一次的递归，调用时较小的那个结点要用下一个结点去参与递归，而递归也有一个返回值，而这个返回值正式接在当前选出的较小结点后面的结点：
```python
if l1.val <= l2.val:
    l1.next = mergeTwoLists(l1.next, l2)
    return l1
else:
    l2.next = mergeTwoLists(l1, l2.next)
    return l2
```
当递归到两个链表中其中一个为空时，此时不需要继续调用递归了，直接返回当前不为空的链表即可。

```python
def mergeTwoLists(self, l1, l2):
    if not l1 or not l2:
        return l1 or l2
    if l1.val < l2.val:
        l1.next = self.mergeTwoLists(l1.next, l2)
        return l1
    else:
        l2.next = self.mergeTwoLists(l1, l2.next)
        return l2
```

### 原地迭代
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
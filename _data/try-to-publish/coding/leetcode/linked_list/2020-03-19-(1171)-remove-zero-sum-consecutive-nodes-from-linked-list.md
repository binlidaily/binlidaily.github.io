---
layout: post
title: 1171. Remove Zero Sum Consecutive Nodes from Linked List
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Linked List]
image: 
comments: true
published: true
---

## Description

Given the `head` of a linked list, we repeatedly delete consecutive sequences of nodes that sum to `0` until there are no such sequences.

After doing so, return the head of the final linked list. You may return any such answer.

 

(Note that in the examples below, all sequences are serializations of `ListNode` objects.)

**Example 1:**

```
Input: head = [1,2,-3,3,1]
Output: [3,1]
Note: The answer [1,2,1] would also be accepted.
```

**Example 2:**

```
Input: head = [1,2,3,-3,4]
Output: [1,2,4]
```

**Example 3:**

```
Input: head = [1,2,3,-3,-2]
Output: [1]
```

 

**Constraints:**

- The given linked list will contain between `1` and `1000` nodes.
- Each node in the linked list has `-1000 <= node.val <= 1000`.


## Solutions
### 1. 前缀和-Hash Table

```python
# Time: O(n)
# Space: O(n)
# Definition for singly-linked list.
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def removeZeroSumSublists(self, head: ListNode) -> ListNode:
        dummy = ListNode(0)
        dummy.next = head
        sum_hash = collections.defaultdict()
        add = 0
        sum_hash[0] = dummy
        node = head
        while node:
            add += node.val
            if add in sum_hash:
                sum_hash[add].next = node.next
                sum_hash.clear()
                node = dummy
                sum_hash[0] = dummy
                add = 0
            else:
                sum_hash[add] = node
            node = node.next
        return dummy.next

# 105/105 cases passed (52 ms)
# Your runtime beats 24.11 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.3 MB)
```

　　不从最开始的位置遍历：


```python
# Time: O(n)
# Space: O(n)
class Solution:
    def removeZeroSumSublists(self, head: ListNode) -> ListNode:
        cur = dummy = ListNode(0)
        dummy.next = head
        prefix = 0
        seen = collections.OrderedDict()
        while cur:
            prefix += cur.val
            node = seen.get(prefix, cur)
            while prefix in seen:
                seen.popitem()
            seen[prefix] = node
            node.next = cur = cur.next
        return dummy.next

# 105/105 cases passed (48 ms)
# Your runtime beats 28.44 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.3 MB)
```

### 2. Two Passes
　　第一遍遍历计算从开始节点开始当当前节点的所有结点的和，有相同也只会更新最近的那个位置，这个位置在第二遍遍历的时候就能直接当做隔空对接的位置！

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def removeZeroSumSublists(self, head: ListNode) -> ListNode:
        cur = dummy = ListNode(0)
        dummy.next = head
        prefix = 0
        sum_hash = collections.defaultdict()
        while cur:
            prefix += cur.val
            sum_hash[prefix] = cur
            cur = cur.next
        
        cur = dummy
        prefix = 0
        while cur:
            prefix += cur.val
            cur.next = sum_hash[prefix].next
            cur = cur.next
        return dummy.next

# 105/105 cases passed (40 ms)
# Your runtime beats 82.67 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.2 MB)
```

## References
1. [1171. Remove Zero Sum Consecutive Nodes from Linked List](https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list/description/)
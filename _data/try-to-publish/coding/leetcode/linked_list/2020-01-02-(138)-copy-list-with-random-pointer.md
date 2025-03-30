---
layout: post
title: 138. Copy List with Random Pointer
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Linked List]
image: 
comments: true
published: true
---

## Description

A linked list is given such that each node contains an additional random pointer which could point to any node in the list or null.

Return a [**deep copy**](https://en.wikipedia.org/wiki/Object_copying#Deep_copy) of the list.

The Linked List is represented in the input/output as a list of `n` nodes. Each node is represented as a pair of `[val, random_index]` where:

- `val`: an integer representing `Node.val`
- `random_index`: the index of the node (range from `0` to `n-1`) where random pointer points to, or `null` if it does not point to any node.

 

**Example 1:**

![](/img/media/15779743370924.jpg)


```
Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**Example 2:**

![](/img/media/15779743446968.jpg)


```
Input: head = [[1,1],[2,1]]
Output: [[1,1],[2,1]]
```

**Example 3:**

![](/img/media/15779743533992.jpg)


```
Input: head = [[3,null],[3,0],[3,null]]
Output: [[3,null],[3,0],[3,null]]
```

**Example 4:**

```
Input: head = []
Output: []
Explanation: Given linked list is empty (null pointer), so return null.
```

 

**Constraints:**

- `-10000 <= Node.val <= 10000`
- `Node.random` is null or pointing to a node in the linked list.
- Number of Nodes will not exceed 1000.


## Solutions
### 1. Copy same

```python
# Time: O(n)
# Space: O(1)
"""
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random
"""
class Solution:
    def copyRandomList(self, head: 'Node') -> 'Node':
        if not head:
            return 
        # copy nodes
        cur = head
        while cur:
            nxt = cur.next
            cur.next = Node(cur.val, cur.next, cur.random)
            cur.next.next = nxt
            cur = nxt
        # copy random pointers
        cur = head
        while cur:
            if cur.random:
                cur.next.random = cur.random.next
            cur = cur.next.next
        # separate two parts
        second = cur = head.next
        while cur.next:
            head.next = cur.next
            head = head.next
            cur.next = head.next
            cur = cur.next
        head.next = None
        return second

# 18/18 cases passed (48 ms)
# Your runtime beats 39.22 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.3 MB)
```

## References
1. [138. Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/description/)
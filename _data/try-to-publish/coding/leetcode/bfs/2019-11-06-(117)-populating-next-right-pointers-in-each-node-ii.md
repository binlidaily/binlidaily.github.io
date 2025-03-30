---
layout: post
title: 117. Populating Next Right Pointers in Each Node II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, BFS]
image: 
comments: true
published: true
---

Given a binary tree
```
struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
```
Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to `NULL`.

Initially, all next pointers are set to `NULL`.

 

**Example**:
![](/img/media/15730317989724.jpg)


```
Input: {"$id":"1","left":{"$id":"2","left":{"$id":"3","left":null,"next":null,"right":null,"val":4},"next":null,"right":{"$id":"4","left":null,"next":null,"right":null,"val":5},"val":2},"next":null,"right":{"$id":"5","left":null,"next":null,"right":{"$id":"6","left":null,"next":null,"right":null,"val":7},"val":3},"val":1}

Output: {"$id":"1","left":{"$id":"2","left":{"$id":"3","left":null,"next":{"$id":"4","left":null,"next":{"$id":"5","left":null,"next":null,"right":null,"val":7},"right":null,"val":5},"right":null,"val":4},"next":{"$id":"6","left":null,"next":null,"right":{"$ref":"5"},"val":3},"right":{"$ref":"4"},"val":2},"next":null,"right":{"$ref":"6"},"val":1}
```

Explanation: Given the above binary tree (Figure A), your function should populate each next pointer to point to its next right node, just like in Figure B.
 

**Note**:

* You may only use constant extra space.
* Recursive approach is fine, implicit stack space does not count as extra space for this problem.

## Solutions
### 1. BFS-迭代

```python
# Time Complexity: O(n)
# Space Complexity: O(logn)
"""
# Definition for a Node.
class Node:
    def __init__(self, val, left, right, next):
        self.val = val
        self.left = left
        self.right = right
        self.next = next
"""
class Solution:
    def connect(self, root: 'Node') -> 'Node':
        if not root:
            return None
        
        queue = collections.deque([root])
        
        while queue:
            pre = None
            size = len(queue)
            
            for i in range(size):
                node = queue.popleft()
                if not pre:
                    pre = node
                else:
                    pre.next = node
                    pre = node
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
        return root
# Runtime: 388 ms, faster than 82.64% of Python3 online submissions for Populating Next Right Pointers in Each Node II.
# Memory Usage: 49.6 MB, less than 8.33% of Python3 online submissions for Populating Next Right Pointers in Each Node II.
```

## References
1. [117. Populating Next Right Pointers in Each Node II](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii)
2. 相关题目
    1. [116. Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/)
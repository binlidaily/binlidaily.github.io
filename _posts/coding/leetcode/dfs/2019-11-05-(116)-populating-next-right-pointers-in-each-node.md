---
layout: post
title: 116. Populating Next Right Pointers in Each Node
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, DFS, BFS, Medium]
image: 
comments: true
published: true
---

You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:

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
![](/img/media/15729496680252.jpg)

```
Input: {"$id":"1","left":{"$id":"2","left":{"$id":"3","left":null,"next":null,"right":null,"val":4},"next":null,"right":{"$id":"4","left":null,"next":null,"right":null,"val":5},"val":2},"next":null,"right":{"$id":"5","left":{"$id":"6","left":null,"next":null,"right":null,"val":6},"next":null,"right":{"$id":"7","left":null,"next":null,"right":null,"val":7},"val":3},"val":1}

Output: {"$id":"1","left":{"$id":"2","left":{"$id":"3","left":null,"next":{"$id":"4","left":null,"next":{"$id":"5","left":null,"next":{"$id":"6","left":null,"next":null,"right":null,"val":7},"right":null,"val":6},"right":null,"val":5},"right":null,"val":4},"next":{"$id":"7","left":{"$ref":"5"},"next":null,"right":{"$ref":"6"},"val":3},"right":{"$ref":"4"},"val":2},"next":null,"right":{"$ref":"7"},"val":1}

Explanation: Given the above perfect binary tree (Figure A), your function should populate each next pointer to point to its next right node, just like in Figure B.
```

**Note**:

* You may only use constant extra space.
* Recursive approach is fine, implicit stack space does not count as extra space for this problem.

## Solutions
### 1. DFS-先序遍历-递归
　　采用递归的方法，注意这里的递归条件。

![-w546](/img/media/15730312397043.jpg)


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
        if not root.left:
            return root
        root.left.next = root.right
        
        if root.next:
            root.right.next = root.next.left
        
        root.left = self.connect(root.left)
        root.right = self.connect(root.right)
        
        return root
# Runtime: 60 ms, faster than 98.51% of Python3 online submissions for Populating Next Right Pointers in Each Node.
# Memory Usage: 14.8 MB, less than 100.00% of Python3 online submissions for Populating Next Right Pointers in Each Node.
```


### 2. BFS-迭代

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
            size = len(queue)
            pre = None
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
# Runtime: 64 ms, faster than 93.22% of Python3 online submissions for Populating Next Right Pointers in Each Node.
# Memory Usage: 14.8 MB, less than 100.00% of Python3 online submissions for Populating Next Right Pointers in Each Node.
```
## References
1. [116. Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/)
2. [huahua](https://www.youtube.com/watch?v=YNu143ZN4qU)
3. 相关题目
    1. [117. Populating Next Right Pointers in Each Node II](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii)
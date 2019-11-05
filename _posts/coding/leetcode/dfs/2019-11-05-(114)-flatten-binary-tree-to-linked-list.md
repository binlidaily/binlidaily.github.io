---
layout: post
title: 114. Flatten Binary Tree to Linked List
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, DFS, Medium]
image: 
comments: true
published: true
---

Given a binary tree, flatten it to a linked list in-place.

For example, given the following tree:
```
    1
   / \
  2   5
 / \   \
3   4   6
```
The flattened tree should look like:
```
1
 \
  2
   \
    3
     \
      4
       \
        5
         \
          6
```
## Solutions
### 1. DFS-迭代

```python
# Time Complexity: O(n)
# Space Complexity: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def flatten(self, root: TreeNode) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        if not root:
            return None
        node = root
        stack = [node]
        while stack:
            cur = stack.pop()
            if not cur:
                continue
            if node != cur:
                node.left = None
                node.right = cur
                node = cur
            if cur.right:
                stack.append(cur.right)
            if cur.left:
                stack.append(cur.left)
# Runtime: 36 ms, faster than 96.86% of Python3 online submissions for Flatten Binary Tree to Linked List.
# Memory Usage: 13.8 MB, less than 8.70% of Python3 online submissions for Flatten Binary Tree to Linked List.
```

### 2. DFS-递归

```python
# Time Complexity: O(n)
# Space Complexity: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def __init__(self):
        self.prev = None

    def flatten(self, root):
        if not root:
            return None
        self.flatten(root.right)
        self.flatten(root.left)

        root.right = self.prev
        root.left = None
        self.prev = root
# Runtime: 48 ms, faster than 23.98% of Python3 online submissions for Flatten Binary Tree to Linked List.
# Memory Usage: 13.8 MB, less than 8.70% of Python3 online submissions for Flatten Binary Tree to Linked List.
```

## References
1. [114. Flatten Binary Tree to Linked List]()
---
layout: post
title: 513. Find Bottom Left Tree Value
subtitle:
author: Bin Li
tags: [Coding, LeetCode, BFS]
image: 
comments: true
published: true
---

Given a binary tree, find the leftmost value in the last row of the tree.

Example 1:
```
Input:

    2
   / \
  1   3

Output:
1
```
Example 2:
```
Input:

        1
       / \
      2   3
     /   / \
    4   5   6
       /
      7

Output:
7
```

Note: You may assume the tree (i.e., the given root node) is not NULL.

## Solutions
### 1. 中序遍历
　　主要是想法，中序遍历树，那么最后一层第一个访问到的肯定是要求的结果。

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def inorder(self, root, level):
        if not root:
            return
        self.inorder(root.left, level+1)
        if self.max_depth < level:
            self.res, self.max_depth = root.val, level
        self.inorder(root.right, level+1)
    
    def findBottomLeftValue(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        self.res, self.max_depth = 0, -1
        self.inorder(root, 0)
        return self.res
# Runtime: 44 ms, faster than 12.18% of Python online submissions for Find Bottom Left Tree Value.
# Memory Usage: 16.9 MB, less than 20.00% of Python online submissions for Find Bottom Left Tree Value.
```

### 2. BFS-从右往左遍历
　　BFS 从右往左遍历的话，最后一个结点就是想要的结果。

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def findBottomLeftValue(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        queue = [root]
        while queue:
            node = queue.pop()
            if node.right:
                queue.insert(0, node.right)
            if node.left:
                queue.insert(0, node.left)
        return node.val
# Runtime: 40 ms, faster than 27.18% of Python online submissions for Find Bottom Left Tree Value.
# Memory Usage: 16.2 MB, less than 60.00% of Python online submissions for Find Bottom Left Tree Value.
```

## References
1. [513. Find Bottom Left Tree Value](https://leetcode.com/problems/find-bottom-left-tree-value/)
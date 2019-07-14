---
layout: post
title: 144. Binary Tree Preorder Traversal
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---



Given a binary tree, return the preorder traversal of its nodes' values.

Example:
```
Input: [1,null,2,3]
   1
    \
     2
    /
   3
Output: [1,2,3]
```

## Solutions
　　用一个辅助函数迭代的方式：


```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def _preorderTraversal(self, root, res):
        if root:
            res.append(root.val)
            self._preorderTraversal(root.left, res)
            self._preorderTraversal(root.right, res)
        
    def preorderTraversal(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        res = []
        self._preorderTraversal(root, res)
        return res

# Runtime: 16 ms, faster than 83.31% of Python online submissions for Binary Tree Preorder Traversal.
# Memory Usage: 11.9 MB, less than 9.67% of Python online submissions for Binary Tree Preorder Traversal.
```

　　采用迭代的方式求解：


```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def preorderTraversal(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        stack = []
        res = []
        node = root
        while node or stack:
            if node:
                res.append(node.val)
                stack.append(node.right)
                node = node.left
            else:
                node = stack.pop()
        return res
# Runtime: 20 ms, faster than 61.96% of Python online submissions for Binary Tree Preorder Traversal.
# Memory Usage: 11.7 MB, less than 72.52% of Python online submissions for Binary Tree Preorder Traversal.
```

　　用循环找的方式：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def preorderTraversal(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        stack = []
        res = []
        node = root
        while node or stack:
            while node:
                res.append(node.val)
                stack.append(node)
                node = node.left
            node = stack.pop()
            node = node.right
        return res
# Runtime: 16 ms, faster than 83.31% of Python online submissions for Binary Tree Preorder Traversal.
# Memory Usage: 11.8 MB, less than 54.63% of Python online submissions for Binary Tree Preorder Traversal.
# Next challenges:
```

## References
1. [144. Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/)
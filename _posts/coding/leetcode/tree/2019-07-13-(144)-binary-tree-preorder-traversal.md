---
layout: post
title: 144. Binary Tree Preorder Traversal
subtitle: 先序遍历（Medium）
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
### 1. 递归方法

```python
# Time Complexity: O(logn)
# Space Complexity: O(1)
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

### 2. 迭代

```python
# Time Complextiy: O(logn)
# Space Complexity: O(logn)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def preorderTraversal(self, root: TreeNode) -> List[int]:
        stack = [root]
        res = []
        while stack:
            node = stack.pop()
            if not node:
                continue
            res.append(node.val)
            stack.append(node.right)  # right first push, last pop
            stack.append(node.left)
        return res
# Runtime: 40 ms, faster than 38.84% of Python3 online submissions for Binary Tree Preorder Traversal.
# Memory Usage: 13.9 MB, less than 6.52% of Python3 online submissions for Binary Tree Preorder Traversal.
```

　　迭代就会难一些了，这里不能像一般的 DFS 那样 stack 直接放到 while 后面做条件判断了，这里加上 node。
```python
# Time Complexity: O(logn)
# Space Complexity: O(n)
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
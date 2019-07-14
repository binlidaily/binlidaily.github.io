---
layout: post
title: 94. Binary Tree Inorder Traversal
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---



Given a binary tree, return the inorder traversal of its nodes' values.

Example:
```
Input: [1,null,2,3]
   1
    \
     2
    /
   3

Output: [1,3,2]
Follow up: Recursive solution is trivial, could you do it iteratively?
```

## Solutions
　　用迭代的方式还是比较好解决：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def inorderTraversal(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        res = []
        
        def _inorderTraversal(node):
            if not node:
                return
            _inorderTraversal(node.left)
            res.append(node.val)
            _inorderTraversal(node.right)
        
        _inorderTraversal(root)
        return res
# Runtime: 20 ms, faster than 59.57% of Python online submissions for Binary Tree Inorder Traversal.
# Memory Usage: 11.9 MB, less than 8.96% of Python online submissions for Binary Tree Inorder Traversal.
```

　　不用内部函数，分开写的话：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def _inorderTraversal(self, root, res):
        if root:
            self._inorderTraversal(root.left, res)
            res.append(root.val)
            self._inorderTraversal(root.right, res)

    def inorderTraversal(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        res = []
        self._inorderTraversal(root, res)
        return res
# Runtime: 20 ms, faster than 59.57% of Python online submissions for Binary Tree Inorder Traversal.
# Memory Usage: 11.7 MB, less than 78.62% of Python online submissions for Binary Tree Inorder Traversal.
```

　　之前整理过的不是很好理解的方式跟上述效果一样：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def inorderTraversal(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        stack = []
        node = root
        res = []
        while node is not None or len(stack) > 0:
            if node is not None:
                stack.append(node)
                node = node.left
            else:
                node = stack.pop()
                res.append(node.val)
                node = node.right
        return res
# Runtime: 20 ms, faster than 59.57% of Python online submissions for Binary Tree Inorder Traversal.
# Memory Usage: 11.9 MB, less than 8.96% of Python online submissions for Binary Tree Inorder Traversal.
```

　　找到一种比较好理解的方式：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def inorderTraversal(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        stack = []
        node = root
        res = []
        while node or stack:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            res.append(node.val)
            node = node.right
        return res
# Runtime: 16 ms, faster than 81.93% of Python online submissions for Binary Tree Inorder Traversal.
# Memory Usage: 11.7 MB, less than 80.46% of Python online submissions for Binary Tree Inorder Traversal.
```

　　先一直遍历到左子树的最左边节点，其没有左孩子了，所以保存自己节点的值，然后遍历其右子树。

## References
1. [94. Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)
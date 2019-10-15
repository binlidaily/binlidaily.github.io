---
layout: post
title: 145. Binary Tree Postorder Traversal
subtitle: 后序遍历（Hard）
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given a binary tree, return the postorder traversal of its nodes' values.

Example:
```
Input: [1,null,2,3]
   1
    \
     2
    /
   3

Output: [3,2,1]
```
Follow up: Recursive solution is trivial, could you do it iteratively?

## Solutions
### 1. 递归

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def _postorderTraversal(self, root, res):
        if not root:
            return
        self._postorderTraversal(root.left, res)
        self._postorderTraversal(root.right, res)
        res.append(root.val)
            
    def postorderTraversal(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        res = []
        self._postorderTraversal(root, res)
        return res
# Runtime: 40 ms, faster than 40.80% of Python3 online submissions for Binary Tree Postorder Traversal.
# Memory Usage: 14 MB, less than 5.72% of Python3 online submissions for Binary Tree Postorder Traversal.
```

### 2. 迭代

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def postorderTraversal(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        res = []
        stack = [root]
        while stack:
            node = stack.pop()
            if not node:
                continue
            res.append(node.val)
            stack.append(node.left)
            stack.append(node.right)
        return res[::-1]
# Runtime: 32 ms, faster than 93.36% of Python3 online submissions for Binary Tree Postorder Traversal.
# Memory Usage: 13.8 MB, less than 5.72% of Python3 online submissions for Binary Tree Postorder Traversal.
```


　　使用迭代，其实而已看成反过来的先序，先访问当前结点，然后右子树再左子树，最后将结果逆序返回即可。

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def postorderTraversal(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        res = []
        stack = []
        node = root
        while node or stack:
            while node:
                res.append(node.val)
                stack.append(node)
                node = node.right
            node = stack.pop()
            node = node.left
        return res[::-1]
# Runtime: 16 ms, faster than 83.33% of Python online submissions for Binary Tree Postorder Traversal.
# Memory Usage: 11.7 MB, less than 72.69% of Python online submissions for Binary Tree Postorder Traversal.
```
## References
1. [145. Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/)
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



## References
1. [94. Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)
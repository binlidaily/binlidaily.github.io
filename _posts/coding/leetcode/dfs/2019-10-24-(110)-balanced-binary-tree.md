---
layout: post
title: 110. Balanced Binary Tree
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Tree]
image: 
comments: true
published: true
---

Given a binary tree, determine if it is height-balanced.

For this problem, a height-balanced binary tree is defined as:

a binary tree in which the left and right subtrees of every node differ in height by no more than 1.

 

Example 1:
```
Given the following tree [3,9,20,null,null,15,7]:

    3
   / \
  9  20
    /  \
   15   7
```
Return true.

Example 2:
```
Given the following tree [1,2,2,3,3,null,null,4,4]:

       1
      / \
     2   2
    / \
   3   3
  / \
 4   4
```
Return false.

## Solutions
### 1. 递归

```python
# Time Complexity: O(nlogn)
# Space Complexity: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isBalanced(self, root: TreeNode) -> bool:
        if not root:
            return True
        left_height = self.height(root.left)
        right_height = self.height(root.right)
        return abs(left_height - right_height) <= 1 and self.isBalanced(root.left) and self.isBalanced(root.right)
    
    def height(self, root):
        if not root:
            return 0
        return max(self.height(root.left), self.height(root.right)) + 1
# Runtime: 84 ms, faster than 13.97% of Python3 online submissions for Balanced Binary Tree.
# Memory Usage: 18.7 MB, less than 37.14% of Python3 online submissions for Balanced Binary Tree.
```
### 2. 递归-优化

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
    def isBalanced(self, root: TreeNode) -> bool:
        if not root:
            return True
        self.balanced = True
        self.dfs_height(root)
        return self.balanced
    
    def dfs_height(self, root):
        if not root or not self.balanced:
            return -1
        l = self.dfs_height(root.left)
        r = self.dfs_height(root.right)
        if abs(l-r) > 1:
            self.balanced = False
            return -1
        return max(l, r) + 1
# Runtime: 56 ms, faster than 87.77% of Python3 online submissions for Balanced Binary Tree.
# Memory Usage: 18.6 MB, less than 45.71% of Python3 online submissions for Balanced Binary Tree.
```
## References
1. [110. Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/)
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

## Description
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
# Definition for a binary tree node.
# Time: O(n)
# Space: O(1)
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isBalanced(self, root: TreeNode) -> bool:
        is_flag, height = self._is_balanced(root)
        return True if is_flag else  False
    
    def _is_balanced(self, root):
        # return is_balanced, height
        if not root:
            return True, 0
        
        left_b, left_h = self._is_balanced(root.left)
        right_b, right_h = self._is_balanced(root.right)
        if not left_b or not right_b:
            return False, -1
        else:
            if abs(left_h - right_h) > 1:
                return False, -1
            else:
                return True, max(left_h, right_h) + 1
# 227/227 cases passed (36 ms)
# Your runtime beats 99.66 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (16.4 MB)
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
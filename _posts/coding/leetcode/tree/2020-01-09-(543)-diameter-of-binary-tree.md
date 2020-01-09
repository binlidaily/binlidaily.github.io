---
layout: post
title: 543. Diameter of Binary Tree
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Tree]
image: 
comments: true
published: true
---

## Description

Given a binary tree, you need to compute the length of the diameter of the tree. The diameter of a binary tree is the length of the **longest** path between any two nodes in a tree. This path may or may not pass through the root.

**Example:**
Given a binary tree

```
          1
         / \
        2   3
       / \     
      4   5    
```



Return **3**, which is the length of the path [4,2,1,3] or [5,2,1,3].

**Note:** The length of path between two nodes is represented by the number of edges between them.


## Solutions
### 1. Recursion

```python
# Time: O(n)
# Space: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def diameterOfBinaryTree(self, root: TreeNode) -> int:
        max_path = [0]
        self.find_max_path(root, max_path)
        return max_path[0]
        
    
    def find_max_path(self, root, max_path):
        if not root:
            return 0
        
        left = self.find_max_path(root.left, max_path)
        right = self.find_max_path(root.right, max_path)
        max_path[0] = max(max_path[0], left + right)

        return max(left, right) + 1
# 106/106 cases passed (44 ms)
# Your runtime beats 62.34 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14.4 MB)
```

## References
1. [543. Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)
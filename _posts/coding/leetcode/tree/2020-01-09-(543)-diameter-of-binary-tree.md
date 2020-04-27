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
　　题意是要找到树中两个结点之间最长的距离，可以用递归来做，总的最长距离可以拆成两个部分，左子树最长距离和右子树最长距离，然后为了找最大值，需要一个最大值的变量。

### 1. Recursion
　　值得注意的是返回值的选定和 max_path 的计算。步骤是先找到最大的左右子树高度，然后在高度上加 1 即可。

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
2. [543. Diameter of Binary Tree 解题报告 (C++&Java&Python)](https://blog.csdn.net/fuxuemingzhu/article/details/70338312)
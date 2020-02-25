---
layout: post
title: 617. Merge Two Binary Trees
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Tree]
image: 
comments: true
published: true
---

## Description

Given two binary trees and imagine that when you put one of them to cover the other, some nodes of the two trees are overlapped while the others are not.

You need to merge them into a new binary tree. The merge rule is that if two nodes overlap, then sum node values up as the new value of the merged node. Otherwise, the NOT null node will be used as the node of new tree.

**Example 1:**

```
Input: 
	Tree 1                     Tree 2                  
          1                         2                             
         / \                       / \                            
        3   2                     1   3                        
       /                           \   \                      
      5                             4   7                  
Output: 
Merged tree:
	     3
	    / \
	   4   5
	  / \   \ 
	 5   4   7
```


## Solutions
### 1. Tree

```python
# Time: O(logn)
# Space: O(logn)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def mergeTrees(self, t1: TreeNode, t2: TreeNode) -> TreeNode:
        if t1 and t2:
            root = TreeNode(t1.val + t2.val)
            root.left = self.mergeTrees(t1.left, t2.left)
            root.right = self.mergeTrees(t1.right, t2.right)
            return root
        else:
            return t1 or t2

# 183/183 cases passed (92 ms)
# Your runtime beats 53.67 % of python3 submissions
# Your memory usage beats 82.86 % of python3 submissions (13.6 MB)
```

## References
1. [617. Merge Two Binary Trees](https://leetcode.com/problems/merge-two-binary-trees/description/)
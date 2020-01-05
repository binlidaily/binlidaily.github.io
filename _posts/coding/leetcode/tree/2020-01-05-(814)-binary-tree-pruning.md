---
layout: post
title: 814. Binary Tree Pruning
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Tree]
image: 
comments: true
published: true
---

## Description

We are given the head node `root` of a binary tree, where additionally every node's value is either a 0 or a 1.

Return the same tree where every subtree (of the given tree) not containing a 1 has been removed.

(Recall that the subtree of a node X is X, plus every node that is a descendant of X.)

```
Example 1:
Input: [1,null,0,0,1]
Output: [1,null,0,null,1]
 
Explanation: 
Only the red nodes satisfy the property "every subtree not containing a 1".
The diagram on the right represents the answer.
```
![](/img/media/15782170388730.jpg)
```
Example 2:
Input: [1,0,1,0,0,0,1]
Output: [1,null,1,null,1]
```
![](/img/media/15782170557454.jpg)
```
Example 3:
Input: [1,1,0,1,1,0,1,0]
Output: [1,1,0,1,1,null,1]
```
![](/img/media/15782170647153.jpg)

**Note:**

- The binary tree will have at most `100 nodes`.
- The value of each node will only be `0` or `1`.


## Solutions
### 1. Recursion

```python
# Time: O(logn)
# Space: O(1)
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def pruneTree(self, root: TreeNode) -> TreeNode:
        if not root:
            return None
        if root.left:
            root.left = self.pruneTree(root.left)
        if root.right:
            root.right = self.pruneTree(root.right)
        if not root.left and not root.right and root.val == 0:
            return None
        return root
# 28/28 cases passed (28 ms)
# Your runtime beats 71.93 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```

## References
1. [814. Binary Tree Pruning](https://leetcode.com/problems/binary-tree-pruning/)
---
layout: post
title: 872. Leaf-Similar Trees
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, DFS]
image: 
comments: true
published: true
---

Consider all the leaves of a binary tree.  From left to right order, the values of those leaves form a leaf value sequence.

![](/img/media/15719912227687.jpg)


For example, in the given tree above, the leaf value sequence is (6, 7, 4, 9, 8).

Two binary trees are considered leaf-similar if their leaf value sequence is the same.

Return true if and only if the two given trees with head nodes root1 and root2 are leaf-similar.

 

Note:

* Both of the given trees will have between 1 and 100 nodes.

## Solutions
### 1. DFS
　　每棵树都算一边，果然速度很慢。

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
    def leafSimilar(self, root1: TreeNode, root2: TreeNode) -> bool:
        res1, res2 = [], []
        self.dfs(root1, res1)
        self.dfs(root2, res2)
        return res1 == res2
    
    def dfs(self, root, res):
        if not root:
            return
        if not root.left and not root.right:
            res.append(root.val)
        if root.left:
            self.dfs(root.left, res)
        if root.right:
            self.dfs(root.right, res)
# Runtime: 48 ms, faster than 7.98% of Python3 online submissions for Leaf-Similar Trees.
# Memory Usage: 14.1 MB, less than 5.55% of Python3 online submissions for Leaf-Similar Trees.
```

　　看了下速度较快的解法：

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
    def leafSimilar(self, root1: TreeNode, root2: TreeNode) -> bool:
        return self.getLeaf(root1) == self.getLeaf(root2)
    
    def getLeaf(self, root):
        
        if not root:
            return []
        if not (root.left or root.right):
            return([root.val])
        
        return self.getLeaf(root.left) + self.getLeaf(root.right)
# Runtime: 44 ms, faster than 21.64% of Python3 online submissions for Leaf-Similar Trees.
# Memory Usage: 13.9 MB, less than 5.55% of Python3 online submissions for Leaf-Similar Trees.
```
## References
1. [872. Leaf-Similar Trees](https://leetcode.com/problems/leaf-similar-trees/)
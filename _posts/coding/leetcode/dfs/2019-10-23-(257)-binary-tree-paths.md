---
layout: post
title: 257. Binary Tree Paths
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given a binary tree, return all root-to-leaf paths.

Note: A leaf is a node with no children.

**Example**:
```
Input:

   1
 /   \
2     3
 \
  5

Output: ["1->2->5", "1->3"]

Explanation: All root-to-leaf paths are: 1->2->5, 1->3
```
## Solutions
### 1. DFS-递归

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
    def binaryTreePaths(self, root: TreeNode) -> List[str]:
        if not root:
            return []
        res = []
        self.dfs(root, '', res)
        return res
    
    def dfs(self, root, path, res):
        if not root:
            return
        if path == '':
            path = str(root.val)
        else:
            path += '->' + str(root.val)
        if not root.left and not root.right:
            res.append(path)
        if root.left:
            self.dfs(root.left, path, res)
        if root.right:
            self.dfs(root.right, path, res)
# Runtime: 36 ms, faster than 88.05% of Python3 online submissions for Binary Tree Paths.
# Memory Usage: 13.8 MB, less than 9.52% of Python3 online submissions for Binary Tree Paths.
```

## References
1. [257. Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths/)
---
layout: post
title: 124. Binary Tree Maximum Path Sum
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Tree, Hard]
image: 
comments: true
published: true
---

Given a non-empty binary tree, find the maximum path sum.

For this problem, a path is defined as any sequence of nodes from some starting node to any node in the tree along the parent-child connections. The path must contain at least one node and does not need to go through the root.

Example 1:
```
Input: [1,2,3]

       1
      / \
     2   3

Output: 6
```
Example 2:
```
Input: [-10,9,20,null,null,15,7]

   -10
   / \
  9  20
    /  \
   15   7

Output: 42
```

## Solutions
### 1. DFS-迭代
　　搞清楚思路，迭代实现就可以了。


```python
# Time Complexity: O(n)
# Space Complexity: O(1)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def maxPathSum(self, root: TreeNode) -> int:
        if not root:
            return 0
        res = [float('-inf')]
        self.dfs(root, res)
        return res[0]
    
    def dfs(self, root, res):
        if not root:
            return 0
        left = max(0, self.dfs(root.left, res))
        right = max(0, self.dfs(root.right, res))
        cur_sum = left + right + root.val
        res[0] = max(res[0], cur_sum)
        return max(left, right) + root.val
# Runtime: 88 ms, faster than 98.26% of Python3 online submissions for Binary Tree Maximum Path Sum.
# Memory Usage: 19.5 MB, less than 100.00% of Python3 online submissions for Binary Tree Maximum Path Sum.
```

## References
1. [124. Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/)
2. 相关题目
    1. 687
    2. 543
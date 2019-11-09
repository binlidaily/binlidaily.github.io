---
layout: post
title: 129. Sum Root to Leaf Numbers
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given a binary tree containing digits from 0-9 only, each root-to-leaf path could represent a number.

An example is the root-to-leaf path 1->2->3 which represents the number 123.

Find the total sum of all root-to-leaf numbers.

Note: A leaf is a node with no children.

Example:
```
Input: [1,2,3]
    1
   / \
  2   3
Output: 25
Explanation:
The root-to-leaf path 1->2 represents the number 12.
The root-to-leaf path 1->3 represents the number 13.
Therefore, sum = 12 + 13 = 25.
```
Example 2:
```
Input: [4,9,0,5,1]
    4
   / \
  9   0
 / \
5   1
Output: 1026
Explanation:
The root-to-leaf path 4->9->5 represents the number 495.
The root-to-leaf path 4->9->1 represents the number 491.
The root-to-leaf path 4->0 represents the number 40.
Therefore, sum = 495 + 491 + 40 = 1026.
```

## Solutions
### 1. DFS-递归
　　先序遍历即可。
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
    def sumNumbers(self, root: TreeNode) -> int:
        if not root:
            return 0
        res = [0]
        self.dfs(root, '', res)
        return res[0]
    
    def dfs(self, root, strs, res):
        if not root:
            return 
        new_strs = strs+str(root.val)
        if not root.left and not root.right:
            res[0] += int(new_strs)
        self.dfs(root.left, new_strs, res)
        self.dfs(root.right, new_strs, res)
# Runtime: 28 ms, faster than 99.62% of Python3 online submissions for Sum Root to Leaf Numbers.
# Memory Usage: 12.9 MB, less than 100.00% of Python3 online submissions for Sum Root to Leaf Numbers.
```

## References
1. [129. Sum Root to Leaf Numbers](https://leetcode.com/problems/sum-root-to-leaf-numbers/)
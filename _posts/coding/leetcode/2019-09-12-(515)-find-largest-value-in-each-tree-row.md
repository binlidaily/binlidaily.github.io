---
layout: post
title: 513. Find Bottom Left Tree Value
subtitle:
author: Bin Li
tags: [Coding, LeetCode, BFS]
image: 
comments: true
published: true
---

You need to find the largest value in each row of a binary tree.

Example:
```
Input: 

          1
         / \
        3   2
       / \   \  
      5   3   9 

Output: [1, 3, 9]
```

## Solutions
### 1. BFS-两个指针的方式

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def largestValues(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        if not root:
            return []
        queue = [root]
        last = n_last = root
        res = []
        level_max = float('-inf')
        while queue:
            node = queue.pop()
            if node.val > level_max:
                level_max = node.val
            if node.left:
                queue.insert(0, node.left)
                n_last = node.left
            if node.right:
                queue.insert(0, node.right)
                n_last = node.right
            if node == last:
                last = n_last
                res.append(level_max)
                level_max = float('-inf')
        return res
# Runtime: 36 ms, faster than 75.28% of Python online submissions for Find Largest Value in Each Tree Row.
# Memory Usage: 16.2 MB, less than 33.33% of Python online submissions for Find Largest Value in Each Tree Row.
```

### 2. BFS-中序遍历

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def largestValues(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        if not root:
            return []
        res = []
        self.inorder(root, 0, res)
        return res
    def inorder(self, root, level, res):
        if not root:
            return
        if len(res) <= level:
            res.append(float('-inf'))
        self.inorder(root.left, level+1, res)
        if res[level] < root.val:
            res[level] = root.val
        self.inorder(root.right, level+1, res)

# Runtime: 40 ms, faster than 49.08% of Python online submissions for Find Largest Value in Each Tree Row.
# Memory Usage: 16.7 MB, less than 33.33% of Python online submissions for Find Largest Value in Each Tree Row.
```

## References
1. [515. Find Largest Value in Each Tree Row](https://leetcode.com/problems/find-largest-value-in-each-tree-row/)
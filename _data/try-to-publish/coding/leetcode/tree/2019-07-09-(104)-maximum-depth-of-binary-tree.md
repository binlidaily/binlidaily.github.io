---
layout: post
title: 104. Maximum Depth of Binary Tree
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Tree]
image: 
comments: true
published: true
---

## Description

Given a binary tree, find its maximum depth.

The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

**Note:** A leaf is a node with no children.

**Example:**

Given binary tree `[3,9,20,null,null,15,7]`,

```
    3
   / \
  9  20
    /  \
   15   7
```

return its depth = 3.


## Solutions
### 1. 分层遍历
　　刚好想到最近在看的二叉树分层打印，于是写了如下的解决办法：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def maxDepth(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        
        if not root:
            return 0
        cnt = 0
        queue = [root]
        last = next_last = root
        while queue:
            node = queue.pop()
            if node.left:
                queue.insert(0, node.left)
                next_last = node.left
            if node.right:
                queue.insert(0, node.right)
                next_last = node.right
            if last == node:
                cnt += 1
                last = next_last
        return cnt
# Runtime: 24 ms, faster than 96.15% of Python online submissions for Maximum Depth of Binary Tree.
# Memory Usage: 14.2 MB, less than 99.43% of Python online submissions for Maximum Depth of Binary Tree.
```

### 2. 递归
　　更好的方法是递归？但是时间不是很高，可能调用函数花了比较多的时间。

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def maxDepth(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        
        if not root:
            return 0
        
        def dfs(node):
            if not node:
                return
            l = r = 1
            if node.left:
                l = dfs(node.left) + 1
            if node.right:
                r = dfs(node.right) + 1
            return max(l, r)
        return dfs(root)
# Runtime: 32 ms, faster than 69.54% of Python online submissions for Maximum Depth of Binary Tree.Memory # Usage: 15.2 MB, less than 5.19% of Python online submissions for Maximum Depth of Binary Tree.
```

## References
1. [104. Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
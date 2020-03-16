---
layout: post
title: 226. Invert Binary Tree
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Tree]
image: 
comments: true
published: true
---

## Description

Invert a binary tree.

**Example:**

Input:

```
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```

Output:

```
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```

**Trivia:**
This problem was inspired by [this original tweet](https://twitter.com/mxcl/status/608682016205344768) by [Max Howell](https://twitter.com/mxcl):

> Google: 90% of our engineers use the software you wrote (Homebrew), but you can’t invert a binary tree on a whiteboard so f*** off.


## Solutions
　　将二叉树翻转得到镜像结果。

### 1. DFS-Recursion

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
# DFS-Recursion
class Solution:
    def invertTree(self, root: TreeNode) -> TreeNode:
        if not root:
            return None
        left, right = root.left, root.right

        root.right = self.invertTree(left)
        root.left = self.invertTree(right)
        return root

# 68/68 cases passed (28 ms)
# Your runtime beats 67.8 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```

　　或者：

```python
class Solution:
    def invertTree(self, root: TreeNode) -> TreeNode:
        if not root:
            return None
        root.right, root.left = root.left, root.right

        self.invertTree(root.left)
        self.invertTree(root.right)
        return root
# 68/68 cases passed (28 ms)
# Your runtime beats 67.73 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

　　更简洁版：


```python
class Solution:
    def invertTree(self, root: TreeNode) -> TreeNode:
        if not root:
            return None
        root.right, root.left = self.invertTree(root.left), self.invertTree(root.right)
        return root

# 68/68 cases passed (24 ms)
# Your runtime beats 89.08 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

### 2. DFS-Iterative

```python
class Solution:
    def invertTree(self, root: TreeNode) -> TreeNode:
        if not root:
            return None
        stack = [root]
        while stack:
            node = stack.pop()
            node.right, node.left = node.left, node.right
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
        return root

# 68/68 cases passed (20 ms)
# Your runtime beats 97.49 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.6 MB)
```

### 3. BFS-Iterative

```python
# BFS-Recursion
import collections
class Solution:
    def invertTree(self, root: TreeNode) -> TreeNode:
        if not root:
            return None
        queue = collections.deque()
        queue.append(root)
        while queue:
            node = queue.popleft()
            node.right, node.left = node.left, node.right
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        return root

# 68/68 cases passed (24 ms)
# Your runtime beats 89.08 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [226. Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/description/)
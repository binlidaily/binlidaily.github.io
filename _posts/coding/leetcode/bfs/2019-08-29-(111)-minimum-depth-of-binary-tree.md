---
layout: post
title: 111. Minimum Depth of Binary Tree
subtitle:
author: Bin Li
tags: [Coding, LeetCode, BFS, DFS]
image: 
comments: true
published: true
---

Given a binary tree, find its minimum depth.

The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.

Note: A leaf is a node with no children.

Example:

Given binary tree `[3,9,20,null,null,15,7]`,
```python
    3
   / \
  9  20
    /  \
   15   7
```
return its minimum depth = 2.

## Solutions
### 1. DFS 递归

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def minDepth(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        if not root:
            return 0
        if not root.left and not root.right:
            return 1
        l = self.minDepth(root.left)
        r = self.minDepth(root.right)
        if not root.left:
            return 1 + r
        if not root.right:
            return 1 + l
        return 1 + min(l, r)
# Runtime: 32 ms, faster than 73.08% of Python online submissions for Minimum Depth of Binary Tree.
# Memory Usage: 14.7 MB, less than 66.67% of Python online submissions for Minimum Depth of Binary Tree.
```

### 2. BFS 迭代

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def minDepth(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        if not root:
            return 0
        res = float('inf')
        queue = [root]
        nxt_last = last = root
        level = 1
        while queue:
            node = queue.pop()
            if not node.left and not node.right:
                if level <= res:
                    return level
            if node.left:
                queue.insert(0, node.left)
                nxt_last = node.left
            if node.right:
                queue.insert(0, node.right)
                nxt_last = node.right
            if node == last:
                last = nxt_last
                level += 1
# Runtime: 32 ms, faster than 73.08% of Python online submissions for Minimum Depth of Binary Tree.
# Memory Usage: 14.5 MB, less than 92.31% of Python online submissions for Minimum Depth of Binary Tree.
```

### 3. BFS 递归

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def minDepth(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        if not root:
            return 0
        self.res = float('inf')
        self.bfs(root, 0, [])
        return self.res
    def bfs(self, root, level, lis):
        if not root:
            return
        if not root.left and not root.right:
            if self.res > level + 1:
                self.res = level + 1
        if level >= len(lis):
            sub_lis = [root.val]
            lis.append(sub_lis)
        else:
            lis[level].append(root)
        self.bfs(root.left, level + 1, lis)
        self.bfs(root.right, level + 1, lis)
# Runtime: 36 ms, faster than 45.93% of Python online submissions for Minimum Depth of Binary Tree.
# Memory Usage: 14.6 MB, less than 79.49% of Python online submissions for Minimum Depth of Binary Tree.
```
## References
1. [111. Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree/)
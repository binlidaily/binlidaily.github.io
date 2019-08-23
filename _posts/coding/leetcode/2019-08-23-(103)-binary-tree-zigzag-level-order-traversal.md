---
layout: post
title: 103. Binary Tree Zigzag Level Order Traversal
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, BFS]
image: 
comments: true
published: true
---
Given a binary tree, return the zigzag level order traversal of its nodes' values. (ie, from left to right, then right to left for the next level and alternate between).

For example:
Given binary tree `[3,9,20,null,null,15,7]`,
```
    3
   / \
  9  20
    /  \
   15   7
```

return its zigzag level order traversal as:
```
[
  [3],
  [20,9],
  [15,7]
]
```

## Solutions
　　对之字操作放在最后的解法，就是广度优先遍历：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def zigzagLevelOrder(self, root):
        """
        :type root: TreeNode
        :rtype: List[List[int]]
        """
        if not root:
            return []
        res = []
        queue = collections.deque([(root, 0)])
        while queue:
            node, level = queue.popleft()
            if node:
                if level == len(res):
                    res.append([])
                res[level].append(node.val)
                queue.append((node.left, level + 1))
                queue.append((node.right, level + 1))
        for i in range(len(res)):
            if i & 1 == 1:
                res[i] = res[i][::-1]
        return res
# Runtime: 20 ms, faster than 64.51% of Python online submissions for Binary Tree Zigzag Level Order Traversal.
# Memory Usage: 12.2 MB, less than 26.19% of Python online submissions for Binary Tree Zigzag Level Order Traversal.
```

　　改得更加简洁，但是发现不用 collections 的 deque 反而更慢了：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def zigzagLevelOrder(self, root):
        """
        :type root: TreeNode
        :rtype: List[List[int]]
        """
        if not root:
            return []
        res = []
        queue = [(root, 0)]
        while queue:
            node, level = queue.pop()
            if node:
                if level == len(res):
                    res.append([])
                if level & 1 == 0:
                    res[level].insert(0, node.val)
                else:
                    res[level].append(node.val)
                queue.append((node.left, level + 1))
                queue.append((node.right, level + 1))
        return res
# Runtime: 24 ms, faster than 32.47% of Python online submissions for Binary Tree Zigzag Level Order Traversal.
# Memory Usage: 12 MB, less than 92.86% of Python online submissions for Binary Tree Zigzag Level Order Traversal.
```

## References
1. [103. Binary Tree Zigzag Level Order Traversal](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)
---
layout: post
title: 107. Binary Tree Level Order Traversal II
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, BFS, Easy]
image: 
comments: true
published: true
---

## Description

Given a binary tree, return the *bottom-up level order* traversal of its nodes' values. (ie, from left to right, level by level from leaf to root).

For example:
Given binary tree `[3,9,20,null,null,15,7]`,

```
    3
   / \
  9  20
    /  \
   15   7
```



return its bottom-up level order traversal as:

```
[
  [15,7],
  [9,20],
  [3]
]
```

## Solutions
　　先用 BFS 遍历，然后反着输出就行。

### 1. BFS
　　使用两个指针的方式判断什么时候换行，效果不是很好：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def levelOrderBottom(self, root):
        """
        :type root: TreeNode
        :rtype: List[List[int]]
        """
        if not root:
            return []
        res = []
        queue = [root]
        last = nxt_last = root
        level = []
        while queue:
            node = queue.pop()
            level.append(node.val)
            if node.left:
                queue.insert(0, node.left)
                # level.append(node.left.val)
                nxt_last = node.left
            if node.right:
                queue.insert(0, node.right)
                # level.append(node.right.val)
                nxt_last = node.right
            if node == last:
                last = nxt_last
                res.append(level)
                level = []
            
        return res[::-1]
# Runtime: 32 ms, faster than 7.82% of Python online submissions for Binary Tree Level Order Traversal II.
# Memory Usage: 12.3 MB, less than 56.52% of Python online submissions for Binary Tree Level Order Traversal II.
```

　　这里比较慢的原因是在每一轮都用上了 insert 时间复杂度为 $O(N)$ 的操作，所以总体复杂度是 $O(N)$，那么可以用 python 的容器类来实现 queue 的操作，并采用常用的 BFS 方式：


```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def levelOrderBottom(self, root):
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
        return res[::-1]
            
# Runtime: 20 ms, faster than 81.64% of Python online submissions for Binary Tree Level Order Traversal II.
# Memory Usage: 12.2 MB, less than 78.26% of Python online submissions for Binary Tree Level Order Traversal II.
```


## References
1. [107. Binary Tree Level Order Traversal II](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/)
2. [Python solutions (dfs recursively, dfs+stack, bfs+queue).](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/discuss/34978/Python-solutions-(dfs-recursively-dfs%2Bstack-bfs%2Bqueue).)
---
layout: post
title: 102. Binary Tree Level Order Traversal
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Tree]
image: 
comments: true
published: true
---

## Description

Given a binary tree, return the level order traversal of its nodes' values. (ie, from left to right, level by level).

For example:
Given binary tree `[3,9,20,null,null,15,7]`,
```
    3
   / \
  9  20
    /  \
   15   7
```
return its level order traversal as:
```
[
  [3],
  [9,20],
  [15,7]
]
```

## Solutions
### 1. 迭代-双指针
　　采用两个指针，一个指向当前行的最右结点，一个指向下一行的最右结点，当前结点遍历到当前航最右结点时就需要换行，当前行最右结点更新为下一行的最右结点；而下一行最右结点只需要与入队列的节点同步即可，因为入队列的节点肯定是当前遍历的下一行最右的节点。直到队列为空，即没有结点可供遍历了。

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def levelOrder(self, root):
        """
        :type root: TreeNode
        :rtype: List[List[int]]
        """
        if not root:
            return []
        res = []
        queue = [root]
        cur_right = nxt_right = root
        tmp = []
        
        while queue:
            node = queue.pop()
            tmp.append(node.val)
            if node.left:
                queue.insert(0, node.left)
                nxt_right = node.left
            if node.right:
                queue.insert(0, node.right)
                nxt_right = node.right
            if cur_right == node:
                cur_right = nxt_right
                res.append(tmp)
                tmp = []
        return res
# Runtime: 16 ms, faster than 95.42% of Python online submissions for Binary Tree Level Order Traversal.
# Memory Usage: 12.2 MB, less than 76.64% of Python online submissions for Binary Tree Level Order Traversal.
```

### 2. 迭代-size

```python
import collections
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def levelOrder(self, root: TreeNode) -> List[List[int]]:
        if not root:
            return []
        res = []
        queue = collections.deque()
        queue.append(root)
        while queue:
            size = len(queue)
            level_nodes = []
            for _ in range(size):
                node = queue.popleft()
                if not node:
                    continue
                level_nodes.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            res.append(level_nodes)
        return res
```


### 3. BFS 递归方法

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def levelOrder(self, root):
        """
        :type root: TreeNode
        :rtype: List[List[int]]
        """
        if not root:
            return []
        res = []
        self.bfs(root, 0, res)
        return res
    def bfs(self, root, level, lis):
        if not root:
            return
        # 如果 level 遍历到下一层就要补充一个新的列表保存下一层的结点
        if level >= len(lis):
            sub_lis = [root.val]
            lis.append(sub_lis)
        else:
            lis[level].append(root.val)
        self.bfs(root.left, level + 1, lis)
        self.bfs(root.right, level + 1, lis)
# Runtime: 8 ms, faster than 99.95% of Python online submissions for Binary Tree Level Order Traversal.
# Memory Usage: 12.6 MB, less than 11.76% of Python online submissions for Binary Tree Level Order Traversal.
```

## References
1. [102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
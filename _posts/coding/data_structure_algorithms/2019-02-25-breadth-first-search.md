---
layout: post
title: Breadth-First Search
subtitle:
author: Bin Li
tags: [Data Structures]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　深度优先遍历 / 搜索（Breadth-First Search/Traversal）是树结构中常见的操作，有着广泛的用处，这里对不同的实现方式做了分别介绍。

## 迭代方式实现

　　这里针对两种输出方式做了具体讨论，输出为一维数组：
```python
def breadth_first_search(self, root):
	"""
	return a list such as: [6, 4, 8, 3, 5, 7, 9]
	"""
	if root is None:
		return []
	queue = [root]
	res = []
	while queue:
		node = queue.pop(0)
		res.append(node.val)
		if node.left is not None:
			queue.append(node.left)
		if node.right is not None:
			queue.append(node.right)

	return res
```

输出为二维数组：
```python
def breadth_first_search_level(self, root):
	if root is None:
		return []
	queue = [root]
	res = []
	while queue:
		level = []
		size = len(queue)
		for i in range(size):
			node = queue.pop(0)
			level.append(node.val)
			if node.left is not None:
				queue.append(node.left)
			if node.right is not None:
				queue.append(node.right)
		res.append(level)
	return res
```

## 递归方式实现
　　这里所谓的 BFS 递归形式，其实是利用 DFS 的递归形式，在递归过程中记录每个结点的 level，然后将属于一个 level 的结点对应放到 list 中。

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
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

　　深度优先遍历/搜索（Breadth-First Search/Traversal）是树结构中常见的操作，有着广泛的用处，这里针对两种输出方式做了具体讨论。

输出为一维数组：
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
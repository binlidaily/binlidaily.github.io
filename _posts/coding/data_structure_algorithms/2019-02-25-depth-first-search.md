---
layout: post
title: Depth-First Search
subtitle:
author: Bin Li
tags: [Data Structures]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　深度优先遍历/搜索（Depth-First Search/Traversal）是树结构中常见的操作，有着广泛的用处，有两种主要的解决办法，递归和迭代。针对节点访问次序的不同，又可以分为先序、中序和后序遍历。

递归方式：
```python
def pre_order(self, node):
	if node is None:
		return
	print(node.val, end=' ')
	self.pre_order(node.left)
	self.pre_order(node.right)

def in_order(self, node):
	if node is None:
		return
	self.in_order(node.left)
	print(node.val, end=' ')
	self.in_order(node.right)

def post_order(self, node):
	if node is None:
		return
	self.post_order(node.left)
	self.post_order(node.right)
	print(node.val, end=' ')
```

迭代方式:
```python
def pre_order_stack(self, root):
	stack = []
	node = root
	res = []

	while node is not None or len(stack) > 0:
		if node is not None:
			res.append(node.val)
			stack.append(node)
			node = node.left
		else:
			node = stack.pop()
			node = node.right
	return res

def in_order_stack(self, root):
	stack = []
	node = root
	res = []
	while node is not None or len(stack) > 0:
		if node is not None:
			stack.append(node)
			node = node.left
		else:
			node = stack.pop()
			res.append(node.val)
			node = node.right
	return res

def in_order_func(self, root):
    if pRoot is None:
            return None
        res = []

        def inorder(pRoot):
            if pRoot is None:
                return
            inorder(pRoot.left)
            res.append(pRoot)
            inorder(pRoot.right)
        
        inorder(root)
        return res

def post_order_stack(self, root):
	stack = []
	node = root
	res = []
	while node is not None or len(stack) > 0:
		if node is not None:
			res.append(node.val)
			stack.append(node)
			node = node.right
		else:
			node = stack.pop()
			node = node.left
			
	return res[::-1]
```

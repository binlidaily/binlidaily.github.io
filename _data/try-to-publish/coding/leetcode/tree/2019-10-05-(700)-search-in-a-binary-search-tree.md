---
layout: post
title: 700. Search in a Binary Search Tree
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given the root node of a binary search tree (BST) and a value. You need to find the node in the BST that the node's value equals the given value. Return the subtree rooted with that node. If such node doesn't exist, you should return NULL.

For example, 
```
Given the tree:
        4
       / \
      2   7
     / \
    1   3

And the value to search: 2
```
You should return this subtree:
```
      2     
     / \   
    1   3
```
In the example above, if we want to search the value 5, since there is no node with value 5, we should return NULL.

Note that an empty tree is represented by NULL, therefore you would see the expected output (serialized tree format) as [], not null.

## Solutions
### 1. BFS-搜索
　　第一印象用的是 BFS，还把结果存下来了，导致空间复杂度贼大……

```python
# Time Complexity: O(logN)
# Space Complexity: O(N)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def searchBST(self, root: TreeNode, val: int) -> TreeNode:
        if not root:
            return []
        queue = collections.deque()
        queue.append(root)
        while queue:
            node = queue.popleft()
            if node.val == val:
                return node
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        return None
# Runtime: 80 ms, faster than 88.68% of Python3 online submissions for Search in a Binary Search Tree.
# Memory Usage: 15.7 MB, less than 9.09% of Python3 online submissions for Search in a Binary Search Tree.
```

　　可以通过判断大小来剩下很多空间啊……
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def searchBST(self, root: TreeNode, val: int) -> TreeNode:
        if not root:
            return []
        cur = root
        while cur:
            if cur.val == val:
                return cur
            elif cur.val < val:
                cur = cur.right
            else:
                cur = cur.left
        return None
# Runtime: 84 ms, faster than 67.84% of Python3 online submissions for Search in a Binary Search Tree.
# Memory Usage: 15.6 MB, less than 9.09% of Python3 online submissions for Search in a Binary Search Tree.
```

## References
1. [700. Search in a Binary Search Tree](https://leetcode.com/problems/search-in-a-binary-search-tree/)
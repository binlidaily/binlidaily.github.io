---
layout: post
title: 222. Count Complete Tree Nodes
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Tree]
image: 
comments: true
published: true
---

## Description

Given a **complete** binary tree, count the number of nodes.

**Note:**

**Definition of a complete binary tree from [Wikipedia](http://en.wikipedia.org/wiki/Binary_tree#Types_of_binary_trees):**
In a complete binary tree every level, except possibly the last, is completely filled, and all nodes in the last level are as far left as possible. It can have between 1 and 2h nodes inclusive at the last level h.

**Example:**

```
Input: 
    1
   / \
  2   3
 / \  /
4  5 6

Output: 6
```


## Solutions
### 1. BFS

```python
# Time: O(nlogn)
# Space: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def countNodes(self, root: TreeNode) -> int:
        if not root:
            return 0
        queue = collections.deque()
        queue.append(root)
        cnt = 0
        while queue:
            size = len(queue)
            cnt += size
            for _ in range(size):
                node = queue.popleft()
                if not node:
                    continue
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        return cnt
                
# 18/18 cases passed (92 ms)
# Your runtime beats 39.51 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (20 MB)
```

### 2. Recursion

```python
# Time: O(nlogn)
# Space: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def countNodes(self, root: TreeNode) -> int:
        if not root:
            return 0
        left, right = root, root
        height = 0
        while right:
            left = left.left
            right = right.right
            height += 1
        if not left:
            return (1 << height) - 1
        return 1 + self.countNodes(root.left) + self.countNodes(root.right)
# 18/18 cases passed (68 ms)
# Your runtime beats 97.54 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (20 MB)
```

## References
1. [222. Count Complete Tree Nodes](https://leetcode.com/problems/count-complete-tree-nodes/)
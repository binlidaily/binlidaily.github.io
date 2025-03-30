---
layout: post
title: 993. Cousins in Binary Tree
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

In a binary tree, the root node is at depth 0, and children of each depth k node are at depth k+1.

Two nodes of a binary tree are cousins if they have the same depth, but have different parents.

We are given the root of a binary tree with unique values, and the values x and y of two different nodes in the tree.

Return true if and only if the nodes corresponding to the values x and y are cousins.


Example 1:
![](/img/media/15692945742550.jpg)

```
Input: root = [1,2,3,4], x = 4, y = 3
Output: false
```
Example 2:
![](/img/media/15692945795436.jpg)

```
Input: root = [1,2,3,null,4,null,5], x = 5, y = 4
Output: true
```
Example 3:
![](/img/media/15692945856479.jpg)

```
Input: root = [1,2,3,null,4], x = 2, y = 3
Output: false
```

Note:

1. The number of nodes in the tree will be between 2 and 100.
2. Each node has a unique integer value from 1 to 100.

## Solutions
### 1. BFS-两个指针
　　先判断是否是同一个父节点，然后再判断是否在同一行。
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isCousins(self, root: TreeNode, x: int, y: int) -> bool:
        if not root:
            return root
        queue = collections.deque([root])
        level = set()
        last = n_last = root
        while any(queue):
            node = queue.popleft()
            same_father = set()
            if node.left:
                level.add(node.left.val)
                queue.append(node.left)
                n_last = node.left
                same_father.add(node.left.val)
            if node.right:
                level.add(node.right.val)
                queue.append(node.right)
                n_last = node.right
                same_father.add(node.right.val)
            if x in same_father and y in same_father:
                return False
            if node == last:
                last = n_last
                if x in level and y in level:
                    return True
                level = set()
        return False
# Runtime: 36 ms, faster than 86.08% of Python3 online submissions for Cousins in Binary Tree.
# Memory Usage: 13.8 MB, less than 6.12% of Python3 online submissions for Cousins in Binary Tree.
```

### 2. DFS-先序遍历
　　最直白的方法就是把每个节点的父节点和高度都求出来，然后判断 x 和 y 这两个节点是不是符合要求即可。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isCousins(self, root: TreeNode, x: int, y: int) -> bool:
        self.info = collections.defaultdict(tuple)
        self.dfs_preorder(root, None, 0)
        px, dx = self.info[x]
        py, dy = self.info[y]
        return dx == dy and px != py
    
    def dfs_preorder(self, root, parent, depth):
        if not root:
            return
        self.info[root.val] = (parent, depth)
        self.dfs_preorder(root.left, root, depth+1)
        self.dfs_preorder(root.right, root, depth+1)
# Runtime: 44 ms, faster than 20.97% of Python3 online submissions for Cousins in Binary Tree.
# Memory Usage: 13.9 MB, less than 6.12% of Python3 online submissions for Cousins in Binary Tree.
```

### 3. BFS
　　queue 里存当前的 node 和父节点。
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isCousins(self, root: TreeNode, x: int, y: int) -> bool:
        if not root:
            return root
        queue = collections.deque()
        info = collections.defaultdict(tuple)
        depth = 0
        # (Node, Parent)
        queue.append((root, None))
        
        while any(queue):
            size = len(queue)
            for i in range(size):
                node, p = queue.popleft()
                if not node:
                    continue
                info[node.val] = (p, depth)
                queue.append((node.left, node))
                queue.append((node.right, node))
            depth += 1
        px, dx = info[x]
        py, dy = info[y]
        return px != py and dx == dy
# Runtime: 36 ms, faster than 86.28% of Python3 online submissions for Cousins in Binary Tree.
# Memory Usage: 13.8 MB, less than 6.12% of Python3 online submissions for Cousins in Binary Tree.
```
## References
1. [993. Cousins in Binary Tree](https://leetcode.com/problems/cousins-in-binary-tree/)
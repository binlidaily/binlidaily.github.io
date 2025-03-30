---
layout: post
title: 559. Maximum Depth of N-ary Tree
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, DFS, BFS]
image: 
comments: true
published: true
---

Given a n-ary tree, find its maximum depth.

The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

For example, given a 3-ary tree:

![](/img/media/15692081958251.jpg){:.center-image}

We should return its max depth, which is 3.


Note:

1. The depth of the tree is at most 1000.
2. The total number of nodes is at most 5000.

## Solutions
### 1. BFS-迭代方法

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val, children):
        self.val = val
        self.children = children
"""
class Solution:
    def maxDepth(self, root: 'Node') -> int:
        if not root:
            return 0
        level = 0
        queue = collections.deque([root])
        last = n_last = root
        while any(queue):
            node = queue.popleft()
            for child in node.children:
                if not child:
                    continue
                queue.append(child)
                n_last = child
            if last == node:
                level += 1
                last = n_last
        return level
# Runtime: 648 ms, faster than 70.53% of Python3 online submissions for Maximum Depth of N-ary Tree.
# Memory Usage: 95 MB, less than 8.33% of Python3 online submissions for Maximum Depth of N-ary Tree.
```

## 2. BFS-递归方法
　　注意起始为 1：

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val, children):
        self.val = val
        self.children = children
"""
class Solution:
    def maxDepth(self, root: 'Node') -> int:
        if not root:
            return 0
        return self.bfs(root, 1)
    
    def bfs(self, root, level):
        if not root:
            return level
        lis = []
        for child in root.children:
            lis.append(self.bfs(child, level+1))
        if not any(lis):
            return level
        return max(lis)
# Runtime: 636 ms, faster than 89.96% of Python3 online submissions for Maximum Depth of N-ary Tree.
# Memory Usage: 95.1 MB, less than 8.33% of Python3 online submissions for Maximum Depth of N-ary Tree.
```

## References
1. [559. Maximum Depth of N-ary Tree](https://leetcode.com/problems/maximum-depth-of-n-ary-tree/)
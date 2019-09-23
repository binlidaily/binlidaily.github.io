---
layout: post
title: 429. N-ary Tree Level Order Traversal
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, DFS, BFS]
image: 
comments: true
published: true
---

Given an n-ary tree, return the level order traversal of its nodes' values. (ie, from left to right, level by level).

For example, given a 3-ary tree:

![](/img/media/15692035137375.jpg){:.center-image}
 



 

We should return its level order traversal:
```
[
     [1],
     [3,2,4],
     [5,6]
]
```

Note:

1. The depth of the tree is at most 1000.
2. The total number of nodes is at most 5000.

## Solutions
### 1. 迭代方法
　　用两种指针的方式，自己写了下，发现好想不是很优雅，很多 if，而且速度也很慢：
```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val, children):
        self.val = val
        self.children = children
"""
class Solution:
    def levelOrder(self, root: 'Node') -> List[List[int]]:
        if not root:
            return root
        res = [[root.val]]
        queue = collections.deque([root])
        last = nxt_last = root
        level = []
        while queue:
            node = queue.popleft()
            for child in node.children:
                if not node.children:
                    continue
                level.append(child.val)
                queue.append(child)
                nxt_last = child
            if node == last:
                last = nxt_last
                if level:
                    res.append(level)
                level = []
        return res
# Runtime: 772 ms, faster than 5.09% of Python3 online submissions for N-ary Tree Level Order Traversal.
# Memory Usage: 95.3 MB, less than 8.33% of Python3 online submissions for N-ary Tree Level Order Traversal.
```

### 3. 递归方法
　　实现了一下递归方法，发现也很慢：
```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val, children):
        self.val = val
        self.children = children
"""
class Solution:
    def levelOrder(self, root: 'Node') -> List[List[int]]:
        if not root:
            return root
        res = []
        self.bfs(root, 0, res)
        return res

    def bfs(self, root, level, res):
        if not root:
            return
        if len(res) <= level:
            res.append([])
        res[level].append(root.val)
        for child in root.children:
            self.bfs(child, level+1, res)
# Runtime: 692 ms, faster than 19.06% of Python3 online submissions for N-ary Tree Level Order Traversal.
# Memory Usage: 95.3 MB, less than 8.33% of Python3 online submissions for N-ary Tree Level Order Traversal.
```

## References
1. [429. N-ary Tree Level Order Traversal](https://leetcode.com/problems/n-ary-tree-level-order-traversal/submissions/)

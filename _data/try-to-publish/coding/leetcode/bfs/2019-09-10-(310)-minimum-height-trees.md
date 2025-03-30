---
layout: post
title: 310. Minimum Height Trees
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, BFS]
image: 
comments: true
published: true
---

## Description

For an undirected graph with tree characteristics, we can choose any node as the root. The result graph is then a rooted tree. Among all possible rooted trees, those with minimum height are called minimum height trees (MHTs). Given such a graph, write a function to find all the MHTs and return a list of their root labels.

**Format**
The graph contains `n` nodes which are labeled from `0` to `n - 1`. You will be given the number `n` and a list of undirected `edges` (each edge is a pair of labels).

You can assume that no duplicate edges will appear in `edges`. Since all edges are undirected, `[0, 1]` is the same as `[1, 0]` and thus will not appear together in `edges`.

**Example 1 :**

```
Input: n = 4, edges = [[1, 0], [1, 2], [1, 3]]

        0
        |
        1
       / \
      2   3 

Output: [1]
```

**Example 2 :**

```
Input: n = 6, edges = [[0, 3], [1, 3], [2, 3], [4, 3], [5, 4]]

     0  1  2
      \ | /
        3
        |
        4
        |
        5 

Output: [3, 4]
```

**Note**:

- According to the [definition of tree on Wikipedia](https://en.wikipedia.org/wiki/Tree_(graph_theory)): “a tree is an undirected graph in which any two vertices are connected by *exactly* one path. In other words, any connected graph without simple cycles is a tree.”
- The height of a rooted tree is the number of edges on the longest downward path between the root and a leaf.

## Solutions
### BFS
　　采用层层剥茧的方式进行求解：

```python
class Solution(object):
    def findMinHeightTrees(self, n, edges):
        """
        :type n: int
        :type edges: List[List[int]]
        :rtype: List[int]
        """
        if n == 1:
            return [0]
        leaves = collections.defaultdict(set)
        for u, v in edges:
            leaves[u].add(v)
            leaves[v].add(u)
        que = collections.deque()
        for u, vs in leaves.items():
            if len(vs) == 1:
                que.append(u)
        
        while n > 2:
            _len = len(que)
            n -= _len
            for _ in range(_len):
                u = que.popleft()
                for v in leaves[u]:
                    leaves[v].remove(u)
                    if len(leaves[v]) == 1:
                        que.append(v)
        return list(que)
# Runtime: 216 ms, faster than 70.15% of Python online submissions for Minimum Height Trees.
# Memory Usage: 18.4 MB, less than 33.33% of Python online submissions for Minimum Height Trees.
```

## References
1. [310. Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/)
2. [310. Minimum Height Trees](https://blog.csdn.net/fuxuemingzhu/article/details/83548874)
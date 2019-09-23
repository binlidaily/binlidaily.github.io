---
layout: post
title: 785. Is Graph Bipartite?
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, DFS, BFS]
image: 
comments: true
published: true
---

Given an undirected graph, return true if and only if it is bipartite.

Recall that a graph is bipartite if we can split it's set of nodes into two independent subsets A and B such that every edge in the graph has one node in A and another node in B.

The graph is given in the following form: graph[i] is a list of indexes j for which the edge between nodes i and j exists.  Each node is an integer between 0 and graph.length - 1.  There are no self edges or parallel edges: graph[i] does not contain i, and it doesn't contain any element twice.

Example 1:
```python
Input: [[1,3], [0,2], [1,3], [0,2]]
Output: true
Explanation: 
The graph looks like this:
0----1
|    |
|    |
3----2
We can divide the vertices into two groups: {0, 2} and {1, 3}.
```
Example 2:
```python
Input: [[1,2,3], [0,2], [0,1,3], [0,2]]
Output: false
Explanation: 
The graph looks like this:
0----1
| \  |
|  \ |
3----2
We cannot find a way to divide the set of nodes into two independent subsets.
```

Note:
* graph will have length in range [1, 100].
* graph[i] will contain integers in range [0, graph.length - 1].
* graph[i] will not contain i or duplicate values.
* The graph is undirected: if any element j is in graph[i], then i will be in graph[j].

## Solutions
　　首先要弄懂输入是什么意思，输入表示的是下标从0 开始的结点的相邻结点有哪些，比如例子 1 中，第一个 list 中的[1,3]表示与结点 0 相邻的结点是 1 和 3，以后一次类推。
### 1. 染色法
　　可以通过染色，如果两个相邻的结点被染成同一种颜色那么就不是二分图，否则便是。

```python

```

## References
1. [785. Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite/)
2. [785. Is Graph Bipartite? 是二分图么？](https://www.cnblogs.com/grandyang/p/8519566.html)
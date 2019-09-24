---
layout: post
title: 207. Course Schedule
subtitle:
author: Bin Li
tags: [Coding, LeetCode, BFS, DFS]
image: 
comments: true
published: true
---
There are a total of n courses you have to take, labeled from 0 to n-1.

Some courses may have prerequisites, for example to take course 0 you have to first take course 1, which is expressed as a pair: [0,1]

Given the total number of courses and a list of prerequisite pairs, is it possible for you to finish all courses?

Example 1:
```
Input: 2, [[1,0]] 
Output: true
Explanation: There are a total of 2 courses to take. 
             To take course 1 you should have finished course 0. So it is possible.
```
Example 2:
```
Input: 2, [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take. 
             To take course 1 you should have finished course 0, and to take course 0 you should
             also have finished course 1. So it is impossible.
```
Note:

1. The input prerequisites is a graph represented by a list of edges, not adjacency matrices. Read more about [how a graph is represented](https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs).
2. You may assume that there are no duplicate edges in the input prerequisites.

## Solutions
### 拓扑排序-BFS
　　从出入度的角度来计算，复杂度是 $O(n^2)$：
```python
class Solution(object):
    def canFinish(self, numCourses, prerequisites):
        """
        :type numCourses: int
        :type prerequisites: List[List[int]]
        :rtype: bool
        """
        graph = collections.defaultdict(list)
        indegrees = collections.defaultdict(int)
        for u, v in prerequisites:
            graph[v].append(u)
            indegrees[u] += 1
        for i in range(numCourses):
            zero_degree = False
            for j in range(numCourses):
                if indegrees[j] == 0:
                    zero_degree = True
                    break
            if not zero_degree:
                return False
            indegrees[j] = -1
            for node in graph[j]:
                indegrees[node] -= 1
        return True
# Runtime: 324 ms, faster than 15.97% of Python online submissions for Course Schedule.
# Memory Usage: 13.4 MB, less than 76.27% of Python online submissions for Course Schedule.
```

### 拓扑排序-DFS

```python
class Solution(object):
    def canFinish(self, numCourses, prerequisites):
        """
        :type numCourses: int
        :type prerequisites: List[List[int]]
        :rtype: bool
        """
        graph = collections.defaultdict(list)
        for u, v in prerequisites:
            graph[u].append(v)
        # 0 = Unkown, 1 = visiting, 2 = visited
        visited = [0] * numCourses
        for i in range(numCourses):
            if not self.dfs(graph, visited, i):
                return False
        return True
    
    def dfs(self, graph, visited, i):
        if visited[i] == 1: return False
        if visited[i] == 2: return True
        visited[i] = 1
        for j in graph[i]:
            if not self.dfs(graph, visited, j):
                return False
        visited[i] = 2
        return True
# Runtime: 68 ms, faster than 99.28% of Python online submissions for Course Schedule.
# Memory Usage: 14.5 MB, less than 49.15% of Python online submissions for Course Schedule.
```


## References
1. [207. Course Schedule](https://leetcode.com/problems/course-schedule/) 
2. [207. Course Schedule 解题报告](https://blog.csdn.net/fuxuemingzhu/article/details/82951771)
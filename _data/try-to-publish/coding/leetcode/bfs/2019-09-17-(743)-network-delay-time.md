---
layout: post
title: 743. Network Delay Time
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, DFS, BFS]
image: 
comments: true
published: true
---

There are N network nodes, labelled 1 to N.

Given times, a list of travel times as directed edges times[i] = (u, v, w), where u is the source node, v is the target node, and w is the time it takes for a signal to travel from source to target.

Now, we send a signal from a certain node K. How long will it take for all nodes to receive the signal? If it is impossible, return -1.


Example 1:
![](/img/media/15687074095955.jpg)

```
Input: times = [[2,1,1],[2,3,1],[3,4,1]], N = 4, K = 2
Output: 2
```

Note:

1. N will be in the range [1, 100].
2. K will be in the range [1, N].
3. The length of times will be in the range [1, 6000].
4. All edges times[i] = (u, v, w) will have 1 <= u, v <= N and 0 <= w <= 100.


## Solutions
![-w1712](/img/media/15687085428814.jpg)

### 1. Dijkstras's algorithm
### 2. Bellman-Ford
　　说是模板题，得用上 DP。
```python
class Solution:
    def networkDelayTime(self, times: List[List[int]], N: int, K: int) -> int:
        dist = [float('inf') for _ in range(N)]
        dist[K-1] = 0
        
        for i in range(N):
            for time in times:
                u, v, w = time[0] - 1, time[1] - 1, time[2]
                dist[v] = min(dist[v], dist[u]+w)
        max_dist = max(dist)
        return -1 if max_dist == float('inf') else max_dist

# Runtime: 2064 ms, faster than 5.05% of Python3 online submissions for Network Delay Time.
# Memory Usage: 15.5 MB, less than 7.69% of Python3 online submissions for Network Delay Time.
```

### 3. Floyd-Warshall (all pairs)
　　三维的 DP：

```python
class Solution:
    def networkDelayTime(self, times: List[List[int]], N: int, K: int) -> int:
        dist = [[float('inf') for _ in range(N)] for _ in range(N)]
        for time in times:
            dist[time[0]-1][time[1]-1] = time[2]
        
        for i in range(N):
            dist[i][i] = 0
        # pay attention to this order k, i, j
        for k in range(N):
            for i in range(N):
                for j in range(N):
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
                    
        max_dist = max(dist[K-1])
        return -1 if max_dist == float('inf') else max_dist
# Runtime: 1884 ms, faster than 5.05% of Python3 online submissions for Network Delay Time.
# Memory Usage: 15.6 MB, less than 7.69% of Python3 online submissions for Network Delay Time.
```
## References
1. [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/)
2. [huahaua](http://zxi.mytechroad.com/blog/graph/leetcode-743-network-delay-time/)
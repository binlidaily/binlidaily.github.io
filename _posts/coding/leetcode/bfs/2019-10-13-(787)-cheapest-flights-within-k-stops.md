---
layout: post
title: 787. Cheapest Flights Within K Stops
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Graph Search, DP, BFS, DFS]
image: 
comments: true
published: true
---

There are n cities connected by m flights. Each fight starts from city u and arrives at v with a price w.

Now given all the cities and flights, together with starting city src and the destination dst, your task is to find the cheapest price from src to dst with up to k stops. If there is no such route, output -1.

Example 1:
> Input: 
n = 3, edges = [[0,1,100],[1,2,100],[0,2,500]]
src = 0, dst = 2, k = 1
Output: 200
Explanation: 
The graph looks like this:
![](/img/media/15709472459478.jpg)
The cheapest price from city 0 to city 2 with at most 1 stop costs 200, as marked red in the picture.


Example 2:
> Input: 
n = 3, edges = [[0,1,100],[1,2,100],[0,2,500]]
src = 0, dst = 2, k = 0
Output: 500
Explanation: 
The graph looks like this:
![](/img/media/15709472543980.jpg)
The cheapest price from city 0 to city 2 with at most 0 stop costs 500, as marked blue in the picture.

Note:

* The number of nodes n will be in range [1, 100], with nodes labeled from 0 to n - 1.
* The size of flights will be in range [0, n * (n - 1) / 2].
* The format of each flight will be (src, dst, price).
* The price of each flight will be in the range [1, 10000].
* k is in the range of [0, n - 1].
* There will not be any duplicated flights or self cycles.

## Solutions
### 1. BFS
　　这种图操作最直接的想法应该是用 BFS 做，搜索图，知道找到最小的 prices 路径。

```python
# Time Complexity: O(n^{K+1})
# Space Complexity: O(K+1)
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, K: int) -> int:
        graph = collections.defaultdict(list)
        queue = collections.deque()
        min_price = float('inf')
        
        for c, nei, p in flights:
            graph[c].append((nei, p))
            
        queue.append((src, 0, 0))    # (current stop, count stops, sum prices)
        while queue:
            cur, stops, prices = queue.popleft()
            if cur == dst:
                min_price = min(min_price, prices)
                continue
            
            if stops <= K and prices < min_price:
                for nei, p in graph[cur]:
                    queue.append((nei, stops+1, prices+p))
        return min_price if min_price != float('inf') else -1
# Runtime: 128 ms, faster than 34.18% of Python3 online submissions for Cheapest Flights Within K Stops.
# Memory Usage: 16.8 MB, less than 52.63% of Python3 online submissions for Cheapest Flights Within K Stops.
```

### 2. DFS
　　用 DFS 发现写 dfs 函数时需要哪些参数是一个比较难的问题。只能写着写着，缺啥就往上面添。

```python
# Time Complexity: O(n^{K+1})
# Space Complexity: O(K+1)
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, K: int) -> int:
        graph = collections.defaultdict(list)
        stack = []
        min_price = [float('inf')]
        
        for c, nei, p in flights:
            graph[c].append((nei, p))
            
        self.dfs(graph, 0, src, dst, K, 0, min_price)
        return min_price[0] if min_price[0] != float('inf') else -1
    
    def dfs(self, graph, stops, src, dst, K, prices, min_price):
        if src == dst and prices < min_price[0]:
            min_price[0] = prices
            return
        if stops > K:
            return
        for nei, p in graph[src]:
            if p + prices < min_price[0]:
                self.dfs(graph, stops+1, nei, dst, K, p+prices, min_price)
# Runtime: 1228 ms, faster than 5.12% of Python3 online submissions for Cheapest Flights Within K Stops.
# Memory Usage: 14.8 MB, less than 52.63% of Python3 online submissions for Cheapest Flights Within K Stops.
```

### 3. DP
* dp[k][i]: 从 src 到达 i 机场的最小花费，共做了 k 个航班，经停 k-1 站。
* 初始化: dp[0:k+2][src] = 0，其他为无限大
* 状态转移矩阵: dp[k][i] = min(dp[k-1][j] + price[j][i])
* 结果: dp[K+1][dst]

```python
# Time Complexity: O(n*{K+1})
# Space Complexity: O(K+1)
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, K: int) -> int:
        dp = [[float('inf') for _ in range(n)] for _ in range(K+2)]
        dp[0][src] = 0
        
        for i in range(1, K+2):
            dp[i][src] = 0
            for fly in flights:
                dp[i][fly[1]] = min(dp[i][fly[1]], dp[i-1][fly[0]]+fly[2])
        
        return dp[K+1][dst] if dp[K+1][dst] != float('inf') else -1
# Runtime: 204 ms, faster than 15.24% of Python3 online submissions for Cheapest Flights Within K Stops.
# Memory Usage: 14.3 MB, less than 57.89% of Python3 online submissions for Cheapest Flights Within K Stops.
```

### 4. Bellman-Ford algorithm

```python
# Time Complexity: O(n*{K+1})
# Space Complexity: O(K+1)
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, K: int) -> int:
        dp = [[float('inf') for _ in range(n)] for _ in range(K+2)]
        dp[0][src] = 0
        
        for i in range(1, K+2):
            dp[i][src] = 0
            for cur, nei, pri in flights:
                dp[i][nei] = min(dp[i][nei], dp[i-1][cur]+pri)
        
        return dp[K+1][dst] if dp[K+1][dst] != float('inf') else -1
# Runtime: 204 ms, faster than 15.24% of Python3 online submissions for Cheapest Flights Within K Stops.
# Memory Usage: 14.3 MB, less than 57.89% of Python3 online submissions for Cheapest Flights Within K Stops.
```
## References
1. [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)
2. [Dijkstra Python commented and explained](https://leetcode.com/problems/cheapest-flights-within-k-stops/discuss/362377/Dijkstra-Python-commented-and-explained)
3. [花花](http://zxi.mytechroad.com/blog/dynamic-programming/leetcode-787-cheapest-flights-within-k-stops/)
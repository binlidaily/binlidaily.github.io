---
layout: post
title: 刷题代码模板
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---


## 二分模板

```python
# Author: Huahua
# Returns the smallest m in [l, r),
# s.t. cond(m) == True
# If not found returns r.
def binary_search(l, r, cond)
  while l < r:
    m = l + (r - l) // 2
    if cond(m):
      r = m
    else
      l = m + 1
  return l
```


## 组合模板

```python
# Author: Huahua
def C(n, m, s, cur):
  if len(cur) == m:
    print(cur)
    return
  for i in range(s, n):
    cur.append(i + 1)
    C(n, m, i + 1, cur)
    cur.pop()    

n = 5
m = 3
C(n, m, 0, [])
```

## 排列模板

```python
# Author: Huahua
def P(n, m, cur, used):
  if len(cur) == m:
    print(cur)
    return
  for i in range(n):
    if used[i]: continue
    used[i] = True
    cur.append(i + 1)
    P(n, m, cur, used)
    cur.pop()
    used[i] = False

n = 5
m = 3
P(n, m, [], [False] * n)
```

## BFS模板

```python
# Author: Huahua
# Find the shortest path from |start| to |target| in a unweighted graph G.
# neighbor(x) returns the neighbors of x in G.

q = deque([start])
seen = set([start])
steps = 0

while q:
  size = len(q)
  for _ in range(size):
    n = q.popleft()
    if n == target: return steps
    for t in neighbor(n):
      if t in seen: continue
      q.append(t)
      seen.add(t)
  steps += 1
return -1 # not found
```

## DFS模板

```python
# Author: Huahua
# Check whether there is a path from |start| to |target| in graph G.
# neighbor(x) returns the neighbors of x in G.

seen = set([start])
def dfs(n):
  if n == target:
    return True  
  for t in neighbor(n):
    if t in seen: continue
    seen.add(t)
    if dfs(t): return True
    seen.remove(t) # back-tracking  
  return False
return dfs(start)
```

## 前缀树模板

```python
# Author: Huahua
class Trie(object):
  def __init__(self): self.root = {}

  def insert(self, word):
    p = self.root
    for c in word:
      if c not in p: p[c] = {}
      p = p[c]
    p['#'] = True    

  def search(self, word):
    node = self._find(word)
    return node and '#' in node
    
  def startsWith(self, prefix):
    return self._find(prefix)

  def _find(self, prefix):
    p = self.root
    for c in prefix:
      if c not in p: return None
      p = p[c]
    return p
```

## 并查集模板

```python
# Author: Huahua
class UnionFindSet:
  def __init__(self, n):
    self.p = [i for i in range(n + 1)]
    self.r = [1 for i in range(n + 1)]

  def find(self, u):
    while u != self.p[u]:
      self.p[u] = self.p[self.p[u]]
      u = self.p[u]
    return u

  def union(self, u, v):
    pu, pv = self.find(u), self.find(v)
    if pu == pv: return False    
    if self.r[pu] < self.r[pv]:
      self.p[pu] = pv
    elif self.r[pu] > self.r[pv]:
      self.p[pv] = pu
    else:        
      self.p[pv] = pu
      self.r[pu] += 1
    return True
```

## 记忆化递归模板

```python
# Author: Huahua
# dp(state) returns the minimal cost to solve the subproblem |s|.
def dp(s):
  # No solution
  if unsolvable(s): return float('inf')
  # Base case, easy to solve.
  if base_case(s): return cost(s)
  # Already solved
  if s in memo: return memo[s]
  best = float('inf')
  for t in subproblems(s):   
    best = min(best, cost(s, t) + dp(t))
  memo[s] = best
  return best
return dp(start)
```

## References
1. [代码模板，刷题必会](https://blog.csdn.net/fuxuemingzhu/article/details/101900729)
2. [14 Patterns to Ace Any Coding Interview Question](https://medium.com/hackernoon/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed)
3. [花花酱 LeetCode DP Summary 动态规划总结](https://zxi.mytechroad.com/blog/dynamic-programming/leetcode-dp-summary/)
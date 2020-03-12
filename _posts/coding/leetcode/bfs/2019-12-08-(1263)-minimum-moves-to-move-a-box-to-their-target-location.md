---
layout: post
title: 1263. Minimum Moves to Move a Box to Their Target Location
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Search, BFS]
image: 
comments: true
published: true
---

## Description

Storekeeper is a game in which the player pushes boxes around in a warehouse trying to get them to target locations.

The game is represented by a `grid` of size `m x n`, where each element is a wall, floor, or a box.

Your task is move the box `'B'` to the target position `'T'` under the following rules:

- Player is represented by character `'S'` and can move up, down, left, right in the `grid` if it is a floor (empy cell).
- Floor is represented by character `'.'` that means free cell to walk.
- Wall is represented by character `'#'` that means obstacle (impossible to walk there). 
- There is only one box `'B'` and one target cell `'T'` in the `grid`.
- The box can be moved to an adjacent free cell by standing next to the box and then moving in the direction of the box. This is a **push**.
- The player cannot walk through the box.

Return the minimum number of **pushes** to move the box to the target. If there is no way to reach the target, return `-1`.

**Example 1:**

![](/img/media/15758180750891.jpg)

```
Input: grid = [["#","#","#","#","#","#"],
               ["#","T","#","#","#","#"],
               ["#",".",".","B",".","#"],
               ["#",".","#","#",".","#"],
               ["#",".",".",".","S","#"],
               ["#","#","#","#","#","#"]]
Output: 3
Explanation: We return only the number of times the box is pushed.
```

**Example 2:**

```
Input: grid = [["#","#","#","#","#","#"],
               ["#","T","#","#","#","#"],
               ["#",".",".","B",".","#"],
               ["#","#","#","#",".","#"],
               ["#",".",".",".","S","#"],
               ["#","#","#","#","#","#"]]
Output: -1
```

**Example 3:**

```
Input: grid = [["#","#","#","#","#","#"],
               ["#","T",".",".","#","#"],
               ["#",".","#","B",".","#"],
               ["#",".",".",".",".","#"],
               ["#",".",".",".","S","#"],
               ["#","#","#","#","#","#"]]
Output: 5
Explanation:  push the box down, left, left, up and up.
```

**Example 4:**

```
Input: grid = [["#","#","#","#","#","#","#"],
               ["#","S","#",".","B","T","#"],
               ["#","#","#","#","#","#","#"]]
Output: -1
```

**Constraints:**

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m <= 20`
- `1 <= n <= 20`
- `grid` contains only characters `'.'`, `'#'`, `'S'` , `'T'`, or `'B'`.
- There is only one character `'S'`, `'B'` and `'T'` in the `grid`.

## Solutions
　　推箱子小游戏的实现，找到人推箱子最少次数推导重点。如果没有人箱子自己走的话，还是比较简单的，BFS 即可。

### 1. BFS

```python
# Time: O()
# Space: O()
class Solution:
    def minPushBox(self, grid: List[List[str]]) -> int:
        dire = [(1,0),(0,1),(-1,0),(0,-1)]
		
        def can_get(cur_b,cur_p,tar):
            seen,cur = set([cur_p]),set([cur_p])
            while cur:
                tmp = []
                for loc in cur:
                    for x,y in dire:
                        if 0<= loc[0]+x < len(grid) and 0 <= loc[1] + y < len(grid[0]) and (loc[0]+x,loc[1] +y) != cur_b and grid[loc[0] +x][loc[1] +y] != '#' and (loc[0]+x,loc[1] +y) not in seen:
                            tmp += [(loc[0]+x,loc[1] +y)]
                cur = set(tmp)
                seen |= cur
                if tar in seen:
                    return True
            return False
			
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j] == 'B': box = (i,j)
                if grid[i][j] == 'S': player = (i,j)
                if grid[i][j] == 'T': target = (i,j)
				
        seen,cur,res = set([(box,player)]), set([(box,player)]), 0
        while cur:
            tmp = []
            res += 1
            for b,p in cur:
                for x,y in dire:
                    if 0<= b[0]+x < len(grid) and 0 <= b[1] + y < len(grid[0]) and grid[b[0]+x][b[1]+y] != '#' and can_get(b,p,(b[0]-x,b[1]-y)) and ((b[0]+x,b[1]+y),b) not in seen:
                        tmp += [((b[0]+x,b[1]+y),b)]
            cur = set(tmp)
            seen |= cur
            for x,y in dire:
                if (target,(target[0]+x,target[1]+y)) in seen:
                    return res
        return -1
# Runtime: 732 ms, faster than 23.61% of Python3 online submissions for Minimum Moves to Move a Box to Their Target Location.
# Memory Usage: 12.8 MB, less than 100.00% of Python3 online submissions for Minimum Moves to Move a Box to Their Target Location.
```

　　写法：

```python
from itertools import product

class Solution:
    def minPushBox(self, grid: List[List[str]]) -> int:

        #constants
        m, n = len(grid), len(grid[0]) #dimensions
        neighbors = ((-1,0), (1,0), (0,-1), (0,1)) 
        
        #initial values
        for i, j in product(range(m), range(n)):
            if   grid[i][j] == "B": box    = i, j
            elif grid[i][j] == "S": player = i, j
            elif grid[i][j] == "T": target = i, j
        
        #helper functions
        not_wall = lambda i, j: 0 <= i < m and 0 <= j < n and grid[i][j] !="#" #true if not wall
            
        def connected(s, d):
            """bfs to check if s and d are connected"""
            queue = [s]
            seen = set(queue)
            for i, j in queue: #okay to change size
                for di, dj in neighbors:
                    ii, jj = i + di, j + dj
                    if not_wall(ii, jj) and (ii, jj) != box and (ii, jj) not in seen: 
                        queue.append((ii, jj))
                        seen.add((ii, jj))
                if d in seen: return True
            return False
        final = set((target, (target[0]+di, target[1]+dj)) for di,dj in neighbors)

        moves = 0 
        queue = [(box, player)] #initial position
        seen = set(queue)
        while queue: #bfs by level 
            temp = []
            for box, player in queue:
                i, j = box
                for di, dj in neighbors:
                    if not_wall(i+di, j+dj) and ((i+di, j+dj), (i, j)) not in seen and not_wall(i-di, j-dj) and connected(player, (i-di, j-dj)):
                        temp.append(((i+di, j+dj), (i, j)))
                        seen.add(((i+di, j+dj), (i, j)))
            queue = temp
            moves += 1
            if seen & final: return moves #final configuration => arrive at target
        return -1 
```

　　C++解释版：

```C++
int minPushBox(vector<vector<char>>& grid) 
{
	// pq，[0]当前状态最小推箱子次数 [1]人的坐标x [2]人的坐标y [3]箱子的坐标x [4]箱子的坐标y
	priority_queue<vector<size_t>, vector<vector<size_t>>, greater<vector<size_t>>> pq;
	size_t m = grid.size();
	size_t n = grid[0].size();

	vector<size_t> a(5, 0);
	for (size_t x = 0; x < m; x++)
	{
		for (size_t y = 0; y < n; y++)
		{
			if (grid[x][y] == 'S')
			{
				a[1] = x;
				a[2] = y;
				grid[x][y] = '.';
			}
			else if (grid[x][y] == 'B')
			{
				a[3] = x;
				a[4] = y;
				grid[x][y] = '.';
			}
		}
	}
	pq.push(a);

	set<vector<size_t>> dist;
	dist.insert({ a[1], a[2], a[3], a[4] });
	int dx[4] = { 0,0,1,-1 };
	int dy[4] = { 1,-1,0,0 };

	while (!pq.empty())
	{
		auto v = pq.top();
		pq.pop();

		for (int i = 0; i < 4; i++)
		{
			vector<size_t> next_s = { v[1] + dx[i], v[2] + dy[i] };
			if (next_s[0] >= m || next_s[1] >= n || grid[next_s[0]][next_s[1]] == '#')
			{
				continue;
			}
			vector<size_t> next_b = { v[3], v[4] };
			size_t d = v[0];
			if (next_s == next_b)
			{
				next_b[0] += dx[i];
				next_b[1] += dy[i];
				if (next_b[0] >= m || next_b[1] >= n || grid[next_b[0]][next_b[1]] == '#')
				{
					continue;
				}
				d++;
			}
			if (grid[next_b[0]][next_b[1]] == 'T')
			{
				return (int)d;
			}

			if (dist.find({next_s[0], next_s[1], next_b[0], next_b[1]}) != dist.end())
			{
				continue;
			}
			dist.insert({ next_s[0], next_s[1], next_b[0], next_b[1] });
			pq.push({ d, next_s[0], next_s[1], next_b[0], next_b[1] });
		}
	}
	return -1;
}
```

## References
1. [1263. Minimum Moves to Move a Box to Their Target Location](https://leetcode.com/problems/minimum-moves-to-move-a-box-to-their-target-location/)
2. [huahua](https://zxi.mytechroad.com/blog/searching/leetcode-1263-minimum-moves-to-move-a-box-to-their-target-location/)
3. [【推箱子】BFS + 优先队列 的 详细讲解](https://leetcode-cn.com/problems/minimum-moves-to-move-a-box-to-their-target-location/solution/1263-by-ikaruga/)
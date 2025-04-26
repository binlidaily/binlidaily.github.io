---
layout: post
title: 40. Combination Sum II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Backtracking]
image: 
comments: true
published: true
---

## Description

Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sums to `target`.

Each number in `candidates` may only be used **once** in the combination.

**Note:**

- All numbers (including `target`) will be positive integers.
- The solution set must not contain duplicate combinations.

**Example 1:**

```
Input: candidates = [10,1,2,7,6,1,5], target = 8,
A solution set is:
[
  [1, 7],
  [1, 2, 5],
  [2, 6],
  [1, 1, 6]
]
```

**Example 2:**

```
Input: candidates = [2,5,2,1,2], target = 5,
A solution set is:
[
  [1,2,2],
  [5]
]
```

## Solutions
### 1. Backtracking
  这得判断前后两个数是否相同，相同就不要重复采用了，然后下一个数的起始点应该是 i+1 了！


```python
# Time: O(n^target)
# Space: O(n)
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []
        candidates.sort()
        self.dfs(candidates, 0, [], target, res)
        return res
    
    def dfs(self, candidates, start, path, target, res):
        if target == 0:
            res.append(path)
        n = len(candidates)
        for i in range(start, n):
            if i > start and candidates[i] == candidates[i-1]:
                continue
            if target >= candidates[i]:
                self.dfs(candidates, i + 1, path + [candidates[i]], target - candidates[i], res)
# 172/172 cases passed (68 ms)
# Your runtime beats 67.83 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

### 2. 迭代解法

```python
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        
        ans = [[] for i in range(target + 1)]
        ans[0] = [[]]
        candidates = sorted(candidates)
        
        for i in candidates:
            for j in range(target, -1, -1):
                if i <= j:
                    for p in ans[j - i]:
                        if p + [i] not in ans[j]:
                            ans[j].append(p + [i])
        
        return ans[target]
```

## References
1. [40. Combination Sum II](https://leetcode.com/problems/combination-sum-ii/)
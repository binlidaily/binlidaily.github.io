---
layout: post
title: 39. Combination Sum
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DFS, Backtracking]
image: 
comments: true
published: true
---

## Description

Given a **set** of candidate numbers (`candidates`) **(without duplicates)** and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sums to `target`.

The **same** repeated number may be chosen from `candidates` unlimited number of times.

**Note:**

- All numbers (including `target`) will be positive integers.
- The solution set must not contain duplicate combinations.

**Example 1:**

```
Input: candidates = [2,3,6,7], target = 7,
A solution set is:
[
  [7],
  [2,2,3]
]
```

**Example 2:**

```
Input: candidates = [2,3,5], target = 8,
A solution set is:
[
  [2,2,2,2],
  [2,3,3],
  [3,5]
]
```

## Solutions
### 1. Backtracking 
　　比较明显这个是有回溯的搜索题目，写了一个拙劣的版本，虽然过了，但是真是太慢……

```python
# Time: O(n^target)
# Space: O(n)
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []
        self.dfs(candidates, [], target, res)
        
        return res
    
    def dfs(self, candidates, cur_list, target, res):
        cur_sum = sum(cur_list)
        if cur_sum > target:
            return
        if cur_sum == target:
            cur_list.sort()
            for item in res:
                if cur_list == item:
                    return
            res.append(cur_list)
            return
        
        for cand in candidates:
            self.dfs(candidates, cur_list + [cand], target, res)
# 168/168 cases passed (768 ms)
# Your runtime beats 5.02 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

　　这种去重的，肯定是要先 sort 的，每次调用都 sort 的办法肯定不合适。如果每次进去都是从第一个位置开始遍历数组肯定会难以避免出现重复的，所以可以记录下当前的位置 start。


```python
# Time: O(n^target)
# Space: O(n)
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []
        candidates.sort()
        self.dfs(candidates, 0, [], target, res)
        return res
    
    def dfs(self, candidates, start, path, target, res):
        if target == 0:
            res.append(path)

        n = len(candidates)
        for i in range(start, n):
            if target >= candidates[i]:
                self.dfs(candidates, i, path + [candidates[i]], target - candidates[i], res)
# 168/168 cases passed (56 ms)
# Your runtime beats 94.05 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```
## References
1. [39. Combination Sum](https://leetcode.com/problems/combination-sum/)
2. [A general approach to backtracking questions in Java (Subsets, Permutations, Combination Sum, Palindrome Partitioning)](https://leetcode.com/problems/combination-sum/discuss/16502/A-general-approach-to-backtracking-questions-in-Java-(Subsets-Permutations-Combination-Sum-Palindrome-Partitioning))
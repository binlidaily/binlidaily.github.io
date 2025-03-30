---
layout: post
title: 47. Permutations II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Backtracking]
image: 
comments: true
published: true
---

## Description

Given a collection of numbers that might contain duplicates, return all possible unique permutations.

**Example:**

```
Input: [1,1,2]
Output:
[
  [1,1,2],
  [1,2,1],
  [2,1,1]
]
```

## Solutions
### 1. Backtracking
　　值得注意的是，这里需要排除一样元素的干扰，可以先排序，然后比较前后两个数是否相同。

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        if not nums:
            return []
        res = []
        nums.sort()
        self.dfs(nums, [], res)
        return res
    
    def dfs(self, nums, path, res):
        if not nums or len(nums) == 0:
            res.append(path)
        n = len(nums)
        for i in range(n):
            if i >= 1 and nums[i-1] == nums[i]:
                continue
            self.dfs(nums[:i]+nums[i+1:], path+[nums[i]], res)
# 30/30 cases passed (48 ms)
# Your runtime beats 98.52 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

### 2. 迭代方法

```python
class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        res = [[]]
        for n in nums:
            tmp = []
            for item in res:
                for i in range(len(item)+1):
                    tmp.append(item[:i]+[n]+item[i:])
                    if i < len(item) and item[i] == n:
                        break
            res = tmp
        return res
# 30/30 cases passed (48 ms)
# Your runtime beats 98.52 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

## References
1. [47. Permutations II](https://leetcode.com/problems/permutations-ii/description/)
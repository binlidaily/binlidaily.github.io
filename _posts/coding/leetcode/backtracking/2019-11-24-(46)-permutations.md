---
layout: post
title: 46. Permutations
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Backtracking]
image: 
comments: true
published: true
---

## Description

Given a collection of **distinct** integers, return all possible permutations.

**Example:**

```
Input: [1,2,3]
Output:
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
```

## Solutions
### 1. Backtracking

　　这里采用了 visited 的方式记录已经访问过的元素，需要回溯！只是通过记录已经遍历过的下标还是不够的。

```python
# Time: O(n^k)
# Space: O(n)
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        if not nums:
            return []
        res = []
        visited = set()
        self.dfs(nums, visited, [], res)
        return res
    
    def dfs(self, nums, visited, path, res):
        if not nums:
            return
        
        n = len(nums)
        if len(path) == n:
            res.append(path)
            return
        
        for i in range(n):
            if nums[i] in visited:
                continue
            visited.add(nums[i])
            self.dfs(nums, visited, path + [nums[i]], res)
            visited.remove(nums[i])
# 25/25 cases passed (36 ms)
# Your runtime beats 96.9 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

### 2. Backtracking-每次交换两个数
　　参考了这篇[博文](https://www.cnblogs.com/grandyang/p/4358848.html)解法二的交换两个数的方式进行全排列，结果发现如果用 Python 每次都会修改所有的 nums 对应的值，后来发现需要在 nums 后面加上 copy() 即可。

```python
# Time: O(n^k)
# Space: O(n)
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        if not nums:
            return []
        res = []
        self.dfs(nums, 0, res)
        return res
    
    def dfs(self, nums, start, res):
        if not nums:
            return 
        n = len(nums)
        if start >= n:
            # res.append(nums)
            res.append(nums.copy())
            return
        
        for i in range(start, n):
            nums[start], nums[i] = nums[i], nums[start]
            self.dfs(nums, start+1, res)
            nums[start], nums[i] = nums[i], nums[start]
```

　　还有一种写法：

```python
class Solution:
    def DFS(self, nums, result, current):
        if len(nums) == 0:
            result.append(current)
            return
        for i in range(len(nums)):
            # current.append(nums[i])
            # del nums[i]
            # self.DFS(nums, result, current)
            temp = nums[0:i] + nums[i+1:]
            self.DFS(temp, result, current+[nums[i]])
    
    def permute(self, nums: List[int]) -> List[List[int]]:
        result = []
        self.DFS(nums, result, [])
        return result
```

### 3. 迭代-交换两个数

```python
"""Time and space complexity are both O(n*(n!)).
Space: It doesn't alloc any extra space, just copy and concat the buffers to form the output. There is n! output and each has n elements.
And
Time: it doesn't do any extra computation but consider needing copy NN! elements. So time complexity is also O(NN!)"""
class Solution:
    def permute(self, nums):
        ans = [[]]
        
        for n in nums:
            temp=[]
            for lst in ans:
                for i in range(len(lst)+1):
                    temp.append(lst[:i]+[n]+lst[i:])
            ans = temp
        return ans
```

## References
1. [46. Permutations](https://leetcode.com/problems/permutations/description/)
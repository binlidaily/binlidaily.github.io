---
layout: post
title: 60. Permutation Sequence
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Backtracking]
image: 
comments: true
published: true
---

## Description

The set `[1,2,3,...,*n*]` contains a total of *n*! unique permutations.

By listing and labeling all of the permutations in order, we get the following sequence for *n* = 3:

1. `"123"`
2. `"132"`
3. `"213"`
4. `"231"`
5. `"312"`
6. `"321"`

Given *n* and *k*, return the *k*th permutation sequence.

**Note:**

- Given *n* will be between 1 and 9 inclusive.
- Given *k* will be between 1 and *n*! inclusive.

**Example 1:**

```
Input: n = 3, k = 3
Output: "213"
```

**Example 2:**

```
Input: n = 4, k = 9
Output: "2314"
```

## Solutions
### 1. Backtracking
　　全排会超时！

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        res = []
        visited = set()
        self.dfs(n, k, visited, '', res)
        return res[k-1]

    def dfs(self, n, k, visited, path, res):
        # add this, TLE too
        if k <= len(res):
            return
        if n == len(path):
            res.append(path)
            return

        for i in range(1, n+1):
            if i in visited:
                continue
            visited.add(i)
            self.dfs(n, k, visited, path + str(i), res)
            visited.remove(i)
# Time Limit Exceeded
# 85/200 cases passed (N/A)
# Testcase
# 9
# 331987
```

　　举个例子，n = 4，k = 9 时，有：

```python
1234
1243
1324
1342
1423
1432
2134
2143
2314  <= k = 9
2341
2413
2431
3124
3142
3214
3241
3412
3421
4123
4132
4213
4231
4312
4321
```

　　根本不需要从 1 开始全排，因为从 1 开始全排的只有 3!=6 个数，那么这里可以优化！

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        self.k = k
    
        def backtrack(path, remain):
            if not remain:
                self.k -= 1
                if self.k == 0:
                    return path
                return ''
                
            for i in range(len(remain)):
                if self.k > math.factorial(len(remain)-1):
                    self.k -= math.factorial(len(remain)-1)
                    continue
                ans = backtrack(path + remain[i], remain[:i]+remain[i+1:])
                if ans: 
                    return ans
            return ''
        nums = list(map(str, range(1, n+1)))
        return backtrack('', nums)
# 200/200 cases passed (32 ms)
# Your runtime beats 78.87 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [60. Permutation Sequence](https://leetcode.com/problems/permutation-sequence/)
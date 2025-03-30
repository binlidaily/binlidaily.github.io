---
layout: post
title: 854. K-Similar Strings
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, BFS]
image: 
comments: true
published: true
---

## Description

Strings `A` and `B` are `K`-similar (for some non-negative integer `K`) if we can swap the positions of two letters in `A` exactly `K` times so that the resulting string equals `B`.

Given two anagrams `A` and `B`, return the smallest `K` for which `A` and `B` are `K`-similar.

**Example 1:**

```
Input: A = "ab", B = "ba"
Output: 1
```

**Example 2:**

```
Input: A = "abc", B = "bca"
Output: 2
```

**Example 3:**

```
Input: A = "abac", B = "baca"
Output: 2
```

**Example 4:**

```
Input: A = "aabc", B = "abca"
Output: 2
```

**Note:**

1. `1 <= A.length == B.length <= 20`
2. `A` and `B` contain only lowercase letters from the set `{'a', 'b', 'c', 'd', 'e', 'f'}`


## Solutions
　　找到从 A 每次交换两个字母变换到 B 所用的最少交换次数。

### 1. BFS
　　其实这就是搜索的题目，而且是要找到最短的，可以通过 BFS 的分支限界法求解。

```python
# Time: O(?)
# Space: O(n)
class Solution:
    def kSimilarity(self, A: str, B: str) -> int:
        res, n  = 0, len(A)
        visited = set()
        visited.add(A)
        queue = collections.deque()
        queue.append(A)
        while queue:
            size = len(queue)
            for _ in range(size):
                T = queue.popleft()
                if T == B:
                    return res
                i = 0
                while i < n and T[i] == B[i]:
                    i += 1
                T = list(T)
                for j in range(i+1, n):
                    if T[j] == B[j] or T[j] != B[i]:
                        continue
                    T[i], T[j] = T[j], T[i]
                    if ''.join(T) not in visited:
                        visited.add(''.join(T))
                        queue.append(''.join(T))
                    T[i], T[j] = T[j], T[i]
            res += 1
        return -1

# 54/54 cases passed (184 ms)
# Your runtime beats 60.39 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14 MB)
```

## References
1. [854. K-Similar Strings](https://leetcode.com/problems/k-similar-strings/description/)
2. [854. K-Similar Strings 相似度为K的字符串](https://www.cnblogs.com/grandyang/p/11343552.html)
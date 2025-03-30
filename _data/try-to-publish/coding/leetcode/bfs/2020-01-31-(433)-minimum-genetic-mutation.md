---
layout: post
title: 433. Minimum Genetic Mutation
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, BFS]
image: 
comments: true
published: true
---

## Description

A gene string can be represented by an 8-character long string, with choices from `"A"`, `"C"`, `"G"`, `"T"`.

Suppose we need to investigate about a mutation (mutation from "start" to "end"), where ONE mutation is defined as ONE single character changed in the gene string.

For example, `"AACCGGTT"` -> `"AACCGGTA"` is 1 mutation.

Also, there is a given gene "bank", which records all the valid gene mutations. A gene must be in the bank to make it a valid gene string.

Now, given 3 things - start, end, bank, your task is to determine what is the minimum number of mutations needed to mutate from "start" to "end". If there is no such a mutation, return -1.

**Note:**

1. Starting point is assumed to be valid, so it might not be included in the bank.
2. If multiple mutations are needed, all mutations during in the sequence must be valid.
3. You may assume start and end string is not the same.

 

**Example 1:**

```
start: "AACCGGTT"
end:   "AACCGGTA"
bank: ["AACCGGTA"]

return: 1
```

 

**Example 2:**

```
start: "AACCGGTT"
end:   "AAACGGTA"
bank: ["AACCGGTA", "AACCGCTA", "AAACGGTA"]

return: 2
```

 

**Example 3:**

```
start: "AAAAACCC"
end:   "AACCCCCC"
bank: ["AAAACCCC", "AAACCCCC", "AACCCCCC"]

return: 3
```


## Solutions
### 1. BFS
　　找最短路径，尽量用 BFS。
```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def minMutation(self, start: str, end: str, bank: List[str]) -> int:
        if not start or not str or not bank:
            return -1
        queue = collections.deque()
        queue.append((start, 0))
        while queue:
            gene, step = queue.popleft()
            if gene == end:
                return step
            for i in range(len(gene)):
                for ch in 'ACGT':
                    new_gene = gene[:i] + ch + gene[i+1:]
                    if bank and new_gene in bank:
                        queue.append((new_gene, step + 1))
                        bank.remove(new_gene)
        return -1

# 14/14 cases passed (24 ms)
# Your runtime beats 86.19 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [433. Minimum Genetic Mutation](https://leetcode.com/problems/minimum-genetic-mutation/description/)
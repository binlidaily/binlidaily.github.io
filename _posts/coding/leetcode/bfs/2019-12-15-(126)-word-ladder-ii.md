---
layout: post
title: 126. Word Ladder II
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Backtracking, BFS]
image: 
comments: true
published: true
---

## Description

Given two words (*beginWord* and *endWord*), and a dictionary's word list, find all shortest transformation sequence(s) from *beginWord* to *endWord*, such that:

1. Only one letter can be changed at a time
2. Each transformed word must exist in the word list. Note that *beginWord* is *not* a transformed word.

**Note:**

- Return an empty list if there is no such transformation sequence.
- All words have the same length.
- All words contain only lowercase alphabetic characters.
- You may assume no duplicates in the word list.
- You may assume *beginWord* and *endWord* are non-empty and are not the same.

**Example 1:**

```
Input:
beginWord = "hit",
endWord = "cog",
wordList = ["hot","dot","dog","lot","log","cog"]

Output:
[
  ["hit","hot","dot","dog","cog"],
  ["hit","hot","lot","log","cog"]
]
```

**Example 2:**

```
Input:
beginWord = "hit"
endWord = "cog"
wordList = ["hot","dot","dog","lot","log"]

Output: []

Explanation: The endWord "cog" is not in wordList, therefore no possible transformation.
```

## Solutions
### 1. Backtracking
　　注意要找最短路径，我是从遍历所有结果后再找最小的，没有做好剪枝，导致了 TLE。
```python
class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: List[str]) -> List[List[str]]:
        res = []
        self.alpha = string.ascii_lowercase # a-z
        self.max = float('inf')
        visited = set()
        visited.add(beginWord)
        self.dfs(endWord, set(wordList), visited, beginWord, [beginWord], res)
        min_len = self.find_min_len(res)
        return [path for path in res if len(path) == min_len]
    
    def find_min_len(self, res):
        min_len = float('inf')
        for path in res:
            size = len(path)
            if size < min_len:
                min_len = size
        return min_len

    def dfs(self, endWord, wordList, visited, word, path, res):
        if word == endWord:
            size = len(path)
            if size <= self.max:
                self.max = size
                res.append(path)
            return
        
        if len(path) > self.min:
            return
            
        n = len(word)
        for i in range(n):
            for ch in self.alpha:
                new_word = word[:i] + ch + word[i+1:]
                if new_word in wordList and new_word not in visited:
                    visited.add(new_word)
                    self.dfs(endWord, wordList, visited, new_word, path+[new_word], res)
                    visited.remove(new_word)
# TLE
```

　　回溯参考：

```python
# Time: O()
# Space: O()
class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: List[str]) -> List[List[str]]:
        tree, words, n = collections.defaultdict(set), set(wordList), len(beginWord)
        if endWord not in wordList: return []
        found, q, nq = False, {beginWord}, set()
        while q and not found:
            words -= set(q)
            for x in q:
                for y in [x[:i]+c+x[i+1:] for i in range(n) for c in 'qwertyuiopasdfghjklzxcvbnm']:
                    if y in words:
                        if y == endWord: 
                            found = True
                        else: 
                            nq.add(y)
                        tree[x].add(y)
            q, nq = nq, set()
        def bt(x): 
            return [[x]] if x == endWord else [[x] + rest for y in tree[x] for rest in bt(y)]
        return bt(beginWord)
# Runtime: 532 ms, faster than 35.67%
# Memory Usage: 16.7 MB, less than 16.67%
```

### 2. BFS
![-w1210](/img/media/15671529359520.jpg)
　　还是用 BFS 试一下。

```python
# Time: O()
# Space: O()
class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: List[str]) -> List[List[str]]:
        all_adj_combine = collections.defaultdict(list)
        wordLen = len(beginWord)
        for w in wordList:
            for i in range(wordLen):
                all_adj_combine[w[:i] + "*" + w[i + 1:]].append(w)
        level = {}
        for w in wordList:
            level[w] = float("inf")
        level[beginWord] = 0
            
        # BFS
        res = []
        size = float("inf")
        queue = [(beginWord, [beginWord])]
        while queue:
            word, path_list = queue.pop(0)
            if len(path_list) >= size:
                return res
            for i in range(wordLen):
                adj_words = all_adj_combine[word[:i] + "*" + word[i + 1:]]
                for adj_w in adj_words:
                    if adj_w == endWord:
                        res.append(path_list + [adj_w])
                        size = len(path_list + [adj_w])
                    elif level[adj_w] > level[word]:
                        queue.append((adj_w, path_list + [adj_w]))
                        level[adj_w] = level[word] + 1
        return res
# Runtime: 348 ms, faster than 71.55%
# Memory Usage: 17.7 MB, less than 8.33%
```

## References
1. [126. Word Ladder II](https://leetcode.com/problems/word-ladder-ii/)
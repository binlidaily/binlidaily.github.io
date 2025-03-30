---
layout: post
title: 212. Word Search II
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Trie, DFS, Hard]
image: 
comments: true
published: true
---

## Description

Given a 2D board and a list of words from the dictionary, find all words in the board.

Each word must be constructed from letters of sequentially adjacent cell, where "adjacent" cells are those horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

 

**Example:**

```
Input: 
board = [
  ['o','a','a','n'],
  ['e','t','a','e'],
  ['i','h','k','r'],
  ['i','f','l','v']
]
words = ["oath","pea","eat","rain"]

Output: ["eat","oath"]
```

 

**Note:**

1. All inputs are consist of lowercase letters `a-z`.
2. The values of `words` are distinct.

## Solutions
### 1. DFS
　　用 DFS TLE 了……
```python
class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        if not board:
            return []
        res = []
        for word in words:
            if self.exist(board, word):
                res.append(word)
        return res

    def exist(self, board: List[List[str]], word: str) -> bool:
        if not board:
            return False
        r, c = len(board), len(board[0])
        for i in range(r):
            for j in range(c):
                if self.dfs(board, word, i, j, r, c):
                    return True
        return False

    def dfs(self, board, word, i, j, r, c):
        if not word:
            return True
        if not (0 <= i < r) or not (0 <= j < c) or word[0] != board[i][j]:
            return False
        tmp = board[i][j]
        board[i][j] = '#'
        res = self.dfs(board, word[1:], i + 1, j, r, c) or \
                self.dfs(board, word[1:], i - 1, j, r, c) or \
                self.dfs(board, word[1:], i, j + 1, r, c) or \
                self.dfs(board, word[1:], i, j - 1, r, c)
        board[i][j] = tmp
        return res
# Time Limit Exceeded
```

### 2. Trie

```python
class TrieNode():
    def __init__(self):
        self.children = collections.defaultdict(TrieNode)
        self.isWord = False

class Trie():
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for w in word:
            node = node.children[w]
        node.isWord = True

    def search(self, word):
        node = self.root
        for w in word:
            node = node.children.get(w)
            if not node:
                return False
        return node.isWord

class Solution(object):
    def findWords(self, board, words):
        """
        :type board: List[List[str]]
        :type words: List[str]
        :rtype: List[str]
        """
        if not board or len(board) < 1:
            return []
        res = []
        trie = Trie()
        node = trie.root
        self.r, self.c = len(board), len(board[0])
        for word in words:
            trie.insert(word)
        for i in range(self.r):
            for j in range(self.c):
                self.dfs(board, node, '', i, j, res)
        return res

    def dfs(self, board, node, path, row, col, res):
        if node.isWord:
            res.append(path)
            node.isWord = False
        if row < 0 or row >= self.r or col < 0 or col >= self.c:
            return
        # Avoid access the same character
        char = board[row][col]
        node = node.children.get(char)
        if not node:
            return
        board[row][col] = '#'
        self.dfs(board, node, path+char, row, col+1, res)
        self.dfs(board, node, path+char, row, col-1, res)
        self.dfs(board, node, path+char, row+1, col, res)
        self.dfs(board, node, path+char, row-1, col, res)
        board[row][col] = char
# Runtime: 488 ms, faster than 25.75% of Python online submissions for Word Search II.
# Memory Usage: 47.9 MB, less than 34.78% of Python online submissions for Word Search II.
```

## References
1. [212. Word Search II](https://leetcode.com/problems/word-search-ii/)
2. [huahua](https://zxi.mytechroad.com/blog/searching/leetcode-212-word-search-ii/)
3. [ LeetCode - Word Search II](http://bookshadow.com/weblog/2015/05/19/leetcode-word-search-ii/)
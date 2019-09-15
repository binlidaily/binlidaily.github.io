---
layout: post
title: 212. Word Search II
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given a 2D board and a list of words from the dictionary, find all words in the board.

Each word must be constructed from letters of sequentially adjacent cell, where "adjacent" cells are those horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

 

Example:
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

## Solutions
### 1. DFS
　　用 DFS TLE 了……
```python
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
        self.r, self.c = len(board), len(board[0])
        for word in words:
            if self.exist(board, word):
                res.append(word)
        return res
    
    def exist(self, board, word):
        for i in range(self.r):
            for j in range(self.c):
                if self.search(board, word, 0, i, j):
                    return True
        return False
    
    def search(self, board, word, depth, row, col):
        if row < 0 or row >= self.r or col < 0 or col >= self.c or board[row][col] != word[depth]:
            return False
        # Found the last char of the word
        if depth == len(word) - 1:
            return True
        # Avoid access the same character
        char = board[row][col]
        board[row][col] = '#'
        bi_found = self.search(board, word, depth+1, row, col+1) or \
                self.search(board, word, depth+1, row, col-1) or \
                self.search(board, word, depth+1, row+1, col) or \
                self.search(board, word, depth+1, row-1, col)
        board[row][col] = char
        return bi_found
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
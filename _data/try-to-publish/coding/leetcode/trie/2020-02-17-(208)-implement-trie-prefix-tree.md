---
layout: post
title: 208. Implement Trie (Prefix Tree)
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Trie]
image: 
comments: true
published: true
---

## Description

Implement a trie with `insert`, `search`, and `startsWith` methods.

**Example:**

```
Trie trie = new Trie();

trie.insert("apple");
trie.search("apple");   // returns true
trie.search("app");     // returns false
trie.startsWith("app"); // returns true
trie.insert("app");   
trie.search("app");     // returns true
```

**Note:**

- You may assume that all inputs are consist of lowercase letters `a-z`.
- All inputs are guaranteed to be non-empty strings.


## Solutions
### 1. Design

```python
# Time: O(n)
# Space: O(n)

class TrieNode:
    def __init__(self):
        self.children = collections.defaultdict(TrieNode)
        self.is_word = False

class Trie:

    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        """
        Inserts a word into the trie.
        """
        cur = self.root
        for letter in word:
            if letter not in cur.children:
                cur.children[letter] = TrieNode()
            cur = cur.children[letter]
            # only this one line can work
            # cur = cur.children[letter]
        cur.is_word = True

    def search(self, word: str) -> bool:
        """
        Returns if the word is in the trie.
        """
        cur = self.root
        for letter in word:
            cur = cur.children.get(letter)
            if not cur:
                return False
        return cur.is_word

    def startsWith(self, prefix: str) -> bool:
        """
        Returns if there is any word in the trie that starts with the given prefix.
        """
        cur = self.root
        for letter in prefix:
            cur = cur.children.get(letter)
            if not cur:
                return False
        return True

# 15/15 cases passed (188 ms)
# Your runtime beats 53.64 % of python3 submissions
# Your memory usage beats 7.41 % of python3 submissions (31.5 MB)
```

## References
1. [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)
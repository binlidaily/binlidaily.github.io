---
layout: post
title: 472. Concatenated Words
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, DFS]
image: 
comments: true
published: true
---

## Description

Given a list of words (**without duplicates**), please write a program that returns all concatenated words in the given list of words.

A concatenated word is defined as a string that is comprised entirely of at least two shorter words in the given array.

**Example:**

```
Input: ["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"]

Output: ["catsdogcats","dogcatsdog","ratcatdogcat"]

Explanation: "catsdogcats" can be concatenated by "cats", "dog" and "cats"; 
 "dogcatsdog" can be concatenated by "dog", "cats" and "dog"; 
"ratcatdogcat" can be concatenated by "rat", "cat", "dog" and "cat".
```



**Note:**

1. The number of elements of the given array will not exceed `10,000`
2. The length sum of elements in the given array will not exceed `600,000`.
3. All the input string will only include lower case letters.
4. The returned elements order does not matter.


## Solutions
### 1. DFS

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def findAllConcatenatedWordsInADict(self, words: List[str]) -> List[str]:
        if not words or len(words) == 0:
            return []
        sets = set(words)
        res = []
        for word in words:
            if self.dfs(word, sets):
                res.append(word)
        return res
    
    def dfs(self, word, words):
        n = len(word)
        for i in range(1, n):
            prefix = word[:i]
            suffix = word[i:]
            
            if prefix in words and suffix in words:
                return True
            
            if prefix in words and self.dfs(suffix, words):
                return True
            
            # if self.dfs(prefix, words) and suffix in words:
            #     return True
        return False
# Runtime: 388 ms, faster than 82.71%
# Memory Usage: 16 MB, less than 75.00%
```

## References
1. [472. Concatenated Words](https://leetcode.com/problems/concatenated-words/)
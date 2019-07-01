---
layout: post
title: 890. Find and Replace Pattern
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

You have a list of words and a pattern, and you want to know which words in words matches the pattern.

A word matches the pattern if there exists a permutation of letters p so that after replacing every letter x in the pattern with p(x), we get the desired word.

(Recall that a permutation of letters is a bijection from letters to letters: every letter maps to another letter, and no two letters map to the same letter.)

Return a list of the words in words that match the given pattern. 

You may return the answer in any order.

Example 1:
```
Input: words = ["abc","deq","mee","aqq","dkd","ccc"], pattern = "abb"
Output: ["mee","aqq"]
Explanation: "mee" matches the pattern because there is a permutation {a -> m, b -> e, ...}. 
"ccc" does not match the pattern because {a -> c, b -> c, ...} is not a permutation,
since a and b map to the same letter.
``` 

Note:
```
1 <= words.length <= 50
1 <= pattern.length = words[i].length <= 20
```

## Solutions
　　理解题意就可以了，不是很难，但是写出来的代码就不够优雅，一堆 if。

```python
class Solution(object):
    def findAndReplacePattern(self, words, pattern):
        """
        :type words: List[str]
        :type pattern: str
        :rtype: List[str]
        """
        res = []
        n = len(pattern)
        for item in words:
            dic = {}
            Flag = True
            for i in range(n):
                if pattern[i] in dic:
                    if item[i] != dic[pattern[i]]:
                        Flag = False
                        break
                else:
                    if item[i] in dic.values():
                        Flag = False
                        break
                    dic[pattern[i]] = item[i]
            if Flag:
                res.append(item)
        return res
# Runtime: 12 ms, faster than 98.90% of Python online submissions for Find and Replace Pattern.
# Memory Usage: 11.6 MB, less than 96.80% of Python online submissions for Find and Replace Pattern.
```
## References
1. [890. Find and Replace Pattern](https://leetcode.com/problems/find-and-replace-pattern/)
2. [890. Find And Replace Pattern](https://leetcode.com/articles/find-and-replace-pattern/)
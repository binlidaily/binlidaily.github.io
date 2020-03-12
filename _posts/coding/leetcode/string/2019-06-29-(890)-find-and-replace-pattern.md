---
layout: post
title: 890. Find and Replace Pattern
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, String, Greedy, Medium]
image: 
comments: true
published: true
---

# Description

You have a list of `words` and a `pattern`, and you want to know which words in `words` matches the pattern.

A word matches the pattern if there exists a permutation of letters `p` so that after replacing every letter `x` in the pattern with `p(x)`, we get the desired word.

(*Recall that a permutation of letters is a bijection from letters to letters: every letter maps to another letter, and no two letters map to the same letter.*)

Return a list of the words in `words` that match the given pattern. 

You may return the answer in any order.

 

**Example 1:**

```
Input: words = ["abc","deq","mee","aqq","dkd","ccc"], pattern = "abb"
Output: ["mee","aqq"]
Explanation: "mee" matches the pattern because there is a permutation {a -> m, b -> e, ...}. 
"ccc" does not match the pattern because {a -> c, b -> c, ...} is not a permutation,
since a and b map to the same letter.
```

 

**Note:**

- `1 <= words.length <= 50`
- `1 <= pattern.length = words[i].length <= 20`

## Solutions
　　找到所有与 pattern 形式相同的字符串保存下来。

### 1. Greedy + Dict
　　理解题意就可以了，不是很难，但是写出来的代码就不够优雅，一堆 if。用字典存映射关系，然后挨个字符去找对应！

　　找对应的时候注意，如果字符串的字符不在字典中，还要判断是不是在已经存进字典的 values 中。

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def findAndReplacePattern(self, words: List[str], pattern: str) -> List[str]:
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
# 46/46 cases passed (32 ms)
# Your runtime beats 79 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [890. Find and Replace Pattern](https://leetcode.com/problems/find-and-replace-pattern/)
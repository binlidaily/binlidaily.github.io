---
layout: post
title: 438. Find All Anagrams in a String
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Hash Table]
image: 
comments: true
published: true
---

## Description

Given a string **s** and a **non-empty** string **p**, find all the start indices of **p**'s anagrams in **s**.

Strings consists of lowercase English letters only and the length of both strings **s** and **p** will not be larger than 20,100.

The order of output does not matter.

**Example 1:**

```
Input:
s: "cbaebabacd" p: "abc"

Output:
[0, 6]

Explanation:
The substring with start index = 0 is "cba", which is an anagram of "abc".
The substring with start index = 6 is "bac", which is an anagram of "abc".
```



**Example 2:**

```
Input:
s: "abab" p: "ab"

Output:
[0, 1, 2]

Explanation:
The substring with start index = 0 is "ab", which is an anagram of "ab".
The substring with start index = 1 is "ba", which is an anagram of "ab".
The substring with start index = 2 is "ab", which is an anagram of "ab".
```


## Solutions
### 1. Brute Force

```python
# Time: O(nm)
# Space: O(n)
class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        ns, np = len(s), len(p)
        res = []
        for i in range(ns-np+1):
            if self.is_anagrams(s[i:i+np], p):
                res.append(i)
        return res

    def is_anagrams(self, s, p):
        s_dict = collections.defaultdict()
        p_dict = collections.defaultdict()
        for ch in s:
            s_dict[ch] = s_dict.get(ch, 0) + 1

        for ch in p:
            p_dict[ch] = p_dict.get(ch, 0) + 1
        
        return s_dict == p_dict

# Time Limit Exceeded
# 34/36 cases passed (N/A)
```


```python
# Time: O(nm)
# Space: O(n)
class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        ns, np = len(s), len(p)
        p_dict = collections.defaultdict()
        for ch in p:
            p_dict[ch] = p_dict.get(ch, 0) + 1
        res = []
        for i in range(ns-np+1):
            s_dict = collections.defaultdict()
            for j in range(i, i+np):
                s_dict[s[j]] = s_dict.get(s[j], 0) + 1
            if s_dict == p_dict:
                res.append(i)
            else:
                s_dict[s[i]] = s_dict[s[i]] - 1
                if s_dict[s[i]] == 0:
                    s_dict.pop(s[i])
        return res

# Time Limit Exceeded
# 34/36 cases passed (N/A)
```

### 2. Hash Table
　　用字符串的机器码作为下标，定义一个足够大的数组，Python 中 123 即可。


```python
# Time: O(n)
# Space: O(1)
class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        ns, np = len(s), len(p)
        if np > ns:
            return []
        shash, phash = [0] * 123, [0] * 123
        res = []
        for ch in p:
            phash[ord(ch)] += 1
        for i in range(np-1):
            shash[ord(s[i])] += 1
        for i in range(np-1, ns):
            shash[ord(s[i])] += 1
            if i - np >= 0:
                shash[ord(s[i - np])] -= 1
            if shash == phash:
                res.append(i - np + 1)
        return res

# 36/36 cases passed (112 ms)
# Your runtime beats 75.49 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.7 MB)
```
## References
1. [438. Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)
---
layout: post
title: 387. First Unique Character in a String
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Hash Table]
image: 
comments: true
published: true
---

## Description

Given a string, find the first non-repeating character in it and return it's index. If it doesn't exist, return -1.

**Examples:**

```
s = "leetcode"
return 0.

s = "loveleetcode",
return 2.
```

**Note:** You may assume the string contain only lowercase letters.


## Solutions
### 1. Hash Table

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def firstUniqChar(self, s: str) -> int:
        hash_map = collections.defaultdict()
        for i, ch in enumerate(s):
            if ch in hash_map:
                hash_map[ch] = (hash_map[ch][0] + 1, hash_map[ch][1], ch)
            else:
                hash_map[ch] = (1, i, ch)

        values = hash_map.values()
        res = float('inf')
        for cnt, idx, ch in values:
            if cnt == 1 and idx < res:
                res = idx
        return res if res < float('inf') else -1

# 104/104 cases passed (184 ms)
# Your runtime beats 16.71 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

　　优化一下：


```python
# Time: O(n)
# Space: O(n)
class Solution:
    def firstUniqChar(self, s: str) -> int:
        hash_map = collections.defaultdict()
        filter = set()
        for i, ch in enumerate(s):
            if ch not in filter:
                filter.add(ch)
                hash_map[ch] = i
            elif ch in hash_map:
                del hash_map[ch]
        return min(hash_map.values()) if hash_map else -1

# 104/104 cases passed (96 ms)
# Your runtime beats 75.89 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```


```python
class Solution:
    def firstUniqChar(self, s: str) -> int:
        leng =len(s)
        set_ = set()
        for i in range(leng):
            if s[i] not in set_:
                tmp = s[:i] + s[i+1:]
                if s[i] not in tmp:
                    return i
                set_.add(s[i])
        return -1
```

　　注意字典在存的时候也是有顺序的？
```python
class Solution:
    def firstUniqChar(self, s: str) -> int:
        d={}     
        for ch in s:
            d[ch]=d.get(ch, 0) + 1
        for i in range(len(s)):
            if d[s[i]] == 1:
                return i
        return -1
```
## References
1. [387. First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/description/)
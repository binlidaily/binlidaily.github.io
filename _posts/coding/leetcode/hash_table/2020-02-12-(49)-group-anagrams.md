---
layout: post
title: 49. Group Anagrams
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Hash Table]
image: 
comments: true
published: true
---

## Description

Given an array of strings, group anagrams together.

**Example:**

```
Input: ["eat", "tea", "tan", "ate", "nat", "bat"],
Output:
[
  ["ate","eat","tea"],
  ["nat","tan"],
  ["bat"]
]
```

**Note:**

- All inputs will be in lowercase.
- The order of your output does not matter.


## Solutions
### 1. Hash Table

```python
# Time: O(mnlogn)
# Time: O(nm)
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        hash_map = collections.defaultdict(list)
        for s in strs:
            sorted_s = ''.join(sorted(s))
            if sorted_s in hash_map:
                hash_map[sorted_s].append(s)
            else:
                hash_map[sorted_s] = [s]
        return list(hash_map.values())

# 101/101 cases passed (92 ms)
# Your runtime beats 95.46 % of python3 submissions
# Your memory usage beats 96.23 % of python3 submissions (15.6 MB)
```

## References
1. [49. Group Anagrams](https://leetcode.com/problems/group-anagrams/description/)
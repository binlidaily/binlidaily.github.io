---
layout: post
title: 93. Restore IP Addresses
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Backtracking]
image: 
comments: true
published: true
---

## Description

Given a string containing only digits, restore it by returning all possible valid IP address combinations.

**Example:**

```
Input: "25525511135"
Output: ["255.255.11.135", "255.255.111.35"]
```


## Solutions
### 1. Backtracking

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def restoreIpAddresses(self, s: str) -> List[str]:
        if not s or len(s) < 4:
            return []
        
        res = []
        self.dfs(s, [], res)
        return res
        
    def dfs(self, s, path, res):
        if path and s == '' and len(path) == 4:
            res.append('.'.join(path))
            return
        
        if path and len(path) > 4:
            return
        
        for i in range(3):
            if i < len(s) and int(s[:i+1]) <= 255:
                if s[:i+1].startswith('0') and i >= 1:
                    continue
                self.dfs(s[i+1:], path+[s[:i+1]], res)
# 147/147 cases passed (32 ms)
# Your runtime beats 87.3 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [93. Restore IP Addresses](https://leetcode.com/problems/restore-ip-addresses)
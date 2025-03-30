---
layout: post
title: 567. Permutation in String
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Sliding Window, Two Pointers, Hash Table]
image: 
comments: true
published: true
---

## Description

Given two strings **s1** and **s2**, write a function to return true if **s2** contains the permutation of **s1**. In other words, one of the first string's permutations is the **substring** of the second string.


**Example 1:**

```
Input: s1 = "ab" s2 = "eidbaooo"
Output: True
Explanation: s2 contains one permutation of s1 ("ba").
```

**Example 2:**

```
Input:s1= "ab" s2 = "eidboaoo"
Output: False
```

**Note:**

1. The input strings only contain lower case letters.
2. The length of both given strings is in range [1, 10,000].


## Solutions
### 1. Sliding Window
　　自己实现的版本不优雅：

```python
# Time Complexity: O(l1+l2)
# Space Complexity: O(l1+l2)
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        if len(s1) > len(s2):
            return False
        n1, n2 = len(s1), len(s2)
        d1 = collections.defaultdict()
        d2 = collections.defaultdict()
        
        for i in range(n1):
            d1[s1[i]] = d1.get(s1[i], 0)
            d1[s1[i]] += 1
            d2[s2[i]] = d2.get(s2[i], 0)
            d2[s2[i]] += 1
        
        if d1 == d2:
            return True
        
        for i in range(n1, n2):
            d2[s2[i]] = d2.get(s2[i], 0)
            d2[s2[i]] += 1
            d2[s2[i-n1]] -= 1
            if d2[s2[i-n1]] == 0:
                d2.pop(s2[i-n1])
            if d1 == d2:
                return True
        
        return False
# Runtime: 84 ms, faster than 51.79% of Python3 online submissions for Permutation in String.
# Memory Usage: 12.9 MB, less than 100.00% of Python3 online submissions for Permutation in String.
```

　　直接设定 26 个字母的字典，比来回增删操作会快很多！


```python
# Time Complexity: O(l1+l2)
# Space Complexity: O(l1+l2)
import string

class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        if len(s1)>len(s2):
            return False
        s1_freq = dict.fromkeys(string.ascii_lowercase, 0)
        s2_freq = dict.fromkeys(string.ascii_lowercase, 0)
        for c in s1:
            s1_freq[c]+=1
        k = len(s1)
        for i in range(k):
            s2_freq[s2[i]] += 1    
        for i in range(k, len(s2)+1):
            if s2_freq == s1_freq:
                return True
            elif i< len(s2):
                s2_freq[s2[i-k]]-=1
                s2_freq[s2[i]]+=1
            else:
                return False
        return False
# Runtime: 52 ms, faster than 98.58% of Python3 online submissions for Permutation in String.
# Memory Usage: 12.9 MB, less than 100.00% of Python3 online submissions for Permutation in String.
```

### 2. Sliding Window - Two Pointers
　　用双指针发现更加复杂了：


```python
# Time Complexity: O(l1+l2)
# Space Complexity: O(l1+l2)
import string
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        if len(s1) > len(s2):
            return False
        n1, n2 = len(s1), len(s2)
        l = 0
        m = dict.fromkeys(string.ascii_lowercase, 0)

        for c in s1:
            m[c] += 1
        
        cnt = n1
        for r in range(n2):
            if m[s2[r]] > 0:
                cnt -= 1
            m[s2[r]] -= 1
            while cnt == 0:
                if r - l + 1 == n1:
                    return True
                m[s2[l]] += 1
                if m[s2[l]] > 0:
                    cnt += 1
                l += 1
        return False
# Runtime: 52 ms, faster than 98.58% of Python3 online submissions for Permutation in String.
# Memory Usage: 12.9 MB, less than 100.00% of Python3 online submissions for Permutation in String.
```


## References
1. [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/)
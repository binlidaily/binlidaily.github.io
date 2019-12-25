---
layout: post
title: 242. Valid Anagram
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, String]
image: 
comments: true
published: true
---

## Description

Given two strings *s* and *t* , write a function to determine if *t* is an anagram of *s*.

**Example 1:**

```
Input: s = "anagram", t = "nagaram"
Output: true
```

**Example 2:**

```
Input: s = "rat", t = "car"
Output: false
```

**Note:**
You may assume the string contains only lowercase alphabets.

**Follow up:**
What if the inputs contain unicode characters? How would you adapt your solution to such case?


## Solutions
### 1. Dict

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if not s and not t:
            return True
        if not s or not t or len(s) != len(t):
            return False
        sd = self.to_dict(s)
        td = self.to_dict(t)
        return sd == td
    
    def to_dict(self, s):
        if not s:
            return {}
        dic = {}
        for c in s:
            dic[c] = dic.get(c, 0) + 1
        return dic
# 34/34 cases passed (52 ms)
# Your runtime beats 60.73 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.1 MB)
```

### 2. Array

```C++
public class Solution {
    public boolean isAnagram(String s, String t) {
        int[] table = new int[26];
        // 记录字母在第一个单词中出现的次数
        for(int i = 0; i < s.length(); i++){
            table[s.charAt(i)-'a']++;
        }
        // 减去字母在第二个单词中出现的次数
        for(int i = 0; i < t.length(); i++){
            table[t.charAt(i)-'a']--;
        }
        // 如果某个计数器不为0，则返回假
        for(int i = 0; i < 26; i++){
            if(table[i]!=0) return false;
        }
        return true;
    }
}
```
## References
1. [242. Valid Anagram](https://leetcode.com/problems/valid-anagram/description/)
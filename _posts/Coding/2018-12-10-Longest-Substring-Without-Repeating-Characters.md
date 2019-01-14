---
layout: post
title: 3. Longest Substring Without Repeating Characters
subtitle:
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

## Description
Given a string, find the length of the longest substring without repeating characters.

Example 1:
```
Input: "abcabcbb"
Output: 3 
Explanation: The answer is "abc", with the length of 3. 
```

Example 2:
```
Input: "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

Example 3:
```
Input: "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3. 

Note that the answer must be a substring, "pwke" is a subsequence and not a substring.
```

## Solutions
暴力求解法还是比较简单可以实现的，两重循环，外循环遍历，内循环从外循环的当前位置开始往后扫描，遇到重复的字符就终止当前遍历，统计大小。
```python
class Solution(object):
    def lengthOfLongestSubstring(self, s):
        """
        :type s: str
        :rtype: int
        """
        n = len(s)
        num_max = 0
        
        for i in range(n):
            used_chars = {}
            cur_max = 0
            for j in range(i, n):
                if s[j] in used_chars:
                    break
                
                used_chars[s[j]] = j
                cur_max += 1
            if cur_max > num_max:
                        num_max = cur_max
        return num_max                         
```

第二种方法：
![](/img/media/15473606262679.png)

如上图所示，这里的 End 可以表示为在遍历时的 i 的值，Max length 就是 $i-start+1$。那么参考这个表，我们需要搞清楚什么时候 start 更换赋值？很明显，如果当前位置的字母在之前的 Start 到 End 段中出现重复就需要调整，调整是从当前 Start 位置到 End 位置之间重复字母的第一个位置开始加上1（这就要求我们在存字母的时候保证对应上字母的当前坐标位置）。为了保证是当前这个重复段的，我们还得要求重复的字母位置要比 start 的位置大！

而比较大小的步骤，其实可以在每一次迭代下都进行，但是我们发现在更换 start 的位置的时候其实可以不用比较，因为刚开始，所以可以把比较大小的部分放到更换 start 值的 if 补集中。

```python
class Solution(object):
    def lengthOfLongestSubstring(self, s):
        """
        :type s: str
        :rtype: int
        """
        n = len(s)
        num_max = start = 0
        used_chars = {}
        
        for i in range(n):
            if s[i] in used_chars and start <= used_chars[s[i]]:
                start = used_chars[s[i]] + 1
            else:
                num_max = max(num_max, i - start + 1)
            used_chars[s[i]] = i

        return num_max
```

## References
1. [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/)
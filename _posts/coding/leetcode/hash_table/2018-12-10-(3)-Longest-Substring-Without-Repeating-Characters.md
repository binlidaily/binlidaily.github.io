---
layout: post
title: 3. Longest Substring Without Repeating Characters
subtitle: 最长不重复子序列 (Medium)
author: Bin Li
tags: [Coding, LeetCode, Hash Table, Sliding Window, Medium, Two Pointers]
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
### 1. Brute Force

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

### 2. HashMap + Sliding Window

<p align="center">
  <img width="" height="" src="/img/media/15473606262679.png">
</p>

　　如上图所示，这里的 End 可以表示为在遍历时的 i 的值，Max length 就是 $i-start+1$。那么参考这个表，我们需要搞清楚什么时候 start 更换赋值？很明显，如果当前位置的字母在之前的 Start 到 End 段中出现重复就需要调整，调整是从当前 Start 位置到 End 位置之间重复字母的第一个位置开始加上 1（这就要求我们在存字母的时候保证对应上字母的当前坐标位置）。为了保证是当前这个重复段的，我们还得要求重复的字母位置要比 start 的位置大！

　　而比较大小的步骤，其实可以在每一次迭代下都进行，但是我们发现在更换 Start 的位置的时候其实可以不用比较，因为刚开始，所以可以把比较大小的部分放到更换 Start 值的 if 补集中。

```python
# Time Complexity: O(n)
# Space Complexity: O(1)
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        start = 0
        hash_table = collections.defaultdict()
        res = 0
        for i in range(len(s)):
            if s[i] in hash_table:
                start = max(start, hash_table[s[i]] + 1)
            hash_table[s[i]] = i
            res = max(res, i - start + 1)
        return res
# Runtime: 72 ms, faster than 58.41% of Python3 online submissions for Longest Substring Without Repeating Characters.
# Memory Usage: 13.9 MB, less than 5.10% of Python3 online submissions for Longest Substring Without Repeating Characters.
```

### 3. 两个指针的方式 - Sliding Window
　　用集合储存不重复的字串个数，用两个指针框住的字串判断是否重复，一直往右移动。

　　右边指针指向的元素如果在字典中，判断左侧指针指向元素是否也在，在的话则删除左侧指针指向元素，不在则挪动 left 指针。

　　right 指向元素不在字典中的话，就加入长度加 1，比较滑动窗口大小存下结果。

```python
# Time Complexity: O(n)
# Space Complexity: O(1)
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        if not s:
            return 0
        visited = set()
        l, r = 0, 0
        n = len(s)
        res = 0
        while l < n and r < n:
            if s[r] in visited:
                if s[l] in visited:
                    visited.remove(s[l])
                l += 1
            else:
                visited.add(s[r])
                r += 1
                res = max(res, len(visited))
                # res = max(res, r - l)  # r add 1 first, not need add 1 here
        return res
# Runtime: 84 ms, faster than 38.74% of Python3 online submissions for Longest Substring Without Repeating Characters.
# Memory Usage: 13.9 MB, less than 5.10% of Python3 online submissions for Longest Substring Without Repeating Characters.
```

## References
1. [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/)
2. [LeetCode第三题(Longest Substring Without Repeating Characters)三部曲之一：解题思路](https://blog.csdn.net/boling_cavalry/article/details/86563586)
3. [【LeetCode】3. Longest Substring Without Repeating Characters 解题报告（Python & C++）](https://blog.csdn.net/fuxuemingzhu/article/details/82022530)
---
layout: post
title: 395. Longest Substring with At Least K Repeating Characters
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium]
image: 
comments: true
published: true
---

## Description

Find the length of the longest substring ***T\*** of a given string (consists of lowercase letters only) such that every character in ***T\*** appears no less than *k* times.

**Example 1:**

```
Input:
s = "aaabb", k = 3

Output:
3

The longest substring is "aaa", as 'a' is repeated 3 times.
```



**Example 2:**

```
Input:
s = "ababbc", k = 2

Output:
5

The longest substring is "ababb", as 'a' is repeated 2 times and 'b' is repeated 3 times.
```


## Solutions
### 1. Brute Force
　　TLE 了。

```python
# Time: O(n^2)
# Space: O(n^2)
class Solution:
    def longestSubstring(self, s: str, k: int) -> int:
        n = len(s)
        res = 0
        for i in range(n):
            for j in range(i, n):
                if self.check(s[i:j+1], k):
                    res = max(res, j - i + 1)
        return res
    
    def check(self, subs, k):
        hash_map = collections.defaultdict()
        for ch in subs:
            hash_map[ch] = hash_map.get(ch, 0) + 1

        return True if min(hash_map.values()) >= k else False

# Time Limit Exceeded
# 24/28 cases passed (N/A)
# Testcase
# "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
# 1
```

### 2. Divide and Conquer
　　想法：
1. 如果字符串的长度小于 k，则不存在符合要求的字串，返回零；
2. 如果存在一个字符的统计个数小于 k，那么符合要求的字串中肯定不包含这个字符，故而可以利用这个字串作为分割原来字符串的字符，然后迭代调用每个字串作为参数的原函数

```python
# Time: O(n^2)
# Space: O(n^2)
class Solution:
    def longestSubstring(self, s: str, k: int) -> int:
        if len(s) < k:
            return 0
        for ch in set(s):
            if s.count(ch) < k:
                return max(self.longestSubstring(sub, k) for sub in s.split(ch))
        return len(s)

# 28/28 cases passed (28 ms)
# Your runtime beats 88.94 % of python3 submissions
# Your memory usage beats 85.71 % of python3 submissions (13 MB)
```

### 3. 分治法-迭代
　　可以想象一下，递归函数就是利用栈实现的，那么这里肯定可以利用栈将其改写成迭代的形式：


```python
# Time: O(n^2)
# Space: O(n^2)
class Solution:
    def longestSubstring(self, s: str, k: int) -> int:
        stack = []
        stack.append(s)
        res = 0
        while stack:
            s = stack.pop()
            for ch in set(s):
                if s.count(ch) < k:
                    stack.extend([sub for sub in s.split(ch)])
                    break
            else:
                res = max(res, len(s))
        return res

# 28/28 cases passed (28 ms)
# Your runtime beats 88.94 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```



The else statement is executed in Python after exiting a for/while block IF the exit is due to a "break" clause.
( Even though Guido said this may be a poor design choice for readability, i.e. just because you can do it, doesn't mean that you should. )
If there was a break inside the while loop, Python would handle a separate else clause after exiting the while loop to a break clause, a short example would be:



```
while (condition):
    for something in range(list):
        if break_for_loop_condition:
            break  # break from the for loop
    else:
        function_call_after_break_in_for_loop()
    if break_while_loop_condition:
        break  # break from the while loop
else:
    function_call_after_break_in_while_loop()
```



```python
# Time: O(n^2)
# Space: O(n^2)
class Solution:
    def longestSubstring(self, s: str, k: int) -> int:
        stack = []
        stack.append(s)
        res = 0
        while stack:
            s = stack.pop()
            is_update = True
            for ch in set(s):
                if s.count(ch) < k:
                    stack.extend([sub for sub in s.split(ch)])
                    is_update = False
                    break
            if is_update:
                res = max(res, len(s))
        return res

# 28/28 cases passed (20 ms)
# Your runtime beats 99.89 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [395. Longest Substring with At Least K Repeating Characters](https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/)
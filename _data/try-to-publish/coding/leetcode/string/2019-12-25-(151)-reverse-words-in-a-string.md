---
layout: post
title: 151. Reverse Words in a String
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, String, Two Pointers]
image: 
comments: true
published: true
---

## Description

Given an input string, reverse the string word by word.

 

**Example 1:**

```
Input: "the sky is blue"
Output: "blue is sky the"
```

**Example 2:**

```
Input: "  hello world!  "
Output: "world! hello"
Explanation: Your reversed string should not contain leading or trailing spaces.
```

**Example 3:**

```
Input: "a good   example"
Output: "example good a"
Explanation: You need to reduce multiple spaces between two words to a single space in the reversed string.
```

 

**Note:**

- A word is defined as a sequence of non-space characters.
- Input string may contain leading or trailing spaces. However, your reversed string should not contain leading or trailing spaces.
- You need to reduce multiple spaces between two words to a single space in the reversed string.

 

**Follow up:**

For C programmers, try to solve it *in-place* in *O*(1) extra space.


## Solutions
### 1. Two Pointers

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def reverseWords(self, s: str) -> str:
        arr = list(s)
        self.reverse_string(arr, 0, len(arr)-1)
        self.reverse_words(arr)
        words = self.trim_sides(arr)
        res = self.trim_space(words)
        return ''.join(res)

    def reverse_string(self, arr, l, r):
        '''reverse a given string'''
        while l < r:
            arr[l], arr[r] = arr[r], arr[l]
            l += 1
            r -= 1
        return arr
    
    def reverse_words(self, arr):
        '''reverse every words in a string'''
        l, r = 0, 0
        n = len(arr)
        while r < n:
            while r < n and not arr[r].isspace():
                r += 1
            self.reverse_string(arr, l, r - 1)
            r += 1
            l = r
        return arr
    
    def trim_sides(self, arr):
        '''str.strip() basically'''
        if ''.join(arr).isspace():
            return []
        l, r = 0, len(arr) - 1
        while l < r and arr[l].isspace():
            l += 1
        while l < r and arr[r].isspace():
            r -= 1
        return arr[l:r+1]
    
    def trim_space(self, words):
        '''remove duplicating space in a word'''
        if not words:
            return []
        res = [words[0]]
        n = len(words)
        for i in range(1, n):
            if res[-1].isspace() and words[i].isspace():
                continue
            res.append(words[i])
        return res

# 25/25 cases passed (72 ms)
# Your runtime beats 6.47 % of python3 submissions
# Your memory usage beats 8.7 % of python3 submissions (14.3 MB)
```

### 2. 用上堆或者栈

```python
from collections import deque
class Solution:
    def reverseWords(self, s: str) -> str:
        queue = []
        left, right = 0, len(s) - 1
        while left in range(len(s)) and s[left] == ' ':
            left += 1
        while right in range(len(s)) and s[right] == ' ':
            right -= 1
        word = ''
        for i in range(left, right + 1):
            if s[i] != ' ':
                word += s[i]
            else:
                if word: queue.append(word)
                word = ''
        if word:
            queue.append(word)
        res = []
        while queue:
            res.append(queue.pop())
        return ' '.join(res)
# 25/25 cases passed (40 ms)
# Your runtime beats 38.87 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.3 MB)
```

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        
        output = ''
        stack = []

        # point idx to last character
        idx = len(s) - 1

        if not s:
            return ''
        
        # point idx to non-space character
        while s[idx] == ' ' and idx >= 0:
            idx -=1

        if idx < 0:
            return ''

        # iterate over entire string
        while idx >= 0:
        
            while s[idx] != ' ' and idx >= 0:
                stack.append(s[idx])
                idx -= 1

            if output:
                output += ' '
            while stack:
                character = stack.pop()
                output += character
            
            while s[idx] == ' ':
                idx -= 1
                
        return output
# 25/25 cases passed (52 ms)
# Your runtime beats 12.2 % of python3 submissions
# Your memory usage beats 78.26 % of python3 submissions (13.4 MB)
```

## References
1. [151. Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/)
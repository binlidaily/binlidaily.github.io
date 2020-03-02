---
layout: post
title: 30. Substring with Concatenation of All Words
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, String, Linked List, Two Pointers]
image: 
comments: true
published: true
---

## Description

You are given a string, **s**, and a list of words, **words**, that are all of the same length. Find all starting indices of substring(s) in **s** that is a concatenation of each word in **words** exactly once and without any intervening characters.

 

**Example 1:**

```
Input:
  s = "barfoothefoobarman",
  words = ["foo","bar"]
Output: [0,9]
Explanation: Substrings starting at index 0 and 9 are "barfoo" and "foobar" respectively.
The output order does not matter, returning [9,0] is fine too.
```

**Example 2:**

```
Input:
  s = "wordgoodgoodgoodbestword",
  words = ["word","good","best","word"]
Output: []
```


## Solutions
### 1. Hash Table + Brute Force
　　实质上比较两个字典是否一致：
1. 先对 words 建立一个字典
2. 然后循环遍历 s 中的每一个位置，内循环找从当前位置开始到遍历 words 里面元素个数作为遍历轮次后结束，是否收集到和原来字典相同的字典

```Python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def findSubstring(self, s: str, words: List[str]) -> List[int]:
        if not words:
            return []
        words_sz = len(words)
        word_len = len(words[0])
        s_len = len(s)

        word_cnt = collections.defaultdict()
        for word in words:
            word_cnt[word] = word_cnt.get(word, 0) + 1
        
        res = []
        last_i = s_len - words_sz * word_len + 1

        for i in range(last_i):
            valid_cnt = 0
            cur_cnt = collections.defaultdict()
            last_j = i + words_sz * word_len

            for j in range(i, last_j, word_len):
                word = s[j:j+word_len]
                if word not in word_cnt:
                    continue
                cur_cnt[word] = cur_cnt.get(word, 0) + 1
                if cur_cnt[word] > word_cnt[word]:
                    break
                valid_cnt += 1

            if valid_cnt == words_sz:
                res.append(i)
        return res


# 173/173 cases passed (600 ms)
# Your runtime beats 43.2 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

### 2. Sliding Window
　　采用滑动窗口的方式进行统计，外层循环可以少很多。在上面的基础上，如果两个字典不相等，那么在前一个 cur_cnt 的基础上删去不合适的，继续下去。

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def findSubstring(self, s: str, words: List[str]) -> List[int]:
        if not words:
            return []
        words_sz = len(words)
        word_len = len(words[0])

        word_cnt = collections.defaultdict()
        for word in words:
            word_cnt[word] = word_cnt.get(word, 0) + 1
        
        res = []

        for i in range(word_len):
            start = i
            cur_cnt = collections.defaultdict()
            last_j = len(s) - word_len + 1

            for j in range(i, last_j, word_len):
                word = s[j:j+word_len]
                if word in word_cnt:
                    cur_cnt[word] = cur_cnt.get(word, 0) + 1

                    while cur_cnt[word] > word_cnt[word]:
                        cur_cnt[s[start: start + word_len]] -= 1
                        start += word_len
                else:
                    cur_cnt.clear()
                    start = j + word_len

                if j - start == (words_sz-1) * word_len:
                    res.append(start)
        return res

# 173/173 cases passed (60 ms)
# Your runtime beats 95.13 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```
## References
1. [30. Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words/description/)
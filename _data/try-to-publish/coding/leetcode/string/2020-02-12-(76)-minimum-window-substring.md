---
layout: post
title: 76. Minimum Window Substring
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, String, Two Pointers]
image: 
comments: true
published: true
---

## Description

Given a string S and a string T, find the minimum window in S which will contain all the characters in T in complexity O(n).

**Example:**

```
Input: S = "ADOBECODEBANC", T = "ABC"
Output: "BANC"
```

**Note:**

- If there is no such window in S that covers all characters in T, return the empty string `""`.
- If there is such window, you are guaranteed that there will always be only one unique minimum window in S.


## Solutions
### 1. Two Pointers

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        hash_map = collections.defaultdict(int)
        for ch in t:
            hash_map[ch] += 1
        # hash_map = collections.Counter(t)
        l, r = 0, 0
        min_window = ''
        cnt = len(t)
        
        for r in range(len(s)):
            # If we see a target letter, decrease the total target letter count
            if hash_map[s[r]] > 0:
                cnt -= 1
            
            # Decrease the letter count for the current letter
			# If the letter is not a target letter, the count just becomes -ve
            hash_map[s[r]] -= 1

            # If all letters in the target are found:
            while cnt == 0:
                win_size = r - l + 1
                if not min_window or win_size < len(min_window):
                    # Note the new minimum window
                    min_window = s[l:r+1]
                # Increase the letter count of the current letter
                hash_map[s[l]] += 1

                # If all target letters have been seen and now, a target letter is seen with count > 0
				# Increase the target length to be found. This will break out of the loop
                if hash_map[s[l]] > 0:
                    cnt += 1
                l += 1
        return min_window

# 268/268 cases passed (88 ms)
# Your runtime beats 92.35 % of python3 submissions
# Your memory usage beats 61.11 % of python3 submissions (13.4 MB)
```

## References
1. [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/description/)
2. [Substring 总结](https://leetcode.com/problems/minimum-window-substring/discuss/26808/Here-is-a-10-line-template-that-can-solve-most-'substring'-problems)

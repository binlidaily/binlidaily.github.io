---
layout: post
title: 443. String Compression
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, String, Easy]
image: 
comments: true
published: true
---

## Description

Given an array of characters, compress it [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm).

The length after compression must always be smaller than or equal to the original array.

Every element of the array should be a **character** (not int) of length 1.

After you are done **modifying the input array [in-place](https://en.wikipedia.org/wiki/In-place_algorithm)**, return the new length of the array.

 

**Follow up:**
Could you solve it using only O(1) extra space?

 

**Example 1:**

```
Input:
["a","a","b","b","c","c","c"]

Output:
Return 6, and the first 6 characters of the input array should be: ["a","2","b","2","c","3"]

Explanation:
"aa" is replaced by "a2". "bb" is replaced by "b2". "ccc" is replaced by "c3".
```

 

**Example 2:**

```
Input:
["a"]

Output:
Return 1, and the first 1 characters of the input array should be: ["a"]

Explanation:
Nothing is replaced.
```

 

**Example 3:**

```
Input:
["a","b","b","b","b","b","b","b","b","b","b","b","b"]

Output:
Return 4, and the first 4 characters of the input array should be: ["a","b","1","2"].

Explanation:
Since the character "a" does not repeat, it is not compressed. "bbbbbbbbbbbb" is replaced by "b12".
Notice each digit has it's own entry in the array.
```

 

**Note:**

1. All characters have an ASCII value in `[35, 126]`.
2. `1 <= len(chars) <= 1000`.

## Solutions

### 1. 不优雅的拼凑
　　自己实现的版本真的是一堆 if-else，说明没有对规律了解清楚：
```python
# Time Complexity: O(n)
# Space Complexity: O(1)
class Solution:
    def compress(self, chars: List[str]) -> int:
        if not chars:
            return 0
        if len(chars) == 1:
            return 1
        n = len(chars)
        pre = chars[0]
        cnt = 1
        idx = 0
        res = ''
        for i in range(1, n):
            if chars[i] == pre:
                cnt += 1
            else:
                chars[idx] = pre
                pre = chars[i]
                if cnt == 1:
                    idx += 1
                elif cnt >= 10:
                    for c in str(cnt):
                        idx += 1
                        chars[idx] = c
                    idx += 1
                else:
                    chars[idx+1] = str(cnt)
                    idx += 2
                cnt = 1
            if i == n-1:
                chars[idx] = pre
                if cnt == 1:
                    idx += 1
                elif cnt >= 10:
                    for c in str(cnt):
                        idx += 1
                        chars[idx] = c
                    idx += 1
                else:
                    chars[idx+1] = str(cnt)
                    idx += 2
        return idx
# Runtime: 56 ms, faster than 98.75% of Python3 online submissions for String Compression.
# Memory Usage: 12.9 MB, less than 100.00% of Python3 online submissions for String Compression.
```

### 2. 优雅的版本

```python
# Time Complexity: O(n)
# Space Complexity: O(1)
class Solution:
    def compress(self, chars: List[str]) -> int:
        n = len(chars)
        i, count = 0, 1
        for j in range(1,n+1):
            if j < n and chars[j] == chars[j-1]:
                count += 1
            else:
                chars[i] = chars[j-1]
                i += 1
                if count > 1:
                    for m in str(count):
                        chars[i] = m
                        i += 1
                count = 1
        return i
# Runtime: 60 ms, faster than 95.41% of Python3 online submissions for String Compression.
# Memory Usage: 12.8 MB, less than 100.00% of Python3 online submissions for String Compression.
```

## References
1. [443. String Compression](https://leetcode.com/problems/string-compression/)
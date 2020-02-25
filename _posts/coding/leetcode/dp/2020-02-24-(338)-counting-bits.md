---
layout: post
title: 338. Counting Bits
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DP, Bit Manipulation]
image: 
comments: true
published: true
---

## Description

Given a non negative integer number **num**. For every numbers **i** in the range **0 ≤ i ≤ num** calculate the number of 1's in their binary representation and return them as an array.

**Example 1:**

```
Input: 2
Output: [0,1,1]
```

**Example 2:**

```
Input: 5
Output: [0,1,1,2,1,2]
```

**Follow up:**

- It is very easy to come up with a solution with run time **O(n\*sizeof(integer))**. But can you do it in linear time **O(n)** /possibly in a single pass?
- Space complexity should be **O(n)**.
- Can you do it like a boss? Do it without using any builtin function like **__builtin_popcount** in c++ or in any other language.


## Solutions
### 1. Brute Force

```python
# 1. Brute Force
# Time: O(num)
# Space: O(num)
class Solution:
    def countBits(self, num: int) -> List[int]:
        res = []
        for i in range(num+1):
            cnt = 0
            while i != 0:
                div, mod = divmod(i, 2)
                if mod == 1:
                    cnt += 1
                i = div
            res.append(cnt)
        return res

# 15/15 cases passed (300 ms)
# Your runtime beats 5.01 % of python3 submissions
# Your memory usage beats 5 % of python3 submissions (19.5 MB)
```

### 2. DP
　　状态转移矩阵：f[i] = f[i / 2] + i % 2.

```python
# Time: O(num)
# Space: O(num)
class Solution:
    def countBits(self, num: int) -> List[int]:
        res = [0] * (num + 1)
        for i in range(num + 1):
            res[i] = res[i >> 1] + i % 2
        return res
# 15/15 cases passed (88 ms)
# Your runtime beats 56.5 % of python3 submissions
# Your memory usage beats 5 % of python3 submissions (19.6 MB)
```

## References
1. [338. Counting Bits](https://leetcode.com/problems/counting-bits/discuss/79557/How-we-handle-this-question-on-interview-Thinking-process-%2B-DP-solution)
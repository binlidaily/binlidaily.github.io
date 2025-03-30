---
layout: post
title: 326. Power of Three
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Math]
image: 
comments: true
published: true
---

## Description

Given an integer, write a function to determine if it is a power of three.

**Example 1:**

```
Input: 27
Output: true
```

**Example 2:**

```
Input: 0
Output: false
```

**Example 3:**

```
Input: 9
Output: true
```

**Example 4:**

```
Input: 45
Output: false
```

**Follow up:**
Could you do it without using any loop / recursion?


## Solutions
### 1. Iterative

```python
# Time: O(n)
# Sapce: O(1)
class Solution:
    def isPowerOfThree(self, n: int) -> bool:
        if n > 1:
            while n % 3 == 0: 
                n /= 3
        return n == 1

# 21038/21038 cases passed (56 ms)
# Your runtime beats 98.46 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

### 2. Trick

```python
# Time: O(n)
# Sapce: O(1)
class Solution:
    def isPowerOfThree(self, n: int) -> bool:
        return n > 0 and 1162261467 % n == 0

# 21038/21038 cases passed (72 ms)
# Your runtime beats 75.88 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```
## References
1. [326. Power of Three](https://leetcode.com/problems/power-of-three/description/)
---
layout: post
title: 914. X of a Kind in a Deck of Cards
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Array]
image: 
comments: true
published: true
---

## Description

In a deck of cards, each card has an integer written on it.

Return `true` if and only if you can choose `X >= 2` such that it is possible to split the entire deck into 1 or more groups of cards, where:

- Each group has exactly `X` cards.
- All the cards in each group have the same integer.


**Example 1:**

```
Input: [1,2,3,4,4,3,2,1]
Output: true
Explanation: Possible partition [1,1],[2,2],[3,3],[4,4]
```

**Example 2:**

```
Input: [1,1,1,2,2,2,3,3]
Output: false
Explanation: No possible partition.
```

**Example 3:**

```
Input: [1]
Output: false
Explanation: No possible partition.
```

**Example 4:**

```
Input: [1,1]
Output: true
Explanation: Possible partition [1,1]
```

**Example 5:**

```
Input: [1,1,2,2,2,2]
Output: true
Explanation: Possible partition [1,1],[2,2],[2,2]
```

**Note:**

1. `1 <= deck.length <= 10000`
2. `0 <= deck[i] < 10000`


## Solutions
### 1. Hash Table
　　本来想着直接存一个字典，看下 value 值是否都一样就可以了，后来发现，这个 group 里的值也可以和其他的 group 里的值一样，于是参考得到一个解决办法是，只要所有 value 值的最大公约数是大于 1 的，就说明多的那些可以拆成大小一致的 group！


```python
from functools import reduce
# Time: O(n)
# Space: O(n)
class Solution:
    def hasGroupsSizeX1(self, deck: List[int]) -> bool:
        def gcd(a, b):
            while b: 
                a, b = b, a % b
            return a
        count = collections.Counter(deck).values()
        return reduce(gcd, count) > 1

    def hasGroupsSizeX(self, deck: List[int]) -> bool:
        count = collections.Counter(deck).values()
        res = 0
        for cnt in count:
            res = self.gcd(cnt, res)
        return res > 1

    def gcd(self, a, b):
        while b:
            a, b = b, a % b
        return a

# 74/74 cases passed (144 ms)
# Your runtime beats 56.29 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```


### 2. Array
　　先给 nums 排序，接着两层遍历：
* 让 i 从 2 开始往后面遍历，把 i 当做每个 group 的大小
    * 在每一次遍历中，再从 0 开始检查没 i 个连续子数组转成 set 后大小是否为 1，是就返回真

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def hasGroupsSizeX(self, deck: List[int]) -> bool:
        n = len(deck)
        deck.sort()
        for i in range(2, n+1):
            if n % i == 0:
                flag = True
                j = 0
                while j < n:
                    if len(set(deck[j:j+i])) != 1:
                        flag = False
                    j += i
                if flag:
                    return True
        return False
# 69/69 cases passed (164 ms)
# Your runtime beats 14.11 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

## References
1. [914. X of a Kind in a Deck of Cards](https://leetcode.com/problems/x-of-a-kind-in-a-deck-of-cards/description/)
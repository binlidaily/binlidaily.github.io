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
### 1. Array

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def hasGroupsSizeX(self, deck: List[int]) -> bool:
        n = len(deck)
        deck.sort()
        for i in range(2, n+1):
            if n % i == 0:
                # count = n // i
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
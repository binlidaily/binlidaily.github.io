---
layout: post
title: 309. Best Time to Buy and Sell Stock with Cooldown
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DP]
image: 
comments: true
published: true
---

## Description

Say you have an array for which the *i*th element is the price of a given stock on day *i*.

Design an algorithm to find the maximum profit. You may complete as many transactions as you like (ie, buy one and sell one share of the stock multiple times) with the following restrictions:

- You may not engage in multiple transactions at the same time (ie, you must sell the stock before you buy again).
- After you sell your stock, you cannot buy stock on next day. (ie, cooldown 1 day)

**Example:**

```
Input: [1,2,3,0,2]
Output: 3 
Explanation: transactions = [buy, sell, cooldown, buy, sell]
```


## Solutions
### 1. Brute Force
　　搜索。

### 2. DP
![](/img/media/15824646842679.jpg)

　　三个状态的转变：

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        if len(prices) <= 1:
            return 0
        n = len(prices)
        rest = [0] * n
        hold = [-prices[0]] * n
        sold = [0] * n
        for i in range(1, n):
            rest[i] = max(rest[i-1], sold[i-1])
            hold[i] = max(hold[i-1], rest[i-1] - prices[i])
            sold[i] = hold[i-1] + prices[i]
        return max(rest[-1], sold[-1])

# 211/211 cases passed (40 ms)
# Your runtime beats 53.66 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

　　使用滚动数组，优化一下：

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        if len(prices) <= 1:
            return 0
        n = len(prices)
        rest = 0
        hold = -prices[0]
        sold = 0
        for i in range(1, n):
            pre_rest = rest
            rest = max(rest, sold)
            sold = hold + prices[i]
            hold = max(hold, pre_rest - prices[i])
        return max(rest, sold)

# 211/211 cases passed (36 ms)
# Your runtime beats 79.61 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [309. Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown)
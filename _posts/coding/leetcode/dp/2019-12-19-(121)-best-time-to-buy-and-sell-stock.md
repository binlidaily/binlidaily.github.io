---
layout: post
title: 121. Best Time to Buy and Sell Stock
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy]
image: 
comments: true
published: true
---

## Description

Say you have an array for which the *i*th element is the price of a given stock on day *i*.

If you were only permitted to complete at most one transaction (i.e., buy one and sell one share of the stock), design an algorithm to find the maximum profit.

Note that you cannot sell a stock before you buy one.

**Example 1:**

```
Input: [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
             Not 7-1 = 6, as selling price needs to be larger than buying price.
```

**Example 2:**

```
Input: [7,6,4,3,1]
Output: 0
Explanation: In this case, no transaction is done, i.e. max profit = 0.
```


## Solutions
### 1. DP

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        if not prices:
            return 0
        n = len(prices)
        min_v = float('inf')
        dp = [0 for _ in range(n+1)]
        
        for i in range(n):
            dp[i+1] = max(dp[i], prices[i] - min_v)
            if min_v > prices[i]:
                min_v = prices[i]
        return dp[n]
# 200/200 cases passed (76 ms)
# Your runtime beats 39.56 % of python3 submissions
# Your memory usage beats 55.17 % of python3 submissions (14 MB)
```

### 2. 根据题意
　　其实都用不着 DP，直接根据题意写就可以！

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        if not prices:
            return 0
        max_profit = 0
        lowest = float('inf')
        for price in prices:
            lowest = min(lowest, price)
            max_profit = max(max_profit, price - lowest)
        return max_profit
# 200/200 cases passed (56 ms)
# Your runtime beats 97.72 % of python3 submissions
# Your memory usage beats 96.55 % of python3 submissions (13.8 MB)
```
## References
1. [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
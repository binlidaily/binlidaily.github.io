---
layout: post
title: 714. Best Time to Buy and Sell Stock with Transaction Fee
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, DP]
image: 
comments: true
published: true
---

## Description

Your are given an array of integers `prices`, for which the `i`-th element is the price of a given stock on day `i`; and a non-negative integer `fee` representing a transaction fee.

You may complete as many transactions as you like, but you need to pay the transaction fee for each transaction. You may not buy more than 1 share of a stock at a time (ie. you must sell the stock share before you buy again.)

Return the maximum profit you can make.

**Example 1:**

```
Input: prices = [1, 3, 2, 8, 4, 9], fee = 2
Output: 8
Explanation: The maximum profit can be achieved by:
Buying at prices[0] = 1Selling at prices[3] = 8Buying at prices[4] = 4Selling at prices[5] = 9The total profit is ((8 - 1) - 2) + ((9 - 4) - 2) = 8.
```

**Note:**

`0 < prices.length <= 50000`.

`0 < prices[i] < 50000`.

`0 <= fee < 50000`.


## Solutions
### 1. DP

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def maxProfit(self, prices: List[int], fee: int) -> int:
        if not prices or len(prices) <= 1:
            return 0
        n = len(prices)
        buy = [0 for _ in range(n)]
        sell = [0 for _ in range(n)]
        buy[0] = -prices[0] - fee
        for i in range(1, n):
            buy[i] = max(buy[i - 1], sell[i - 1] - prices[i] - fee) # keep the same as day i-1, or buy from sell status at day i-1
            sell[i] = max(sell[i - 1], buy[i - 1] + prices[i])  # keep the same as day i-1, or sell from buy status at day i-1
        return sell[n - 1]
# 44/44 cases passed (920 ms)
# Your runtime beats 17.06 % of python3 submissions
# Your memory usage beats 12.5 % of python3 submissions (19.3 MB)
```

## References
1. [714. Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/description/)
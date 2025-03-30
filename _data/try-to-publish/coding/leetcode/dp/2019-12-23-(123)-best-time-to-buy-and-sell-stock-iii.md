---
layout: post
title: 123. Best Time to Buy and Sell Stock III
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, DP, Hard]
image: 
comments: true
published: true
---

## Description

Say you have an array for which the *i*th element is the price of a given stock on day *i*.

Design an algorithm to find the maximum profit. You may complete at most *two* transactions.

**Note:** You may not engage in multiple transactions at the same time (i.e., you must sell the stock before you buy again).

**Example 1:**

```
Input: [3,3,5,0,0,3,1,4]
Output: 6
Explanation: Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.
             Then buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3.
```

**Example 2:**

```
Input: [1,2,3,4,5]
Output: 4
Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
             Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are
             engaging multiple transactions at the same time. You must sell before buying again.
```

**Example 3:**

```
Input: [7,6,4,3,1]
Output: 0
Explanation: In this case, no transaction is done, i.e. max profit = 0.
```


## Solutions
　　最多交易两次，计算最大收益。

### 1. DP
　　最多进行 k 次交易，采用局部和全局最优解法，维护两个量。一个是当前到达第 i 天可以最多进行 j 次交易，最高的收益为：


```python
global[i][j] = max(local[i][j], global[i-1][j])
```

　　其中 local[i][j] 表示当前到达第 i 天，最多可进行 j 次交易，最后一次交易在当天卖出的最高利润为：

```python
local[i][j] = max(global[i-1][j-1] + max(diff, 0), local[i-1][j] + diff)
```

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        if not prices: return 0
        n = len(prices)
        g = [[0] * 3 for _ in range(n)]
        l = [[0] * 3 for _ in range(n)]
        for i in range(1, n):
            diff = prices[i] - prices[i - 1]
            for j in range(1, 3):
                l[i][j] = max(g[i - 1][j - 1] + max(diff, 0), l[i - 1][j] + diff)
                g[i][j] = max(l[i][j], g[i - 1][j])
        return g[-1][-1]
# 200/200 cases passed (108 ms)
# Your runtime beats 17.09 % of python3 submissions
# Your memory usage beats 36.36 % of python3 submissions (18.4 MB)
```

### 2. 前后扫描


## References
1. [123. Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii)
2. [Best Time to Buy and Sell Stock III -- LeetCode](https://blog.csdn.net/linhuanmars/article/details/23236995)
3. [Detail explanation of DP solution](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/discuss/135704/Detail-explanation-of-DP-solution)
4. [leetcode Best Time to Buy and Sell Stock](https://www.hrwhisper.me/leetcode-best-time-to-buy-and-sell-stock-i-ii-iii-iv/)
5. [123. Best Time to Buy and Sell Stock III - Python](https://www.jianshu.com/p/491c769bc5e5)
---
layout: post
title: 1155. Number of Dice Rolls With Target Sum
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, DP]
image: 
comments: true
published: true
---

You have d dice, and each die has f faces numbered 1, 2, ..., f.

Return the number of possible ways (out of fd total ways) modulo 10^9 + 7 to roll the dice so the sum of the face up numbers equals target.


Example 1:
```
Input: d = 1, f = 6, target = 3
Output: 1
Explanation: 
You throw one die with 6 faces.  There is only one way to get a sum of 3.
```
Example 2:
```
Input: d = 2, f = 6, target = 7
Output: 6
Explanation: 
You throw two dice, each with 6 faces.  There are 6 ways to get a sum of 7:
1+6, 2+5, 3+4, 4+3, 5+2, 6+1.
```
Example 3:
```
Input: d = 2, f = 5, target = 10
Output: 1
Explanation: 

You throw two dice, each with 5 faces.  There is only one way to get a sum of 10: 5+5.
```
Example 4:
```
Input: d = 1, f = 2, target = 3
Output: 0
Explanation: 
You throw one die with 2 faces.  There is no way to get a sum of 3.
```
Example 5:
```
Input: d = 30, f = 30, target = 500
Output: 222616187
Explanation: 
The answer must be returned modulo 10^9 + 7.
```

Constraints:

* 1 <= d, f <= 30
* 1 <= target <= 1000

## Solutions
### 动规
　　首先看下 dp[i][t] 表示什么，这里表示使用前 i 个色子能够拼出 t 数字的最多形式个数。
* 初始化
    * dp[0][0] = 1
* 状态转移
    * 掷骰子一次有 f 种可能
    * 

1. 只存两行降维
2. 滚动数组降维

　　top-down 的第一种方式，需要存储，结果发现一直跑不出 `30, 30, 500` 的例子。

```python
class Solution(object):
    def numRollsToTarget(self, d, f, target):
        """
        :type d: int
        :type f: int
        :type target: int
        :rtype: int
        """
        modulo = 10**9 + 7
        dp = [[0 for _ in range(target + 1)] for _ in range(d + 1)]
        dp[0][0] = 1
        def dynamic_programming(i, t):
            if i == 0:
                return 1 if t == 0 else 0
            lp = min(t, f)
            ans = 0
            for j in range(1, lp + 1):
                ans = (ans + dynamic_programming(i-1, t-j)) % modulo
            dp[i][t] = ans
            return ans
        dynamic_programming(d, target)
        return dp[d][target]
```

　　Top-down 不采用数组存储的方式，还是超时啊：


```python
class Solution(object):
    def numRollsToTarget(self, d, f, target):
        """
        :type d: int
        :type f: int
        :type target: int
        :rtype: int
        """
        modulo = 10**9 + 7
        def dynamic_programming(i, t):
            if i == 0:
                return 1 if t == 0 else 0
            lp = min(t, f)
            ans = 0
            for j in range(1, lp + 1):
                ans = (ans + dynamic_programming(i-1, t-j))
            return ans
        
        return dynamic_programming(d, target) % modulo
```

　　Bottom-up 的方法：

```python
class Solution(object):
    def numRollsToTarget(self, d, f, target):
        """
        :type d: int
        :type f: int
        :type target: int
        :rtype: int
        """
        modulo = 10 ** 9 + 7
        dp = [[0 for _ in range(target + 1)] for _ in range(d + 1)]
        dp[0][0] = 1
        
        for i in range(1, d + 1):
            for j in range(1, target + 1):
                lp = min(j, f)
                for k in range(1, lp + 1):
                    dp[i][j] += dp[i - 1][j - k]
        return dp[d][target] % modulo
Runtime: 780 ms, faster than 33.97% of Python online submissions for Number of Dice Rolls With Target Sum.
Memory Usage: 12.1 MB, less than 100.00% of Python online submissions for Number of Dice Rolls With Target Sum.
```

　　还有一种非常快的操作：


```python
class Solution(object):
    def numRollsToTarget(self, d, f, target):
        """
        :type d: int
        :type f: int
        :type target: int
        :rtype: int
        """
        if target < d or target > d * f:
            return 0

        dp = [0] * (target + 1)
        if target > d * (1 + f) / 2:
            target = d * (1 + f) - target
        for i in range(1, min(f, target) + 1):
            dp[i] = 1

        for i in range(2, d + 1):
            new_dp = [0] * (target + 1)
            for j in range(i, min(target, i * f) + 1):
                new_dp[j] = new_dp[j - 1] + dp[j - 1]
                if j - 1 > f:
                    new_dp[j] -= dp[j - f - 1]
            dp = new_dp

        return dp[target] % (10 ** 9 + 7)
```

### 滚动数组优化
　　只需要一行，逆序计算，从右边开始计算：

![-w731](/img/media/15663916565537.jpg)

```python
class Solution(object):
    def numRollsToTarget(self, d, f, target):
        """
        :type d: int
        :type f: int
        :type target: int
        :rtype: int
        """
        modulo = 10**9 + 7
        dp = [0 for _ in range(target + 1)]
        dp[0] = 1
        for i in range(1, d + 1):
            for k in range(target, -1, -1):
                dp[k] = 0
                lp = min(f, k)
                for j in range(1, lp + 1):
                    dp[k] = (dp[k] + dp[k-j])  % modulo
        return dp[target]
```

## References
1. [1155. Number of Dice Rolls With Target Sum](https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/)
2. [花花酱 LeetCode 1155. Number of Dice Rolls With Target Sum](https://www.youtube.com/watch?v=J9s7402s5FA&list=PLLuMmzMTgVK7vEbeHBDD42pqqG36jhuOr)
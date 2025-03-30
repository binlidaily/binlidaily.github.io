---
layout: post
title: 279. Perfect Squares
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DP]
image: 
comments: true
published: true
---

## Description

Given a positive integer *n*, find the least number of perfect square numbers (for example, `1, 4, 9, 16, ...`) which sum to *n*.

**Example 1:**

```
Input: n = 12
Output: 3 
Explanation: 12 = 4 + 4 + 4.
```

**Example 2:**

```
Input: n = 13
Output: 2
Explanation: 13 = 4 + 9.
```


## Solutions
　　题意很简明，找到加和为 n 的最小个数的完全平方数，如 1，4，6，16 等。

### 1. DP
　　面试中遇到过的题目，当场只给出了思路，还不对，要继续加油啊！查看了下前辈的思路，用动规来做，**我们定义 dp[i] 为整数 i 最少能分解成多少个正整数的平方和**：

```python
dp[i + j * j] = min(dp[i + j * j], dp[i] + 1)
```

<p align="center">
  <img width="" height="" src="/img/media/15621643227158.jpg">
</p>

　　参考下得到这样的结果，也是对照之后才写出来的，还得注意：

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def numSquares(self, n: int) -> int:
        if n <= 0 :
            return 0
        dp = [float('inf')] * (n + 1)
        dp[0] = 0
        for i in range(1, n+1):
            j = 1
            while j * j <= n:
                dp[i] = min(dp[i], dp[i - j * j] + 1)
                j += 1
        return dp[n]
```

　　之前 DP 这种解法还行，现在可能改了测试样例，会超时。要先计算得到所有的平方数：


```python
class Solution:
   def numSquares(self, n: int) -> int:
        square_nums = [i**2 for i in range(0, int(n ** 0.5)+1)]
        
        dp = [float('inf')] * (n+1)
        # bottom case
        dp[0] = 0
        
        for i in range(1, n+1):
            for square in square_nums:
                if i < square:
                    break
                dp[i] = min(dp[i], dp[i-square] + 1)
        
        return dp[-1]
# 588/588 cases passed (4584 ms)
# Your runtime beats 36.9 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

### 2. 四平方定理
　　参考 submit 的结果看到原来有四平方定理：

```python
class Solution:
    def numSquares(self, n: int) -> int:
        '''
        思路：四平方定理（任何一个整数都可以表示成四个数的平方和）
        1.由于一个数如果含有因子4，那么我们可以把4都去掉，并不影响结果
        2.等于4的情况：如果一个数除以8余7的话，那么肯定是由4个完全平方数组成
        3.等于2或者1的情况：如果一个数由2个平方数组成，如果其中一个平方数是0，那么就是1，如果不是0，那就是2。
        4.等于3的情况：其他
        '''
        if n <= 0:
            return 1
        
        while n % 4 == 0:
            n = n / 4
        # 等于4的情况
        if n % 8 == 7:
            return 4
        
        i = 0
        while i * i <= n:
            j = int((n - i * i) ** 0.5)
            if i * i + j * j == n:
                if i == 0 or j == 0:
                    return 1
                else:
                    return 2
            i = i + 1
        return 3

# 588/588 cases passed (28 ms)
# Your runtime beats 99.54 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [279. Perfect Squares](https://leetcode.com/problems/perfect-squares/)
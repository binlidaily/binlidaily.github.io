---
layout: post
title: 813. Largest Sum of Averages
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DP]
image: 
comments: true
published: true
---

## Description

We partition a row of numbers `A` into at most `K` adjacent (non-empty) groups, then our score is the sum of the average of each group. What is the largest score we can achieve?

Note that our partition must use every number in A, and that scores are not necessarily integers.

```
Example:
Input: 
A = [9,1,2,3,9]
K = 3
Output: 20
Explanation: 
The best choice is to partition A into [9], [1, 2, 3], [9]. The answer is 9 + (1 + 2 + 3) / 3 + 9 = 20.
We could have also partitioned A into [9, 1], [2], [3, 9], for example.
That partition would lead to a score of 5 + 2 + 6 = 13, which is worse.
```

**Note:**

- `1 <= A.length <= 100`.
- `1 <= A[i] <= 10000`.
- `1 <= K <= A.length`.
- Answers within `10^-6` of the correct answer will be accepted as correct.


## Solutions
### 1. DP
* dp[i][1] represent the largest sum of averages of front i's element in A when K = 1, namely the mean of subarray A[0] ~A[i - 1].
* dp[i][k] = max(dp[i][k], dp[j][k - 1] + 1.0 * (sum[i] - sum[j]) / (i - j)) means we split the k subarray to k -1 subarray in A[0] ~A[j - 1] and one more subarray from A[j] ~A[i - 1], use the sum we already computed, we can get this subarray's mean easily.

```python
# Time: O(nk^2)
# Time: O(n*k)
class Solution:
    def largestSumOfAverages(self, A: List[int], K: int) -> float:
        if not A:
            return 0
        n = len(A)

        sumA = [0 for _ in range(n+1)]
        for i in range(n):
            sumA[i+1] = sumA[i] + A[i]

        if K <= 1:
            return 1.0 * sumA[n] / n
        
        if K >= n:
            return sumA[n]

        dp = [[0 for _ in range(K + 1)] for _ in range(n + 1)]
        # k = 1
        for i in range(1, n+1):
            dp[i][1] = (1.0 * sumA[i]) / i
        # k = 2...K
        for k in range(2, K+1):
            for i in range(k, n+1):
                j = i - 1
                while j >= k - 1:
                    dp[i][k] = max(dp[i][k], dp[j][k - 1] + 1.0 * (sumA[i] - sumA[j]) / (i - j))
                    j -= 1

        return dp[n][K]
# 51/51 cases passed (320 ms)
# Your runtime beats 46.04 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [813. Largest Sum of Averages](https://leetcode.com/problems/largest-sum-of-averages/)
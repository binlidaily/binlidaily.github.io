---
layout: post
title: 985. Sum of Even Numbers After Queries
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Array]
image: 
comments: true
published: true
---

## Description

We have an array `A` of integers, and an array `queries` of queries.

For the `i`-th query `val = queries[i][0], index = queries[i][1]`, we add val to `A[index]`. Then, the answer to the `i`-th query is the sum of the even values of `A`.

*(Here, the given `index = queries[i][1]` is a 0-based index, and each query permanently modifies the array `A`.)*

Return the answer to all queries. Your `answer` array should have `answer[i]` as the answer to the `i`-th query.

 

**Example 1:**

```
Input: A = [1,2,3,4], queries = [[1,0],[-3,1],[-4,0],[2,3]]
Output: [8,6,2,4]
Explanation: 
At the beginning, the array is [1,2,3,4].
After adding 1 to A[0], the array is [2,2,3,4], and the sum of even values is 2 + 2 + 4 = 8.
After adding -3 to A[1], the array is [2,-1,3,4], and the sum of even values is 2 + 4 = 6.
After adding -4 to A[0], the array is [-2,-1,3,4], and the sum of even values is -2 + 4 = 2.
After adding 2 to A[3], the array is [-2,-1,3,6], and the sum of even values is -2 + 6 = 4.
```

 

**Note:**

1. `1 <= A.length <= 10000`
2. `-10000 <= A[i] <= 10000`
3. `1 <= queries.length <= 10000`
4. `-10000 <= queries[i][0] <= 10000`
5. `0 <= queries[i][1] < A.length`


## Solutions
　　题意比较简单，每次 query，都把对应的数加到对应位置上，然后计算数列中所有偶数的和。

### 1. Array

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def sumEvenAfterQueries(self, A: List[int], queries: List[List[int]]) -> List[int]:
        res = []
        pre_sum = self.get_even_sum(A)
        for val, idx in queries:
            if A[idx] % 2 == 0 and val % 2 == 0:
                pre_sum += val
            elif A[idx] % 2 != 0 and val % 2 != 0:
                pre_sum += val + A[idx]
            elif A[idx] % 2 == 0 and val % 2 != 0:
                pre_sum -= A[idx]
            else: # A[idx] % 2 != 0 and val % 2 == 0
                pass
            A[idx] += val
            res.append(pre_sum)
        return res
    
    def get_even_sum(self, A):
        if not A: 
            return 0
        sum_v = 0
        for a in A:
            if a % 2 == 0:
                sum_v += a
        return sum_v

# 58/58 cases passed (548 ms)
# Your runtime beats 82.58 % of python3 submissions
# Your memory usage beats 5.88 % of python3 submissions (18.8 MB)
```

## References
1. [985. Sum of Even Numbers After Queries](https://leetcode.com/problems/sum-of-even-numbers-after-queries/description/)
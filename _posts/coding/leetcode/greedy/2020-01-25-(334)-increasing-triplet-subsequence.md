---
layout: post
title: 334. Increasing Triplet Subsequence
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Greedy]
image: 
comments: true
published: true
---

## Description

Given an unsorted array return whether an increasing subsequence of length 3 exists or not in the array.

Formally the function should:

> Return true if there exists *i, j, k*
> such that *arr[i]* < *arr[j]* < *arr[k]* given 0 ≤ *i* < *j* < *k* ≤ *n*-1 else return false.

**Note:** Your algorithm should run in O(*n*) time complexity and O(*1*) space complexity.

**Example 1:**

```
Input: [1,2,3,4,5]
Output: true
```

**Example 2:**

```
Input: [5,4,3,2,1]
Output: false
```


## Solutions
### 1. DP
　　尝试用 DP 的方式，DP[i] 表示到 i 位置为止，一共有多少个递增的子序列。
* 外层循环 $i$，从左到右扫描
* 内层循环 $j$，从 $i$ 位置往左扫描：
    * 如果有 nums[j] < nums[i]，说明有增序，需要更新 dp[i] 的值

　　双层循环，是很难很快的，本题结果也是 TLE。

```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def increasingTriplet(self, nums: List[int]) -> bool:
        if not nums or len(nums) < 3:
            return False
        n = len(nums)
        dp = [1 for i in range(n)]
        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:
                    dp[i] = max(dp[j] + 1, dp[i])
                    if dp[i] >= 3:
                        return True
        return False
# Time Limit Exceeded
# 61/62 cases passed (N/A)
```

### 2. Greedy
　　使用贪心的算法，我们用两个变量 first 和 second 分别储存第一小和第二小（初始化都是无穷大）的数，然后第三个数 num 就通过遍历来获取，同时通过大小关系更新前面的两个变量：
1. 如果 num <= first：更新 first = num
2. 不满足 1 的前提下，如果 num <= second：更新 second = num
3. 其他情况就满足 first < second < num，即满足条件，返回

　　一定要注意条件 1 和 2 中的等于的情况！因为题目要求的是不含等于的情况。

![](/img/media/15831525097133.jpg)

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def increasingTriplet(self, nums: List[int]) -> bool:
        if not nums or len(nums) < 3:
            return False
        n = len(nums)
        first = second = float('inf')
        for i in range(n):
            if nums[i] <= first:
                first = nums[i]
            elif nums[i] <= second:
                second = nums[i]
            else:
                return True
        return False
# 62/62 cases passed (52 ms)
# Your runtime beats 82.14 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.2 MB)
```

　　这种方法没有办法拓展？如果子序列是其他数位呢？有没有更加泛化的解法？

## References
1. [334. Increasing Triplet Subsequence](https://leetcode.com/problems/increasing-triplet-subsequence/description/)
2. [huahua](http://zxi.mytechroad.com/blog/greedy/leetcode-334-increasing-triplet-subsequence/)
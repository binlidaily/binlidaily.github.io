---
layout: post
title: 560. Subarray Sum Equals K
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Hash Table]
image: 
comments: true
published: true
---

## Description

Given an array of integers and an integer **k**, you need to find the total number of continuous subarrays whose sum equals to **k**.

**Example 1:**

```
Input:nums = [1,1,1], k = 2
Output: 2
```



**Note:**

1. The length of the array is in range [1, 20,000].
2. The range of numbers in the array is [-1000, 1000] and the range of the integer **k** is [-1e7, 1e7].


## Solutions
### 1. Brute Force

```python
# Time: O(n^3)
# Space: O(n)
class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        n = len(nums)
        res = 0
        for i in range(n):
            for j in range(i, n):
                if sum(nums[i:j+1]) == k:
                    res += 1
        return res

# Time Limit Exceeded
# 58/80 cases passed (N/A)
```

### 2. Prefix Sum
　　空间换时间，优化了一点。
```python
# Time: O(n^2)
# Space: O(n)
class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        n = len(nums)
        res = 0
        prefix_sum = [0] * n
        for i in range(n):
            prefix_sum[i] = prefix_sum[i-1] + nums[i]

        for i in range(n):
            for j in range(i, n):
                if prefix_sum[j] - prefix_sum[i] + nums[i] == k:
                    res += 1
        return res
# Time Limit Exceeded
# 69/80 cases passed (N/A)
```

### 3. Hash Table

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        # Keep tracking the prefix sums and their counts
        counts = collections.defaultdict()
        counts[0] = 1
        cur_sum, res = 0, 0
        for num in nums:
            cur_sum += num
            res += counts.get(cur_sum - k, 0)
            counts[cur_sum] = counts.get(cur_sum, 0) + 1
        return res
# 80/80 cases passed (108 ms)
# Your runtime beats 92.07 % of python3 submissions
# Your memory usage beats 96 % of python3 submissions (15.2 MB)
```
## References
1. [560. Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)

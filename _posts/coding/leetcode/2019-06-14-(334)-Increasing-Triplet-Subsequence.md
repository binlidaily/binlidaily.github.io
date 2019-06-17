---
layout: post
title: 334. Increasing Triplet Subsequence
subtitle: 递增字串问题
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given an unsorted array return whether an increasing subsequence of length 3 exists or not in the array.

Formally the function should:

Return true if there exists i, j, k 
such that arr[i] < arr[j] < arr[k] given 0 ≤ i < j < k ≤ n-1 else return false.
Note: Your algorithm should run in O(n) time complexity and O(1) space complexity.

Example 1:
```
Input: [1,2,3,4,5]
Output: true
```
Example 2:
```
Input: [5,4,3,2,1]
Output: false
```

## Solutions
　　写了个暴力解决，果然超时了：
```python
class Solution(object):
    def increasingTriplet(self, nums):
        """
        :type nums: List[int]
        :rtype: bool
        """
        if nums is None or len(nums) < 3:
            return False
        
        n = len(nums)
        
        pre = float('inf')
        count = 1
        for i in range(n-2):
            for j in range(i+1, n-1):
                for k in range(j+1, n):
                    if nums[i] < nums[j] < nums[k]:
                        return True
        return False
```

　　参考得到一种 $O(n^2)$ 的解法：
```python
class Solution(object):
    def increasingTriplet(self, nums):
        if len(nums) < 3:
            return False
        i,j,k = 0,1,2
        while k < len(nums):
            if nums[i] < nums[j] < nums[k]:
                return True
            while nums[i] >= nums[j]:
                i = j
                j, k = i + 1, i + 2
                if k > len(nums) -1 :
                    return False
            while nums[j] >= nums[k]:
                k += 1
                if k > len(nums) - 1:
                    j, k = j + 1, j + 2
                    break
# Runtime: 40 ms, faster than 76.41% of Python online submissions for Increasing Triplet Subsequence.
# Memory Usage: 12.3 MB, less than 25.08% of Python online submissions for Increasing Triplet Subsequence.
```

　　还有一种玄学的 $O(n)$ 解法：
```python
class Solution(object):
    def increasingTriplet(self, nums):
        if len(nums) < 3:
            return False
        first = second = float('inf')
        for n in nums:
            if n <= first:
                first = n
            elif n <= second:
                second = n
            else:
                return True
        return False
# Runtime: 36 ms, faster than 82.74% of Python online submissions for Increasing Triplet Subsequence.
# Memory Usage: 12.2 MB, less than 68.20% of Python online submissions for Increasing Triplet Subsequence.
```
　　如果这里限制不是 3，而是拓展到 n 又该怎么做呢？
## References
1. [334. Increasing Triplet Subsequence](https://leetcode.com/problems/increasing-triplet-subsequence/)
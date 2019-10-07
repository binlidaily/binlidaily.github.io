---
layout: post
title: 300. Longest Increasing Subsequence
subtitle: 递增字串问题
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given an unsorted array of integers, find the length of longest increasing subsequence.

Example:
```
Input: [10,9,2,5,3,7,101,18]
Output: 4 
Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4. 
```
Note:
```
* There may be more than one LIS combination, it is only necessary for you to return the length.
* Your algorithm should run in O(n2) complexity.
```
Follow up: Could you improve it to O(n log n) time complexity?

## Solutions
### 1. DP
　　采用动态规划的解决方法，维护一个 dp 数组，其中 dp[i] 表示以 nums[i] 结尾的最长递增字串长度，对于每一个 nums[i]，我们从第一个数再搜索到 i，如果发现某个数小于 nums[i]，我们就更新 dp[i]，更新方法是 `dp[i] = max(dp[i], dp[j] + 1)`，即比较当前 dp[i] 的值和那个小于 num[i] 的数的 dp 值加 1 的大小，我们就这样不断的更新 dp数组，到最后 dp 数组中最大的值就是我们要返回的 LIS 的长度。

```python
# Time Complexity: O(n^2)
# Space Complexity: O(n)
class Solution(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        n = len(nums)
        dp = [1] * n
        
        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:
                    dp[i] = max(dp[i], dp[j] + 1)
        
        return max(dp) if dp else 0
```

### 2. 加上 Binary Search 提升到 O(nlogn)
　　按照前人的思考，我们可以维护一个数组 tails 用来存储不同大小下的子序列最小的那个元素，tails[i] 表示长度为 i+1 的子序列中最小的最后一个数。举个栗子，当 `nums = [4,5,6,3]` 时：

```python
len = 1   :      [4], [5], [6], [3]   => tails[0] = 3
len = 2   :      [4, 5], [5, 6]       => tails[1] = 5
len = 3   :      [4, 5, 6]            => tails[2] = 6
```

　　因为不同大小的子序列下都是取最小元素，能想到 tails 数组肯定是递增的。那么在往后遍历时，我们就需要更新 tails 数组，在找合适位置更新时就可以用到二分法了。

　　每一步我们都是采取下述其中之一的方式进行操作，遍历完得到最后的 tails 数组大小即可：

```python
1. 如果 x 大于 tails 中所有的数，那么直接 append x 到 tails 中，大小增 1 即可
2. 如果 tails[i-1] < x <= tails[i]，那么更新 tails[i]
```

```python
# Time Complexity: O(nlogn)
# Space Complexity: O(n)
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = [0] * len(nums)
        size = 0
        for x in nums:
            i, j = 0, size
            while i != j:
                m = (i + j) >> 1
                if tails[m] < x:
                    i = m + 1
                else:
                    j = m
            tails[i] = x
            size = max(i + 1, size)
        return size
# Runtime: 44 ms, faster than 96.94% of Python3 online submissions for Longest Increasing Subsequence.
# Memory Usage: 13.8 MB, less than 5.13% of Python3 online submissions for Longest Increasing Subsequence.
```

　　可以将上述解法修改成保存 tails 数组的方式
```python
# Time Complexity: O(nlogn)
# Space Complexity: O(n)
class Solution(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        tails = []
        n = len(nums)
        for i in range(n):
            left, right = 0, len(tails)
            while left < right:
                mid = (left + right) >> 1
                if tails[mid] < nums[i]:
                    left = mid + 1
                else:
                    right = mid
            if right >= len(tails):
                tails.append(nums[i])
            else:
                tails[left] = nums[i]
        return len(tails)
# Runtime: 52 ms, faster than 79.46% of Python3 online submissions for Longest Increasing Subsequence.
# Memory Usage: 14.1 MB, less than 5.13% of Python3 online submissions for Longest Increasing Subsequence.
```

## References
1. [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
2. [Longest Increasing Subsequence ](http://bookshadow.com/weblog/2015/11/03/leetcode-longest-increasing-subsequence/)
3. [Longest Increasing Subsequence 最长递增子序列](https://www.cnblogs.com/grandyang/p/4938187.html)
4. [Java/Python Binary search O(nlogn) time with explanation](https://leetcode.com/problems/longest-increasing-subsequence/discuss/74824/JavaPython-Binary-search-O(nlogn)-time-with-explanation)
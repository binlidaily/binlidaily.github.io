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
　　按照前人的思考，我们可以维护一个数组 ends，这个数组用来记录遍历时得到的单调递增的数据序列，该序列大小即为想要的结果，而其对应的序列不一定为要对应的递增序列。
1. 如果遍历到的数比 ends 首个数小，直接替换。
2. 如果遍历到的数比 ends 末尾数大，那么就补充到 ends 末尾。
3. 如果遍历到的数位于 ends 中间，就用二分法找到对应的位置替换。

```python
class Solution(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        if nums is None or len(nums) <= 0:
            return 0
        ends = [nums[0]]
        for num in nums:
            if num < ends[0]:
                ends[0] = num
            elif num > ends[-1]:
                ends.append(num)
            else:
                left, right = 0, len(ends)
                while left < right:
                    mid = (left+ right) / 2
                    if ends[mid] < num:
                        left = mid + 1
                    else:
                        right = mid
                ends[left] = num
        return len(ends)
# Runtime: 28 ms, faster than 91.63% of Python online submissions for Longest Increasing Subsequence.
# Memory Usage: 12.1 MB, less than 12.60% of Python online submissions for Longest Increasing Subsequence.
```

　　可以将上述解法修改成对应比较好理解的方式：
```python
class Solution(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        dp = []
        n = len(nums)
        for i in range(n):
            left, right = 0, len(dp)
            while left < right:
                mid = (left + right) / 2
                if dp[mid] < nums[i]:
                    left = mid + 1
                else:
                    right = mid
            if right >= len(dp):
                dp.append(nums[i])
            else:
                dp[left] = nums[i]
        return len(dp)
# Runtime: 28 ms, faster than 91.63% of Python online submissions for Longest Increasing Subsequence.
# Memory Usage: 11.9 MB, less than 54.04% of Python online submissions for Longest Increasing Subsequence.
```

## References
1. [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
2. [Longest Increasing Subsequence ](http://bookshadow.com/weblog/2015/11/03/leetcode-longest-increasing-subsequence/)
3. [Longest Increasing Subsequence 最长递增子序列](https://www.cnblogs.com/grandyang/p/4938187.html)
4. [Java/Python Binary search O(nlogn) time with explanation](https://leetcode.com/problems/longest-increasing-subsequence/discuss/74824/JavaPython-Binary-search-O(nlogn)-time-with-explanation)
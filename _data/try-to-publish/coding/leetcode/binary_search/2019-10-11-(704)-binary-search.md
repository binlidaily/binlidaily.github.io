---
layout: post
title: 704. Binary Search
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---
Given a sorted (in ascending order) integer array nums of n elements and a target value, write a function to search target in nums. If target exists, then return its index, otherwise return -1.


Example 1:
```
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
```
Example 2:
```
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1
```

Note:

1. You may assume that all elements in nums are unique.
2. n will be in the range [1, 10000].
3. The value of each element in nums will be in the range [-9999, 9999].

## Solutions
### 1. 递归方法
　　注意判断条件，right 最开始要是 n-1（不然在计算时会出现索引越界），且在判断返回为 -1 时，要选择 `left > right`（left 和 right 相等是，求得的 mid 还是相同的数，是满足查找条件的）。

```python
# Time Complexity: O(logn)
# Space Complexity: O(1)
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        if not nums:
            return -1
        left, right = 0, len(nums)-1
        return self.binary_search(nums, left, right, target)
    
    def binary_search(self, nums: List[int], left: int, right: int, target: int) -> int:
        if left > right:
            return -1
        mid = (left + right) >> 1
        if nums[mid] == target:
            return mid
        elif nums[mid] > target:
            right = mid - 1
        else:
            left = mid + 1
        return self.binary_search(nums, left, right, target)
# Runtime: 304 ms, faster than 10.61% of Python3 online submissions for Binary Search.
# Memory Usage: 15 MB, less than 6.45% of Python3 online submissions for Binary Search.
```

### 2. 迭代方法
　　迭代相对来说会快一点，没有重复进出调用栈。

```python
# Time Complexity: O(logn)
# Space Complexity: O(1)
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        if not nums:
            return -1
        left, right = 0, len(nums)-1
        while left <= right:
            mid = (left + right) >> 1
            if nums[mid] == target:
                return mid
            elif nums[mid] > target:
                right = mid - 1
            else:
                left = mid + 1
        return -1
# Runtime: 292 ms, faster than 41.46% of Python3 online submissions for Binary Search.
# Memory Usage: 15 MB, less than 6.45% of Python3 online submissions for Binary Search.
```
## References
1. [704. Binary Search](https://leetcode.com/problems/binary-search/)
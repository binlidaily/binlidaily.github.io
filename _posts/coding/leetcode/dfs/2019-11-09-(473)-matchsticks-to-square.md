---
layout: post
title: 473. Matchsticks to Square
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, DFS, Medium]
image: 
comments: true
published: true
---

Remember the story of Little Match Girl? By now, you know exactly what matchsticks the little match girl has, please find out a way you can make one square by using up all those matchsticks. You should not break any stick, but you can link them up, and each matchstick must be used **exactly** one time.

Your input will be several matchsticks the girl has, represented with their stick length. Your output will either be true or false, to represent whether you could make one square using all the matchsticks the little match girl has.

**Example 1:**

```
Input: [1,1,2,2,2]
Output: true

Explanation: You can form a square with length 2, one side of the square came two sticks with length 1.
```



**Example 2:**

```
Input: [3,3,3,3,4]
Output: false

Explanation: You cannot find a way to form a square with all the matchsticks.
```



**Note:**

1. The length sum of the given matchsticks is in the range of `0` to `10^9`.
2. The length of the given matchstick array will not exceed `15`.

## Solutions
### 1. DFS-回溯法
　　没有整明白！

```python
# Time Complexity: O(n^2)
# Space Complexity: O(n)
class Solution:
    def makesquare(self, nums: List[int]) -> bool:
        if not nums or len(nums) < 4:
            return False
        sum_ = sum(nums)
        div, mod = divmod(sum_, 4)
        if mod != 0 or div < max(nums):
            return False
        nums.sort(reverse=True)
        target = [div] * 4
        return self.dfs(nums, 0, target)
        
    def dfs(self, nums, idx, target):
        # traverse all num, if not False, return True
        if idx == len(nums):
            return True
        num = nums[idx]
        for i in range(4):
            if target[i] >= num:
                target[i] -= num
                if self.dfs(nums, idx+1, target):
                    return True
                target[i] += num
        return False
# Runtime: 1452 ms, faster than 47.32% of Python3 online submissions for Matchsticks to Square.
# Memory Usage: 12.8 MB, less than 100.00% of Python3 online submissions for Matchsticks to Square.
```

　　这个好理解很多，注意要将 nums 从大到小排序，不然容易超时了！

```python
# Time Complexity: O(n^2)
# Space Complexity: O(n)
class Solution:
    def makesquare(self, nums: List[int]) -> bool:
        if not nums or len(nums) < 4:
            return False
        sum_ = sum(nums)
        div, mod = divmod(sum_, 4)
        if mod != 0 or div < max(nums):
            return False
        sums = [0] * 4
        nums.sort(reverse=True)
        return self.dfs(nums, sums, 0, div)
        
    def dfs(self, nums, sums, idx, target):
        # traverse all num, if not False, return True
        if idx == len(nums):
            if sums[0] == target and sums[1] == target and sums[2] == target and sums[3] == target:
                return True
            else:
                return False

        for i in range(4):
            if sums[i] + nums[idx] > target:
                continue
            sums[i] += nums[idx]
            if self.dfs(nums, sums, idx+1, target):
                return True
            sums[i] -= nums[idx]
        return False
# Runtime: 1452 ms, faster than 47.32% of Python3 online submissions for Matchsticks to Square.
# Memory Usage: 12.8 MB, less than 100.00% of Python3 online submissions for Matchsticks to Square.
```

## References
1. [473. Matchsticks to Square](https://leetcode.com/problems/matchsticks-to-square/)
2. 相关题目
    1. [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)
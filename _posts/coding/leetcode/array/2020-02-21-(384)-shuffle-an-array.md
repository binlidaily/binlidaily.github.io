---
layout: post
title: 384. Shuffle an Array
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium]
image: 
comments: true
published: true
---

## Description

Shuffle a set of numbers without duplicates.

**Example:**

```
// Init an array with set 1, 2, and 3.
int[] nums = {1,2,3};
Solution solution = new Solution(nums);

// Shuffle the array [1,2,3] and return its result. Any permutation of [1,2,3] must equally likely to be returned.
solution.shuffle();

// Resets the array back to its original configuration [1,2,3].
solution.reset();

// Returns the random shuffling of array [1,2,3].
solution.shuffle();
```


## Solutions
### 1. Backtracking
　　超时。
```python
# Time: O(nlogn)
# Space: O(n)
from random import randint
class Solution:

    def __init__(self, nums: List[int]):
        self.nums = nums

    def reset(self) -> List[int]:
        """
        Resets the array to its original configuration and return it.
        """
        return self.nums

    def shuffle(self) -> List[int]:
        """
        Returns a random shuffling of the array.
        """
        visited = set()
        permutations = []
        self.dfs(visited, [], permutations)
        n = len(permutations)
        ran = randint(0, n-1)
        print(ran)
        return permutations[ran]


    def dfs(self, visited, path, res):
        if len(path) == len(self.nums):
            res.append(path)
            return
        
        for num in self.nums:
            if num in visited:
                continue
            visited.add(num)
            self.dfs(visited, path + [num], res)
            visited.remove(num)

# Your Solution object will be instantiated and called as such:
# obj = Solution(nums)
# param_1 = obj.reset()
# param_2 = obj.shuffle()
# Time Limit Exceeded
# 2/10 cases passed (N/A)
```

### 2. Rand

```python
# Time: O(n)
# Space: O(n)
from random import randint
class Solution:

    def __init__(self, nums: List[int]):
        self.nums = nums

    def reset(self) -> List[int]:
        """
        Resets the array to its original configuration and return it.
        """
        return self.nums

    def shuffle(self) -> List[int]:
        """
        Returns a random shuffling of the array.
        """
        n = len(self.nums)
        nums = self.nums[:]
        for i in range(n):
            j = randint(0, i)
            nums[i], nums[j] = nums[j], nums[i]
        return nums
# Your Solution object will be instantiated and called as such:
# obj = Solution(nums)
# param_1 = obj.reset()
# param_2 = obj.shuffle()
# Time Limit Exceeded
# 2/10 cases passed (N/A)

# 10/10 cases passed (324 ms)
# Your runtime beats 64.42 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (18.1 MB)
```

## References
1. [384. Shuffle an Array](https://leetcode.com/problems/shuffle-an-array/description/)
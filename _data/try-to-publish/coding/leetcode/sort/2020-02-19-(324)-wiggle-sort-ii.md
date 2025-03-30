---
layout: post
title: 324. Wiggle Sort II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Sort]
image: 
comments: true
published: true
---

## Description

Given an unsorted array `nums`, reorder it such that `nums[0] < nums[1] > nums[2] < nums[3]...`.

**Example 1:**

```
Input: nums = [1, 5, 1, 1, 6, 4]
Output: One possible answer is [1, 4, 1, 5, 1, 6].
```

**Example 2:**

```
Input: nums = [1, 3, 2, 2, 3, 1]
Output: One possible answer is [2, 3, 1, 3, 1, 2].
```

**Note:**
You may assume all input has valid answer.

**Follow Up:**
Can you do it in O(n) time and/or in-place with O(1) extra space?


## Solutions
### 1. Sort

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def wiggleSort(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        nums.sort()
        mid = len(nums[::2])
        nums[::2], nums[1::2] = nums[:mid][::-1], nums[mid:][::-1]

# 44/44 cases passed (172 ms)
# Your runtime beats 86.52 % of python3 submissions
# Your memory usage beats 11.11 % of python3 submissions (15.7 MB)
```

### 2. Quick Sort - median

```python
from random import randint
# Time: O(n)
# Space: O(1)
class Solution:
    def wiggleSort(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        def findKthLargest(nums, k):
            left, right = 0, len(nums) - 1
            while left <= right:
                pivot_idx = randint(left, right)
                new_pivot_idx = partitionAroundPivot(left, right, pivot_idx, nums)
                if new_pivot_idx == k - 1:
                    return nums[new_pivot_idx]
                elif new_pivot_idx > k - 1:
                    right = new_pivot_idx - 1
                else:  # new_pivot_idx < k - 1.
                    left = new_pivot_idx + 1

        def partitionAroundPivot(left, right, pivot_idx, nums):
            pivot_value = nums[pivot_idx]
            new_pivot_idx = left
            nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
            for i in range(left, right):
                if nums[i] > pivot_value:
                    nums[i], nums[new_pivot_idx] = nums[new_pivot_idx], nums[i]
                    new_pivot_idx += 1
            nums[right], nums[new_pivot_idx] = nums[new_pivot_idx], nums[right]
            return new_pivot_idx

        def reversedTriPartitionWithVI(nums, val):
            def idx(i, N):
                return (1 + 2 * (i)) % N

            N = len(nums) // 2 * 2 + 1
            i, j, n = 0, 0, len(nums) - 1
            while j <= n:
                if nums[idx(j, N)] > val:
                    nums[idx(i, N)], nums[idx(j, N)] = nums[idx(j, N)], nums[idx(i, N)]
                    i += 1
                    j += 1
                elif nums[idx(j, N)] < val:
                    nums[idx(j, N)], nums[idx(n, N)] = nums[idx(n, N)], nums[idx(j, N)]
                    n -= 1
                else:
                    j += 1

        mid = (len(nums) - 1) // 2
        findKthLargest(nums, mid + 1)
        reversedTriPartitionWithVI(nums, nums[mid])

# 44/44 cases passed (3140 ms)
# Your runtime beats 5.02 % of python3 submissions
# Your memory usage beats 11.11 % of python3 submissions (15.4 MB)
```


```python
import statistics

class Solution:
    def wiggleSort(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        med= statistics.median(nums)
        l, m, r=0, 0, len(nums) - 1
        
        while m<=r:
            m_ind=self.A(m,nums)
            if nums[m_ind]>med:
                l_ind=self.A(l,nums)
                nums[l_ind],nums[m_ind]=nums[m_ind],nums[l_ind]                               
                l+=1
                m+=1
            elif nums[m_ind]<med: 
                r_ind=self.A(r,nums)
                nums[m_ind],nums[r_ind]=nums[r_ind],nums[m_ind]
                r-=1
            else:
                m+=1
        

    def A(self,i,nums):  
        n=len(nums)
        return(1+2*(i)) % (n|1)
# 44/44 cases passed (228 ms)
# Your runtime beats 25.71 % of python3 submissions
# Your memory usage beats 11.11 % of python3 submissions (15.9 MB)
```
## References
1. [324. Wiggle Sort II](https://leetcode.com/problems/wiggle-sort-ii/description/)
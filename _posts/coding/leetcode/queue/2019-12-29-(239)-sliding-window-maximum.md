---
layout: post
title: 239. Sliding Window Maximum
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Queue]
image: 
comments: true
published: true
---

## Description

Given an array *nums*, there is a sliding window of size *k* which is moving from the very left of the array to the very right. You can only see the *k* numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.

**Example:**

```
Input: nums = [1,3,-1,-3,5,3,6,7], and k = 3
Output: [3,3,5,5,6,7] 
Explanation: 

Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

**Note:**
You may assume *k* is always valid, 1 ≤ k ≤ input array's size for non-empty array.

**Follow up:**
Could you solve it in linear time?


## Solutions
### 1. Two-End Queue

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        if not nums:
            return []
        n = len(nums)
        if n <= k:
            return [max(nums)]
        res = []
        # the front of the two-end queue stores the max in the window
        qmax = []
        for i in range(n):
            if not qmax:
                qmax.insert(0, i)
            elif nums[i] < nums[qmax[-1]]:
                qmax.append(i)
            else:
                while qmax and nums[i] >= nums[qmax[-1]]:
                    qmax.pop()
                qmax.append(i)
            if i >= k-1:
                while qmax and i - qmax[0] + 1 > k:
                    qmax.pop(0)
                res.append(nums[qmax[0]])
        return res
# 18/18 cases passed (184 ms)
# Your runtime beats 54.31 % of python3 submissions
# Your memory usage beats 80.77 % of python3 submissions (19.6 MB)
```

　　自己实现的太多 if-else 了，优化一下，更优雅一些：

```python
# Time: O(n)
# Space: O(n)
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        if not nums:
            return []
        n = len(nums)
        if n <= k:
            return [max(nums)]
        res = []
        # the front of the two-end queue stores the max in the window
        qmax = []
        for i in range(n):
            while qmax and nums[i] > nums[qmax[-1]]:
                qmax.pop()
            qmax.append(i)
            if i >= k - 1:
                while qmax and i - qmax[0] + 1 > k:
                    qmax.pop(0)
                res.append(nums[qmax[0]])
        return res
# 18/18 cases passed (180 ms)
# Your runtime beats 61.53 % of python3 submissions
# Your memory usage beats 80.77 % of python3 submissions (19.6 MB)
```

### 2. Array
　　操作数组：

```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        if not nums: return([])
        
        max_cur = max(nums[:k])
        
        ans = [max_cur]
        for i,j in enumerate(nums):
            if i>=k:
                if j>=max_cur:
                    max_cur = max([max_cur,j])
                    ans.append(max_cur)
                else:
                    if nums[i-k]<max_cur:
                        ans.append(max_cur)
                    else:
                        max_cur = max(nums[i-k+1:i+1])
                        ans.append(max_cur)
        return(ans)
```
## References
1. [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
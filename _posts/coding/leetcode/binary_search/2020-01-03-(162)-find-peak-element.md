---
layout: post
title: 162. Find Peak Element
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Binary Search]
image: 
comments: true
published: true
---

## Description

A peak element is an element that is greater than its neighbors.

Given an input array `nums`, where `nums[i] ≠ nums[i+1]`, find a peak element and return its index.

The array may contain multiple peaks, in that case return the index to any one of the peaks is fine.

You may imagine that `nums[-1] = nums[n] = -∞`.

**Example 1:**

```
Input: nums = [1,2,3,1]
Output: 2
Explanation: 3 is a peak element and your function should return the index number 2.
```

**Example 2:**

```
Input: nums = [1,2,1,3,5,6,4]
Output: 1 or 5 
Explanation: Your function can return either index number 1 where the peak element is 2, 
             or index number 5 where the peak element is 6.
```

**Note:**

Your solution should be in logarithmic complexity.


## Solutions
### 1. Binary Search
　　这样看条件还挺多。
```python
# Time: O(logn)
# Space: O(1)
class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        if not nums:
            return -1

        n = len(nums)
        if n == 1:
            return 0
        l, r = 0, n - 1
        while l < r-1:
            mid = l + (r - l) // 2
            if nums[mid-1] < nums[mid] > nums[mid+1]:
                return mid
            if nums[mid+1] > nums[mid]:
                l = mid + 1
            else:
                r = mid - 1
        return l if nums[l] > nums[r] else r
# 59/59 cases passed (40 ms)
# Your runtime beats 91.44 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.7 MB)
```

　　有大牛的简洁版：


```python
# Time: O(logn)
# Space: O(1)
class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        if not nums:
            return -1
        n = len(nums)
        if n == 1:
            return 0
        l, r = 0, n - 1
        while l < r:
            mid = l + (r - l) // 2
            if nums[mid] < nums[mid+1]:
                l = mid + 1
            else:
                r = mid
        return l
# 59/59 cases passed (44 ms)
# Your runtime beats 72.82 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## 找局部最小值

```c++
class Solution {
public:
    int getLessIndex(vector<int> arr) {
        int n = arr.size();
        if(n == 0)
        {
            return -1;
        }
        if(n == 1 || arr[0] < arr[1])
        {
            return 0;
        }
        if(arr[n-1] < arr[n-2])
        {
            return n-1;
        }
        int l = 1;
        int r = n - 2;
        int mid = -1;
        while(l <= r)
        {
            mid = l + (r - l) / 2;
            if(arr[mid-1] > arr[mid] && arr[mid] < arr[mid+1])
            {
                return mid;
            }
            else if(arr[mid-1] < arr[mid])
            {
                r = mid - 1;
            }
            else
            {
                l = mid + 1;
            }
        }
        return -1;
    }
};
```
## References
1. [162. Find Peak Element](https://leetcode.com/problems/find-peak-element/)
2. [Solution](https://leetcode.com/problems/find-peak-element/discuss/50259/My-clean-and-readable-python-solution)
3. [Solution 2](https://leetcode.com/problems/find-peak-element/discuss/50232/Find-the-maximum-by-binary-search-(recursion-and-iteration))
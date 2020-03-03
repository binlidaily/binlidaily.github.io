---
layout: post
title: 238. Product of Array Except Self
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Array, Medium]
image: 
comments: true
published: true
---

## Description
Given an array `nums` of *n* integers where *n* > 1,  return an array `output` such that `output[i]` is equal to the product of all the elements of `nums` except `nums[i]`.

**Example:**

```
Input:  [1,2,3,4]
Output: [24,12,8,6]
```

**Note:** Please solve it **without division** and in O(*n*).

**Follow up:**
Could you solve it with constant space complexity? (The output array **does not** count as extra space for the purpose of space complexity analysis.)

## Solutions
　　第一反应是先将所有的数乘起来得出一个结果，然后再遍历一遍除去每一个数。但是要求说不要用这么方式，而且试了下之后，这种方式要防止分母是零的情况。

　　另外一种可行的解决方案就是，从头扫遍历相乘到当前位置，然后从尾遍历相乘到当前位置。所以分两个循环来遍历，将两次遍历结果存在一个 product 中，实现对接。
1. 第一个循环遍历的是从头开始一直乘到当前位置，除去当前值
2. 第二个循环遍历的是从尾巴开始一直乘到当前位置，除去当前值

### 1. DP-分段乘积
　　难点是对每个位置的数，都要计算剩余 n-1 个位置的乘积，且要求在 $O(n)$ 的时间复杂度里进行。那么我们可以用两次 $O(n)$ 的循环来实现，第一次循环找到从开始到当前位置前一个位置的乘积，第二次循环找到后面的乘积。

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        if not nums:
            return []
        n = len(nums)
        res = [1 for _ in range(n)]

        for i in range(1, n):
            res[i] = res[i-1] * nums[i-1]
        right_prod = 1
        for i in range(n-2, -1, -1):
            right_prod *= nums[i+1]
            res[i] = res[i] * right_prod
        return res

# 17/17 cases passed (120 ms)
# Your runtime beats 87.45 % of python3 submissions
# Your memory usage beats 96 % of python3 submissions (19.5 MB)
```

　　注意在第二次遍历时，右边累加的情况，需要一个辅助的变量，累乘右侧的结果。
## References
1. [238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)
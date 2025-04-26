---
layout: post
title: 169. Majority Element
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Bit Manipulation]
image: 
comments: true
published: true
---

## Description

Given an array of size *n*, find the majority element. The majority element is the element that appears **more than** `⌊ n/2 ⌋` times.

You may assume that the array is non-empty and the majority element always exist in the array.

**Example 1:**

```
Input: [3,2,3]
Output: 3
```

**Example 2:**

```
Input: [2,2,1,1,1,2,2]
Output: 2
```


## Solutions
### 1. Sort
　　要求找到占一半以上的数，那么排序找中间数即可。

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        nums.sort()
        return nums[len(nums) // 2]

# 44/44 cases passed (172 ms)
# Your runtime beats 85.91 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14 MB)
```

### 2. Bit Manipulation
　　占据一半以上的数有一个特点就是，从 bit 位上看：
* 每一位上的 1 或 0 都是占大多数的（每个数位上一般以上是啥，最终结果在该数位上肯定是啥）
* 所以只需要在外层遍历 32 位的每一位，然后将 1 左移遍历指针 i，让 i 位为 1，其他为 0，统计 1 的个数
    * 如果超过半数，则最后结果在该位上为 1，用结果值与该位取或
    * 如果没有超过一般，则最后结果该位上为 0，不作额外才做，默认就为零。


```python
# Time: O(n)
# Space: O(n)
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        n = len(nums)
        majority = 0
        for i in range(32):
            mask = 1 << i
            count = 0
            for num in nums:
                if num & mask:
                    count += 1
            if count > n // 2:
                majority |= mask
        return majority if majority >> 31 == 0 else majority - (1 << 32)

# 44/44 cases passed (172 ms)
# Your runtime beats 85.91 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14 MB)
```

## References
1. [169. Majority Element](https://leetcode.com/problems/majority-element/description/)
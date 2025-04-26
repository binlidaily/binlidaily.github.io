---
layout: post
title: 179. Largest Number
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Sort, Medium]
image: 
comments: true
published: true
---

## Description

Given a list of non negative integers, arrange them such that they form the largest number.

**Example 1:**

```
Input: [10,2]
Output: "210"
```

**Example 2:**

```
Input: [3,30,34,5,9]
Output: "9534330"
```

**Note:** The result may be very large, so you need to return a string instead of an integer.

## Solutions
### 1. Backtracking
　　搜索会超时。

```python
class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        if not nums:
            return ''
        res = ['']
        self.dfs(nums, '', res)
        return res[0]
    
    def dfs(self, nums, path, res):
        if not nums or len(nums) == 0:
            if res[0] == '':
                res[0] = path
            elif float(path) > float(res[0]):
                res[0] = path
            return
        
        n = len(nums)
        for i in range(n):
            self.dfs(nums[:i]+nums[i+1:], path+str(nums[i]), res)
# Time Limit Exceeded
# 35/222 cases passed (N/A)
# Testcase
# [1,2,3,4,5,6,7,8,9,0]
```

### 2. Sort
　　举例子试一下就会发现是直接通过新建一种比较大小的顺序，来讲数据排序就可以了，这里比较大小的方式就是看两个字符换位置连接后比较数值大小。


```python
class compare(str):
    def __lt__(x, y):
        return x+y > y+x

class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        # res = ''.join(sorted(map(str, nums), key=lambda x, y: int(x+y)-int(y+x)))
        res = ''.join(sorted([str(v) for v in nums], key=compare))
        return res if res[0]!='0' else '0'
# 222/222 cases passed (36 ms)
# Your runtime beats 93.4 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

```python
# Python 2
class Solution:
    def largestNumber(self, numbers):
        # write code here
        if numbers is None:
            return None
        str_numbers = [str(i) for i in numbers]
        res = sorted(str_numbers, cmp=lambda x, y: cmp(x+y, y+x))
        return ''.join(res)
```

### 3. 神操作

```python
class Solution:
    def helper(self,nums,i):
        if int(nums[i+1]+nums[i]) > int(nums[i]+nums[i+1]):
            nums[i], nums[i+1] = nums[i+1],nums[i]
    def largestNumber(self, nums) -> str:
        nums = [str(item) for item in nums]
        nums.sort(reverse=True)
        for j in range(1, len(nums)):
            for i in range(0, len(nums)-j):
                if nums[i+1] in nums[i] and nums[i+1] != nums[i]:
                    self.helper(nums, i)
        return str(int(''.join(nums)))
```

```python
class Solution:
    def largestNumber(self, nums):
        if set(nums) == {0}:
            return '0'
        nums = list(map(str,nums))
        len_list = list(map(len,nums))
        max_len = max(len_list)
        min_len = min(len_list)
        i = max_len//min_len+1
        
        nums.sort(reverse = True,key=lambda x:x*i)
        return "".join(nums)
```
## References
1. [179. Largest Number](https://leetcode.com/problems/largest-number/description/)
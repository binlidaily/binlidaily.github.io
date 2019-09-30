---
layout: post
title: 287. Find the Duplicate Number
subtitle:
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given an array nums containing n + 1 integers where each integer is between 1 and n (inclusive), prove that at least one duplicate number must exist. Assume that there is only one duplicate number, find the duplicate one.

Example 1:
```
> Input: [1,3,4,2,2]
> Output: 2
```
Example 2:
```
> Input: [3,1,3,4,2]
> Output: 3
```
Note:

1. You must not modify the array (assume the array is read only).
2. You must use only constant, O(1) extra space.
3. Your runtime complexity should be less than O(n2).
4. There is only one duplicate number in the array, but it could be repeated more than once.


## Solutions
### 1. 暴力解法
　　首先，这个问题看起来很简单，不是就找重复的嘛？我直接用 List 或者用 Dict 来找就好了，但是细看规则，这里要求只能用 $O(1)$ 的 Space Complexity。但是我们可以先试下：
```python
class Solution(object):
    def findDuplicate(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        
        dup_list = {}
        for item in nums:
            if item in dup_list:
                return item
            else:
                dup_list[item] = 1
```

　　用 dict 写完后想用 list 也试下，结果发现改成 list 实现会报错 `Time Limit Exceeded`。

```python
 class Solution(object):
    def findDuplicate(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        
        dup_list = []
        for item in nums:
            if item in dup_list:
                return item
            else:
                dup_list.append(item)
```

　　分析了下原因很明显，因为用 list 的 in 来查找，其实就是 $O(n)$ 的时间复杂度啊！于是想办法找到空间复杂度为 $O(1)$ 的方式，看提示说可以将这个问题看成链表中判断是否有环的情况，然后有环的话找对应的环的入口。

```python
class Solution(object):
    def findDuplicate(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        
        # check the loop
        tortoise = nums[0]
        hase = nums[0]
        
        while True:
            tortoise = nums[tortoise]
            hase = nums[nums[hase]]
            if tortoise == hase:
                break
        
        # get the entrance of the loop
        idx1 = nums[0]
        idx2 = tortoise
        while idx1 != idx2:
            idx1 = nums[idx1]
            idx2 = nums[idx2]
        
        return idx1
```

![](/img/media/15438386827938.jpg)

We can conclude below from above diagram


**Distance traveled by fast pointer = 2 * (Distance traveled by slow pointer)**

$$(m + n*x + k) = 2*(m + n*y + k)$$

Note that before meeting the point shown above, fast
was moving at twice speed.

> x -->  Number of complete cyclic rounds made by fast pointer before they meet first time

> y -->  Number of complete cyclic rounds made by slow pointer before they meet first time

From above equation, we can conclude below

$$m + k = (x-2y)*n$$

Which means m+k is a multiple of n. 

## References
1. [287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)
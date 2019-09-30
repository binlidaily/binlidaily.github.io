---
layout: post
title: 287. Find the Duplicate Number
subtitle:
author: Bin Li
tags: [Coding, LeetCode, Array, Binary Search, Linked List]
image: 
comments: true
published: true
---

Given an array nums containing n + 1 integers where each integer is between 1 and n (inclusive), prove that at least one duplicate number must exist. Assume that there is only one duplicate number, find the duplicate one.

Example 1:
```
Input: [1,3,4,2,2]
Output: 2
```
Example 2:
```
Input: [3,1,3,4,2]
Output: 3
```
Note:

1. You must not modify the array (assume the array is read only).
2. You must use only constant, $O(1) extra space.
3. Your runtime complexity should be less than $O(n^2)$.
4. There is only one duplicate number in the array, but it could be repeated more than once.


## Solutions
### 1. 暴力解法
　　首先，这个问题看起来很简单，不是就找重复的嘛？我直接用 List 或者用 Dict 来找就好了，但是细看规则，这里要求只能用 $O(1)$ 的 Space Complexity。但是我们可以先试下：

```python
# Time Complexity: O(n)
# Space Complexity: O(n)
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
# Time Complexity: O(n^2)
# Space Complexity: O(n)
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

　　分析了下原因很明显，因为用 list 的 in 来查找，其实就是 $O(n)$ 的时间复杂度啊！

### 2. 二分查找
　　我们先找到对应的 mid 值，然后遍历数组中所有的数，统计小于等于 mid 的数的个数，如果个数个数小于等于 mid，说明重复的数实在 [mid+1, n] 之间，反之在 [1, m-1]。

```python
# Time Complexity: O(nlogn)
# Space Complexity: O(1)
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        l, r = 0, len(nums)
        cnt = 0
        while l <= r:
            # mid = (l+r) // 2
            mid = (l+r) >> 1
            cnt = 0
            for num in nums:
                if num <= mid:
                    cnt += 1
            if cnt <= mid:
                l = mid + 1
            else:
                r = mid - 1
        return l
# Runtime: 92 ms, faster than 22.02% of Python3 online submissions for Find the Duplicate Number.
# Memory Usage: 16.3 MB, less than 7.14% of Python3 online submissions for Find the Duplicate Number.
```

　　值得注意的是，除以 2 可以用位操作！

### 3. 链表有环找入口

　　于是想办法找到空间复杂度为 $O(1)$ 的方式，看提示说可以将这个问题看成链表中判断是否有环的情况，然后有环的话找对应的环的入口。

```shell
[1,3,4,2,2]
0->1->3->2->4->2 cycle: 2->4->2

[3,1,3,4,2]
0->3->4->2->3->4->2 cycle 3->4->2->3
```

```python
# Time Complexity: O(n)
# Space Complexity: O(1)
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        fast, slow = nums[0], nums[0]
        while True:
            fast = nums[nums[fast]]
            slow = nums[slow]
            if fast == slow:
                break
        fast = nums[0]
        while fast != slow:
            fast = nums[fast]
            slow = nums[slow]
        return fast
# Runtime: 68 ms, faster than 98.85% of Python3 online submissions for Find the Duplicate Number.
# Memory Usage: 16.2 MB, less than 7.14% of Python3 online submissions for Find the Duplicate Number.
```

### 4. 位操作
　　什么骚操作，都没看懂。

```python
# Time Complexity: O(kn)
# Space Complexity: O(1)
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        res, n = 0, len(nums)
        MAX_BITS = 32
        for i in range(MAX_BITS):
            bit, cnt1, cnt2 = 1 << i, 0, 0
            for j in range(n):
                if j & bit > 0:
                    cnt1 += 1
                if nums[j] & bit > 0:
                    cnt2 += 1
            if cnt2 > cnt1:
                res += bit
        return res
# Runtime: 216 ms, faster than 5.73% of Python3 online submissions for Find the Duplicate Number.
# Memory Usage: 16.1 MB, less than 7.14% of Python3 online submissions for Find the Duplicate Number.
```

## References
1. [287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)
2. [位操作解法](https://www.cnblogs.com/grandyang/p/4843654.html)
---
layout: post
title: Binary Search
subtitle: 二分查找
author: Bin Li
tags: [Coding]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　二分查找（Binary Search）是在有序数组中查找某一特定元素的搜索算法。主要的算法流程如下：
1. 从数组的中间元素开始搜索，如果中间元素即是需要查找的元素，即搜索过程结束。
2. 如果中间元素比要搜索的元素大，那么要搜索的元素就在中间元素的左侧（升序数组，否则在右侧），对左侧有序子数组进行相同的取中间元素再比较的过程；如果中间元素比要搜索的元素小，就对右侧子数组进行同样的操作。
3. 结束条件（递归出口）：如果子数组为空。


　　值得注意的是加减 1 缺少了，在做这种较简单的算法时可以画出图来：

<p align="center">
    <img src="/img/media/15510652001271.jpg" width="450">
</p>

　　Python 实现时可以分用不用左右边界坐标的方式，如利用递归的方式如下：
```python
def search(self, nums: List[int], target: int) -> int:
    if not nums:
        return -1
    left, right = 0, len(nums)-1
    return self.binary_search(nums, left, right, target)
    
def binary_search(self, nums: List[int], left: int, right: int, target: int) -> int:
    if left > right:
        return -1
    mid = (left + right) >> 1
    if nums[mid] == target:
        return mid
    elif nums[mid] > target:
        right = mid - 1
    else:
        left = mid + 1
    return self.binary_search(nums, left, right, target)
```

　　迭代的方式如下：
```python
def binarySearch(arr, l, r, x): 
  
    while l <= r: 
  
        mid = l + (r - l)/2; 
          
        # Check if x is present at mid 
        if arr[mid] == x: 
            return mid 
  
        # If x is greater, ignore left half 
        elif arr[mid] < x: 
            l = mid + 1
  
        # If x is smaller, ignore right half 
        else: 
            r = mid - 1
      
    # If we reach here, then the element 
    # was not present 
    return -1
```

## References
1. [Binary Search - geeksforgeeks](https://www.geeksforgeeks.org/binary-search/)
2. [二维数组中的查找](https://www.nowcoder.com/practice/abc3fe2ce8e146608e868a70efebf62e?tpId=13&tqId=11154&rp=1&ru=/ta/coding-interviews&qru=/ta/coding-interviews/question-ranking)
3. [【数据结构】折半查找（二分查找）](https://blog.csdn.net/coolingcoding/article/details/7983070)
4. [704. Binary Search](https://leetcode.com/problems/binary-search/)




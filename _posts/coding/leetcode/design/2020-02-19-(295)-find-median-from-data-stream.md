---
layout: post
title: 295. Find Median from Data Stream
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Heap]
image: 
comments: true
published: true
---

## Description

Median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value. So the median is the mean of the two middle value.

For example,

```
[2,3,4]`, the median is `3
[2,3]`, the median is `(2 + 3) / 2 = 2.5
```

Design a data structure that supports the following two operations:

- void addNum(int num) - Add a integer number from the data stream to the data structure.
- double findMedian() - Return the median of all elements so far.

 

**Example:**

```
addNum(1)
addNum(2)
findMedian() -> 1.5
addNum(3) 
findMedian() -> 2
```

 

**Follow up:**

1. If all integer numbers from the stream are between 0 and 100, how would you optimize it?
2. If 99% of all integer numbers from the stream are between 0 and 100, how would you optimize it?


## Solutions
### 1. List

```python
# Time: O(n)
# Sapce: O(n)
class MedianFinder:

    def __init__(self):
        """
        initialize your data structure here.
        """
        self.nums = []

    def addNum(self, num: int) -> None:
        if not self.nums:
            self.nums.append(num)
        else:
            n = len(self.nums)
            for i in range(n):
                if self.nums[i] > num:
                    self.nums = self.nums[:i] + [num] + self.nums[i:]
                    return
            self.nums.append(num)

    def findMedian(self) -> float:
        n = len(self.nums)
        if n % 2 == 0:
            two_sum = self.nums[n // 2 - 1] + self.nums[n // 2]
            return (two_sum) / 2 if two_sum > 0 else -1 * (abs(two_sum) / 2)
        else:
            return self.nums[n // 2] 

# Your MedianFinder object will be instantiated and called as such:
# obj = MedianFinder()
# obj.addNum(num)
# param_2 = obj.findMedian()

# Time Limit Exceeded
# 17/18 cases passed (N/A)
```

### 2. Heap
　　采用两个堆。

```python
import heapq
# Time: O(nlogn)
# Sapce: O(n)
class MedianFinder:

    def __init__(self):
        """
        initialize your data structure here.
        """
        self.small = [] # the smaller half of the list, use max heap (invert min-heap)
        self.large = [] # the larger half of the list, use min heap

    def addNum(self, num: int) -> None:
        if len(self.small) == len(self.large):
            heapq.heappush(self.large, -heapq.heappushpop(self.small, -num))
        else:
            heapq.heappush(self.small, -heapq.heappushpop(self.large, num))

    def findMedian(self) -> float:
        if len(self.small) == len(self.large):
            return float(self.large[0] - self.small[0]) / 2.0
        else:
            return float(self.large[0])

# 18/18 cases passed (192 ms)
# Your runtime beats 82.78 % of python3 submissions
# Your memory usage beats 46.67 % of python3 submissions (23.5 MB)
```

## References
1. [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/description/)
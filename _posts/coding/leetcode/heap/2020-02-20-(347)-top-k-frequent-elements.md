---
layout: post
title: 347. Top K Frequent Elements
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Hash Table, Heap]
image: 
comments: true
published: true
---

## Description

Given a non-empty array of integers, return the ***k\*** most frequent elements.

**Example 1:**

```
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
```

**Example 2:**

```
Input: nums = [1], k = 1
Output: [1]
```

**Note:**

- You may assume *k* is always valid, 1 ≤ *k* ≤ number of unique elements.
- Your algorithm's time complexity **must be** better than O(*n* log *n*), where *n* is the array's size.


## Solutions
### 1. Hash Table

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        hash_map = collections.defaultdict(int)
        for num in nums:
            if num not in hash_map:
                hash_map[num] = 1
            else:
                hash_map[num] += 1
        vals = sorted(hash_map.values())
        threshold = vals[-k]
        res = []
        for key, val in hash_map.items():
            if val >= threshold:
                res.append(key)
        return res

# 21/21 cases passed (92 ms)
# Your runtime beats 99.41 % of python3 submissions
# Your memory usage beats 6.25 % of python3 submissions (17.3 MB)
```
### 2. Heap

```python
# Time: O(nlogn)
# Space: O(n)
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        if not nums:
            return []
        frequency = collections.Counter(nums)
        heap = []
        for key, val in frequency.items():
            if len(heap) == k:
                heapq.heappushpop(heap, (val, key))
            else:
                heapq.heappush(heap, (val, key))
        res = []
        while k > 0:
            item = heapq.heappop(heap)
            res.append(item[1])
            k -= 1
        return res[::-1]

# 21/21 cases passed (100 ms)
# Your runtime beats 91.02 % of python3 submissions
# Your memory usage beats 6.25 % of python3 submissions (17.1 MB)
```

　　注意加入到堆的时候要将 val 放前面，默认采用第一个作为排序的元素。


## References
1. [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)
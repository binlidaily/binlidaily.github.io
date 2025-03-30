---
layout: post
title: 495. Teemo Attacking
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Array]
image: 
comments: true
published: true
---

## Description

In LOL world, there is a hero called Teemo and his attacking can make his enemy Ashe be in poisoned condition. Now, given the Teemo's attacking **ascending** time series towards Ashe and the poisoning time duration per Teemo's attacking, you need to output the total time that Ashe is in poisoned condition.

You may assume that Teemo attacks at the very beginning of a specific time point, and makes Ashe be in poisoned condition immediately.

**Example 1:**

```
Input: [1,4], 2
Output: 4
Explanation: At time point 1, Teemo starts attacking Ashe and makes Ashe be poisoned immediately. 
This poisoned status will last 2 seconds until the end of time point 2. 
And at time point 4, Teemo attacks Ashe again, and causes Ashe to be in poisoned status for another 2 seconds. 
So you finally need to output 4.
```

 

**Example 2:**

```
Input: [1,2], 2
Output: 3
Explanation: At time point 1, Teemo starts attacking Ashe and makes Ashe be poisoned. 
This poisoned status will last 2 seconds until the end of time point 2. 
However, at the beginning of time point 2, Teemo attacks Ashe again who is already in poisoned status. 
Since the poisoned status won't add up together, though the second poisoning attack will still work at time point 2, it will stop at the end of time point 3. 
So you finally need to output 3.
```

 

**Note:**

1. You may assume the length of given time series array won't exceed 10000.
2. You may assume the numbers in the Teemo's attacking time series and his poisoning time duration per attacking are non-negative integers, which won't exceed 10,000,000.


## Solutions
### 1. Direct
　　找到 duration 和 gap 之间比较小的加上。
```python
class Solution:
    def findPoisonedDuration(self, timeSeries: List[int], duration: int) -> int:
        if not timeSeries:
            return 0
        sumT = 0
        n = len(timeSeries)
        for i in range(n):
            if i >= 1 and duration > timeSeries[i] - timeSeries[i-1]:
                sumT += timeSeries[i] - timeSeries[i-1]
            else:
                sumT += duration
        return sumT

# 39/39 cases passed (280 ms)
# Your runtime beats 66.52 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14.2 MB)
```

## References
1. [495. Teemo Attacking](https://leetcode.com/problems/teemo-attacking/description/)
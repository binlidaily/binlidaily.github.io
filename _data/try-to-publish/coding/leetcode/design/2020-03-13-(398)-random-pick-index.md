---
layout: post
title: 398. Random Pick Index
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium]
image: 
comments: true
published: true
---

## Description

Given an array of integers with possible duplicates, randomly output the index of a given target number. You can assume that the given target number must exist in the array.

**Note:**
The array size can be very large. Solution that uses too much extra space will not pass the judge.

**Example:**

```
int[] nums = new int[] {1,2,3,3,3};
Solution solution = new Solution(nums);

// pick(3) should return either index 2, 3, or 4 randomly. Each index should have equal probability of returning.
solution.pick(3);

// pick(1) should return 0. Since in the array only nums[0] is equal to 1.
solution.pick(1);
```


## Solutions
### 1. Direct
　　题目看错了，上来就排序……，那还找什么坐标……🙄

```python
# Time: O(n)
# Space: O(n)
class Solution:

    def __init__(self, nums: List[int]):
        self.nums = nums

    def pick(self, target: int) -> int:
        idx = []
        for i, num in enumerate(self.nums):
            if num == target:
                idx.append(i)
        import random
        return random.choice(idx)

# Your Solution object will be instantiated and called as such:
# obj = Solution(nums)
# param_1 = obj.pick(target)

# 13/13 cases passed (300 ms)
# Your runtime beats 94.99 % of python3 submissions
# Your memory usage beats 33.33 % of python3 submissions (16.7 MB)
```

### 2. Reservoir Sampling
　　蓄水池采样算法（Reservoir Sampling）是说在一个流中，随机选择k个数字，保证每个数字被选择的概率相等。
1. 假设数据序列的规模为 n，需要采样的数量的为 k。
2. 首先构建一个可容纳 k 个元素的数组，将序列的前 k 个元素放入数组中。
3. 然后从第 k+1 个元素开始，以 k/cnt 的概率来决定该元素是否被替换到数组中（数组中的元素被替换的概率是相同的）。 当遍历完所有元素之后，数组中剩下的元素即为所需采取的样本。

```python
)
class Solution:

    def __init__(self, nums: List[int]):
        self.nums = nums

    def pick(self, target: int) -> int:
        import random
        res = -1
        count = 0
        for i, n in enumerate(self.nums):
            if n == target:
                count += 1 
                chance = random.randint(1, count)
                if chance == count:
                    res = i
        return res

# 13/13 cases passed (312 ms)
# Your runtime beats 78.28 % of python3 submissions
# Your memory usage beats 33.33 % of python3 submissions (16.7 MB)
```

## References
1. [398. Random Pick Index](https://leetcode.com/problems/random-pick-index/description/)
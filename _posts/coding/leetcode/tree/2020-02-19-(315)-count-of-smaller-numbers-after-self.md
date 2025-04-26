---
layout: post
title: 315. Count of Smaller Numbers After Self
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, BST]
image: 
comments: true
published: true
---

## Description

You are given an integer array *nums* and you have to return a new *counts* array. The *counts* array has the property where `counts[i]` is the number of smaller elements to the right of `nums[i]`.

**Example:**

```
Input: [5,2,6,1]
Output: [2,1,1,0] 
Explanation:
To the right of 5 there are 2 smaller elements (2 and 1).
To the right of 2 there is only 1 smaller element (1).
To the right of 6 there is 1 smaller element (1).
To the right of 1 there is 0 smaller element.
```


## Solutions
### 1. Brute Force - TLE

```python
# Time: O(n^2)
# Space: O(1)
class Solution:
    def countSmaller(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = []
        for i in range(n):
            cnt = 0
            for j in range(i, n):
                if nums[i] > nums[j]:
                    cnt += 1
            res.append(cnt)
        return res

# Time Limit Exceeded
# 15/16 cases passed (N/A)
```

### 2. BST

```python
# Time: O(nlogn - n^2)
# Space: O(n)
class BinarySearchTreeNode(object):
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.count = 1
        self.leftTreeSize = 0


class BinarySearchTree(object):
    def __init__(self):
        self.root = None

    def insert(self, val, root):
        if not root:
            self.root = BinarySearchTreeNode(val)
            return 0

        if val == root.val:
            root.count += 1
            return root.leftTreeSize

        if val < root.val:
            root.leftTreeSize += 1

            if not root.left:
                root.left = BinarySearchTreeNode(val)
                return 0
            return self.insert(val, root.left)

        if not root.right:
            root.right = BinarySearchTreeNode(val)
            return root.count + root.leftTreeSize

        return root.count + root.leftTreeSize + self.insert(
            val, root.right)


class Solution():
    def countSmaller(self, nums: List[int]) -> List[int]:
        tree = BinarySearchTree()
        return [
            tree.insert(nums[i], tree.root)
            for i in range(len(nums) - 1, -1, -1)
        ][::-1]

# 16/16 cases passed (180 ms)
# Your runtime beats 43.58 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (16.2 MB)
```
## References
1. [315. Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)
2. [huahua](https://www.youtube.com/watch?v=2SVLYsq5W8M)
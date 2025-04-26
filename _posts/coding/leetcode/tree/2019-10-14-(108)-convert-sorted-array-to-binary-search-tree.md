---
layout: post
title: 108. Convert Sorted Array to Binary Search Tree
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, DFS]
image: 
comments: true
published: true
---

## Description

Given an array where elements are sorted in ascending order, convert it to a height balanced BST.

For this problem, a height-balanced binary tree is defined as a binary tree in which the depth of the two subtrees of *every* node never differ by more than 1.

**Example:**

```
Given the sorted array: [-10,-3,0,5,9],

One possible answer is: [0,-3,9,-10,null,5], which represents the following height balanced BST:

      0
     / \
   -3   9
   /   /
 -10  5
```

## Solutions
　　这题考验理解 BST 的本质，首先大小关系，再者左右子树深度之差不超过 1。如何让树的高度最小呢？左右子树分到的结点个数尽量小即可。

### 1. DFS-递归
　　注意，解不是唯一的！

```python
# Time: O(nlogn)
# Space: O(n)
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> TreeNode:
        return self.dfs(nums, 0, len(nums) - 1)

    def dfs(self, nums, l, r):
        if l > r:
            return None
        mid = l + ((r - l) >> 1)
        root = TreeNode(nums[mid])
        root.left = self.dfs(nums, l, mid - 1)
        root.right = self.dfs(nums, mid + 1, r)
        return root

# 32/32 cases passed (64 ms)
# Your runtime beats 97.52 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (15.1 MB)
```

### 2. 迭代方法
　　[参考](https://blog.csdn.net/happyaaaaaaaaaaa/article/details/51496939)发现，迭代方法太复杂，使用两个栈。

## References
1. [108. Convert Sorted Array to Binary Search Tree](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/)
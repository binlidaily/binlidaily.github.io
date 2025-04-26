---
layout: post
title: 508. Most Frequent Subtree Sum
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Hash Table, Tree]
image: 
comments: true
published: true
---

## Description

Given the root of a tree, you are asked to find the most frequent subtree sum. The subtree sum of a node is defined as the sum of all the node values formed by the subtree rooted at that node (including the node itself). So what is the most frequent subtree sum value? If there is a tie, return all the values with the highest frequency in any order.

**Examples 1**
Input:

```
  5
 /  \
2   -3
```

return [2, -3, 4], since all the values happen only once, return all of them in any order.



**Examples 2**
Input:

```
  5
 /  \
2   -5
```

return [2], since 2 happens twice, however -5 only occur once.



**Note:** You may assume the sum of values in any subtree is in the range of 32-bit signed integer.


## Solutions
### 1. DFS + Hash Table
　　先用 DFS 遍历找到所有子树，同时计算出子树的加和，可以用一个参数存个结果，也可以用一个全局变量来存。最好用 Hash Table 来存，方便查找最多的相同结果，然后根据最大结果的个数筛选。

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
    def findFrequentTreeSum(self, root: TreeNode) -> List[int]:
        if not root:
            return []
        hash_table = collections.defaultdict()
        self.subtree_sum(root, hash_table)
        max_cnt = max(hash_table.values())
        return [key for key in hash_table.keys() if hash_table[key] == max_cnt]

    def subtree_sum(self, root, hash_table):
        if not root:
            return 0
        # this if can be deleted
        if not root.left and not root.right:
            hash_table[root.val] = hash_table.get(root.val, 0) + 1
            return root.val
        sum_val = root.val + self.subtree_sum(root.left, hash_table) + self.subtree_sum(root.right, hash_table)
        hash_table[sum_val] = hash_table.get(sum_val, 0) + 1
        return sum_val

# 61/61 cases passed (44 ms)
# Your runtime beats 88.12 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (15.8 MB)
```

## References
1. [508. Most Frequent Subtree Sum](https://leetcode.com/problems/most-frequent-subtree-sum/description/)
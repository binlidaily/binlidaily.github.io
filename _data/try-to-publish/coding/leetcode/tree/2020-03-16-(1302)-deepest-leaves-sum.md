---
layout: post
title: 1302. Deepest Leaves Sum
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Tree, BFS]
image: 
comments: true
published: true
---

## Description

Given a binary tree, return the sum of values of its deepest leaves.

 

**Example 1:**

![](/img/media/15843419105633.jpg)


```
Input: root = [1,2,3,4,5,null,6,7,null,null,null,null,8]
Output: 15
```

 

**Constraints:**

- The number of nodes in the tree is between `1` and `10^4`.
- The value of nodes is between `1` and `100`.


## Solutions
　　找到最后一层的所有叶子节点的加和。

### 1. BFS

```python
# Time: O(nlogn)
# Space: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def deepestLeavesSum(self, root: TreeNode) -> int:
        if not root:
            return 0
        queue = collections.deque()
        queue.append(root)
        res = 0
        while queue:
            size = len(queue)
            level_sum = 0
            for _ in range(size):
                node = queue.popleft()
                if not node:
                    continue
                level_sum += node.val
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            res = level_sum
        return res

# 15/15 cases passed (96 ms)
# Your runtime beats 70.8 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (16.3 MB)
```

## References
1. [1302. Deepest Leaves Sum](https://leetcode.com/problems/deepest-leaves-sum/description/)
---
layout: post
title: 563. Binary Tree Tilt
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Tree]
image: 
comments: true
published: true
---

## Description

Given a binary tree, return the tilt of the **whole tree**.

The tilt of a **tree node** is defined as the **absolute difference** between the sum of all left subtree node values and the sum of all right subtree node values. Null node has tilt 0.

The tilt of the **whole tree** is defined as the sum of all nodes' tilt.

**Example:**

```
Input: 
         1
       /   \
      2     3
Output: 1
Explanation: 
Tilt of node 2 : 0
Tilt of node 3 : 0
Tilt of node 1 : |2-3| = 1
Tilt of binary tree : 0 + 0 + 1 = 1
```



**Note:**

1. The sum of node values in any subtree won't exceed the range of 32-bit integer.
2. All the tilt values won't exceed the range of 32-bit integer.

## Solutions
　　主要是题意的理解，倾斜度的计算是要左子树和右子树所有节点值的和的差值。

### 1. Recurrence

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
    def findTilt(self, root: TreeNode) -> int:
        if not root:
            return 0
        return abs(self.nodeSum(root.left) - self.nodeSum(root.right)) + self.findTilt(root.left) + self.findTilt(root.right)
    
    def nodeSum(self, root):
        if not root:
            return 0
        return self.nodeSum(root.left) + self.nodeSum(root.right) + root.val

# 75/75 cases passed (596 ms)
# Your runtime beats 7.44 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (14.4 MB)
```

　　看了 submission，最快的把这两个过程放在一起了，真是厉害！


```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def findTilt(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        if not root: return 0
        return self.helper(root)[1]
        
    def helper(self, root):
        ltot = rtot = ltlt = rtlt = 0
        if root.left:
            ltot, ltlt = self.helper(root.left)
        if root.right:
            rtot, rtlt = self.helper(root.right)
        return (ltot + rtot + root.val, abs(ltot - rtot) + ltlt + rtlt)
```

## References
1. [563. Binary Tree Tilt](https://leetcode.com/problems/binary-tree-tilt/)
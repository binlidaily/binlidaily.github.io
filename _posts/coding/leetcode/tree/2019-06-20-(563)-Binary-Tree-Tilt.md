---
layout: post
title: 563. Binary Tree Tilt
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given a binary tree, return the tilt of the whole tree.

The tilt of a tree node is defined as the absolute difference between the sum of all left subtree node values and the sum of all right subtree node values. Null node has tilt 0.

The tilt of the whole tree is defined as the sum of all nodes' tilt.

Example:
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
Note:

1. The sum of node values in any subtree won't exceed the range of 32-bit integer.
2. All the tilt values won't exceed the range of 32-bit integer.

## Solutions
　　刚开始头脑一懵，写出了这么个很二的代码：
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
        if not root:
            return 0
        if root.left and root.right:
            return self.findTilt(root.left) + self.findTilt(root.right) + abs(root.left.val - root.right.val)
        elif root.left:
            return self.findTilt(root.left) + root.left.val
        elif root.right:
            return self.findTilt(root.right) + root.right.val
        else:
            return 0
```

　　真是唯恐子树为空啊，全是 if，结果还是错的。其实在递归的某一层的时候不要考虑下一层的结果啊，如果子树为空，那么在遍历到下一层时有为空的判断对应返回子树为空的结果就好了啊！

　　出现这个问题主要是对题意理解不是很对，这里的结点的值和倾斜度是不同的！

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def nodeSum(self, root):
        if not root:
            return 0
        return self.nodeSum(root.left) + self.nodeSum(root.right) + root.val
    
    def findTilt(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        if not root:
            return 0
        return abs(self.nodeSum(root.left) - self.nodeSum(root.right)) + self.findTilt(root.left) + self.findTilt(root.right)
            
# Runtime: 784 ms, faster than 6.94% of Python online submissions for Binary Tree Tilt.
# Memory Usage: 14.6 MB, less than 79.38% of Python online submissions for Binary Tree Tilt.
```
## References
1. [563. Binary Tree Tilt](https://leetcode.com/problems/binary-tree-tilt/)
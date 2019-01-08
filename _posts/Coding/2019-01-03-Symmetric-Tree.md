---
layout: post
title: 101. Symmetric Tree
subtitle:
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: false
---

## Description
Given a binary tree, check whether it is a mirror of itself (ie, symmetric around its center).

For example, this binary tree [1,2,2,3,4,4,3] is symmetric:
```
    1
   / \
  2   2
 / \ / \
3  4 4  3
```
But the following [1,2,2,null,3,null,3] is not:
```
    1
   / \
  2   2
   \   \
   3    3
```

Note:
Bonus points if you could solve it both recursively and iteratively.

## Solutions
第一印象是从根节点开始一个一个对比，应该用递归来做，但是发现如果将函数 isSymmetric 设计成递归的，似乎不好操作，因为可能会出现节点为 null 的情况。于是需要找到可以递归的部分，在对比查看对称的过程中，从当前结点开始，先检查左右子结点是否为空，如果都是空的，返回真，如果一个空返回假，其他情况表示子结点都不空，就继续递归。

```
    0
   / \
  l   r
 / \ / \
l  r l  r
```

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    
        
    def isSymmetric(self, root):
        """
        :type root: TreeNode
        :rtype: bool
        """
        def compare(left, right):
            if left is None and right is None:
                return True
            elif left is None or right is None:
                return False
            elif left.val != right.val:
                return False
            else:
                left_bool = compare(left.left, right.right)
                right_bool = compare(left.right, right.left)
                return left_bool & right_bool
            
        if root is None:
            return True
        else:
            return compare(root.left, root.right)
```

## References
1. [101. Symmetric Tree](https://leetcode.com/problems/symmetric-tree/)



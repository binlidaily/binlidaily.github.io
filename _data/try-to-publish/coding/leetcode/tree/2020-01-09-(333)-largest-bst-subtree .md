---
layout: post
title: 333. Largest BST Subtree 
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, Tree]
image: 
comments: true
published: true
---

## Description
Given a binary tree, find the largest subtree which is a Binary Search Tree (BST), where largest means subtree with largest number of nodes in it.


```python
Input: [10,5,15,1,8,null,7]

   10 
   / \ 
  5  15 
 / \   \ 
1   8   7

Output: 3
Explanation: The Largest BST Subtree in this case is the highlighted one.
             The return value is the subtree's size, which is 3.

```

Note:
* A subtree must include all of its descendants.

## Solutions
### 1. Recursion

```python
# Time:  O(n)
# Space: O(h)

class Solution(object):
    def largestBSTSubtree(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        if root is None:
            return 0

        max_size = [1]
        def largestBSTSubtreeHelper(root):
            if root.left is None and root.right is None:
                return 1, root.val, root.val

            left_size, left_min, left_max = 0, root.val, root.val
            if root.left is not None:
                left_size, left_min, left_max = largestBSTSubtreeHelper(root.left)

            right_size, right_min, right_max = 0, root.val, root.val
            if root.right is not None:
                right_size, right_min, right_max = largestBSTSubtreeHelper(root.right)

            size = 0
            if (root.left is None or left_size > 0) and \
               (root.right is None or right_size > 0) and \
               left_max <= root.val <= right_min:
                size = 1 + left_size + right_size
                max_size[0] = max(max_size[0], size)

            return size, left_min, right_max

        largestBSTSubtreeHelper(root)
        return max_size[0]
```

## References
1. [333. Largest BST Subtree](https://leetcode.com/problems/largest-bst-subtree)
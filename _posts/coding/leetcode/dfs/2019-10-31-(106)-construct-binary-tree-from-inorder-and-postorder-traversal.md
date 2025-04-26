---
layout: post
title: 106. Construct Binary Tree from Inorder and Postorder Traversal
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DFS, Tree]
image: 
comments: true
published: true
---

## Description

Given inorder and postorder traversal of a tree, construct the binary tree.

**Note:**
You may assume that duplicates do not exist in the tree.

For example, given

```
inorder = [9,3,15,20,7]
postorder = [9,15,7,20,3]
```

Return the following binary tree:

```
    3
   / \
  9  20
    /  \
   15   7
```

## Solutions
　　给定中序和后序遍历的结果，求先序遍历的结果。

### 1. DFS-递归

```python
# Time Complexity: O(n)
# Space Complexity: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> TreeNode:
        if not inorder or not postorder:
            return None
        
        root_i = inorder.index(postorder[-1])
        root = TreeNode(postorder[-1])
        root.left = self.buildTree(inorder[:root_i], postorder[:root_i])
        root.right = self.buildTree(inorder[root_i+1:], postorder[root_i:-1])
        
        return root
        
# Runtime: 208 ms, faster than 23.80% of Python3 online submissions for Construct Binary Tree from Inorder and Postorder Traversal.
# Memory Usage: 88.1 MB, less than 11.11% of Python3 online submissions for Construct Binary Tree from Inorder and Postorder Traversal.
```

### 2. DFS-递推

```python
# Time Complexity: O(n)
# Space Complexity: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> TreeNode:
        if (not postorder) or (not inorder) or (len(postorder) != len(inorder)):
            return None

        d = dict()
        for idx, val in enumerate(inorder):
            d[val] = idx
        head = TreeNode(postorder[-1])
        stack = [head]
        for i in range(len(inorder) - 2, -1, -1):
            val = postorder[i]
            node = TreeNode(val)
            if d[val] > d[stack[-1].val]:
                stack[-1].right = node
            else:
                while stack and d[val] < d[stack[-1].val]:
                    parent = stack.pop()
                parent.left = node
            stack.append(node)
        return head
# Runtime: 60 ms, faster than 94.62% of Python3 online submissions for Construct Binary Tree from Inorder and Postorder Traversal.
# Memory Usage: 15.1 MB, less than 100.00% of Python3 online submissions for Construct Binary Tree from Inorder and Postorder Traversal.
```
## References
1. [106. Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
2. 相关题目
    1. [105. Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
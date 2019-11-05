---
layout: post
title: 105. Construct Binary Tree from Preorder and Inorder Traversal
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, Medium]
image: 
comments: true
published: true
---


Given preorder and inorder traversal of a tree, construct the binary tree.

Note:
You may assume that duplicates do not exist in the tree.

For example, given
```
preorder = [3,9,20,15,7]
inorder = [9,3,15,20,7]
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
　　从先序遍历和中序遍历得到对应的二叉树。

### 1. DFS-递归
　　需要留意一下 inorder 中找到的 index 和 preorder 左子树个数的关系，其实 inorder 中找到的 root 的 index 指向的就是 preorder 中 root 加上左子树的截止的位置（包含）。

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
    def buildTree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        if not preorder or not inorder:
            return None
        root = TreeNode(preorder[0])
        index = inorder.index(preorder[0])
        
        left_inorder = inorder[:index]
        right_inorder = inorder[index+1:]
        left_preorder = preorder[1:index+1]
        right_preorder = preorder[index+1:]
        
        root.left = self.buildTree(left_preorder, left_inorder)
        root.right = self.buildTree(right_preorder, right_inorder)
        return root
# Runtime: 192 ms, faster than 40.03% of Python3 online submissions for Construct Binary Tree from Preorder and Inorder Traversal.
# Memory Usage: 88.6 MB, less than 13.16% of Python3 online submissions for Construct Binary Tree from Preorder and Inorder Traversal.
```

　　通过通过使用集合或者字典来优化速度，从提交的结果上看，使用字典会更快一些。


```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        map_inorder = {}
        for i, val in enumerate(inorder):
            map_inorder[val] = i
        def recurse(low, high):
            if low > high:
                return None
            x = TreeNode(preorder.pop(0))
            mid = map_inorder[x.val]
            x.left = recurse(low, mid-1)
            x.right = recurse(mid+1, high)
            return x
        return recurse(0, len(inorder)-1)
```

### 2. DFS-递推
　　看到高分的解法：
```python
# Time Complexity: O(n)
# Space Complexity: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        if (not preorder) or (not inorder) or (len(preorder) != len(inorder)):
            return None

        root = TreeNode(preorder[0])
        stack, index = [root], 0
        for i in range(1, len(preorder)):
            curr, prev = TreeNode(preorder[i]), None
            while stack and stack[-1].val == inorder[index]:
                prev = stack.pop()
                index += 1
            if prev:
                prev.right = curr
            else:
                stack[-1].left = curr
            stack.append(curr)
        return root
# Runtime: 60 ms, faster than 95.61% of Python3 online submissions for Construct Binary Tree from Preorder and Inorder Traversal.
# Memory Usage: 14.7 MB, less than 86.84% of Python3 online submissions for Construct Binary Tree from Preorder and Inorder Traversal.
```
## References
1. [105. Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
2. 相关题目
    * [106. Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
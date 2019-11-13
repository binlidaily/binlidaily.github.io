---
layout: post
title: 98. Validate Binary Search Tree
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given a binary tree, determine if it is a valid binary search tree (BST).

Assume a BST is defined as follows:

* The left subtree of a node contains only nodes with keys less than the node's key.
* The right subtree of a node contains only nodes with keys greater than the node's key.
* Both the left and right subtrees must also be binary search trees.
 

Example 1:
```
    2
   / \
  1   3

Input: [2,1,3]
Output: true
```
Example 2:
```
    5
   / \
  1   4
     / \
    3   6

Input: [5,1,4,null,null,3,6]
Output: false
Explanation: The root node's value is 5 but its right child's value is 4.
```

## Solutions
![-w357](/img/media/15630758213031.jpg)

　　采用递归的方法实现，子节点取值可以在最小值和最大值之间，左子树要比根节点小，右子树要比根节点大：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def validaBST(self, root, min_val, max_val):
        if not root:
            return True
        if root.val <= min_val or root.val >= max_val:
            return False
        return self.validaBST(root.left, min_val, root.val) and \
            self.validaBST(root.right, root.val, max_val)
    
    def isValidBST(self, root):
        """
        :type root: TreeNode
        :rtype: bool
        """
        return self.validaBST(root, float('-inf'), float('inf'))
# Runtime: 36 ms, faster than 72.76% of Python online submissions for Validate Binary Search Tree.
# Memory Usage: 16.4 MB, less than 66.11% of Python online submissions for Validate Binary Search Tree.
```

　　这里的问题是 hard code 了，因为设定了最大值和最小值，如果当树中类型发生改变后，这就不一定可行了。

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def validaBST(self, root, min_val, max_val):
        if not root:
            return True
        if (min_val is not None and root.val <= min_val) or \
                (max_val is not None and root.val >= max_val):
            return False
        return self.validaBST(root.left, min_val, root.val) and \
            self.validaBST(root.right, root.val, max_val)
    
    def isValidBST(self, root):
        """
        :type root: TreeNode
        :rtype: bool
        """
        return self.validaBST(root, None, None)
# Runtime: 24 ms, faster than 99.22% of Python online submissions for Validate Binary Search Tree.
# Memory Usage: 16.3 MB, less than 73.10% of Python online submissions for Validate Binary Search Tree.
```

　　使用中序的深度优先遍历，那么左子树，子节点，右子树的大小顺序是升序的：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):    
    def isValidBST(self, root):
        """
        :type root: TreeNode
        :rtype: bool
        """
        self.prev = None
        def validaBST(root):
            if not root:
                return True
            # 如果左子树递归结果为 False 就返回 False
            if not validaBST(root.left):
                return False
            # 前一个结点存的结果其实就是左子树的结果，如果左子树大于等于子节点就 返回 False
            if self.prev and self.prev.val >= root.val:
                return False
            self.prev = root
            return validaBST(root.right)
        return validaBST(root)
# Runtime: 36 ms, faster than 72.76% of Python online submissions for Validate Binary Search Tree.
# Memory Usage: 16.9 MB, less than 10.30% of Python online submissions for Validate Binary Search Tree.
```

　　采用迭代的方式再写一遍：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):    
    def isValidBST(self, root):
        """
        :type root: TreeNode
        :rtype: bool
        """
        if not root:
            return True
        prev = None
        stack = []
        while root or stack:
            while root:
                stack.append(root)
                root = root.left
            root = stack.pop()
            if prev and prev.val >= root.val:
                return False
            prev = root
            root = root.right
        return True
# Runtime: 32 ms, faster than 87.48% of Python online submissions for Validate Binary Search Tree.
# Memory Usage: 16.3 MB, less than 74.53% of Python online submissions for Validate Binary Search Tree.
```

　　注意外层的 while 中间用 or 连着，不用 and。

## References
1. [98. Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)
2. [花花酱 LeetCode 98. Validate Binary Search Tree](https://www.youtube.com/watch?v=Jq0Wk9xeQ0U)
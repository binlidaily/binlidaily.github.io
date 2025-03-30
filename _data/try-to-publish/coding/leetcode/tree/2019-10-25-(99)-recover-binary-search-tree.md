---
layout: post
title: 99. Recover Binary Search Tree
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, DFS, Tree, Hard]
image: 
comments: true
published: true
---

## Description

Two elements of a binary search tree (BST) are swapped by mistake.

Recover the tree without changing its structure.

Example 1:
```
Input: [1,3,null,null,2]

   1
  /
 3
  \
   2

Output: [3,1,null,null,2]

   3
  /
 1
  \
   2
```
Example 2:
```
Input: [3,1,4,null,null,2]

  3
 / \
1   4
   /
  2

Output: [2,1,4,null,null,3]

  2
 / \
1   4
   /
  3
```
Follow up:

* A solution using O(n) space is pretty straight forward.
* Could you devise a constant space solution?

## Solutions
### 1. DFS-中序遍历
　　首先明白如何判断发生了变化，可以通过中序遍历知道是否发生的改变。有两个数字位置发生了变化，有两种情况：
1. 这俩结点相邻，中序遍历后的数组只有一次降序出现
2. 这俩结点不相邻，则有两次降序
    1. 第一次降序记录其中较大的
    2. 第二次降序记录其中较小的

　　找到这两个发生错误的元素后再遍历一遍二叉树做一下修正：

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
    def recoverTree(self, root: TreeNode) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        if not root:
            return None
        one, two = self.find_two_nodes(root)
        print(one, two)
        stack = []
        node = root
        while node or stack:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            if node.val == one:
                node.val = two
            elif node.val == two:
                node.val = one
            node = node.right
        # return root

    def find_two_nodes(self, root):
        if not root:
            return None, None
        stack = []        
        res = []
        node = root
        while stack or node:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            res.append(node.val)
            node = node.right
        n = len(res)
        max_val, min_val = None, None
        for i in range(1, n):
            if res[i - 1] > res[i]:
                if min_val is not None:
                    min_val = res[i]
                else:
                    max_val, min_val = res[i - 1], res[i]
        return max_val, min_val

# 1917/1917 cases passed (80 ms)
# Your runtime beats 15.52 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```



### 2. DFS-中序遍历递归优化

　　这里记录一种更加广泛的做法，不只打乱一对数，用空间换时间的做法，定义了两个数组。

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
    def recoverTree(self, root: TreeNode) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        seq, seq_p = [], []
        self.inorder(root, seq, seq_p)
        seq.sort()
        for i in range(len(seq)):
            seq_p[i].val = seq[i]
    
    def inorder(self, root, seq, seq_p):
        if not root:
            return
        self.inorder(root.left, seq, seq_p)
        seq.append(root.val)
        seq_p.append(root)
        self.inorder(root.right, seq, seq_p)
# Runtime: 76 ms, faster than 67.66% of Python3 online submissions for Recover Binary Search Tree.
# Memory Usage: 13.9 MB, less than 25.00% of Python3 online submissions for Recover Binary Search Tree.
```

### 3. DFS-迭代
　　参考方案得到迭代方式：
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
    def recoverTree(self, root: TreeNode) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        first, second, pre = None, None, None
        stack = []
        
        while root or stack:
            if root:
                stack.append(root)
                root = root.left
            else:
                root = stack.pop()
                if pre and pre.val > root.val:
                    second = root
                    if not first:
                        first = pre
                    else:
                        break
                pre = root
                root = root.right
        first.val, second.val = second.val, first.val
# Runtime: 76 ms, faster than 67.66% of Python3 online submissions for Recover Binary Search Tree.
# Memory Usage: 14.1 MB, less than 25.00% of Python3 online submissions for Recover Binary Search Tree.
```
## References
1. [99. Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree/)
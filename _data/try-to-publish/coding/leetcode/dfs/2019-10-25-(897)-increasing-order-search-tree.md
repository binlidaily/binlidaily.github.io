---
layout: post
title: 897. Increasing Order Search Tree
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, DFS, Tree]
image: 
comments: true
published: true
---

Given a binary search tree, rearrange the tree in in-order so that the leftmost node in the tree is now the root of the tree, and every node has no left child and only 1 right child.

Example 1:
```
Input: [5,3,6,2,4,null,8,1,null,null,null,7,9]

       5
      / \
    3    6
   / \    \
  2   4    8
 /        / \ 
1        7   9

Output: [1,null,2,null,3,null,4,null,5,null,6,null,7,null,8,null,9]

 1
  \
   2
    \
     3
      \
       4
        \
         5
          \
           6
            \
             7
              \
               8
                \
                 9  
```
**Note**:

1. The number of nodes in the given tree will be between 1 and 100.
2. Each node will have a unique integer value from 0 to 1000.

## Solutions
### 1. DFS-中序遍历
　　比较 naive 的解法……
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
    def increasingBST(self, root: TreeNode) -> TreeNode:
        if not root:
            return None
        seq = []
        self.dfs(root, seq)
        return self.build(seq)
    
    def dfs(self, root, seq):
        if not root:
            return
        self.dfs(root.left, seq)
        seq.append(root.val)
        self.dfs(root.right, seq)
    
    def build(self, seq):
        if not seq:
            return None
        root = TreeNode(seq[0])
        node = root
        for i in range(1, len(seq)):
            cur_node = TreeNode(seq[i])
            node.right = cur_node
            node = cur_node
        return root
# Runtime: 104 ms, faster than 41.51% of Python3 online submissions for Increasing Order Search Tree.
# Memory Usage: 14 MB, less than 8.33% of Python3 online submissions for Increasing Order Search Tree.
```

### 2. DFS-递归
　　待解释。
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
    def increasingBST(self, root: TreeNode) -> TreeNode:
        return self.dfs(root, None)
    
    def dfs(self, root, pre):
        if not root:
            return pre
        res = self.dfs(root.left, root)
        root.left = None
        root.right = self.dfs(root.right, pre)
        return res
# Runtime: 104 ms, faster than 41.51% of Python3 online submissions for Increasing Order Search Tree.
# Memory Usage: 13.9 MB, less than 8.33% of Python3 online submissions for Increasing Order Search Tree.
```
## References
1. [897. Increasing Order Search Tree](https://leetcode.com/problems/increasing-order-search-tree/)
2. [897. Increasing Order Search Tree 递增顺序查找树](https://www.cnblogs.com/grandyang/p/10970623.html)
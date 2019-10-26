---
layout: post
title: 99. Recover Binary Search Tree
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, DFS]
image: 
comments: true
published: true
---

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
　　这种方法可以应对所有的打乱顺序，但是，问题是用空间换时间的做法，定义了两个数组。

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

### 2. DFS-中序遍历递归优化

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
        seq = []
        self.inorder(root, seq)
        first, second = None, None
        for i in range(1, len(seq)):
            if not first and seq[i-1].val > seq[i].val:
                first, second = seq[i-1], seq[i]
            if first and seq[i-1].val > seq[i].val:
                second = seq[i]
        first.val, second.val = second.val, first.val
    
    def inorder(self, root, seq):
        if not root:
            return
        self.inorder(root.left, seq)
        seq.append(root)
        self.inorder(root.right, seq)
# Runtime: 76 ms, faster than 67.66% of Python3 online submissions for Recover Binary Search Tree.
# Memory Usage: 14.1 MB, less than 25.00% of Python3 online submissions for Recover Binary Search Tree.
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
---
layout: post
title: 655. Print Binary Tree
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Tree]
image: 
comments: true
published: true
---

## Description

Print a binary tree in an m*n 2D string array following these rules:

1. The row number `m` should be equal to the height of the given binary tree.
2. The column number `n` should always be an odd number.
3. The root node's value (in string format) should be put in the exactly middle of the first row it can be put. The column and the row where the root node belongs will separate the rest space into two parts (**left-bottom part and right-bottom part**). You should print the left subtree in the left-bottom part and print the right subtree in the right-bottom part. The left-bottom part and the right-bottom part should have the same size. Even if one subtree is none while the other is not, you don't need to print anything for the none subtree but still need to leave the space as large as that for the other subtree. However, if two subtrees are none, then you don't need to leave space for both of them.
4. Each unused space should contain an empty string `""`.
5. Print the subtrees following the same rules.

**Example 1:**

```
Input:
     1
    /
   2
Output:
[["", "1", ""],
 ["2", "", ""]]
```



**Example 2:**

```
Input:
     1
    / \
   2   3
    \
     4
Output:
[["", "", "", "1", "", "", ""],
 ["", "2", "", "", "", "3", ""],
 ["", "", "4", "", "", "", ""]]
```



**Example 3:**

```
Input:
      1
     / \
    2   5
   / 
  3 
 / 
4 
Output:

[["",  "",  "", "",  "", "", "", "1", "",  "",  "",  "",  "", "", ""]
 ["",  "",  "", "2", "", "", "", "",  "",  "",  "",  "5", "", "", ""]
 ["",  "3", "", "",  "", "", "", "",  "",  "",  "",  "",  "", "", ""]
 ["4", "",  "", "",  "", "", "", "",  "",  "",  "",  "",  "", "", ""]]
```



**Note:** The height of binary tree is in the range of [1, 10].


## Solutions
### 1. Recursion

```python
# Time: O(n)
# Space: O(nlogn)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def printTree(self, root: TreeNode) -> List[List[str]]:
        if not root:
            return []
        row = self.get_height(root)
        col = 2 ** row - 1
        res = [['' for _ in range(col)] for _ in range(row)]
        self.update_output(root, 0, 0, col-1, res)
        return res

    def get_height(self, root):
        if not root:
            return 0
        return 1+ max(self.get_height(root.left), self.get_height(root.right))

    def update_output(self, root, row, left, right, res):
        if not root:
            return
        mid = (left + right) >> 1
        res[row][mid] = str(root.val)
        self.update_output(root.left, row + 1, left, mid - 1, res)
        self.update_output(root.right, row + 1, mid + 1, right, res)
# 73/73 cases passed (36 ms)
# Your runtime beats 33.22 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [655. Print Binary Tree](https://leetcode.com/problems/print-binary-tree/)
---
layout: post
title: 95. Unique Binary Search Trees II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Recursion, DP, Tree]
image: 
comments: true
published: true
---

## Description

Given an integer *n*, generate all structurally unique **BST's** (binary search trees) that store values 1 ... *n*.

**Example:**

```
Input: 3
Output:
[
  [1,null,3,2],
  [3,2,null,1],
  [3,1,null,null,2],
  [2,1,3],
  [1,null,2,null,3]
]
Explanation:
The above output corresponds to the 5 unique BST's shown below:

   1         3     3      2      1
    \       /     /      / \      \
     3     2     1      1   3      2
    /     /       \                 \
   2     1         2                 3
```


## Solutions
### 1. Recursion
　　遍历每个结点作为根节点，然后迭代下去找合适的树结果。
```python
# Time: O(nlogn)
# Space: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def generateTrees(self, n: int) -> List[TreeNode]:
        if n == 0:
            return []
        return self.dfs(1, n+1)
    
    def dfs(self, start, end):
        if start == end:
            return None
        res = []
        for i in range(start, end):
            for l in self.dfs(start, i) or [None]:
                for r in self.dfs(i+1, end) or [None]:
                    node = TreeNode(i)
                    node.left, node.right = l, r
                    res.append(node)
        return res
# 9/9 cases passed (48 ms)
# Your runtime beats 91.44 % of python3 submissions
# Your memory usage beats 80 % of python3 submissions (14.5 MB)
```

### 2. DP

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
# Time: O()
# Space: O()
class Solution:
    def generateTrees(self, n: int) -> List[TreeNode]:
        if n == 0:
            return []
        dp = [[[] for _ in range(n+1)] for _ in range(n+1)]
        dp[0] = [[None] for _ in range(n+1)]
        for i in range(n+1):
            dp[i][0] = [None]
        
        for i in range(1, n+1):
            for j in range(i, 0, -1):
                if i == j:
                    dp[i][j] = [TreeNode(i)]
                else:
                    for k in range(j, i+1):
                        if k - 1 < j:
                            for right in dp[i][k+1]:
                                root = TreeNode(k)
                                root.left, root.right = None, right
                                dp[i][j].append(root)
                        elif k + 1 > i:
                            for left in dp[k-1][j]:
                                root = TreeNode(k)
                                root.left, root.right = left, None
                                dp[i][j].append(root)
                        else:
                            for left in dp[k-1][j]:
                                for right in dp[i][k+1]:
                                    root = TreeNode(k)
                                    root.left, root.right = left, right
                                    dp[i][j].append(root)
        return dp[n][1]
        
# 9/9 cases passed (44 ms)
# Your runtime beats 97.57 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.4 MB)
```

## References
1. [95. Unique Binary Search Trees II]()
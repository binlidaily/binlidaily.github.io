---
layout: post
title: 199. Binary Tree Right Side View
subtitle:
author: Bin Li
tags: [Coding, LeetCode, BFS]
image: 
comments: true
published: true
---

Given a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

Example:
```
Input: [1,2,3,null,5,null,4]
Output: [1, 3, 4]
Explanation:

   1            <---
 /   \
2     3         <---
 \     \
  5     4       <---
```

## Solutions
### BFS-两个指针
　　还是打印二叉树的套路，用两个指针分别指向当前行和下一行的最右结点，然后判断什么时候换行，此时的结点就应该存进结果中。

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def rightSideView(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        if not root:
            return []
        queue = [root]
        res = []
        last = nxt_last = root
        while queue:
            node = queue.pop()
            if node.left:
                queue.insert(0, node.left)
                nxt_last = node.left
            if node.right:
                queue.insert(0, node.right)
                nxt_last = node.right
            if node == last:
                last = nxt_last
                res.append(node.val)
        return res
# Runtime: 16 ms, faster than 83.95% of Python online submissions for Binary Tree Right Side View.
# Memory Usage: 11.7 MB, less than 85.71% of Python online submissions for Binary Tree Right Side View.
```

### 递归遍历
　　结果的 list 大小和树的深度正好能对上，而且在递归的时候先访问右子树。
```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def rightSideView(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        if not root:
            return []
        res = []
        self.bfs(root, 0, res)
        return res
    
    def bfs(self, root, depth, res):
        if not root:
            return
        if depth == len(res):
            res.append(root.val)
        self.bfs(root.right, depth+1, res)
        self.bfs(root.left, depth+1, res)
# Runtime: 24 ms, faster than 28.50% of Python online submissions for Binary Tree Right Side View.
# Memory Usage: 11.8 MB, less than 64.29% of Python online submissions for Binary Tree Right Side View.
```
## References
1. [199. Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)
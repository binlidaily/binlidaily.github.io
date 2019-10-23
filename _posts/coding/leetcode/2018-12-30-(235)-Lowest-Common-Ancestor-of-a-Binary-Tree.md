---
layout: post
title: 235. Lowest Common Ancestor of a Binary Search Tree
subtitle:
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

## Description
Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”

Given binary search tree:  root = [6,2,8,0,4,7,9,null,null,3,5]

 ![](/img/media/15463080882445.jpg)


Example 1:

> Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
> Output: 6
> Explanation: The LCA of nodes 2 and 8 is 6.

Example 2:
> Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, > q = 4
> Output: 2
> Explanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.
 

Note:

All of the nodes' values will be unique.
p and q are different and both values will exist in the BST.


## Solutions
### 1. 迭代
　　因为没有刷过类似的问题，在参考了 Discussion 后就恍然大悟了。其实这里考察的是 BST 的特性，比当前节点小的结点放左边，比当前节点大的放右边。我们的目标是要找到一个节点，其是给定两个结点的最近共同祖先，最近指的是离两者的距离最小。那么可以将 root，p，q 三个结点的大小情况分开考虑：

1、root > max(p, q)

　　即此时节点 p，q 都在当前结点 root 的右子树下，虽然 root 是其共同祖先，但并不是其最近的共同祖先，于是需要继续从右子树向下深入探索。

2、root < max(p, q)

　　类似的，此种情况是节点 p，q 都在当前结点 root 的左子树下，于是还得继续从左子树继续向下深入探索。

3、(p < root < q) or (q < root < p)

　　当出现这类大小关系时，根据 BST 的特性，我们能够判断此时 root 就是节点 p 和 q 的最近共同祖先。

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def lowestCommonAncestor(self, root, p, q):
        """
        :type root: TreeNode
        :type p: TreeNode
        :type q: TreeNode
        :rtype: TreeNode
        """
        while root:
            if p.val < root.val > q.val:
                root = root.left
            elif p.val > root.val < q.val:
                root = root.right
            else:
                return root
```

### 2. 递归
　　下面这种理解需要一定的想法：

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def lowestCommonAncestor(self, root, p, q):
        """
        :type root: TreeNode
        :type p: TreeNode
        :type q: TreeNode
        :rtype: TreeNode
        """
        if not root:
            return None
        if root == p or root == q:
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        
        if left and right:
            return root
        
        if left:
            return left
        
        if right:
            return right
        
        return None
# Runtime: 92 ms, faster than 7.88% of Python online submissions for Lowest Common Ancestor of a Binary Search Tree.
# Memory Usage: 19.8 MB, less than 72.73% of Python online submissions for Lowest Common Ancestor of a Binary Search Tree.
```

　　另外通过比较结点大小的方式：


```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def lowestCommonAncestor(self, root, p, q):
        """
        :type root: TreeNode
        :type p: TreeNode
        :type q: TreeNode
        :rtype: TreeNode
        """
        if not root or not p or not q:
            return None
        
        if max(p.val, q.val) < root.val:
            return self.lowestCommonAncestor(root.left, p, q)
        elif min(p.val, q.val) > root.val:
            return self.lowestCommonAncestor(root.right, p, q)
        else:
            return root
# Runtime: 60 ms, faster than 96.06% of Python online submissions for Lowest Common Ancestor of a Binary Search Tree.
# Memory Usage: 20.1 MB, less than 6.82% of Python online submissions for Lowest Common Ancestor of a Binary Search Tree.
```

　　这样就少递归很多，看到速度上提升了很多。
## References
1. [235. Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)
2. [50 剑指 Offer](http://binlidaily.github.io/2019-05-12-(050)-最近公共祖先.md)
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
因为没有刷过类似的问题，在参考了 Discussion 后就恍然大悟了。其实这里考察的是 BST 的特性，比当前节点小的结点放左边，比当前节点大的放右边。我们的目标是要找到一个节点，其是给定两个结点的最近共同祖先，最近指的是离两者的距离最小。那么可以将 root，p，q 三个结点的大小情况分开考虑：

### 1、root > max(p, q)
即此时节点 p，q 都在当前结点 root 的右子树下，虽然 root 是其共同祖先，但并不是其最近的共同祖先，于是需要继续从右子树向下深入探索。

### 2、root < max(p, q)
类似的，此种情况是节点 p，q 都在当前结点 root 的左子树下，于是还得继续从左子树继续向下深入探索。

### 3、(p < root < q) or (q < root < p)
当出现这类大小关系时，根据 BST 的特性，我们能够判断此时 root 就是节点 p 和 q 的最近共同祖先。

## References
1. [235. Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)
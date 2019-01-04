---
layout: post
title: 101. Symmetric Tree
subtitle:
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: false
---

## Description
Given a binary tree, check whether it is a mirror of itself (ie, symmetric around its center).

For example, this binary tree [1,2,2,3,4,4,3] is symmetric:
```
    1
   / \
  2   2
 / \ / \
3  4 4  3
```
But the following [1,2,2,null,3,null,3] is not:
```
    1
   / \
  2   2
   \   \
   3    3
```

Note:
Bonus points if you could solve it both recursively and iteratively.

## Solutions
第一印象是从根节点开始一个一个对比，应该用递归来做，但是发现如果将函数 isSymmetric 设计成递归的，似乎不好操作，因为可能会出现节点为 null 的情况。于是需要找到可以递归的部分。

```
    0
   / \
  l   r
 / \ / \
l  r l  r
```



## References
1. [101. Symmetric Tree](https://leetcode.com/problems/symmetric-tree/)



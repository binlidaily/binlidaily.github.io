---
layout: post
title: 501. Find Mode in Binary Search Tree
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Tree, Easy]
image: 
comments: true
published: true
---

## Description

Given a binary search tree (BST) with duplicates, find all the [mode(s)](https://en.wikipedia.org/wiki/Mode_(statistics)) (the most frequently occurred element) in the given BST.

Assume a BST is defined as follows:

- The left subtree of a node contains only nodes with keys **less than or equal to** the node's key.
- The right subtree of a node contains only nodes with keys **greater than or equal to** the node's key.
- Both the left and right subtrees must also be binary search trees.

 

For example:
Given BST `[1,null,2,2]`,

```
   1
    \
     2
    /
   2
```

 

return `[2]`.

**Note:** If a tree has more than one mode, you can return them in any order.

**Follow up:** Could you do that without using any extra space? (Assume that the implicit stack space incurred due to recursion does not count).


## Solutions
### 1. Inorder traversal

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
    def findMode(self, root: TreeNode) -> List[int]:
        if not root:
            return []
        stack = []
        node = root
        hash_map = {}
        max_val = float('-inf')
        res = []
        while node or stack:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            hash_map[node.val] = hash_map.get(node.val, 0) + 1
            max_val = max(hash_map[node.val], max_val)
            node = node.right
        for key, value in hash_map.items():
            if value == max_val:
                res.append(key)
        return res

# 25/25 cases passed (56 ms)
# Your runtime beats 65.56 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (16.6 MB)
```

### 2. Space O(1)
　　一直没找到改成 python 后错在哪儿……

```python
class Solution:
    def findMode(self, root: TreeNode) -> List[int]:
        if not root:
            return []
        pre_node = None
        max_val, cnt = [0], [1]
        res = []
        self.inorder(root, pre_node, cnt, max_val, res) 
        return res
    
    def inorder(self, node, pre_node, cnt, max_val, res):
        if not node:
            return 
        self.inorder(node.left, pre_node, cnt, max_val, res)
        if pre_node:
            if node.val == pre_node.val:
                cnt[0] += 1
            else:
                cnt[0] = 1
        print(res, cnt[0], max_val[0])
        if cnt[0] >= max_val[0]:
            if cnt[0] > max_val[0]:
                res.clear()
            res.append(node.val)
            max_val[0] = cnt[0]
        
        pre_node = node
        self.inorder(node.right, pre_node, cnt, max_val, res)
```

　　不想看了，有点儿烦躁了……

```python
class Solution(object):
    def findMode(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        def inorder(root, prev, cnt, max_cnt, result):
            if not root:
                return prev, cnt, max_cnt

            prev, cnt, max_cnt = inorder(root.left, prev, cnt, max_cnt, result)
            if prev:
                if root.val == prev.val:
                    cnt += 1
                else:
                    cnt = 1
            if cnt > max_cnt:
                max_cnt = cnt
                del result[:]
                result.append(root.val)
            elif cnt == max_cnt:
                result.append(root.val)
            return inorder(root.right, root, cnt, max_cnt, result)

        if not root:
            return []
        result = []
        inorder(root, None, 1, 0, result)
        return result
# 25/25 cases passed (60 ms)
# Your runtime beats 39.26 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (16.5 MB)
```

## References
1. [501. Find Mode in Binary Search Tree](https://leetcode.com/problems/find-mode-in-binary-search-tree/description/)
2. [Find Mode in Binary Search Tree 找二分搜索数的众数](https://www.cnblogs.com/grandyang/p/6436150.html)
---
layout: post
title: 449. Serialize and Deserialize BST
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Tree]
image: 
comments: true
published: true
---

## Description

Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a **binary search tree**. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary search tree can be serialized to a string and this string can be deserialized to the original tree structure.

**The encoded string should be as compact as possible.**

**Note:** Do not use class member/global/static variables to store states. Your serialize and deserialize algorithms should be stateless.


## Solutions
### 1. Recursion + Queue

```python
# Time: O(n)
# Space: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Codec:

    def serialize(self, root: TreeNode) -> str:
        """Encodes a tree to a single string.
        """
        if not root:
            return 'null'
        
        res = []
        self.preorder(root, res)
        return ','.join(res)

    def preorder(self, root, res):
        if not root:
            res.append('null')
            return
        res.append(str(root.val))
        self.preorder(root.left, res)
        self.preorder(root.right, res)

    def deserialize(self, data: str) -> TreeNode:
        """Decodes your encoded data to tree.
        """
        queue = collections.deque()
        for node in data.split(','):
            if node != 'null':
                queue.append(int(node))
        return self.build_tree(queue, float('-inf'), float('inf'))


    def build_tree(self, queue, min_val, max_val):
        if queue and min_val < queue[0] < max_val:
            node_val = queue.popleft()
            root = TreeNode(node_val)
            root.left = self.build_tree(queue, min_val, node_val)
            root.right = self.build_tree(queue, node_val, max_val)
            return root
        return None

# Your Codec object will be instantiated and called as such:
# codec = Codec()
# codec.deserialize(codec.serialize(root))
# 62/62 cases passed (76 ms)
# Your runtime beats 46.43 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (17.1 MB)
```

## References
1. [449. Serialize and Deserialize BST](https://leetcode.com/problems/serialize-and-deserialize-bst/)
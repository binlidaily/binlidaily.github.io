---
layout: post
title: 297. Serialize and Deserialize Binary Tree
subtitle: Hard
author: Bin Li
tags: [Coding, LeetCode, Hard, Tree]
image: 
comments: true
published: true
---

## Description

Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

**Example:** 

```
You may serialize the following tree:

    1
   / \
  2   3
     / \
    4   5

as "[1,2,3,null,null,4,5]"
```

**Clarification:** The above format is the same as [how LeetCode serializes a binary tree](https://leetcode.com/faq/#binary-tree). You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.

**Note:** Do not use class member/global/static variables to store states. Your serialize and deserialize algorithms should be stateless.


## Solutions
### 1. BFS

```python
# Time: O(n)
# Space: O(n)
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Codec:

    def serialize(self, root):
        """Encodes a tree to a single string.
        :type root: TreeNode
        :rtype: str
        """
        if not root:
            return ''
        queue = collections.deque()
        queue.append(root)
        res = []
        while queue:
            node = queue.popleft()
            if not node:
                res.append('null')
                continue
            res.append(str(node.val))
            queue.append(node.left)
            queue.append(node.right)
        return ','.join(res)

    def deserialize(self, data):
        """Decodes your encoded data to tree.
        :type data: str
        :rtype: TreeNode
        """
        if not data:
            return None
        nodes = data.split(',')
        n = len(nodes)
        queue = collections.deque()
        root = TreeNode(int(nodes[0]))
        queue.append(root)
        i = 1
        while i < n:
            parent = queue.popleft()
            if nodes[i] != 'null':
                left = TreeNode(int(nodes[i]))
                parent.left = left
                queue.append(left)
            
            i += 1
            if nodes[i] != 'null':
                right = TreeNode(int(nodes[i]))
                parent.right = right
                queue.append(right)
            i += 1
        return root

# Your Codec object will be instantiated and called as such:
# codec = Codec()
# codec.deserialize(codec.serialize(root))

# 48/48 cases passed (116 ms)
# Your runtime beats 56.73 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (17.7 MB)
```

## References
1. [297. Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/description/)
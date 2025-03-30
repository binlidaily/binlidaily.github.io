---
layout: post
title: 958. Check Completeness of a Binary Tree
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Tree]
image: 
comments: true
published: true
---

## Description

Given a binary tree, determine if it is a *complete binary tree*.

**Definition of a complete binary tree from [Wikipedia](http://en.wikipedia.org/wiki/Binary_tree#Types_of_binary_trees):**
In a complete binary tree every level, except possibly the last, is completely filled, and all nodes in the last level are as far left as possible. It can have between 1 and 2h nodes inclusive at the last level h.

 

**Example 1:**

![](/img/media/15785517739120.jpg)


```
Input: [1,2,3,4,5,6]
Output: true
Explanation: Every level before the last is full (ie. levels with node-values {1} and {2, 3}), and all nodes in the last level ({4, 5, 6}) are as far left as possible.
```

**Example 2:**

![](/img/media/15785517822560.jpg)


```
Input: [1,2,3,4,5,null,7]
Output: false
Explanation: The node with value 7 isn't as far left as possible.
```

 

**Note:**

1. The tree will have between 1 and 100 nodes.


## Solutions
### 1. BFS-Travel by level

```python
# Time: O(n)
# Space: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isCompleteTree(self, root: TreeNode) -> bool:
        if not root:
            return True
        
        queue = collections.deque()
        queue.append(root)
        is_1st_none = False
        while queue:
            node = queue.popleft()
            if not node:
                is_1st_none = True
            else:
                if is_1st_none:
                    return False
                queue.append(node.left)
                queue.append(node.right)
        return True
# 119/119 cases passed (28 ms)
# Your runtime beats 93.74 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

## References
1. [958. Check Completeness of a Binary Tree](https://leetcode.com/problems/check-completeness-of-a-binary-tree/description/)
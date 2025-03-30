---
layout: post
title: 101. Symmetric Tree
subtitle:
author: Bin Li
tags: [Coding, LeetCode, Tree]
image: 
comments: true
published: true
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
### 1. Recurrence
　　先判断左右子节点是否相等，再判断左子节点的左子节点与右子节点的右子节点，还有左子节点的右子节点和右子节点的左子节点是否一样。

```
    0
   / \
  l   r
 / \ / \
l  r l  r
```

```python
# Time: O(n)
# Space: O(1)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isSymmetric(self, root: TreeNode) -> bool:
        if not root:
            return True
        return self.is_mirror(root.left, root.right)
    
    def is_mirror(self, left, right):
        if not left or not right:
            return left == right
        if left.val != right.val:
            return False
        return self.is_mirror(left.left, right.right) and \
            self.is_mirror(left.right, right.left)

# 195/195 cases passed (32 ms)
# Your runtime beats 69.89 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

### 2. Iterative-Stack
　　注意用两个栈！

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
    def isSymmetric(self, root: TreeNode) -> bool:
        if not root:
            return True
        left_stack, right_stack = [root.left], [root.right]
        while len(left_stack) > 0 and len(right_stack) > 0:
            left = left_stack.pop()
            right = right_stack.pop()
            if not left and not right:
                continue
            elif not left or not right:
                return False
            if left.val != right.val:
                return False
            left_stack.append(left.left)
            right_stack.append(right.right)
            left_stack.append(left.right)
            right_stack.append(right.left)
        return len(left_stack) == 0 and len(right_stack) == 0

# 195/195 cases passed (32 ms)
# Your runtime beats 69.89 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```

### 3. Iterative-Queue

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
    def isSymmetric(self, root: TreeNode) -> bool:
        if not root:
            return True
        left_queue, right_queue = collections.deque([root.left]), collections.deque([root.right])
        while len(left_queue) > 0 and len(right_queue) > 0:
            left = left_queue.popleft()
            right = right_queue.popleft()
            if not left and not right:
                continue
            elif not left or not right:
                return False
            if left.val != right.val:
                return False
            left_queue.append(left.left)
            right_queue.append(right.right)
            left_queue.append(left.right)
            right_queue.append(right.left)
        return len(left_queue) == 0 and len(right_queue) == 0

# 195/195 cases passed (36 ms)
# Your runtime beats 33.94 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.9 MB)
```
## References
1. [101. Symmetric Tree](https://leetcode.com/problems/symmetric-tree/)
2. [Python Version](https://blog.csdn.net/coder_orz/article/details/51579528)

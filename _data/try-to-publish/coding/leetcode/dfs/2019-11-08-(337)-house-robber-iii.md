---
layout: post
title: 337. House Robber III
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, DFS, Medium]
image: 
comments: true
published: true
---

The thief has found himself a new place for his thievery again. There is only one entrance to this area, called the "root." Besides the root, each house has one and only one parent house. After a tour, the smart thief realized that "all houses in this place forms a binary tree". It will automatically contact the police if two directly-linked houses were broken into on the same night.

Determine the maximum amount of money the thief can rob tonight without alerting the police.

**Example 1:**

```
Input: [3,2,3,null,3,null,1]

     3
    / \
   2   3
    \   \ 
     3   1

Output: 7 
Explanation: Maximum amount of money the thief can rob = 3 + 3 + 1 = 7.
```

**Example 2:**

```
Input: [3,4,5,1,3,null,1]

     3
    / \
   4   5
  / \   \ 
 1   3   1

Output: 9
Explanation: Maximum amount of money the thief can rob = 4 + 5 = 9.
```

## Solutions

### 1. 递归

　　使用 DFS 图搜索，注意记忆化！

```python
# Time Complexity: O(n^2)
# Space Complexity: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def rob(self, root: TreeNode) -> int:
        if not root:
            return 0
        if root.left:
            ll = self.rob(root.left.left)
            lr = self.rob(root.left.right)
        else:
            ll, lr = 0, 0
        
        if root.right:
            rl = self.rob(root.right.left)
            rr = self.rob(root.right.right)
        else:
            rl, rr = 0, 0
        
        return max(root.val + ll + lr + rl + rr, self.rob(root.left) + self.rob(root.right))
```

　　报超时了，忧伤。 

### 2. 递归+记忆化

　　加一个记忆化，不需要重复计算。

```python
# Time Complexity: O(n)
# Space Complexity: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def __init__(self):
        self.memo = collections.defaultdict()
    def rob(self, root: TreeNode) -> int:
        if not root:
            return 0
        if root in self.memo:
            return self.memo[root]
        if root.left:
            ll = self.rob(root.left.left)
            lr = self.rob(root.left.right)
        else:
            ll, lr = 0, 0
        
        if root.right:
            rl = self.rob(root.right.left)
            rr = self.rob(root.right.right)
        else:
            rl, rr = 0, 0
        self.memo[root] = max(root.val + ll + lr + rl + rr, self.rob(root.left) + self.rob(root.right))
        return self.memo[root]
# Runtime: 48 ms, faster than 96.90% of Python3 online submissions for House Robber III.
# Memory Usage: 15.3 MB, less than 80.00% of Python3 online submissions for House Robber III.
```

### 3. DFS-递归-抢或不抢

```python
# Time Complexity: O(n)
# Space Complexity: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def rob(self, root: TreeNode) -> int:
        rob_val, not_rob_val  = self.rob_or_not_rob(root)
        return max(rob_val, not_rob_val)
    
    def rob_or_not_rob(self, root: TreeNode):
        if not root:
            return 0, 0
        
        left_rob, left_not_rob = self.rob_or_not_rob(root.left)
        right_rob, right_not_rob = self.rob_or_not_rob(root.right)
        
        # rob this root node, the left and right childs are not rob
        rob_val = root.val + left_not_rob + right_not_rob
        # if not rob this root node, so the thief can choose rob or not in both the left and right childs
        not_rob_val = max(left_rob, left_not_rob) + max(right_rob, right_not_rob)
        return rob_val, not_rob_val
# Runtime: 44 ms, faster than 99.07% of Python3 online submissions for House Robber III.
# Memory Usage: 14.6 MB, less than 100.00% of Python3 online submissions for House Robber III.
```




## References
1. [337. House Robber III]( https://leetcode.com/problems/house-robber-iii/  )
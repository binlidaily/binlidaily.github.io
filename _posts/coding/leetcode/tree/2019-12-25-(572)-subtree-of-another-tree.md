---
layout: post
title: 572. Subtree of Another Tree
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Tree]
image: 
comments: true
published: true
---

## Description

Given two non-empty binary trees **s** and **t**, check whether tree **t** has exactly the same structure and node values with a subtree of **s**. A subtree of **s** is a tree consists of a node in **s** and all of this node's descendants. The tree **s** could also be considered as a subtree of itself.

**Example 1:**
Given tree s:

```
     3
    / \
   4   5
  / \
 1   2
```

Given tree t:

```
   4 
  / \
 1   2
```

Return **true**, because t has the same structure and node values with a subtree of s.



**Example 2:**
Given tree s:

```
     3
    / \
   4   5
  / \
 1   2
    /
   0
```

Given tree t:

```
   4
  / \
 1   2
```

Return **false**.


## Solutions
### 1. Direct

```python
# Time: O(logn*logn)
# Space: O(n)
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isSubtree(self, s: TreeNode, t: TreeNode) -> bool:
        queue = collections.deque()
        queue.append(s)
        while queue:
            node = queue.popleft()
            if not node:
                continue
            if node.val == t.val:
                if self.is_equal(node, t):
                    return True
            queue.append(node.left)
            queue.append(node.right)
        return False
    
    def is_equal(self, s, t):
        if not s and not t:
            return True
        if not s or not t:
            return False
        if s.val != t.val:
            return False
        
        if self.is_equal(s.left, t.left) and \
            self.is_equal(s.right, t.right):
            return True
        else:
            return False

# 176/176 cases passed (248 ms)
# Your runtime beats 65.75 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.2 MB)
```

　　果然手写太冗余了，参考人家全是递归的做法。


```python
# Time: O(s*t)
# Space: O(s)
class Solution:
    def isSubtree(self, s, t):
        if self.isMatch(s, t): return True
        if not s: return False
        return self.isSubtree(s.left, t) or self.isSubtree(s.right, t)
    
    def isMatch(self, s, t):
        if not(s and t):
            return s is t
        return (s.val == t.val and 
                self.isMatch(s.left, t.left) and 
                self.isMatch(s.right, t.right))
# 176/176 cases passed (240 ms)
# Your runtime beats 70.66 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.4 MB)
```

### 2. String
　　中序访问成字符串，然后比较，因为数值可能有多位的区别，可以在中间加上一些字符表示区别，比如说中间间隔用#，空用$。


```python
# Time: O(s+t)
# Space: O(s+t)
class Solution:
    def isSubtree(self, s, t):
        return self.convert(t) in self.convert(s)

    def convert(self, s):
        return "^" + str(s.val) + "#" + self.convert(s.left) + self.convert(s.right) if s else "$"
# 176/176 cases passed (72 ms)
# Your runtime beats 92.96 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (13.5 MB)
```

### 3. 神奇做法
　　还没来得及看，感觉很复杂。

```python
class Solution:
    def isSubtree(self, s, t):
        # from hashlib import sha256
        from hashlib import sha1
        def hash_(x):
            # S = sha256()
            # S.update(x)
            # return S.hexdigest()
            m = sha1()
            m.update(str.encode(s))
            return m.hexdigest()
            
        def merkle(node):
            if not node:
                return '#'
            m_left = merkle(node.left)
            m_right = merkle(node.right)
            node.merkle = hash_(m_left + str(node.val) + m_right)
            return node.merkle
            
        merkle(s)
        merkle(t)
        def dfs(node):
            if not node:
                return False
            return (node.merkle == t.merkle or 
                    dfs(node.left) or dfs(node.right))
                        
        return dfs(s)
```
## References
1. [572. Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/description/)
---
layout: post
title: 863. All Nodes Distance K in Binary Tree
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Tree, BFS]
image: 
comments: true
published: true
---

We are given a binary tree (with root node root), a target node, and an integer value K.

Return a list of the values of all nodes that have a distance K from the target node.  The answer can be returned in any order.

 

**Example 1**:

> **Input**: root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, K = 2

> **Output**: [7,4,1]

> **Explanation**: 
The nodes that are a distance 2 from the target node (with value 5)
have values 7, 4, and 1.

> ![](/img/media/15716291820423.jpg)

> Note that the inputs "root" and "target" are actually TreeNodes.
The descriptions of the inputs above are just serializations of these objects.

**Note**:

1. The given tree is non-empty.
2. Each node in the tree has unique values 0 <= node.val <= 500.
3. The target node is a node in the tree.
4. 0 <= K <= 1000.

## Solutions
### 1. 当成图来解-BFS
　　在构造图的时候，
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
    def distanceK(self, root, target, K):
        """
        :type root: TreeNode
        :type target: TreeNode
        :type K: int
        :rtype: List[int]
        """
        self.graph = collections.defaultdict(list)
        self.build_graph(None, root)
        
        queue = collections.deque()
        queue.append(target.val)
        visited = set([target.val])
        res = []
        k = 0
        while queue and k <= K:
            size = len(queue)
            for i in range(size):
                node_val = queue.popleft()
                if k == K:
                    res.append(node_val)
                for child in self.graph[node_val]:
                    if child in visited:
                        continue
                    queue.append(child)
                    visited.add(child)
            k += 1
        return res
                
    
    def build_graph(self, parent, child):
        if parent and child:
            self.graph[parent.val].append(child.val)
            self.graph[child.val].append(parent.val)
        
        if child.left:
            self.build_graph(child, child.left)
        
        if child.right:
            self.build_graph(child, child.right)
# Runtime: 36 ms, faster than 97.96% of Python3 online submissions for All Nodes Distance K in Binary Tree.
# Memory Usage: 13.9 MB, less than 62.50% of Python3 online submissions for All Nodes Distance K in Binary Tree.
```

### 2. 递归方法

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
    def distanceK(self, root, target, K):
        """
        :type root: TreeNode
        :type target: TreeNode
        :type K: int
        :rtype: List[int]
        """
        self.res = []
        self.traverse(root, target, K)
        return self.res
                
    # Returns the distance from root to target.
    # Returns -1 if target does not in the tree.
    def traverse(self, root, target, K):
        if not root:
            return -1
        if root == target:
            self.collect(target, K)
            return 0
        
        l = self.traverse(root.left, target, K)
        r = self.traverse(root.right, target, K)
        
        if l >= 0:
            if l == K-1:
                self.res.append(root.val)
            self.collect(root.right, K-l-2)
            return l + 1
        
        if r >= 0:
            if r == K-1:
                self.res.append(root.val)
            self.collect(root.left, K-r-2)
            return r + 1
        
        return -1
    
    # Collect nodes that are d steps from root.
    def collect(self, root, d):
        if not root or d < 0:
            return
        if d == 0:
            self.res.append(root.val)
        self.collect(root.left, d-1)
        self.collect(root.right, d-1)
# Runtime: 44 ms, faster than 73.33% of Python3 online submissions for All Nodes Distance K in Binary Tree.
# Memory Usage: 13.9 MB, less than 62.50% of Python3 online submissions for All Nodes Distance K in Binary Tree.
```
## References
1. [863. All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/)
2. [Java - O(1) space excluding recursive stack space](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/discuss/143886/Java-O(1)-space-excluding-recursive-stack-space)
3. [花花](http://zxi.mytechroad.com/blog/tree/leetcode-863-all-nodes-distance-k-in-binary-tree/)
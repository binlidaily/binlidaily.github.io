---
layout: post
title: 109. Convert Sorted List to Binary Search Tree
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Binary Search]
image: 
comments: true
published: true
---

Given a singly linked list where elements are sorted in ascending order, convert it to a height balanced BST.

For this problem, a height-balanced binary tree is defined as a binary tree in which the depth of the two subtrees of every node never differ by more than 1.

Example:

Given the sorted linked list: [-10,-3,0,5,9],

One possible answer is: [0,-3,9,-10,null,5], which represents the following height balanced BST:

```
      0
     / \
   -3   9
   /   /
 -10  5
```

## Solutions
　　跟 108 题很像，但这里是用的链表，不能想数组那样直接通过取中间的那个数作为跟结点了。所以有一种可行的方法是，遍历列表得到数组那么就转换成了 108 题。

### 1. 快慢指针
　　数组可以通过取中间数的方式很快找到根节点，链表想要实现类似的除以 2 的功能的话可以用快慢指针。


```python
# Time Complexity: O(nlogn)
# Space Complexity: O(1)
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def sortedListToBST(self, head: ListNode) -> TreeNode:
        if not head:
            return None
        
        return self.to_dst(head, None)
    
    def to_dst(self, head, tail):
        if head == tail:
            return None
        fast = head
        slow = head
        
        while fast != tail and fast.next != tail:
            fast = fast.next.next
            slow = slow.next
        
        root = TreeNode(slow.val)
        root.left = self.to_dst(head, slow)
        root.right = self.to_dst(slow.next, tail)
        return root
# Runtime: 160 ms, faster than 5.53% of Python3 online submissions for Convert Sorted List to Binary Search Tree.
# Memory Usage: 20.5 MB, less than 6.67% of Python3 online submissions for Convert Sorted List to Binary Search Tree.
```

### 2. 没理解的方法
　　还有一种不好理解的方法，不好证明为什么这样合理。
1. 为什么用中序遍历？
    * 二叉所搜树的中序遍历的结果就是一个递增的序列，所以只要按照树的中序遍历的方式来构造即可
2. 这里二分查找的使用该如何解释？

```python
# Time Complexity: O(logn)
# Space Complexity: O(1)
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def sortedListToBST(self, head: ListNode) -> TreeNode:
        if not head:
            return None
        
        size = 0
        self.node = head
        runner = head
        while runner:
            runner = runner.next
            size += 1
        return self.inorder(0, size-1)
    
    def inorder(self, start, end):
        if start > end:
            return None
        
        mid = (start+end) >> 1
        left = self.inorder(start, mid-1)
        
        treenode = TreeNode(self.node.val)
        treenode.left = left
        self.node = self.node.next
        
        right = self.inorder(mid+1, end)
        treenode.right = right
        return treenode
# Runtime: 136 ms, faster than 65.51% of Python3 online submissions for Convert Sorted List to Binary Search Tree.
# Memory Usage: 20.4 MB, less than 6.67% of Python3 online submissions for Convert Sorted List to Binary Search Tree.
```
## References
1. [109. Convert Sorted List to Binary Search Tree](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/)
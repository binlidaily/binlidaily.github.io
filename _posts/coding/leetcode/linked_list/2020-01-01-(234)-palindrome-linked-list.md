---
layout: post
title: 234. Palindrome Linked List
subtitle: 
author: Bin Li
tags: [Coding, LeetCode, Linked List]
image: 
comments: true
published: true
---

## Description

Given a singly linked list, determine if it is a palindrome.

**Example 1:**

```
Input: 1->2
Output: false
```

**Example 2:**

```
Input: 1->2->2->1
Output: true
```

**Follow up:**
Could you do it in O(n) time and O(1) space?


## Solutions
### 1. Linked List to Array

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        if not head:
            return True
        array = []
        node = head
        while node:
            array.append(node.val)
            node = node.next
        l, r = 0, len(array)-1
        while l <= r:
            if array[l] != array[r]:
                return False
            l += 1
            r -= 1
        return True
# 26/26 cases passed (76 ms)
# Your runtime beats 54.24 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (22.8 MB)
```

### 2. 快慢指针
### 3. 后一半反转比较
## References
1. [234. Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/description/)
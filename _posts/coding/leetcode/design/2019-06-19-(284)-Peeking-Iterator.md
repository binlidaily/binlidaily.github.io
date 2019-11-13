---
layout: post
title: 284. Peeking Iterator
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given an Iterator class interface with methods: next() and hasNext(), design and implement a PeekingIterator that support the peek() operation -- it essentially peek() at the element that will be returned by the next call to next().

Example:
```
Assume that the iterator is initialized to the beginning of the list: [1,2,3].

Call next() gets you 1, the first element in the list.
Now you call peek() and it returns 2, the next element. Calling next() after that still return 2. 
You call next() the final time and it returns 3, the last element. 
Calling hasNext() after that should return false.
```
Follow up: How would you extend your design to be generic and work with all types, not just integer?

## Solutions
　　倒是蛮容易写出来的，主要出现的一个问题是，我刚开始的时候将属性定义为 `self.peek` 因为类的函数中也有同名的，所以会出错，然后找了好半天才发现是这个问题，实在很无语！🤷‍♀️


``` python
# Below is the interface for Iterator, which is already defined for you.
#
# class Iterator(object):
#     def __init__(self, nums):
#         """
#         Initializes an iterator object to the beginning of a list.
#         :type nums: List[int]
#         """
#
#     def hasNext(self):
#         """
#         Returns true if the iteration has more elements.
#         :rtype: bool
#         """
#
#     def next(self):
#         """
#         Returns the next element in the iteration.
#         :rtype: int
#         """

class PeekingIterator(object):
    def __init__(self, iterator):
        """
        Initialize your data structure here.
        :type iterator: Iterator
        """
        self.iterator = iterator
        self.top = None
        if self.iterator.hasNext():
            self.top = self.iterator.next()
        

    def peek(self):
        """
        Returns the next element in the iteration without advancing the iterator.
        :rtype: int
        """
        return self.top

    def next(self):
        """
        :rtype: int
        """
        res = self.top
        if self.iterator.hasNext():
            self.top = self.iterator.next()
        else:
            self.top = None
        return res
    
    def hasNext(self):
        """
        :rtype: bool
        """
        if self.top:
            return True
        else:
            return False

# Your PeekingIterator object will be instantiated and called as such:
# iter = PeekingIterator(Iterator(nums))
# while iter.hasNext():
#     val = iter.peek()   # Get the next element but not advance the iterator.
#     iter.next()         # Should return the same value as [val].

# Runtime: 20 ms, faster than 89.90% of Python online submissions for Peeking Iterator.
# Memory Usage: 12 MB, less than 6.30% of Python online submissions for Peeking Iterator.
```

## References
1. [284. Peeking Iterator](https://leetcode.com/problems/peeking-iterator/)
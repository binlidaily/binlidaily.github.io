---
layout: post
title: 380. Insert Delete GetRandom O(1)
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Design]
image: 
comments: true
published: true
---

## Description

Design a data structure that supports all following operations in *average* **O(1)** time.



1. `insert(val)`: Inserts an item val to the set if not already present.
2. `remove(val)`: Removes an item val from the set if present.
3. `getRandom`: Returns a random element from current set of elements. Each element must have the **same probability** of being returned.



**Example:**

```
// Init an empty set.
RandomizedSet randomSet = new RandomizedSet();

// Inserts 1 to the set. Returns true as 1 was inserted successfully.
randomSet.insert(1);

// Returns false as 2 does not exist in the set.
randomSet.remove(2);

// Inserts 2 to the set, returns true. Set now contains [1,2].
randomSet.insert(2);

// getRandom should return either 1 or 2 randomly.
randomSet.getRandom();

// Removes 1 from the set, returns true. Set now contains [2].
randomSet.remove(1);

// 2 was already in the set, so return false.
randomSet.insert(2);

// Since 2 is the only number in the set, getRandom always return 2.
randomSet.getRandom();
```

## Solutions
### 1. Set
　　看上去似乎很复杂，但是实现起来还是比较容易的，Python 中的 Set 使用得到了一些熟悉，但是速度上并不那么快：

```python
class RandomizedSet(object):

    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.set = set()
        

    def insert(self, val):
        """
        Inserts a value to the set. Returns true if the set did not already contain the specified element.
        """
        if val in self.set:
            return  0
        else:
            n_set = len(self.set)
            self.set.add(val)
            if n_set >= len(self.set):
                return 0
            else:
                return 1
        

    def remove(self, val):
        """
        Removes a value from the set. Returns true if the set contained the specified element.
        """
        if val in self.set:
            self.set.remove(val)
            if val in self.set:
                return 0
            else:
                return 1
        else:
            return 0

    def getRandom(self):
        """
        Get a random element from the set.
        """
        import random
        # n_set = len(self.set)
        # n_iter = random.randint(0, n_set)
        # res = 0
        # for i in range(n_iter):
        #     res = next(iter(self.set))
        # return res
        return random.sample(self.set, 1)[0]

# Your RandomizedSet object will be instantiated and called as such:
# obj = RandomizedSet()
# param_1 = obj.insert(val)
# param_2 = obj.remove(val)
# param_3 = obj.getRandom()
# Runtime: 380 ms, faster than 17.86% of Python online submissions for Insert Delete GetRandom O(1).
# Memory Usage: 16.4 MB, less than 60.06% of Python online submissions for Insert Delete GetRandom O(1).
```

### 2. Hash Table
　　用哈希表能快一丢丢：
```python
class RandomizedSet(object):

	def __init__(self):
		"""
		Initialize your data structure here.
		"""
		self.elements = dict()
		

	def insert(self, val):
		"""
		Inserts a value to the set. Returns true if the set did not already contain the specified element.
		:type val: int
		:rtype: bool
		"""
		if val in self.elements:
			return False
		else:
			self.elements[val] = 0
			return True
		

	def remove(self, val):
		"""
		Removes a value from the set. Returns true if the set contained the specified element.
		:type val: int
		:rtype: bool
		"""
		if val in self.elements:
			self.elements.pop(val)
			return True
		else:
			return False
		

	def getRandom(self):
		"""
		Get a random element from the set.
		:rtype: int
		"""
		from random import randint
		
		return self.elements.keys()[randint(0, len(self.elements) - 1)]
# Runtime: 296 ms, faster than 27.66% of Python online submissions for Insert Delete GetRandom O(1).
# Memory Usage: 16.4 MB, less than 42.69% of Python online submissions for Insert Delete GetRandom O(1).
```

### 3. list + hash table
　　更快的解法，用一个数列存放添加进来的数值，用一个字典存放，对应数值和其在数列中的坐标。因为直接用字典去删除的话，可能不是常数时间！（平均下来应该是常数时间）

```python
import random

class RandomizedSet(object):

	def __init__(self):
		self.nums, self.pos = [], {}
		
	def insert(self, val):
		if val not in self.pos:
			self.nums.append(val)
			self.pos[val] = len(self.nums) - 1
			return True
		return False
		

	def remove(self, val):
		if val in self.pos:
		  # remove val is more difficult, switch last and val pos
			idx, last = self.pos[val], self.nums[-1]
			self.nums[idx], self.pos[last] = last, idx
			self.nums.pop(); self.pos.pop(val, 0)
			return True
		return False
			
	def getRandom(self):
		return self.nums[random.randint(0, len(self.nums) - 1)]

# Runtime: 116 ms, faster than 53.20% of Python online submissions for Insert Delete GetRandom O(1).
# Memory Usage: 16.5 MB, less than 14.45% of Python online submissions for Insert Delete GetRandom O(1).
```

## References
1. [380. Insert Delete GetRandom O(1)](https://leetcode.com/problems/insert-delete-getrandom-o1/)
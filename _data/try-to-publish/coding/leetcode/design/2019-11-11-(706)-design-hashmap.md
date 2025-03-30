---
layout: post
title: 706. Design HashMap
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Hash Table]
image: 
comments: true
published: true
---

## Description

Design a HashMap without using any built-in hash table libraries.

To be specific, your design should include these functions:

- `put(key, value)` : Insert a (key, value) pair into the HashMap. If the value already exists in the HashMap, update the value.
- `get(key)`: Returns the value to which the specified key is mapped, or -1 if this map contains no mapping for the key.
- `remove(key)` : Remove the mapping for the value key if this map contains the mapping for the key.


**Example:**

```
MyHashMap hashMap = new MyHashMap();
hashMap.put(1, 1);          
hashMap.put(2, 2);         
hashMap.get(1);            // returns 1
hashMap.get(3);            // returns -1 (not found)
hashMap.put(2, 1);          // update the existing value
hashMap.get(2);            // returns 1 
hashMap.remove(2);          // remove the mapping for 2
hashMap.get(2);            // returns -1 (not found) 
```


**Note:**

- All keys and values will be in the range of `[0, 1000000]`.
- The number of operations will be in the range of `[1, 10000]`.
- Please do not use the built-in HashMap library.

## Solutions
### 1. 哈希表
　　知道要如何做哈希，即设计其中的哈希函数，围绕哈希函数进行操作。需要注意的是在删除的时候，不能删除 item，而要删除 self.table[hash_index][index]！


```python
# Time: O(n)
# Space: O(n)
class Item:
    def __init__(self, key, value):
        self.key = key
        self.value = value

class MyHashMap:

    def __init__(self, size=None):
        """
        Initialize your data structure here.
        """
        if not size:
            self.size = 1000
        else:
            self.size = size
        self.table = [[] for _ in range(self.size)]

    def _hash_function(self, key):
        return key % self.size

    def put(self, key: int, value: int) -> None:
        """
        value will always be non-negative.
        """
        hash_key = self._hash_function(key)
        for item in self.table[hash_key]:
            if item.key == key:
                item.value = value
                return
        self.table[hash_key].append(Item(key, value))


    def get(self, key: int) -> int:
        """
        Returns the value to which the specified key is mapped, or -1 if this map contains no mapping for the key
        """
        hash_key = self._hash_function(key)
        for item in self.table[hash_key]:
            if item.key == key:
                return item.value
        # raise KeyError('Key Not Found')
        return -1
        

    def remove(self, key: int) -> None:
        """
        Removes the mapping of the specified value key if this map contains a mapping for the key
        """
        hash_key = self._hash_function(key)
        for index, item in enumerate(self.table[hash_key]):
            if item.key == key:
                del self.table[hash_key][index]
                return

# Your MyHashMap object will be instantiated and called as such:
# obj = MyHashMap()
# obj.put(key,value)
# param_2 = obj.get(key)
# obj.remove(key)

# 33/33 cases passed (228 ms)
# Your runtime beats 68.13 % of python3 submissions
# Your memory usage beats 63.64 % of python3 submissions (15.7 MB)
```

## References
1. [706. Design HashMap](https://leetcode.com/problems/design-hashmap/)
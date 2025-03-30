---
layout: post
title: 70. Climbing Stairs
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

You are climbing a stair case. It takes n steps to reach to the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Note: Given n will be a positive integer.

Example 1:
```
Input: 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps
```
Example 2:
```
Input: 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
```

## Solutions
### 1. DP-迭代自底向上
　　注意循环次数是 n-1，不是 n-2。
```python
# Time Complexity: O(n)
# Space Complexity: O(1)
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 0:
            return 0
        if n == 1:
            return 1
        fn = 0
        fn_2 = 1
        fn_1 = 1
        for i in range(n-1):
            fn = fn_2 + fn_1
            fn_2 = fn_1
            fn_1 = fn
        return fn
# Runtime: 40 ms, faster than 27.63% of Python3 online submissions for Climbing Stairs.
# Memory Usage: 13.9 MB, less than 5.97% of Python3 online submissions for Climbing Stairs.
```

### 2. DP-递归自顶向下
　　注意存储：

```python
# Time Complexity: O(n)
# Space Complexity: O(n)
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 0:
            return 0
        if n == 1:
            return 1
        self.memo = [0 for _ in range(n+1)]
        self.memo[0] = 1
        self.memo[1] = 1
        self.fibonacci(n)
        return self.memo[-1]
        
    
    def fibonacci(self, n: int) -> int:
        if n == 0 or n == 1:
            return 1
        
        if self.memo[n-1] == 0:
            self.memo[n-1] = self.fibonacci(n-1)
        
        if self.memo[n-2] == 0:
            self.memo[n-2] = self.fibonacci(n-2)
        
        self.memo[n] = self.memo[n-1] + self.memo[n-2]
        return self.memo[n]
        
# Runtime: 32 ms, faster than 89.69% of Python3 online submissions for Climbing Stairs.
# Memory Usage: 13.9 MB, less than 5.97% of Python3 online submissions for Climbing Stairs.
```

　　不够简洁，做进一步简化：

```python
# Time Complexity: O(n)
# Space Complexity: O(n)
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 1:
            return 1
        self.memo = [0 for _ in range(n+1)]
        self.memo[0] = 1
        self.memo[1] = 1
        return self.fibonacci(n)
        
    
    def fibonacci(self, n: int) -> int:
        if self.memo[n] == 0:
            self.memo[n] = self.fibonacci(n-1) + self.fibonacci(n-2)
        return self.memo[n]
        
# Runtime: 32 ms, faster than 89.69% of Python3 online submissions for Climbing Stairs.
# Memory Usage: 13.9 MB, less than 5.97% of Python3 online submissions for Climbing Stairs.
```

　　当然还可以用哈希表做存储，查找起来也相对较快，不要用 List 查找！

```python
# Time Complexity: O(n)
# Space Complexity: O(n)
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 1:
            return 1
        self.memo = {0: 1, 1: 1}
        return self.fibonacci(n)
        
    
    def fibonacci(self, n: int) -> int:
        if n in self.memo:
            return self.memo[n]
        
        self.memo[n-1] = self.fibonacci(n-1)
        self.memo[n-2] = self.fibonacci(n-2)
        self.memo[n] = self.memo[n-1] + self.memo[n-2]
        
        return self.memo[n]
# Runtime: 36 ms, faster than 67.28% of Python3 online submissions for Climbing Stairs.
# Memory Usage: 14 MB, less than 5.97% of Python3 online submissions for Climbing Stairs.
```

## References
1. [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)
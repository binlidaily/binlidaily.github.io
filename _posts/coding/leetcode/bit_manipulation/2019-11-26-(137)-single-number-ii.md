---
layout: post
title: 137. Single Number II
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Bit Manipulation]
image: 
comments: true
published: true
---

## Description

Given a **non-empty** array of integers, every element appears *three* times except for one, which appears exactly once. Find that single one.

**Note:**

Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?

**Example 1:**

```
Input: [2,2,3,2]
Output: 3
```

**Example 2:**

```
Input: [0,1,0,1,0,1,99]
Output: 99
```

## Solutions
### 1. Bit Manipulation
【笔记】网上大佬曾经说，如何设计一个状态转换电路，使得一个数出现3次时能自动抵消为0，最后剩下的就是只出现1次的数。

开始设计：一个二进制位只能表示0或者1。也就是天生可以记录一个数出现了一次还是两次。

- x ^ 0 = x;
- x ^ x = 0;

要记录出现3次，需要两个二进制位。那么上面单独的`x`就不行了。我们需要两个变量，每个变量取一位：

- ab ^ 00 = ab;
- ab ^ ab = 00;

这里，`a`、`b`都是32位的变量。我们使用`a`的第`k`位与`b`的第`k`位组合起来的两位二进制，表示当前位出现了几次。也就是，一个`8`位的二进制`x`就变成了`16`位来表示。

- x = x[7] x[6] x[5] x[4] x[3] x[2] x[1] x[0]
- x = (a[7]b[7]) (a[6]b[6]) ... (a[1]b[1]) (a[0]b[0])

于是，就有了这一幕....

它是一个逻辑电路，`a`、`b`变量中，相同位置上，分别取出一位，负责完成`00->01->10->00`，也就是开头的那句话，当数字出现3次时置零。

```cpp
int singleNumber(vector<int>& nums) {
    int a = 0, b = 0;
    for (auto x : nums) {
        b = (b ^ x) & ~a;
        a = (a ^ x) & ~b;
    }
    return b;
}
```

解释下：假设有一个数为x,那么则有如下规律：

- 0 ^ x = x,
- x ^ x = 0；
- x & ~x = 0,
- x & ~0 =x;

-那么就是很好解释上面的代码了。一开始a = 0, b = 0;

1. x第一次出现后，a = (a ^ x) & ~b的结果为 a = x, b = (b ^ x) & ~a的结果为此时因为a = x了，所以b = 0。
2. x第二次出现：a = (a ^ x) & ~b, a = (x ^ x) & ~0, a = 0; b = (b ^ x) & ~a 化简， b = (0 ^ x) & ~0 ,b = x;
3. x第三次出现：a = (a ^ x) & ~b， a = (0 ^ x) & ~x ,a = 0; b = (b ^ x) & ~a 化简， b = (x ^ x) & ~0 , b = 0;所以出现三次同一个数，a和b最终都变回了0.

- 只出现一次的数，按照上面x第一次出现的规律可知a = x, b = 0;因此最后返回a.

```python
# Time: O(n)
# Space: O(1)
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        ones, twos = 0, 0
        n = len(nums)
        for i in range(n):
            ones = (ones ^ nums[i]) & ~ twos
            twos = (twos ^ nums[i]) & ~ ones
        return ones
# 11/11 cases passed (60 ms)
# Your runtime beats 89.77 % of python3 submissions
# Your memory usage beats 53.33 % of python3 submissions (14.6 MB)
```

## References
1. [137. Single Number II](https://leetcode.com/problems/single-number-ii)
2. [LeetCode-CN Comments](https://leetcode-cn.com/problems/single-number-ii/comments/)
---
layout: post
title: 22. Generate Parentheses
subtitle:
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---


Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

For example, given n = 3, a solution set is:
```
[
  "((()))",
  "(()())",
  "(())()",
  "()(())",
  "()()()"
]
```

## Solutions
　　所谓 Backtracking 都是这样的思路：在当前局面下，你有若干种选择。那么尝试每一种选择。如果已经发现某种选择肯定不行（因为违反了某些限定条件），就返回；如果某种选择试到最后发现是正确解，就将其加入解集

　　所以你思考递归题时，只要明确三点就行：选择 (Options)，限制 (Restraints)，结束条件 (Termination)。

　　对于这道题，在任何时刻，你都有两种选择：
1. 加左括号。
2. 加右括号。

　　同时有以下限制：
1. 如果左括号已经用完了，则不能再加左括号了。
2. 如果已经出现的右括号和左括号一样多，则不能再加右括号了。因为那样的话新加入的右括号一定无法匹配。

　　结束条件是：
* 左右括号都已经用完。

结束后的正确性：
　　左右括号用完以后，一定是正确解。因为1. 左右括号一样多，2. 每个右括号都一定有与之配对的左括号。因此一旦结束就可以加入解集（有时也可能出现结束以后不一定是正确解的情况，这时要多一步判断）。

递归函数传入参数：
　　限制和结束条件中有“用完”和“一样多”字样，因此你需要知道左右括号的数目。

写出伪代码就是：
```python
if (左右括号都已用完) {
  加入解集，返回
}
# 否则开始试各种选择
if (还有左括号可以用) {
  加一个左括号，继续递归
}
if (右括号小于左括号) {
  加一个右括号，继续递归
}
```

```python
class Solution(object):
    def generateParenthesis(self, n):
        """
        :type n: int
        :rtype: List[str]
        """
        if n <= 0:
            return []
        left, right, arr = n, n, []
        self.backtracking(left, right, arr, '')
        return arr
    
    def backtracking(self, left, right, arr, string):
        if left > right:
            return
        if not left and not right:
            arr.append(string)
            return 
        if left:
            self.backtracking(left-1, right, arr, string+'(')
        if right:
            self.backtracking(left, right-1, arr, string+')')
```

　　手写了一下返回的路径帮助理解，因为这里要求 left 的值要大于 right，也就是说右括号数目不能躲过左括号，不然就类似`())`这样不符合要求了。

![IMG_5368](/img/media/IMG_5368.jpg)

## References
1. [22. Generate Parentheses](https://leetcode.com/problems/generate-parentheses/)
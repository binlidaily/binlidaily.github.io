---
layout: post
title: 22. Generate Parentheses
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Backtracking, Medium]
image: 
comments: true
published: true
---

## Decription
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
### 1. Backtracking
　　所谓 Backtracking 都是这样的思路：在当前局面下，你有若干种选择。那么尝试每一种选择。如果已经发现某种选择肯定不行（因为违反了某些限定条件），就返回；如果某种选择试到最后发现是正确解，就将其加入解集。

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
# Time: O(2^n)
# Space: O(n)
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        if n <= 0:
            return []
        left, right = n, n
        res = []
        self.dfs(left, right, '', res)
        return res
    
    def dfs(self, left, right, path, res):
        if left > right :
            return
        if left <= 0 and right <= 0:
            res.append(path)
            return
        
        if left > 0:
            self.dfs(left - 1, right, path + '(', res)
        
        if right > 0:
            self.dfs(left, right - 1, path + ')', res)
# 8/8 cases passed (36 ms)
# Your runtime beats 74.71 % of python3 submissions
# Your memory usage beats 100 % of python3 submissions (12.8 MB)
```

　　手写了一下返回的路径帮助理解，因为这里要求 left 的值要大于 right，也就是说右括号数目不能躲过左括号，不然就类似`())`这样不符合要求了。

![IMG_5368](/img/media/IMG_5368.jpg)

　　二刷：


```python
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        if n <= 0:
            return []
        res = []
        self.dfs(n, 0, 0, '', res)
        return res
    
    def dfs(self, n, l, r, path, res):
        if l >= n and r >= n:
            res.append(path)
            return res
        if l > n or r > n or l < r:
            return
        self.dfs(n, l+1, r, path+'(', res)
        self.dfs(n, l, r+1, path+')', res)
```

### 2. BFS

```python
import collections
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res = []
        queue = collections.deque()
        queue.append((0, 0, ''))
        while queue:
            l, r, seq = queue.popleft()
            if l > n or r > n or l < r:
                continue
            if l == r and l + r == n << 1:
                res.append(seq)
            queue.append((l + 1, r, seq+'('))
            queue.append((l, r + 1, seq+')'))
        return res
```
## References
1. [22. Generate Parentheses](https://leetcode.com/problems/generate-parentheses/)
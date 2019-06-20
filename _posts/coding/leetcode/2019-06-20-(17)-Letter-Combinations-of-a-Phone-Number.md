---
layout: post
title: 17. Letter Combinations of a Phone Number
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.

A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

![](/img/media/15610024146428.jpg)


Example:
```
Input: "23"
Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
```
**Note**:

Although the above answer is in lexicographical order, your answer could be in any order you want.

## Solutions
　　看到这样全部输出的题目一般都是模板题，用 DFS 来做。画出树的时候，node 按键上的数字，边是按键能够打出的字符。搜索树的每一条完整的路径就是一个结果，以下通过 DFS 方法来解决：

```python
class Solution(object):
    def letterCombinations(self, digits):
        """
        :type digits: str
        :rtype: List[str]
        """
        if digits is None or digits == '': 
            return []
        mapping = {'0':' ', '1':'', '2':'abc', '3':'def', '4':'ghi', '5':'jkl', '6':'mno', '7':'pqrs', '8':'tuv', '9':'wxyz'}
        ans = []
        self.dfs(mapping, digits, 0, '', ans)
        return ans
    
    def dfs(self, mapping, digits, lev, cur, ans):
        if lev == len(digits):
            ans.append(cur)
            return
        
        for c in mapping[digits[lev]]:
            self.dfs(mapping, digits, lev + 1, cur + c, ans)
# Runtime: 24 ms, faster than 22.37% of Python online submissions for Letter Combinations of a Phone Number.
# Memory Usage: 11.7 MB, less than 78.60% of Python online submissions for Letter Combinations of a Phone Number.
```

　　接下来用 BFS 的方式求解：

![-w1328](/img/media/15610194736256.jpg)


```python
class Solution(object):
    def letterCombinations(self, digits):
        """
        :type digits: str
        :rtype: List[str]
        """
        if digits is None or digits == '': 
            return []
        mapping = {'0':' ', '1':'', '2':'abc', '3':'def', '4':'ghi', '5':'jkl', '6':'mno', '7':'pqrs', '8':'tuv', '9':'wxyz'}
        ans = ['']
        for digit in digits:
            tmp = []
            for s in ans:
                for c in mapping[digit]:
                    tmp.append(s + c)
            ans = tmp
        return ans
# Runtime: 8 ms, faster than 99.74% of Python online submissions for Letter Combinations of a Phone Number.
# Memory Usage: 11.7 MB, less than 62.53% of Python online submissions for Letter Combinations of a Phone Number.
```

　　看到解法中还要直接用递归求解：
```python
class Solution(object):
    def letterCombinations(self, digits):
        '''
        :type digits: str
        :rtype: List[str]
        '''
        phone = {'2': ['a', 'b', 'c'],
                 '3': ['d', 'e', 'f'],
                 '4': ['g', 'h', 'i'],
                 '5': ['j', 'k', 'l'],
                 '6': ['m', 'n', 'o'],
                 '7': ['p', 'q', 'r', 's'],
                 '8': ['t', 'u', 'v'],
                 '9': ['w', 'x', 'y', 'z']}    
        result = []
        
        def helpCombine(current, leftoverDigits):
            if not leftoverDigits:
                result.append(current)
                return 
            else:
                for char in phone[leftoverDigits[0]]:
                    helpCombine(current + char, leftoverDigits[1:])
        
        if not digits:
            return []
        else: 
            helpCombine("", digits)
            return result
# Runtime: 20 ms, faster than 70.29% of Python online submissions for Letter Combinations of a Phone Number.
# Memory Usage: 11.8 MB, less than 44.24% of Python online submissions for Letter Combinations of a Phone Number.
```

## References
1. [17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)
2. [花花酱 LeetCode 17. Letter Combinations of a Phone Number](https://www.youtube.com/watch?v=fLy8t33M1qQ)
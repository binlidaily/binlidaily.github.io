---
layout: post
title: 221. Maximal Square
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, DP]
image: 
comments: true
published: true
---

## Description

Given a 2D binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area.

**Example:**

```
Input: 

1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0

Output: 4
```

## Solutions
### 1. Brute Force

```python
# Time: O(mn*min(m,n))
# Space: O(n)
class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        if not matrix:
            return 0
        r, c = len(matrix), len(matrix[0])
        max_area = 0
        for i in range(r):
            for j in range(c):
                for l in range(min(r, c)):
                    if self.check_square(matrix, i, j, i + l, j + l):
                        max_area = max(max_area, (l+1)**2)
        return max_area
    
    def check_square(self, matrix, x, y , bottom_x, bottom_y):
        r, c = len(matrix), len(matrix[0])
        if bottom_x >= r or bottom_y >= c:
            return False
        for i in range(x, bottom_x+1):
            for j in range(y, bottom_y+1):
                if matrix[i][j] == '0':
                    return False
        return True
# Time Limit Exceeded
# 69/69 cases passed (N/A)
```

### 2. todo

```c++

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
// Author: Huahua
// Time complexity: O(n^3)
// Running time: 39 ms
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        if (matrix.empty()) return 0;
        int m = matrix.size();
        int n = matrix[0].size();
        
        // sums[i][j] = sum(matrix[0][0] ~ matrix[i-1][j-1])
        vector<vector<int>> sums(m + 1, vector<int>(n + 1, 0));
        for (int i = 1; i <= m; ++i)
            for (int j = 1; j <= n; ++j)        
                sums[i][j] = matrix[i - 1][j - 1] - '0' 
                             + sums[i - 1][j]
                             + sums[i][j - 1]
                             - sums[i - 1][j - 1];
        
        int ans = 0;
        for (int i = 1; i <= m; ++i)
            for (int j = 1; j <= n; ++j)
                for (int k = min(m - i + 1, n - j + 1); k > 0; --k) {
                    int sum = sums[i + k - 1][j + k - 1]
                            - sums[i + k - 1][j - 1]
                            - sums[i - 1][j + k - 1]
                            + sums[i - 1][j - 1];
                    // full of 1
                    if (sum == k*k) {
                        ans = max(ans, sum);
                        break;
                    }
                }
 
        return ans;
    }
};
```
### 3. 2d-DP
![-w1338](/img/media/15823656174851.jpg)


```python
# Time: O(mn)
# Space:O(mn)
class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        if not matrix: return 0
        m , n = len(matrix), len(matrix[0])
        dp = [[ 0 if matrix[i][j] == '0' else 1 for j in range(0, n)] for i in range(0, m)]
        
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == '1':
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                else:
                    dp[i][j] = 0
        
        res = max(max(row) for row in dp)
        return res ** 2

# 69/69 cases passed (200 ms)
# Your runtime beats 73.57 % of python3 submissions
# Your memory usage beats 81.82 % of python3 submissions (13.9 MB)
```

## References
1. [221. Maximal Square](https://leetcode.com/problems/maximal-square/description/)
2. [huahua](https://zxi.mytechroad.com/blog/dynamic-programming/leetcode-221-maximal-square/)
3. [公瑾™](https://leetcode.com/problems/maximal-square/discuss/164120/Python-or-DP-tm)
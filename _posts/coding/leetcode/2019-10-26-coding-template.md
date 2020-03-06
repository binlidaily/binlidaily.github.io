---
layout: post
title: 刷题代码模板
subtitle: 
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

　　对于难题，先想出来 Brute Force 怎么做啊！在刷题的时候先把 BF 的写出来！

　　然后看下有哪些可以优化的地方：
* 是不是可以用空间换时间
* 是不是有重复计算的地方？
* 一般求最大最小要不是 DP 就是 Greedy，怎么知道 Greedy 是最优？

思考一下面对不会做的题目，要如何想！

滚动数组降低空间复杂度！

## 结题总结
* 求极值
    * 最小路径：BFS
    * 最大或最小：DP
    * 最大或最小：Greedy

## 二分模板

```python
# Author: Huahua
# Returns the smallest m in [l, r),
# s.t. cond(m) == True
# If not found returns r.
def binary_search(l, r, cond)
  while l < r:
    m = l + (r - l) // 2
    if cond(m):
      r = m
    else
      l = m + 1
  return l
```

## 组合模板

```python
# Author: Huahua
def C(n, m, s, cur):
  if len(cur) == m:
    print(cur)
    return
  for i in range(s, n):
    cur.append(i + 1)
    C(n, m, i + 1, cur)
    cur.pop()    

n = 5
m = 3
C(n, m, 0, [])
```

## 排列模板

```python
# Author: Huahua
def P(n, m, cur, used):
  if len(cur) == m:
    print(cur)
    return
  for i in range(n):
    if used[i]: continue
    used[i] = True
    cur.append(i + 1)
    P(n, m, cur, used)
    cur.pop()
    used[i] = False

n = 5
m = 3
P(n, m, [], [False] * n)
```

## BFS模板

```python
# Author: Huahua
# Find the shortest path from |start| to |target| in a unweighted graph G.
# neighbor(x) returns the neighbors of x in G.

q = deque([start])
seen = set([start])
steps = 0

while q:
  size = len(q)
  for _ in range(size):
    n = q.popleft()
    if n == target: return steps
    for t in neighbor(n):
      if t in seen: continue
      q.append(t)
      seen.add(t)
  steps += 1
return -1 # not found
```

## DFS模板

```python
# Author: Huahua
# Check whether there is a path from |start| to |target| in graph G.
# neighbor(x) returns the neighbors of x in G.

seen = set([start])
def dfs(n):
  if n == target:
    return True  
  for t in neighbor(n):
    if t in seen: continue
    seen.add(t)
    if dfs(t): return True
    seen.remove(t) # back-tracking  
  return False
return dfs(start)
```

## 前缀树模板

```python
# Author: Huahua
class Trie(object):
  def __init__(self): self.root = {}

  def insert(self, word):
    p = self.root
    for c in word:
      if c not in p: p[c] = {}
      p = p[c]
    p['#'] = True    

  def search(self, word):
    node = self._find(word)
    return node and '#' in node
    
  def startsWith(self, prefix):
    return self._find(prefix)

  def _find(self, prefix):
    p = self.root
    for c in prefix:
      if c not in p: return None
      p = p[c]
    return p
```

## 并查集模板

```python
# Author: Huahua
class UnionFindSet:
  def __init__(self, n):
    self.p = [i for i in range(n + 1)]
    self.r = [1 for i in range(n + 1)]

  def find(self, u):
    while u != self.p[u]:
      self.p[u] = self.p[self.p[u]]
      u = self.p[u]
    return u

  def union(self, u, v):
    pu, pv = self.find(u), self.find(v)
    if pu == pv: return False    
    if self.r[pu] < self.r[pv]:
      self.p[pu] = pv
    elif self.r[pu] > self.r[pv]:
      self.p[pv] = pu
    else:        
      self.p[pv] = pu
      self.r[pu] += 1
    return True
```

## 记忆化递归模板

```python
# Author: Huahua
# dp(state) returns the minimal cost to solve the subproblem |s|.
def dp(s):
  # No solution
  if unsolvable(s): return float('inf')
  # Base case, easy to solve.
  if base_case(s): return cost(s)
  # Already solved
  if s in memo: return memo[s]
  best = float('inf')
  for t in subproblems(s):   
    best = min(best, cost(s, t) + dp(t))
  memo[s] = best
  return best
return dp(start)
```

## LeetCode Done
* [45. Jump Game II](https://binlidaily.github.io/2020-03-02-(45)-jump-game-ii/)
* [Greedy Algorithm](https://binlidaily.github.io/2020-03-02-greedy/)
* [58. Length of Last Word](https://binlidaily.github.io/2020-03-01-(58)-length-of-last-word/)
* [43. Multiply Strings](https://binlidaily.github.io/2020-03-01-(43)-multiply-strings/)
* [30. Substring with Concatenation of All Words](https://binlidaily.github.io/2020-03-01-(30)-substring-with-concatenation-of-all-words/)
* [83. Remove Duplicates from Sorted List](https://binlidaily.github.io/2020-03-01-(83)-remove-duplicates-from-sorted-list/)
* [9. Palindrome Number](https://binlidaily.github.io/2020-02-29-(9)-palindrome-number/)
* [24. Swap Nodes in Pairs](https://binlidaily.github.io/2020-02-29-(24)-swap-nodes-in-pairs/)
* [27. Remove Element](https://binlidaily.github.io/2020-02-29-(27)-remove-element/)
* [16. 3Sum Closest](https://binlidaily.github.io/2020-02-29-(16)-3sum-closest/)
* [6. ZigZag Conversion](https://binlidaily.github.io/2020-02-28-(6)-zigzag-conversion/)
* [312. Burst Balloons](https://binlidaily.github.io/2020-02-28-(312)-burst-balloons/)
* [406. Queue Reconstruction by Height](https://binlidaily.github.io/2020-02-27-(406)-queue-reconstruction-by-height/)
* [438. Find All Anagrams in a String](https://binlidaily.github.io/2020-02-26-(438)-find-all-anagrams-in-a-string/)
* [647. Palindromic Substrings](https://binlidaily.github.io/2020-02-25-(647)-palindromic-substrings/)
* [621. Task Scheduler](https://binlidaily.github.io/2020-02-25-(621)-task-scheduler/)
* [494. Target Sum](https://binlidaily.github.io/2020-02-25-(494)-target-sum/)
* [560. Subarray Sum Equals K](https://binlidaily.github.io/2020-02-25-(560)-subarray-sum-equals-k/)
* [617. Merge Two Binary Trees](https://binlidaily.github.io/2020-02-24-(617)-merge-two-binary-trees/)
* [739. Daily Temperatures](https://binlidaily.github.io/2020-02-24-(739)-daily-temperatures/)
* [338. Counting Bits](https://binlidaily.github.io/2020-02-24-(338)-counting-bits/)
* [31. Next Permutation](https://binlidaily.github.io/2020-02-24-(31)-next-permutation/)
* [226. Invert Binary Tree](https://binlidaily.github.io/2020-02-23-(226)-invert-binary-tree/)
* [309. Best Time to Buy and Sell Stock with Cooldown](https://binlidaily.github.io/2020-02-23-(309)-best-time-to-buy-and-sell-stock-with-cooldown/)
* [221. Maximal Square](https://binlidaily.github.io/2020-02-22-(221)-maximal-square/)
* [395. Longest Substring with At Least K Repeating Characters](https://binlidaily.github.io/2020-02-21-(395)-longest-substring-with-at-least-k-repeating-characters/)
* [387. First Unique Character in a String](https://binlidaily.github.io/2020-02-21-(387)-first-unique-character-in-a-string/)
* [371. Sum of Two Integers](https://binlidaily.github.io/2020-02-21-(371)-sum-of-two-integers/)
* [378. Kth Smallest Element in a Sorted Matrix](https://binlidaily.github.io/2020-02-21-(378)-kth-smallest-element-in-a-sorted-matrix/)
* [412. Fizz Buzz](https://binlidaily.github.io/2020-02-21-(412)-fizz-buzz/)
* [384. Shuffle an Array](https://binlidaily.github.io/2020-02-21-(384)-shuffle-an-array/)
* [344. Reverse String](https://binlidaily.github.io/2020-02-20-(344)-reverse-string/)
* [341. Flatten Nested List Iterator](https://binlidaily.github.io/2020-02-20-(341)-flatten-nested-list-iterator/)
* [328. Odd Even Linked List](https://binlidaily.github.io/2020-02-20-(328)-odd-even-linked-list/)
* [347. Top K Frequent Elements](https://binlidaily.github.io/2020-02-20-(347)-top-k-frequent-elements/)
* [350. Intersection of Two Arrays II](https://binlidaily.github.io/2020-02-20-(350)-intersection-of-two-arrays-ii/)
* [349. Intersection of Two Arrays](https://binlidaily.github.io/2020-02-20-(349)-intersection-of-two-arrays/)
* [315. Count of Smaller Numbers After Self](https://binlidaily.github.io/2020-02-19-(315)-count-of-smaller-numbers-after-self/)
* [324. Wiggle Sort II](https://binlidaily.github.io/2020-02-19-(324)-wiggle-sort-ii/)
* [326. Power of Three](https://binlidaily.github.io/2020-02-19-(326)-power-of-three/)
* [295. Find Median from Data Stream](https://binlidaily.github.io/2020-02-19-(295)-find-median-from-data-stream/)
* [283. Move Zeroes](https://binlidaily.github.io/2020-02-18-(283)-move-zeroes/)
* [236. Lowest Common Ancestor of a Binary Tree](https://binlidaily.github.io/2020-02-18-(236)-lowest-common-ancestor-of-a-binary-tree/)
* [224. Basic Calculator](https://binlidaily.github.io/2020-02-18-(224)-basic-calculator/)
* [268. Missing Number](https://binlidaily.github.io/2020-02-18-(268)-missing-number/)
* [240. Search a 2D Matrix II](https://binlidaily.github.io/2020-02-18-(240)-search-a-2d-matrix-ii/)
* [289. Game of Life](https://binlidaily.github.io/2020-02-18-(289)-game-of-life/)
* [208. Implement Trie (Prefix Tree)](https://binlidaily.github.io/2020-02-17-(208)-implement-trie-prefix-tree/)
* [230. Kth Smallest Element in a BST](https://binlidaily.github.io/2020-02-17-(230)-kth-smallest-element-in-a-bst/)
* [227. Basic Calculator II](https://binlidaily.github.io/2020-02-17-(227)-basic-calculator-ii/)
* [218. The Skyline Problem](https://binlidaily.github.io/2020-02-17-(218)-the-skyline-problem/)
* [215. Kth Largest Element in an Array](https://binlidaily.github.io/2020-02-17-(215)-kth-largest-element-in-an-array/)
* [217. Contains Duplicate](https://binlidaily.github.io/2020-02-17-(217)-contains-duplicate/)
* [150. Evaluate Reverse Polish Notation](https://binlidaily.github.io/2020-02-15-(150)-evaluate-reverse-polish-notation/)
* [172. Factorial Trailing Zeroes](https://binlidaily.github.io/2020-02-15-(172)-factorial-trailing-zeroes/)
* [206. Reverse Linked List](https://binlidaily.github.io/2020-02-15-(206)-reverse-linked-list/)
* [202. Happy Number](https://binlidaily.github.io/2020-02-15-(202)-happy-number/)
* [166. Fraction to Recurring Decimal](https://binlidaily.github.io/2020-02-15-(166)-fraction-to-recurring-decimal/)
* [191. Number of 1 Bits](https://binlidaily.github.io/2020-02-15-(191)-number-of-1-bits/)
* [190. Reverse Bits](https://binlidaily.github.io/2020-02-15-(190)-reverse-bits/)
* [148. Sort List](https://binlidaily.github.io/2020-02-14-(148)-sort-list/)
* [146. LRU Cache](https://binlidaily.github.io/2020-02-14-(146)-lru-cache/)
* [128. Longest Consecutive Sequence](https://binlidaily.github.io/2020-02-13-(128)-longest-consecutive-sequence/)
* [125. Valid Palindrome](https://binlidaily.github.io/2020-02-13-(125)-valid-palindrome/)
* [171. Excel Sheet Column Number](https://binlidaily.github.io/2020-02-13-(171)-excel-sheet-column-number/)
* [134. Gas Station](https://binlidaily.github.io/2020-02-13-(134)-gas-station/)
* [169. Majority Element](https://binlidaily.github.io/2020-02-13-(169)-majority-element/)
* [42. Trapping Rain Water](https://binlidaily.github.io/2020-02-12-(42)-trapping-rain-water/)
* [76. Minimum Window Substring](https://binlidaily.github.io/2020-02-12-(76)-minimum-window-substring/)
* [703. Kth Largest Element in a Stream](https://binlidaily.github.io/2020-02-12-(703)-kth-largest-element-in-a-stream/)
* [49. Group Anagrams](https://binlidaily.github.io/2020-02-12-(49)-group-anagrams/)
* [55. Jump Game](https://binlidaily.github.io/2020-02-12-(55)-jump-game/)
* [56. Merge Intervals](https://binlidaily.github.io/2020-02-12-(56)-merge-intervals/)
* [48. Rotate Image](https://binlidaily.github.io/2020-02-12-(48)-rotate-image/)
* [119. Pascal's Triangle II](https://binlidaily.github.io/2020-02-12-(119)-pascals-triangle-ii/)
* [118. Pascal's Triangle](https://binlidaily.github.io/2020-02-12-(118)-pascals-triangle/)
* [28. Implement strStr()](https://binlidaily.github.io/2020-02-11-(28)-implement-strstr/)
* [19. Remove Nth Node From End of List](https://binlidaily.github.io/2020-02-11-(19)-remove-nth-node-from-end-of-list/)
* [41. First Missing Positive](https://binlidaily.github.io/2020-02-11-(41)-first-missing-positive/)
* [26. Remove Duplicates from Sorted Array](https://binlidaily.github.io/2020-02-11-(26)-remove-duplicates-from-sorted-array/)
* [8. String to Integer (atoi)](https://binlidaily.github.io/2020-02-10-(8)-string-to-integer-atoi/)
* [14. Longest Common Prefix](https://binlidaily.github.io/2020-02-10-(14)-longest-common-prefix/)
* [13. Roman to Integer](https://binlidaily.github.io/2020-02-10-(13)-roman-to-integer/)
* [12. Integer to Roman](https://binlidaily.github.io/2020-02-10-(12)-integer-to-roman/)
* [983. Minimum Cost For Tickets](https://binlidaily.github.io/2020-02-10-(983)-minimum-cost-for-tickets/)
* [181. Employees Earning More Than Their Managers](https://binlidaily.github.io/2020-02-09-(181)-employees-earning-more-than-their-managers/)
* [178. Rank Scores](https://binlidaily.github.io/2020-02-09-(178)-rank-scores/)
* [177. Nth Highest Salary](https://binlidaily.github.io/2020-02-09-(177)-nth-highest-salary/)
* [176. Second Highest Salary](https://binlidaily.github.io/2020-02-09-(176)-second-highest-salary/)
* [175. Combine Two Tables](https://binlidaily.github.io/2020-02-09-(175)-combine-two-tables/)
* [7. Reverse Integer](https://binlidaily.github.io/2020-02-07-(7)-reverse-integer/)
* [4. Median of Two Sorted Arrays](https://binlidaily.github.io/2020-02-06-(4)-median-of-two-sorted-arrays/)
* [205. Isomorphic Strings](https://binlidaily.github.io/2020-02-05-(205)-isomorphic-strings/)
* [92. Reverse Linked List II](https://binlidaily.github.io/2020-02-02-(92)-reverse-linked-list-ii/)
* [149. Max Points on a Line](https://binlidaily.github.io/2020-02-02-(149)-max-points-on-a-line/)
* [730. Count Different Palindromic Subsequences](https://binlidaily.github.io/2020-02-02-(730)-count-different-palindromic-subsequences/)
* [914. X of a Kind in a Deck of Cards](https://binlidaily.github.io/2020-02-02-(914)-x-of-a-kind-in-a-deck-of-cards/)
* [433. Minimum Genetic Mutation](https://binlidaily.github.io/2020-01-31-(433)-minimum-genetic-mutation/)
* [501. Find Mode in Binary Search Tree](https://binlidaily.github.io/2020-01-27-(501)-find-mode-in-binary-search-tree/)
* [334. Increasing Triplet Subsequence](https://binlidaily.github.io/2020-01-25-(334)-increasing-triplet-subsequence/)
* [454. 4Sum II](https://binlidaily.github.io/2020-01-22-(454)-4sum-ii/)
* [66. Plus One](https://binlidaily.github.io/2020-01-21-(66)-plus-one/)
* [18. 4Sum](https://binlidaily.github.io/2020-01-21-(18)-4sum/)
* [29. Divide Two Integers](https://binlidaily.github.io/2020-01-19-(29)-divide-two-integers/)
* [714. Best Time to Buy and Sell Stock with Transaction Fee](https://binlidaily.github.io/2020-01-19-(714)-best-time-to-buy-and-sell-stock-with-transaction-fee/)
* [495. Teemo Attacking](https://binlidaily.github.io/2020-01-17-(495)-teemo-attacking/)
* [430. Flatten a Multilevel Doubly Linked List](https://binlidaily.github.io/2020-01-15-(430)-flatten-a-multilevel-doubly-linked-list/)
* [869. Reordered Power of 2](https://binlidaily.github.io/2020-01-15-(869)-reordered-power-of-2/)
* [525. Contiguous Array](https://binlidaily.github.io/2020-01-15-(525)-contiguous-array/)
* [982. Triples with Bitwise AND Equal To Zero](https://binlidaily.github.io/2020-01-15-(982)-triples-with-bitwise-and-equal-to-zero/)
* [54. Spiral Matrix](https://binlidaily.github.io/2020-01-15-(54)-spiral-matrix/)
* [35. Search Insert Position](https://binlidaily.github.io/2020-01-14-(35)-search-insert-position/)
* [Bit Manipulation](https://binlidaily.github.io/2020-01-11-outliine-bit-manipulation/)
* [389. Find the Difference](https://binlidaily.github.io/2020-01-11-(389)-find-the-difference/)
* [260. Single Number III](https://binlidaily.github.io/2020-01-11-(260)-single-number-iii/)
* [958. Check Completeness of a Binary Tree](https://binlidaily.github.io/2020-01-09-(958)-check-completeness-of-a-binary-tree/)
* [543. Diameter of Binary Tree](https://binlidaily.github.io/2020-01-09-(543)-diameter-of-binary-tree/)
* [333. Largest BST Subtree](https://binlidaily.github.io/2020-01-09-(333)-largest-bst-subtree/)
* [449. Serialize and Deserialize BST](https://binlidaily.github.io/2020-01-08-(449)-serialize-and-deserialize-bst/)
* [523. Continuous Subarray Sum](https://binlidaily.github.io/2020-01-08-(523)-continuous-subarray-sum/)
* [655. Print Binary Tree](https://binlidaily.github.io/2020-01-07-(655)-print-binary-tree/)
* [297. Serialize and Deserialize Binary Tree](https://binlidaily.github.io/2020-01-07-(297)-serialize-and-deserialize-binary-tree/)
* [474. Ones and Zeroes](https://binlidaily.github.io/2020-01-07-(474)-ones-and-zeroes/)
* [416. Partition Equal Subset Sum](https://binlidaily.github.io/2020-01-07-(416)-partition-equal-subset-sum/)
* [926. Flip String to Monotone Increasing](https://binlidaily.github.io/2020-01-06-(926)-flip-string-to-monotone-increasing/)
* [1143. Longest Common Subsequence](https://binlidaily.github.io/2020-01-06-(1143)-longest-common-subsequence/)
* [814. Binary Tree Pruning](https://binlidaily.github.io/2020-01-05-(814)-binary-tree-pruning/)
* [812. Largest Triangle Area](https://binlidaily.github.io/2020-01-05-(812)-largest-triangle-area/)
* [36. Valid Sudoku](https://binlidaily.github.io/2020-01-05-(36)-valid-sudoku/)
* [813. Largest Sum of Averages](https://binlidaily.github.io/2020-01-05-(813)-largest-sum-of-averages/)
* [815. Bus Routes](https://binlidaily.github.io/2020-01-05-(815)-bus-routes/)
* [222. Count Complete Tree Nodes](https://binlidaily.github.io/2020-01-03-(222)-count-complete-tree-nodes/)
* [34. Find First and Last Position of Element in Sorted Array](https://binlidaily.github.io/2020-01-03-(34)-find-first-and-last-position-of-element-in-sorted-array/)
* [162. Find Peak Element](https://binlidaily.github.io/2020-01-03-(162)-find-peak-element/)
* [160. Intersection of Two Linked Lists](https://binlidaily.github.io/2020-01-02-(160)-intersection-of-two-linked-lists/)
* [138. Copy List with Random Pointer](https://binlidaily.github.io/2020-01-02-(138)-copy-list-with-random-pointer/)
* [86. Partition List](https://binlidaily.github.io/2020-01-01-(86)-partition-list/)
* [25. Reverse Nodes in k-Group](https://binlidaily.github.io/2020-01-01-(25)-reverse-nodes-in-k-group/)
* [234. Palindrome Linked List](https://binlidaily.github.io/2020-01-01-(234)-palindrome-linked-list/)
* [203. Remove Linked List Elements](https://binlidaily.github.io/2020-01-01-(203)-remove-linked-list-elements/)
* [708. Insert into a Cyclic Sorted List](https://binlidaily.github.io/2019-12-31-(708)-insert-into-a-cyclic-sorted-list/)
* [239. Sliding Window Maximum](https://binlidaily.github.io/2019-12-29-(239)-sliding-window-maximum/)
* [232. Implement Queue using Stacks](https://binlidaily.github.io/2019-12-28-(232)-implement-queue-using-stacks/)
* [225. Implement Stack using Queues](https://binlidaily.github.io/2019-12-28-(225)-implement-stack-using-queues/)
* [189. Rotate Array](https://binlidaily.github.io/2019-12-26-(189)-rotate-array/)
* [572. Subtree of Another Tree](https://binlidaily.github.io/2019-12-25-(572)-subtree-of-another-tree/)
* [796. Rotate String](https://binlidaily.github.io/2019-12-25-(796)-rotate-string/)
* [242. Valid Anagram](https://binlidaily.github.io/2019-12-25-(242)-valid-anagram/)
* [151. Reverse Words in a String](https://binlidaily.github.io/2019-12-25-(151)-reverse-words-in-a-string/)
* [164. Maximum Gap](https://binlidaily.github.io/2019-12-25-(164)-maximum-gap/)
* [1031. Maximum Sum of Two Non-Overlapping Subarrays](https://binlidaily.github.io/2019-12-25-(1031)-maximum-sum-of-two-non-overlapping-subarrays/)
* [132. Palindrome Partitioning II](https://binlidaily.github.io/2019-12-24-(132)-palindrome-partitioning-ii/)
* [131. Palindrome Partitioning](https://binlidaily.github.io/2019-12-24-(131)-palindrome-partitioning/)
* [152. Maximum Product Subarray](https://binlidaily.github.io/2019-12-23-(152)-maximum-product-subarray/)
* [123. Best Time to Buy and Sell Stock III](https://binlidaily.github.io/2019-12-23-(123)-best-time-to-buy-and-sell-stock-iii/)
* [122. Best Time to Buy and Sell Stock II](https://binlidaily.github.io/2019-12-21-(122)-best-time-to-buy-and-sell-stock-ii/)
* [95. Unique Binary Search Trees II](https://binlidaily.github.io/2019-12-19-(95)-unique-binary-search-trees-ii/)
* [121. Best Time to Buy and Sell Stock](https://binlidaily.github.io/2019-12-19-(121)-best-time-to-buy-and-sell-stock/)
* [96. Unique Binary Search Trees](https://binlidaily.github.io/2019-12-18-(96)-unique-binary-search-trees/)
* [87. Scramble String](https://binlidaily.github.io/2019-12-18-(87)-scramble-string/)
* [93. Restore IP Addresses](https://binlidaily.github.io/2019-12-18-(93)-restore-ip-addresses/)
* [85. Maximal Rectangle](https://binlidaily.github.io/2019-12-17-(85)-maximal-rectangle/)
* [581. Shortest Unsorted Continuous Subarray](https://binlidaily.github.io/2019-12-15-(581)-shortest-unsorted-continuous-subarray/)
* [32. Longest Valid Parentheses](https://binlidaily.github.io/2019-12-15-(32)-longest-valid-parentheses/)
* [126. Word Ladder II](https://binlidaily.github.io/2019-12-15-(126)-word-ladder-ii/)
* [89. Gray Code](https://binlidaily.github.io/2019-12-14-(89)-gray-code/)
* [472. Concatenated Words](https://binlidaily.github.io/2019-12-14-(472)-concatenated-words/)
* [79. Word Search](https://binlidaily.github.io/2019-12-14-(79)-word-search/)
* [60. Permutation Sequence](https://binlidaily.github.io/2019-12-13-(60)-permutation-sequence/)
* [52. N-Queens II](https://binlidaily.github.io/2019-12-13-(52)-n-queens-ii/)
* [44. Wildcard Matching](https://binlidaily.github.io/2019-12-13-(44)-wildcard-matching/)
* [37. Sudoku Solver](https://binlidaily.github.io/2019-12-13-(37)-sudoku-solver/)
* [77. Combinations](https://binlidaily.github.io/2019-12-12-(77)-combinations/)
* [503. Next Greater Element II](https://binlidaily.github.io/2019-12-11-(503)-next-greater-element-ii/)
* [496. Next Greater Element I](https://binlidaily.github.io/2019-12-11-(496)-next-greater-element-i/)
* [1263. Minimum Moves to Move a Box to Their Target Location](https://binlidaily.github.io/2019-12-08-(1263)-minimum-moves-to-move-a-box-to-their-target-location/)
* [140. Word Break II](https://binlidaily.github.io/2019-12-05-(140)-word-break-ii/)
* [139. Word Break](https://binlidaily.github.io/2019-12-05-(139)-word-break/)
* [213. House Robber II](https://binlidaily.github.io/2019-12-02-(213)-house-robber-ii/)
* [90. Subsets II](https://binlidaily.github.io/2019-12-02-(90)-subsets-ii/)
* [47. Permutations II](https://binlidaily.github.io/2019-12-02-(47)-permutations-ii/)
* [20. Valid Parentheses](https://binlidaily.github.io/2019-12-01-(20)-valid-parentheses/)
* [142. Linked List Cycle II](https://binlidaily.github.io/2019-12-01-(142)-linked-list-cycle-ii/)
* [141. Linked List Cycle](https://binlidaily.github.io/2019-11-26-(141)-linked-list-cycle/)
* [137. Single Number II](https://binlidaily.github.io/2019-11-26-(137)-single-number-ii/)
* [136. Single Number](https://binlidaily.github.io/2019-11-26-(136)-single-number/)
* [154. Find Minimum in Rotated Sorted Array II](https://binlidaily.github.io/2019-11-26-(154)-find-minimum-in-rotated-sorted-array-ii/)
* [179. Largest Number](https://binlidaily.github.io/2019-11-25-(179)-largest-number/)
* [38. Count and Say](https://binlidaily.github.io/2019-11-24-(38)-count-and-say/)
* [23. Merge k Sorted Lists](https://binlidaily.github.io/2019-11-24-(23)-merge-k-sorted-lists/)
* [46. Permutations](https://binlidaily.github.io/2019-11-24-(46)-permutations/)
* [74. Search a 2D Matrix](https://binlidaily.github.io/2019-11-21-(74)-search-a-2d-matrix/)
* [40. Combination Sum II](https://binlidaily.github.io/2019-11-21-(40)-combination-sum-ii/)
* [39. Combination Sum](https://binlidaily.github.io/2019-11-21-(39)-combination-sum/)
* [216. Combination Sum III](https://binlidaily.github.io/2019-11-21-(216)-combination-sum-iii/)
* [33. Search in Rotated Sorted Array](https://binlidaily.github.io/2019-11-20-(33)-search-in-rotated-sorted-array/)
* [75. Sort Colors](https://binlidaily.github.io/2019-11-18-(75)-sort-colors/)
* [15. 3Sum](https://binlidaily.github.io/2019-11-14-(15)-3sum/)
* [567. Permutation in String](https://binlidaily.github.io/2019-11-11-(567)-permutation-in-string/)
* [443. String Compression](https://binlidaily.github.io/2019-11-11-(443)-string-compression/)
* [706. Design HashMap](https://binlidaily.github.io/2019-11-11-(706)-design-hashmap/)
* [2. Add Two Numbers](https://binlidaily.github.io/2019-11-10-(2)-add-two-numbers/)
* [11. Container With Most Water](https://binlidaily.github.io/2019-11-10-(11)-container-with-most-water/)
* [473. Matchsticks to Square](https://binlidaily.github.io/2019-11-09-(473)-matchsticks-to-square/)
* [394. Decode String](https://binlidaily.github.io/2019-11-08-(394)-decode-string/)
* [337. House Robber III](https://binlidaily.github.io/2019-11-08-(337)-house-robber-iii/)
* [329. Longest Increasing Path in a Matrix](https://binlidaily.github.io/2019-11-08-(329)-longest-increasing-path-in-a-matrix/)
* [129. Sum Root to Leaf Numbers](https://binlidaily.github.io/2019-11-06-(129)-sum-root-to-leaf-numbers/)
* [124. Binary Tree Maximum Path Sum](https://binlidaily.github.io/2019-11-06-(124)-binary-tree-maximum-path-sum/)
* [117. Populating Next Right Pointers in Each Node II](https://binlidaily.github.io/2019-11-06-(117)-populating-next-right-pointers-in-each-node-ii/)
* [116. Populating Next Right Pointers in Each Node](https://binlidaily.github.io/2019-11-05-(116)-populating-next-right-pointers-in-each-node/)
* [114. Flatten Binary Tree to Linked List](https://binlidaily.github.io/2019-11-05-(114)-flatten-binary-tree-to-linked-list/)
* [106. Construct Binary Tree from Inorder and Postorder Traversal](https://binlidaily.github.io/2019-10-31-(106)-construct-binary-tree-from-inorder-and-postorder-traversal/)
* [105. Construct Binary Tree from Preorder and Inorder Traversal](https://binlidaily.github.io/2019-10-28-(105)-construct-binary-tree-from-preorder-and-inorder-traversal/)
* [刷题代码模板](https://binlidaily.github.io/2019-10-26-coding-template/)
* [99. Recover Binary Search Tree](https://binlidaily.github.io/2019-10-25-(99)-recover-binary-search-tree/)
* [897. Increasing Order Search Tree](https://binlidaily.github.io/2019-10-25-(897)-increasing-order-search-tree/)
* [872. Leaf-Similar Trees](https://binlidaily.github.io/2019-10-25-(872)-leaf-similar-trees/)
* [733. Flood Fill](https://binlidaily.github.io/2019-10-25-(733)-flood-fill/)
* [110. Balanced Binary Tree](https://binlidaily.github.io/2019-10-24-(110)-balanced-binary-tree/)
* [437. Path Sum III](https://binlidaily.github.io/2019-10-23-(437)-path-sum-iii/)
* [257. Binary Tree Paths](https://binlidaily.github.io/2019-10-23-(257)-binary-tree-paths/)
* [113. Path Sum II](https://binlidaily.github.io/2019-10-22-(113)-path-sum-ii/)
* [112. Path Sum](https://binlidaily.github.io/2019-10-22-(112)-path-sum/)
* [863. All Nodes Distance K in Binary Tree](https://binlidaily.github.io/2019-10-21-(863)-all-nodes-distance-k-in-binary-tree/)
* [109. Convert Sorted List to Binary Search Tree](https://binlidaily.github.io/2019-10-16-(109)-convert-sorted-list-to-binary-search-tree/)
* [108. Convert Sorted Array to Binary Search Tree](https://binlidaily.github.io/2019-10-14-(108)-convert-sorted-array-to-binary-search-tree/)
* [100. Same Tree](https://binlidaily.github.io/2019-10-14-(100)-same-tree/)
* [787. Cheapest Flights Within K Stops](https://binlidaily.github.io/2019-10-13-(787)-cheapest-flights-within-k-stops/)
* [73. Set Matrix Zeroes](https://binlidaily.github.io/2019-10-12-(73)-set-matrix-zeroes/)
* [72. Edit Distance](https://binlidaily.github.io/2019-10-11-(72)-edit-distance/)
* [70. Climbing Stairs](https://binlidaily.github.io/2019-10-11-(70)-climbing-stairs/)
* [704. Binary Search](https://binlidaily.github.io/2019-10-11-(704)-binary-search/)
* [700. Search in a Binary Search Tree](https://binlidaily.github.io/2019-10-05-(700)-search-in-a-binary-search-tree/)
* [994. Rotting Oranges](https://binlidaily.github.io/2019-10-02-(994)-rotting-oranges/)
* [993. Cousins in Binary Tree](https://binlidaily.github.io/2019-09-24-(993)-cousins-in-binary-tree/)
* [785. Is Graph Bipartite?](https://binlidaily.github.io/2019-09-23-(785)-is-graph-bipartite/)
* [559. Maximum Depth of N-ary Tree](https://binlidaily.github.io/2019-09-23-(559)-maximum-depth-of-n-ary-tree/)
* [429. N-ary Tree Level Order Traversal](https://binlidaily.github.io/2019-09-23-(429)-n-ary-tree-level-order-traversal/)
* [155. Min Stack](https://binlidaily.github.io/2019-09-22-(155)-min-stack/)
* [752. Open the Lock](https://binlidaily.github.io/2019-09-19-(752)-open-the-lock/)
* [743. Network Delay Time](https://binlidaily.github.io/2019-09-17-(743)-network-delay-time/)
* [690. Employee Importance](https://binlidaily.github.io/2019-09-17-(690)-employee-importance/)
* [542. 01 Matrix](https://binlidaily.github.io/2019-09-15-(542)-01-matrix/)
* [133. Clone Graph](https://binlidaily.github.io/2019-09-13-(133)-clone-graph/)
* [513. Find Bottom Left Tree Value](https://binlidaily.github.io/2019-09-12-(515)-find-largest-value-in-each-tree-row/)
* [513. Find Bottom Left Tree Value](https://binlidaily.github.io/2019-09-12-(513)-find-bottom-left-tree-value/)
* [301. Remove Invalid Parentheses](https://binlidaily.github.io/2019-09-10-(301)-remove-invalid-parentheses/)
* [310. Minimum Height Trees](https://binlidaily.github.io/2019-09-10-(310)-minimum-height-trees/)
* [210. Course Schedule II](https://binlidaily.github.io/2019-09-05-(210)-course-schedule-ii/)
* [207. Course Schedule](https://binlidaily.github.io/2019-09-04-(207)-course-schedule/)
* [200. Number of Islands](https://binlidaily.github.io/2019-09-02-(200)-number-of-islands/)
* [199. Binary Tree Right Side View](https://binlidaily.github.io/2019-09-02-(199)-binary-tree-right-side-view/)
* [130. Surrounded Regions](https://binlidaily.github.io/2019-08-30-(130)-surrounded-regions/)
* [639. Decode Ways II](https://binlidaily.github.io/2019-08-30-(639)-decode-ways-ii/)
* [127. Word Ladder](https://binlidaily.github.io/2019-08-30-(127)-word-ladder/)
* [111. Minimum Depth of Binary Tree](https://binlidaily.github.io/2019-08-29-(111)-minimum-depth-of-binary-tree/)
* [91. Decode Ways](https://binlidaily.github.io/2019-08-28-(91)-decode-ways/)
* [980. Unique Paths III](https://binlidaily.github.io/2019-08-27-(980)-unique-paths-iii/)
* [64. Minimum Path Sum](https://binlidaily.github.io/2019-08-27-(64)-minimum-path-sum/)
* [63. Unique Paths II](https://binlidaily.github.io/2019-08-27-(63)-unique-paths-ii/)
* [322. Coin Change](https://binlidaily.github.io/2019-08-27-(322)-coin-change/)
* [62. Unique Paths](https://binlidaily.github.io/2019-08-26-(62)-unique-paths/)
* [5. Longest Palindromic Substring](https://binlidaily.github.io/2019-08-26-(5)-longest-palindromic-substring/)
* [107. Binary Tree Level Order Traversal II](https://binlidaily.github.io/2019-08-23-(107)-binary-tree-level-order-traversal-ii/)
* [103. Binary Tree Zigzag Level Order Traversal](https://binlidaily.github.io/2019-08-23-(103)-binary-tree-zigzag-level-order-traversal/)
* [212. Word Search II](https://binlidaily.github.io/2019-08-21-(212)-word-search-ii/)
* [1155. Number of Dice Rolls With Target Sum](https://binlidaily.github.io/2019-08-15-(1155)-number-of-dice-rolls-with-target-sum/)
* [417. Pacific Atlantic Water Flow](https://binlidaily.github.io/2019-08-15-(417)-pacific-atlantic-water-flow/)
* [51. N-Queens](https://binlidaily.github.io/2019-07-18-(51)-n-queens/)
* [78. Subsets](https://binlidaily.github.io/2019-07-15-(78)-subsets/)
* [94. Binary Tree Inorder Traversal](https://binlidaily.github.io/2019-07-13-(94)-binary-tree-inorder-traversal/)
* [145. Binary Tree Postorder Traversal](https://binlidaily.github.io/2019-07-13-(145)-binary-tree-postorder-traversal/)
* [144. Binary Tree Preorder Traversal](https://binlidaily.github.io/2019-07-13-(144)-binary-tree-preorder-traversal/)
* [98. Validate Binary Search Tree](https://binlidaily.github.io/2019-07-13-(98)-validate-binary-search-tree/)
* [69. Sqrt(x)](https://binlidaily.github.io/2019-07-13-(69)-sqrtx/)
* [633. Sum of Square Numbers](https://binlidaily.github.io/2019-07-10-(633)-sum-of-square-numbers/)
* [104. Maximum Depth of Binary Tree](https://binlidaily.github.io/2019-07-09-(104)-maximum-depth-of-binary-tree/)
* [890. Find and Replace Pattern](https://binlidaily.github.io/2019-06-29-(890)-find-and-replace-pattern/)
* [198. House Robber](https://binlidaily.github.io/2019-06-25-(198)-House-Robber/)
* [153. Find Minimum in Rotated Sorted Array](https://binlidaily.github.io/2019-06-23-(153)-find-minimum-in-rotated-sorted-array/)
* [10. Regular Expression Matching](https://binlidaily.github.io/2019-06-23-(10)-regular-expression-matching/)
* [204. Count Primes](https://binlidaily.github.io/2019-06-21-(204)-Count-Primes/)
* [563. Binary Tree Tilt](https://binlidaily.github.io/2019-06-20-(563)-Binary-Tree-Tilt/)
* [17. Letter Combinations of a Phone Number](https://binlidaily.github.io/2019-06-20-(17)-Letter-Combinations-of-a-Phone-Number/)








## References
1. [代码模板，刷题必会](https://blog.csdn.net/fuxuemingzhu/article/details/101900729)
2. [14 Patterns to Ace Any Coding Interview Question](https://medium.com/hackernoon/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed)
3. [花花酱 LeetCode DP Summary 动态规划总结](https://zxi.mytechroad.com/blog/dynamic-programming/leetcode-dp-summary/)
---
layout: post
title: Outline of Coding
subtitle:
author: Bin Li
tags: [Coding]
image: 
comments: true
published: false
---

注意两者的区别：
* Iterative
* Recursive

在 Programming 那个子菜单下也有一个整理 LeetCode 问题的地方，那里做有甄选的陈列吧。

找最优的一般用 DP，找所有可能的结果蛀牙欧勇 Backtracking。


## LeetCode
### 双指针问题
双指针简化问题，优化复杂度的题目还是挺多的，这类题目的关键点是想到使用双指针，
双指针有很多种，最常见的是头尾指针，当然还有别的。 比如如何最优地获取链表的倒数第三个节点？这个时候需要一个指针走三步，另外一个指针再走（有点龟兔赛跑的意思）

这里可以列一下博客中Two Pointers标签的连接，好找！

- 11. container-with-most-water 盛最多的水
- 26. remove-duplicates-from-sorted-array 删除有序数组中的重复元素
- 167. two-sum-ii-input-array-is-sorted  two-sum 进化版
- 19. removeNthNodeFromEndofList 删除链表中倒数第N个节点

### 栈
由于栈的特点是先进后出（FILO），我们可以用来解决一些直觉上需要递归的问题， 或者做一些”匹配“操作，比如括号匹配。

- 20. validParentheses
- DFS算法相关的题目
- 150.evaluate-reverse-polish-notation   逆波兰表达式
- 445.addTwoNumbers ii 

### 二分法

二分法解决问题的关键是是否可以将问题的规模缩小一半（如果缩小到三分之一就是三分法了），关键点并不是是否是有序数组，这个只是二分法解决问题的一个很小子集。

- 老鼠试毒
- 875.koko-eating-bananas


### 动态规划

### 滑动窗口
滑动窗口算法广泛应用于网络协议等，其实滑动窗口算法是一种思路，可以解决很多问题，比较适合滑动窗口解决的问题通常是题目要求连续的情况。

解题的套路通常是建立一个数组来表示滑动窗口，然后不断更新滑动窗口的范围（通常是往后移动），解题的不同点其实就在于如何更新滑动窗口的范围而已。

- 3.longestSubstringWithoutRepeatingCharacters
- 239.sliding-window-maximum

### 回溯法
回溯法（探索与回溯法）是一种选优搜索法，又称为试探法，按选优条件向前搜索，以达到目标。但当探索到某一步时，发现原先选择并不优或达不到目标，就退回一步重新选择，这种走不通就退回再走的技术为回溯法，而满足回溯条件的某个状态的点称为“回溯点”。

这个过程可以形象地比喻成我们打游戏，存档，打不过了或者达到了某个分支结局了，就回到存档点继续探索，知道完成所有的游戏结局。

- 39.combination-sum
- 40.combination-sum-ii
- 46.permutations
- 47.permutations-ii
- 78.subsets
- 90.subsets-ii


## Coding Templates



## References
1. [My Python Examples](https://github.com/geekcomputers/Python)
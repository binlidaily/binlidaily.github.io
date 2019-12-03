---
layout: post
title: Dynamic Programming
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---
　　在介绍动态规划之前，先了解一下分治策略：分治策略是将原问题分解为若干个规模较小但类似于原问题的子问题 (Divide)，“递归”的求解这些子问题 (Conquer)，然后再合并这些子问题的解来建立原问题的解。

　　动态规划 (Dynamic Programming，DP) 有点儿像分而治之 (divide and conquer) 算法那样，也是将一个原问题分解为若干个规模较小的子问题，递归的求解这些子问题，然后合并子问题的解得到原问题的解。

　　与分治法最大的差别是：适合于用动态规划法求解的问题，经分解后得到的子问题往往不是互相独立的（即下一个子阶段的求解是建立在上一个子阶段的解的基础上，进行进一步的求解）。


* 递归与循环
    * 从理论上说，所有的递归函数都可以转换为迭代函数，反之亦然，然而代价通常都是比较高的。当递归次数较多时，内存占用也会随之增加。
* 递推与递归
    1. 从程序上看，递归表现为自己调用自己，递推则没有这样的形式。
    2. 递归是从问题的最终目标出发，逐渐将复杂问题化为简单问题，最终求得问题。递推是从简单问题出发，一步步的向前发展，最终求得问题。是正向的。
    3. 递归中，问题的n要求是计算之前就知道的，而递推可以在计算中确定，不要求计算前就知道n。
    4. 一般来说，递推的效率高于递归（当然是递推可以计算的情况下）。

## 动态规划使用场景
　　区别在于这些子问题会有重叠，一个子问题在求解后，可能会再次求解，于是我们想到将这些子问题的解存储起来，当下次再次求解这个子问题时，直接拿过来用便是。也就是说，动态规划所解决的问题是分治策略所解决问题的一个子集，只是这个子集更适合用动态规划来解决从而得到更小的运行时间。

　　动规一般用在一些能够分解成子问题的问题上，目的是重用这些子问题的结果来达到优化的目的。所以可以总结出两点关键：
1. 动态规划试图只解决每个子问题一次，**不重复**
2. 一旦某个给定子问题已经算出结果，则将其存储**记忆化**

　　动态规划中包含三个重要的性质：
1. 最优化原理
    * 如果问题的最优解所包含的子问题的解也是最优的，就称该问题具有最优子结构，即满足最优化原理。
2. 无后效性
    * 即某阶段状态一旦确定，就不受这个状态以后决策的影响。也就是说，某状态以后的过程不会影响以前的状态，只与当前状态有关。
3. 有重叠子问题
    * 即子问题之间是不独立的，一个子问题在下一阶段决策中可能被多次使用到。(该性质并不是动态规划适用的必要条件，但是如果没有这条性质，动态规划算法同其他算法相比就不具备优势)

## 动态规划求解步骤
　　动态规划所处理的问题是一个多阶段决策问题，一般由初始状态开始，通过对中间阶段决策的选择，达到结束状态。这些决策形成了一个决策序列，同时确定了完成整个过程的一条活动路线(通常是求最优的活动路线)。如图所示。动态规划的设计都有着一定的模式，一般要经历以下几个步骤。

![-w448](/img/media/15606112924992.jpg)

1. 划分阶段：按照问题的时间或空间特征，把问题分为若干个阶段。在划分阶段时，注意划分后的阶段一定要是有序的或者是可排序的，否则问题就无法求解。

2. 确定状态和状态变量：将问题发展到各个阶段时所处于的各种客观情况用不同的状态表示出来。当然，状态的选择要满足无后效性。

3. 确定决策并写出**状态转移方程**：因为决策和状态转移有着天然的联系，状态转移就是根据上一阶段的状态和决策来导出本阶段的状态。所以如果确定了决策，状态转移方程也就可写出。但事实上常常是反过来做，根据相邻两个阶段的状态之间的关系来确定决策方法和状态转移方程。

4. 寻找边界条件：给出的状态转移方程是一个递推式，需要一个递推的终止条件或边界条件。

　　一般，只要解决问题的阶段、状态和状态转移决策确定了，就可以写出状态转移方程（包括边界条件）。

实际应用中可以按以下几个简化的步骤进行设计：

1. 分析最优解的性质，并刻画其结构特征。
2. 递归的定义最优解。
3. 以自底向上或自顶向下的记忆化方式（备忘录法）计算出最优值
4. 根据计算最优值时得到的信息，构造问题的最优解

　　使用动态规划求解问题，最重要的就是确定动态规划三要素：
1. 问题的阶段
2. 每个阶段的状态
3. 从前一个阶段转化到后一个阶段之间的递推关系。

　　一般来说分两种实现方法：
1. 自顶向下的备忘录方式，用递归实现
2. 自底向上的方式，用迭代实现

## 滚动数组
滚动数组的作用在于优化空间，主要应用在递推或动态规划中（如01背包问题）。

双序列中常用二维数组表示状态转移关系，但往往可以使用滚动数组的方式对空间复杂度进行优化。

小结一下，使用滚动数组的核心在于：

1. 状态转移矩阵中只能取 f[i+1][*] 和 f[i][*], 这是使用滚动数组的前提。
2. 外循环使用 i, 内循环使用 j 并同时使用逆推，这是滚动数组使用的具体实践。

## 经典问题
1. [Longest Common Subsequence](https://www.techiedelight.com/longest-common-subsequence/)
2. [Shortest Common Supersequence](https://www.techiedelight.com/shortest-common-supersequence-introduction-scs-length/)
3. [Longest Increasing Subsequence problem](https://www.techiedelight.com/longest-increasing-subsequence-using-dynamic-programming/) -  最长递增子序列
4. [The Levenshtein distance (Edit distance) problem](https://www.techiedelight.com/levenshtein-distance-edit-distance-problem/)
5. [Matrix Chain Multiplication](https://www.techiedelight.com/matrix-chain-multiplication/)
6. [0–1 Knapsack problem](https://www.techiedelight.com/0-1-knapsack-problem/)
7. [Partition problem](https://www.techiedelight.com/partition-problem/)
8. [Rod Cutting](https://www.techiedelight.com/rot-cutting/)
9. [Coin change problem](https://www.techiedelight.com/coin-change-making-problem-unlimited-supply-coins/)
10. [Word Break Problem](https://www.techiedelight.com/word-break-problem/)



1. [Longest Common Subsequence](https://www.geeksforgeeks.org/dynamic-programming-set-4-longest-common-subsequence/)
2. [Longest Increasing Subsequence](https://www.geeksforgeeks.org/dynamic-programming-set-3-longest-increasing-subsequence/)
3. [Edit Distance](https://www.geeksforgeeks.org/dynamic-programming-set-5-edit-distance/)
4. [Minimum Partition](https://www.geeksforgeeks.org/partition-a-set-into-two-subsets-such-that-the-difference-of-subset-sums-is-minimum/)
5. [Ways to Cover a Distance](https://www.geeksforgeeks.org/count-number-of-ways-to-cover-a-distance/)
6. [Longest Path In Matrix](https://www.geeksforgeeks.org/find-the-longest-path-in-a-matrix-with-given-constraints/)
7. [Subset Sum Problem](https://www.geeksforgeeks.org/dynamic-programming-subset-sum-problem/)
8. [Optimal Strategy for a Game](https://www.geeksforgeeks.org/dynamic-programming-set-31-optimal-strategy-for-a-game/)
9. [0-1 Knapsack Problem](https://www.geeksforgeeks.org/dynamic-programming-set-10-0-1-knapsack-problem/)
10. [Boolean Parenthesization Problem](https://www.geeksforgeeks.org/dynamic-programming-set-37-boolean-parenthesization-problem/)
11. [Shortest Common Supersequence](https://www.geeksforgeeks.org/shortest-common-supersequence/)
12. [Matrix Chain Multiplication](https://www.geeksforgeeks.org/dynamic-programming-set-8-matrix-chain-multiplication/)
13. [Partition problem](https://www.geeksforgeeks.org/dynamic-programming-set-18-partition-problem/)
14. [Rod Cutting](https://www.geeksforgeeks.org/dynamic-programming-set-13-cutting-a-rod/)
15. [Coin change problem](https://www.geeksforgeeks.org/dynamic-programming-set-7-coin-change/)
16. [Word Break Problem](https://www.geeksforgeeks.org/dynamic-programming-set-32-word-break-problem/)
17. [Maximal Product when Cutting Rope](https://www.geeksforgeeks.org/dynamic-programming-set-36-cut-a-rope-to-maximize-product/)
18. [Dice Throw Problem](https://www.geeksforgeeks.org/dice-throw-problem/)
19. [Box Stacking](https://www.geeksforgeeks.org/dynamic-programming-set-21-box-stacking-problem/)
20. [Egg Dropping Puzzle](https://www.geeksforgeeks.org/dynamic-programming-set-11-egg-dropping-puzzle/)

## References

1. [Data Structures - Dynamic Programming](https://www.tutorialspoint.com/data_structures_algorithms/dynamic_programming.htm)
2. [五大常用算法之二：动态规划算法](https://www.cnblogs.com/steven_oyj/archive/2010/05/22/1741374.html)
3. [算法-动态规划 Dynamic Programming](https://blog.csdn.net/u013309870/article/details/75193592)
4. [动态规划总结【模板】](https://blog.csdn.net/lianai911/article/details/45424703)
5. [动态规划问题总结](https://zhuanlan.zhihu.com/p/33574315)
---
layout: post
title: Backtracking
subtitle: 回溯法
author: Bin Li
tags: [Data Structures]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　回溯算法实际上是一个类似枚举的搜索尝试过程，主要在搜索尝试过程中寻找问题的解，当发现已经不满足求解条件时，就回溯返回，尝试别的路径。

![-w1159](/img/media/15610163679685.jpg)


　　回溯法是一种选优搜索法，按选优条件向前搜索，以达到目的。当搜索到某一步时，发现原先选择并不优或达不到目标，就退回一步重新选择。这种走不通就回退再重新走的机制叫做回溯法，满足回溯条件的某个状态被称为“回溯点”。

　　回溯本质上是一种穷举，是一种类型的递归。什么情况下用回溯法比较好？
* 判断回溯很简单，拿到一个问题，你感觉如果不穷举一下就没法知道答案，那就可以开始回溯了。

一般回溯的问题有三种：
* Find a path to success 有没有解
* Find all paths to success 求所有解
    * 求所有解的个数
    * 求所有解的具体信息
* Find the best path to success 求最优解

　　某种问题的解我们很难去找规律计算出来，没有公式可循，只能列出所有可能的解，然后一个个检查每个解是否符合我们要找的条件，也就是通常说的遍历。而解空间很多是树型的，就是树的遍历。

　　其次，树的先序遍历，也就是根是先被检查的，二叉树的先序遍历是根，左子树，右子树的顺序被输出。如果把树看做一种特殊的图的话，DFS就是先序遍历。所以，回溯和DFS是联系非常紧密的，可以认为回溯是DFS的一种应用场景。另外，DFS有个好处，它只存储深度，不存储广度。所以空间复杂度较小，而时间复杂度较大。

　　最后，某些解空间是非常大的，可以认为是一个非常庞大的树，此时完全遍历的时间复杂度是难以忍受的。此时可以在遍历的同时检查一些条件，当遍历某分支的时候，若发现条件不满足，则退回到根节点进入下一个分支的遍历。这就是“回溯”这个词的来源。而根据条件有选择的遍历，叫做剪枝或分枝定界。


## 基本思想
　　在包含问题的所有解的解空间树中，按照深度优先搜索的策略，从根结点出发深度探索解空间树。当探索到某一结点时，要先判断该结点是否包含问题的解，如果包含，就从该结点出发继续探索下去，如果该结点不包含问题的解，则逐层向其祖先结点回溯。（其实回溯法就是对隐式图的深度优先搜索算法）。

　　若用回溯法求问题的所有解时，要回溯到根，且根结点的所有可行的子树都要已被搜索遍才结束。

　　而若使用回溯法求任一个解时，只要搜索到问题的一个解就可以结束。

## 回溯法解决问题的步骤
1. 针对所给问题，确定问题的解空间：
    * 首先应明确定义问题的解空间，问题的解空间应至少包含问题的一个 (最优) 解。

2. 确定结点的扩展搜索规则

3. 以深度优先方式搜索解空间，并在搜索过程中用剪枝函数避免无效搜索。

## 算法框架
（1）问题框架

　　设问题的解是一个 $n$ 维向量 $(a_1,a_2,\dots,a_n)$，约束条件是 $a_i(i=1,2,3,\dots,n)$ 之间满足某种条件，记为 $f(a_i)$。

（2）非递归回溯框架
```python
int a[n],i;
初始化数组a[];
i = 1;
while (i>0(有路可走)   and  (未达到目标))  // 还未回溯到头
{
    if(i > n)                                              // 搜索到叶结点
    {   
          搜索到一个解，输出；
    }
    else                                                   // 处理第i个元素
    { 
          a[i]第一个可能的值；
          while(a[i]在不满足约束条件且在搜索空间内)
          {
              a[i]下一个可能的值；
          }
          if(a[i]在搜索空间内)
         {
              标识占用的资源；
              i = i+1;                              // 扩展下一个结点
         }
         else 
        {
              清理所占的状态空间；            // 回溯
              i = i –1; 
         }
}
```

（3）递归的算法框架

　　回溯法是对解空间的深度优先搜索，在一般情况下使用递归函数来实现回溯法比较简单，其中 $i$ 为搜索的深度，框架如下：

```python
int a[n];
try(int i)
{
    if(i>n)
       输出结果;
     else
    {
       for(j = 下界; j <= 上界; j=j+1)  // 枚举i所有可能的路径
       {
           if(fun(j))                 // 满足限界函数和约束条件
             {
                a[i] = j;
              ...                         // 其他操作
                try(i+1);
              回溯前的清理工作（如a[i]置空值等）;
              }
         }
     }
}
```

模板：

```python
void dfs(int 当前状态)
{
  if(当前状态为边界状态)
  {
    # 记录或输出
    return;
  }
  for(i=0;i<n;i++)		# 横向遍历解答树所有子节点
 {
       # 扩展出一个子状态。
       # 修改了全局变量
       if(子状态满足约束条件)
        {
          dfs(子状态)
       }
        # 恢复全局变量//回溯部分
    }
}
```

应用回溯法有：
1. 装载问题
2. 批处理作业调度
3. 符号三角形问题
4. n后问题
5. 0-1背包问题
6. 最大团问题
7. 图的m着色问题
8. 旅行售货员问题
9. 圆排列问题
10. 电路板排列问题
11. 连续邮资问题

LeetCode 题目：
1. [17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

## References
1. [Backtracking](https://www.1point3acres.com/bbs/thread-172641-1-1.html)
2. [五大常用算法之四：回溯法](https://www.cnblogs.com/steven_oyj/archive/2010/05/22/1741376.html)
3. [leetcode题解(递归和回溯法)](https://juejin.im/post/5b3b56045188251abe49f738)
4. [Leetcode - Backtracking回溯法(又称DFS,递归)全解](https://segmentfault.com/a/1190000006121957)
5. [彻头彻尾的理解回溯算法](https://blog.csdn.net/ffmpeg4976/article/details/45007439)
6. [数据结构与算法-回溯法-4](https://xiaozhuanlan.com/topic/0289571364)
7. [A general approach to backtracking questions in Java (Subsets, Permutations, Combination Sum, Palindrome Partitioning)](https://leetcode.com/problems/combination-sum/discuss/16502/A-general-approach-to-backtracking-questions-in-Java-(Subsets-Permutations-Combination-Sum-Palindrome-Partitioning))
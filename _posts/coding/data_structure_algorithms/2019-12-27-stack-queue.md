---
layout: post
title: Stack and Queue
subtitle: 栈和队列
author: Bin Li
tags: [Data Structures]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　这里重新学习一下栈和队列，栈是先进后出的，有点儿像弹夹中先压入的子弹后打出；队列是先进先出的，就像人排队一样。

　　在实现角度上看，栈和队列都可以有数组和链表两种形式：
1. 数组结构实现较容易
2. 用链表结构较复杂，牵扯到很多指针操作

## 1. 栈
　　栈的一些操作（$O(1)$）：
1. pop 操作：从栈顶弹出元素
2. top 或 peek 操作：获取最顶上元素
3. push 操作：向栈顶压入元素
4. size 操作：返回栈中元素个数

　　平时使用的递归函数实际上用到了提供的函数系统栈，递归的过程可以看做是递归函数一次进入函数栈的处理过程。

##  2. 队列
　　队列的一些操作（$O(1)$）：
1. pop 操作：从队列头部弹出元素
2. top 或 peek 操作：获取最头部元素
3. push 操作：在队尾压入元素
4. size 操作：返回队列中元素个数
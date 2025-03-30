---
layout: post
title: Branch And Bound
subtitle: 分支界限法
author: Bin Li
tags: [Data Structures]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　解会以空间状态树的形式展示出来。

首先用 Queue 的方式实现（FIFO）：
![-w1396](/img/media/15610207548665.jpg)

然后用 Stack 的方式实现（LIFO）：

![-w1235](/img/media/15610210074200.jpg)


还有一种叫做 Least-Cost BB，最快的实现：
![-w1162](/img/media/15610212014138.jpg)

---
layout: post
title: 1.1 二叉树打印
subtitle: 
author: Bin Li
tags: [Coding, Nowcoder]
image: 
comments: true
published: true
---

　　二叉树打印可以有几种方式，有比较简单的从上往下按层打印，也有比较难一点的分层打印。

## 简单地自上而下打印
　　直接广度优先遍历，用 queue 实现既可：

```python
# -*- coding:utf-8 -*-
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
class Solution:
    # 返回从上到下每个节点值列表，例：[1,2,3]
    def PrintFromTopToBottom(self, root):
        # write code here
        if root is None:
            return []
        res = []
        queue = [root]
        while queue:
            node = queue.pop()
            res.append(node.val)
            if node.left:
                queue.insert(0, node.left)
            if node.right:
                queue.insert(0, node.right)
        return res
# 运行时间：34ms
# 占用内存：5856k
```

## 分层打印
　　但如果是要按照每层存为一个数组的方式打印（分层打印），上述的方式就没有办法实现了。难点在于**如何知道换行**，可以采用两个指针的方式来实现：
* last：表示正在打印的当前行的最右节点
    * 当遍历到 last 结点说明要换行了
    * 换行时需要将 last = next_last
* next_last：表示下一行的最右节点
    * 一直跟踪 queue 新加入的结点即可，因为 queue 最新加入的结点一定是目前发现的下一层最右的节点

<p align="center">
  <img width="400" height="" src="/img/media/15625490852974.jpg">
</p>

```python
# -*- coding:utf-8 -*-

# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
class TreePrinter:
    def printTree(self, root):
        # write code here
        if root is None:
            return []
        res = []
        queue = [root]
        level = []
        last = next_last = root
        while queue:
            node = queue.pop()
            level.append(node.val)
            if node.left:
                queue.insert(0, node.left)
                next_last = node.left
            if node.right:
                queue.insert(0, node.right)
                next_last = node.right
            if node == last:
                last = next_last
                res.append(level)
                level = []
        return res
```

## References
1. [第1节 二叉树打印](https://www.nowcoder.com/study/vod/1/1/1)
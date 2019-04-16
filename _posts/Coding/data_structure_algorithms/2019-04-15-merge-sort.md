---
layout: post
title: Merge Sort
subtitle: 归并排序
author: Bin Li
tags: [Coding, Sorting]
image: 
comments: true
published: true
---

<p align=center>
<img src="https://en.wikipedia.org/wiki/File:Merge-sort-example-300px.gif">
</p>

<p align=center>
<img src="/img/media/15553176949661.jpg">
</p>


采用分治法：
1. 分解：找到中间位置，将数据一分为二，然后迭代的分解，一直到划分开的左右部分只有一个数。
2. 合并：比较大小，合并划分的结果。

```python
#coding:utf-8
def merge_sort(seq):
    """归并排序"""
    if len(seq) <= 1:
        return seq
    mid = len(seq) / 2  # 将列表分成更小的两个列表
    # 分别对左右两个列表进行处理，分别返回两个排序好的列表
    left = merge_sort(seq[:mid])
    right = merge_sort(seq[mid:])
    # 对排序好的两个列表合并，产生一个新的排序好的列表
    return merge(left, right)

def merge(left, right):
    """合并两个已排序好的列表，产生一个新的已排序好的列表"""
    result = []  # 新的已排序好的列表
    i = 0  # 下标
    j = 0
    # 对两个列表中的元素 两两对比。
    # 将最小的元素，放到result中，并对当前列表下标加1
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result += left[i:]
    result += right[j:]
    return result

seq = [5,3,0,6,1,4]
print '排序前：',seq
result = merge_sort(seq)
print '排序后：',result
```

## References
1. [Know Thy Complexities](http://bigocheatsheet.com/)
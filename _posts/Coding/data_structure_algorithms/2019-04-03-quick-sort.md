---
layout: post
title: 快速排序
subtitle:
author: Bin Li
tags: [Coding]
image: 
comments: true
published: true
---

采用分治法：
1. 找到一个 pivot，设立两个指针，一个从前往后扫，一个从后往前扫。
    * pivot 可以直接选最后一个、第一个或者中间那个值
    * 也可以 random 选一个，为了方便要把选的值和数组最后一个数交换位置
2. 前指针从前往后扫，直到找到一个比 pivot 大的数，切换到后指针往前扫直到找到一个比 pivot 小的数，此时调换这两个数
    * 注意只有当前后指针都找到违反大小顺序的时候才执行
3. 重复第二步直到前后指针重合，最后要将 pivot 与汇合的位置点数互换。然后对由 pivot 分隔开的左右两个部分迭代进行排序。

那么这样就可以分成两个部分了，

写成两个函数的形式如下：
```python
def partition(arr, low, high):
	pivot = arr[high]
	i = low
	for j in xrange(low, high):
		if arr[j] <= pivot:
			arr[j], arr[i] = arr[i], arr[j]
			print '  --', arr
			i += 1
	arr[i], arr[high] = arr[high], arr[i]
	print 'loop', arr, low, high
	return i

def quick_sort(arr, low, high):
	if low < high:
		pivot = partition(arr, low, high)
		quick_sort(arr, low, pivot-1)
		quick_sort(arr, pivot+1, high)
```

为了封装成正常的形式，可以将入口函数改写成如下形式：
```python
def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    def _quicksort(arr, low, high):
        if low >= high:
            return
        pivot = partition(arr, low, high)
        _quicksort(arr, low, pivot-1)
        _quicksort(arr, pivot+1, high)
    return _quicksort(arr, low, high)
```
---
layout: post
title: Quick Sort
subtitle: 快速排序
author: Bin Li
tags: [Coding, Sorting]
image: 
comments: true
published: true
---

　　快速排序可以采用分治法：
1. 找到一个 pivot，设立两个指针，一个从前往后扫，一个从后往前扫。
    * pivot 可以直接选最后一个、第一个或者中间那个值
    * 也可以 random 选一个，为了方便要把选的值和数组最后一个数交换位置
2. 前指针从前往后扫，直到找到一个比 pivot 大的数，切换到后指针往前扫直到找到一个比 pivot 小的数，此时调换这两个数
    * 注意只有当前后指针都找到违反大小顺序的时候才执行
3. 重复第二步直到前后指针重合，最后要将 pivot 与汇合的位置点数互换。然后对由 pivot 分隔开的左右两个部分迭代进行排序。

　　那么这样就可以分成两个部分了，第一是从哪儿切数据，切完之后对两边的数据进行递归求解。
    
　　总是遗忘以下几个问题：
1. quick_sort 部分忘记 `if low < high`!
2. inplace 版本在中间交换时也要判断 `low < high`。
3. 最后忘记 pivot 和标记位置做替换。

　　写成两个函数的最初版本如下，这个也是 inplace 的版本：
```python
def partition(nums, low, high):
    pivot = nums[high]
    pos = high
    while low < high:
        # 这里要含等于 pivot 才能原地
        while low < high and nums[low] <= pivot:
            low += 1
        # 这里注意判断条件是要 low < high，不能是 high > 0，这样会串位置
        while low < high and nums[high] >= pivot:
            high -= 1
        if low < high:
            nums[high], nums[low] = nums[low], nums[high]
    # 最后这个交换也总忘记
    nums[high], nums[pos] = nums[pos], nums[high]
    return low

def quick_sort(nums, low, high):
    # 总是缺少这个判断条件
    if low < high:
        pivot = partition(nums, low, high)
        quick_sort(nums, low, pivot-1)
        quick_sort(nums, pivot+1, high)
```

　　上面这种办法在 partition 的时候很明显比较慢，嵌套了两层循环。可以进行优化，我们将两个指针（l 对应 low，h 对应 high）都从最左边开始向右遍历，如果 h 指针所指的数比 pivot 小那么就跟 l 所指的数进行交换，因为 h 遍历时会忽略比 pivot 大的数，l 只在交换后递增，也就是说 l 指向的数应该都是 pivot 大的，如此过程跟上面两重循环的效果一致，可以将 partition 写成下述形式：

```python
def partition(nums, low, high):
    i = low
    pi = nums[high]
    for j in range(low, high):
        if nums[j] <= pi:
            nums[i], nums[j] = nums[j], nums[i]
            i += 1
    nums[i], nums[high] = nums[high], nums[i]
    return i
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

## 复杂度
　　平均情况下快速排序的时间复杂度是 $O(n\log_2n)$，最坏情况是 $O(n^2)$。

## References
1. [Quicksort with Python](https://stackoverflow.com/questions/18262306/quicksort-with-python)
2. [Know Thy Complexities](http://bigocheatsheet.com/)
3. [快速排序法（Quick sort）in Python](http://jialin128.pixnet.net/blog/post/142927691-%5B-%E8%B3%87%E6%96%99%E7%B5%90%E6%A7%8B-%5D-%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F%E6%B3%95%EF%BC%88quick-sort%EF%BC%89in-python)
4. [快速排序的四种python实现](https://blog.csdn.net/razor87/article/details/71155518)
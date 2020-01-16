---
layout: post
title: "Python 基础教程"
author: "Bin Li"
tags: [Programming, Python]
comments: true
published: true
---

本文是阅读 Python 基础教程的一些笔记，方便复习掌握。

## 第一章 基础知识
### 模块
`from model import function`

#### `__future__`
通过这个可以导入那些在未来会成为标准 Python 组成部分的新特性。

#### 字符串表示，str 和 repr
repr 在输出时，会按照原先的结果保存下来。

```python
>>> print repr("Hello, world!") 'Hello, world!'

>>> print repr(10000L) 10000L

>>> print str("Hello, world!") Hello, world!

>>> print str(10000L) 10000
```

#### input 和 raw_input
raw_input 会将所有的输入当做原始数据，然后将其放入字符串中。

```python
>>> input("Enter a number: ") Enter a number: 3 3

>>> raw_input("Enter a number: ") Enter a number: 3 '3'
```

----

## 第二章 列表和元组
数据结构

序列（sequence）：列表，元组（，字符串，Unicode 字符串，buffer 对象和 xrange 对象）。

**元组不能修改。**

列表中的各个元素通过逗号分隔，写在方括号中，类型可以不一样，可同时有数据有字符串等

所有序列类型都有某些特定的操作，包括：索引（indexing）、分片（slicing）、加（adding）、乘（multiplying）。

### 通用序列操作
#### 索引
字符串就是一个由字符组成的序列，所以可以直接使用索引。

```python
>>> greeting = 'Hello'
>>> greeting[1] 
'e'

>>> 'Hello'[1] 
'e'
```

#### 分片

```python
>>> numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

>>> numbers[3:6] [4, 5, 6]
```

第一个索引指向的元素包含在内，第二个不包含在内。

```python
>>> numbers[7:10] 
[8, 9, 10]

>>> numbers[-3:-1] 
[8, 9]

>>> numbers[-3:0] 
[]

>>> numbers[-3:] 
[8, 9, 10]
```

##### 更大的步长
划分时，按照对应步长取对应的元素。第三个参数是步长。

```python
>>> numbers[0:10:2] 
[1, 3, 5, 7, 9]

>>> numbers[::-2] 
[10, 8, 6, 4, 2]
```

步长如果是负数就从右往左。

#### 序列相加
同一种类型的序列才能相加。

#### 乘法
用数字x乘以一个序列会生成一个重复了x次的序列。

```python
>>> 'python' * 5 
'pythonpythonpythonpythonpython'

>>> [42] * 10 
[42, 42, 42, 42, 42, 42, 42, 42, 42, 42]

>>> sequence = [None] * 10

>>> sequence 
[None, None, None, None, None, None, None, None, None, None]
```

表示空的时候可以用内建值 None。

#### 成员资格（membership）
检查一个值是否在序列中，可以用`in`运算符。

```python
>>> permissions = 'rw'

>>> 'w' in permissions 
True

>>> 'x' in permissions
False
```

#### 长度、最大和最小值

### 列表： Python的苦力
#### list 函数
可将所有类型的序列转换成列表，我们在声明一个空列表的时候，可以用list()，也可以直接用[].

#### 基本的列表操作
##### 改变列表：元素赋值

```python
>>> x = [1, 1, 1]

>>> x[1] = 2

>>> x 
[1, 2, 1]
```

##### 删除元素
用del来删除指定的元素。

```python
>>> names = ['Alice', 'Beth', 'Cecil', 'Dee-Dee', 'Earl']

>>> del names[2]

>>> names 
['Alice', 'Beth', 'Dee-Dee', 'Earl']
```

##### 分片赋值

```python
>>> name = list('Perl')

>>> name ['P', 'e', 'r', 'l']

>>> name[2:] = list('ar')

>>> name 
['P', 'e', 'a', 'r']
```

分片赋值时可以与原序列不等长的序列将分片替换：

```python 
>>> name = list('Perl')

>>> name[1:] = list('ython')

>>> name 
['P', 'y', 't', 'h', 'o', 'n']
```

分片赋值可以实现插入操作：

```python
>>> numbers = [1, 5]

>>> numbers[1:1] = [2, 3, 4]

>>> numbers 
[1, 2, 3, 4, 5]
```

分片赋值可以实现删除操作：

```python
>>> numbers [1, 2, 3, 4, 5]

>>> numbers[1:4] = []

>>> numbers 
[1, 5]
```

#### 列表方法
`列表对象.方法（参数）`

append, count, extend, index, ...

### 元组：不可变序列
创建元组很简单，用都好分隔了一些数就创建了一个元组，一般用圆括号括起来。

创建一个元素的元组，也需要加一个逗号。

```python
>>> 42 
42

>>> 42, 
(42,)

>>> (42,) 
(42,)
```

元组的意义何在：

1. 元组可以在映射（和集合的成员）中当做键使用
2. 元组作为很多内建函数和方法的返回值存在


----

### 下划线的作用

* 前面一个下划线表示私有
* 前面两个下划线表示不能被继承，最好不要用
* 前后各两个下划线表示这个不是用户来调用的，是python自己调用的

### 导入其他文件夹中的py文件

```python
import sys
sys.path.insert(0, '/Users/Bin/Dropbox/Codes/ml-algs/utils/')
from plot import plot_data
```




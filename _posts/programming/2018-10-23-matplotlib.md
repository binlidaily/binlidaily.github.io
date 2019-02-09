---
layout: post
title: Matplotlib
subtitle:
author: Bin Li
tags: [Python]
image: 
comments: true
published: true
---

### 一张大图中绘制很多小图
首先要声明一个大图，类似一个大花布，需要设置其大小：
```python
plt.figure(figsize=[16, 12])
```

然后就要加入各个子图：
```python
plt.subplot(231)
plt.boxplot(x=data1['Fare'], showmeans=True, meanline=True)
plt.title('Fare Boxplot')
plt.ylabel('Fare($)')
```
其中 `plt.subplot(231)` 中的前两个数字 23 就已经设定了这个大图下有 2 行 3 列 共 $2*3$ 格子，后面的 1 表示目前加进来的这个 `plt.boxplot` 是在第 1 个格子中。

![-w920](/img/media/15430539904194.jpg)


### 箱线图 - 看离散情况
采用上面的代码：
```python
plt.subplot(231)
plt.boxplot(x=data1['Fare'], showmeans=True, meanline=True)
plt.title('Fare Boxplot')
plt.ylabel('Fare($)')
```
这里的箱线图可以加上平均线，虚线部分是平均数。

![-w275](/img/media/15430538301056.jpg)

可以通过箱线图看出

### 柱状图 - 看占比
```python
plt.hist(x=[data1[data1['Survived']==1]['Fare'], data1[data1['Survived']==0]['Fare']], stacked=True, color=['g', 'r'], label=['Survived', 'Dead'])
plt.title('Fare Histogram by Survival')
plt.xlabel('Fare ($)')
plt.ylabel('# of Passengers')
plt.legend()
```
可以看到如果用了 stacked 之后能很明显的看到对比。

![-w260](/img/media/15430541096087.jpg)


### 调参看效果 - 保存多个绘制的图像
```python
def save_plot_2in1(x1, y1, x2, y2, title1='', title2='', xlabel1='', xlabel2='', ylabel1='', ylabel2='', save_name='save_name'):
	fig = plt.figure()
	plt.subplot(2, 1, 1)
	plt.plot(x1, y1)
	plt.title(title1)
	plt.xlabel(xlabel1)
	plt.ylabel(ylabel1)

	plt.subplot(2, 1, 2)
	plt.plot(x2, y2)
	plt.title(title2)
	plt.xlabel(xlabel2)
	plt.ylabel(ylabel2)
	plt.draw()

	fig.savefig(save_name + '.jpg')
```

### 编码问题
出现这样的问题：
```shell
matplotlib display text must have all code points < 128 or use Unicode strings
```

加入这些以显示中文：
```python
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from matplotlib import rc
rc('font',**{'family':'sans-serif','sans-serif':['AR PL KaitiM GB']})
```

### 查看和修改绘图的大小
```python
# check the size of figure
print(plt.rcParams.get('figure.figsize'))

# change the size of figure
# at the top of python script
plt.rcParams["figure.figsize"] = (10, 6)
```
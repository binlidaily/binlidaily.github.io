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

导入的方式：
```python
import matplotlib.pyplot as plt
%matplotlib inline 
```

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


![](/img/media/15502127515979.jpg)


可以通过箱线图看出画了两条线，红实线是中位数，绿虚线是平均数。超过上限的值是异常点。当然，这里故意把上下界画少了一些，超出的部分样本作为异常点标出。

**箱形图的价值**

1.直观明了地识别数据批中的异常值

箱线图判断异常值的标准以四分位数和四分位距为基础，四分位数具有一定的耐抗性，多达25%的数据可以变得任意远而不会很大地扰动四分位数，所以异常值不会影响箱形图的数据形状，箱线图识别异常值的结果比较客观。由此可见，箱线图在识别异常值方面有一定的优越性。

2.利用箱线图判断数据批的偏态和尾重

对于标准正态分布的样本，只有极少值为异常值。异常值越多说明尾部越重，自由度越小（即自由变动的量的个数）；

而偏态表示偏离程度，异常值集中在较小值一侧，则分布呈左偏态；异常值集中在较大值一侧，则分布呈右偏态。

3.利用箱线图比较几批数据的形状

同一数轴上，几批数据的箱线图并行排列，几批数据的中位数、尾长、异常值、分布区间等形状信息便昭然若揭。如上图，可直观得看出第三季度各分公司的销售额大体都在下降。

但箱形图也有他的局限性，比如：不能精确地衡量数据分布的偏态和尾重程度；对于批量比较大的数据，反映的信息更加模糊以及用中位数代表总体评价水平有一定的局限性。

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

在 Mac 系统中显示中文可以采用[这里的办法](https://blog.csdn.net/Fantasy_Muse/article/details/78585049)。

### 查看和修改绘图的大小
```python
# check the size of figure
print(plt.rcParams.get('figure.figsize'))

# change the size of figure
# at the top of python script
plt.rcParams["figure.figsize"] = (10, 6)
```

### 散点图——渐变
```python

plt.scatter(data_projected[:, 0], data_projected[:, 1], c=digits.target, s=20,
            edgecolor='none', alpha=0.5,
            cmap=plt.cm.get_cmap('Spectral', 10))
plt.colorbar(label='digit label', ticks=range(10))
plt.clim(-0.5, 9.5);
```
![](/img/media/15556738147636.jpg)


### 热力图
```python
from sklearn.metrics import confusion_matrix
mat = confusion_matrix(ytest, y_model)

sns.heatmap(mat, square=True, annot=True, cbar=False)
plt.xlabel('predicted value')
plt.ylabel('true value');
```

![](/img/media/15556739167767.jpg)


## 拟合曲线
![](/img/media/15557719511330.jpg)


## References
1. [拟合曲线图](https://mp.weixin.qq.com/s/r9DYiYvyx5QUqe40n6H2KA)
2. [数据分析最有用的Top 50 Matplotlib图（带有完整的Python代码）(上)](https://mp.weixin.qq.com/s/bs1YfbOOK3EvjyQbTI-FYg)
3. [数据分析最有用的Top 50 Matplotlib图（带有完整的Python代码）(下)](https://mp.weixin.qq.com/s/bs1YfbOOK3EvjyQbTI-FYg)
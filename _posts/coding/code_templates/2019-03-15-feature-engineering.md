---
layout: post
title: Feature Engineering Using Python
subtitle: For Machine Learning and Data Mining
author: Bin Li
tags: [Feature Engineering, Python]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　在整理特征工程的思路时，看到参考 1 中有些同行做了代码的整理，我觉得也挺不错的，以后方便很快上手，于是也开始整理了对于特征工程的代码模板整理操作，在整理时要有一个原则，要尽量将事情说清楚明白，不要嫌麻烦。

## 1. Import 即常见基本操作

```python
# 常用头文件
# -*- coding: utf-8 -*-
import numpy as np               # 数学
import pandas as pd              # 表格
import matplotlib.pyplot as plt  # 图形
%matplotlib inline

import warnings
warnings.filterwarnings("ignore") # 除去恼人的警告信息

import sys
stdout = sys.stdout
reload(sys)
sys.setdefaultencoding('utf-8')
sys.stdout = stdout
# 如果需要绘制图像，且要显示中文的话
plt.rcParams['font.sans-serif'] = ['SimHei'] # 用来正常显示中文标签
plt.rcParams['axes.unicode_minus'] = False # 用来正常显示负号
```

## 2. 文件格式数据读取

```python
# CSV 文件
train_df = pd.read_csv(data_dir + 'train_dataset.csv', sep=',', header=0)

#读取 json（理解为字典格式的封装）
import json
for line in sys.stdin:
  line = ln.decode('gbk').strip().strip('\n')
  #line = line.replace("\\","")
  json_data = json.loads(line)  #loads()json数据:->python数据
  
  #对于单值数据
  cat = json_data['animal']['cat']
  
  #对于多值数据（{"xx1":"1","xx2":"2"}）
  Husky = json_data['animal']['dog'].get('Husky', {})
  Husky = json.dumps(Husky, ensure_ascii=False, encoding="gbk")  #dumps():python数据->json数据
  Husky = json.loads(Husky)

#输出
for key in dict_:
  print("\t".join([str(key), str(dict_[key]), str(ctr)]))
  print("{}\t{}\t{:.8f}".format(key, dict_[key], ctr))
```

## 3. 特征工程

### 3.1 数据选择

```python
# 读取 CSV 文件
train_df = pd.read_csv(data_dir + 'train_dataset.csv', sep=',', header=0)
train_df.info() 	 # 查看总体的情况，找出一些数据猫腻，有无 null 值
train_df.describe()	 # 看总数及数值类型，以及是否有长尾分布(分位点)

train_df.columns					# 获取列名
train_df.isnull().sum()		# 获取空值

data_df['用户年龄', '用户话费敏感度']   						# 选择特定列特征
data_df.loc[data_df['用户年龄'] == 0, '用户年龄'] = data_df['用户年龄'].mode() # 按照条件选择特征

# 统计次数，默认降序，升序为 ascending=True
data_df['当月网购类应用使用次数'].value_counts()   
# 统计频率，默认降序
data_df['当月网购类应用使用次数'].value_counts(normalize=True) 

#分地区记录发生的事件数
df2 = df.groupby(by=['region'])['eventid'].count()
#第一列地区，第二列该地区发生的事件数    
count = pd.DataFrame({"region":df2.index,"counts":df2})  
#返回武器-该武器杀人总数
df2 = df.groupby(by=['weapontype'])['nkill'].sum() 

data = pd.concat([train,predict])  #上下拼接
data = pd.merge(data,ad_feature,on='aid',how='left') #键值左连接
```

### 3.2 缺失值处理

```python
#对于大量缺失数据的列可直接删除
df = df.drop(['PassengerId','Name','Ticket','Cabin'], axis=1) 
#删除含有NaN数据的行 
df = df.dropna()   
#全部直接人工赋值                                            
df = df.fillna('-1')                                           

df['nkill'].fillna(0, inplace = True)   #单列直接人工赋值
df['Embarked'] = df['Embarked'].fillna('S')  #离散值填充众数  
median_age = train['Age'].median()  #连续值填充中位数（或者平均值）
df['Age'] = df['Age'].fillna(median_age)
```

### 3.3 数据转换

```python
df.loc[ (df.Sex == 'male'), 'Sex' ] = 0    #令男为0
df.loc[ (df.Sex == 'female'), 'Sex' ] = 1  #令女为1

df['Sex'] = df['Sex'].map( {'male': 0, 'female': 1} ).astype(int) #这种写法更好
```

### 3.4 特征处理

```python
# 特征合并
#1、称谓
df['Title'] = df['Name'].str.extract('([A-Za-z]+)\.', expand=False)
df['Title'] = df['Title'].fillna('NoTitle')
df['Title'] = df['Title'].replace(['Lady', 'Countess','Capt', 'Col','Don', 'Dr', 'Major', 'Rev', 'Sir', 'Jonkheer', 'Dona'], 'Rare')
df['Title'] = df['Title'].replace(['Mlle','Ms'], 'Miss')
df['Title'] = df['Title'].replace('Mme', 'Mrs')

#2、亲戚数量与子女数量
df['Companions'] = df['Parch'] + df['SibSp']
to_be_dropped.extend(['Parch', 'SibSp'])
```






## References
1. [Python 特征工程篇](https://coladrill.github.io/2018/03/08/Python%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B%E7%AF%87/)
2. [Pandas 常用函数清单](https://www.jianshu.com/p/6eb5499cd07d)
3. [Pandas API](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html)
4. [Pyecharts 文档](http://pyecharts.org/#/zh-cn/)
5. [Python 数据处理，特征工程，比赛等一定会用到的方法](https://www.twblogs.net/a/5b8364342b71776c51e2d0b2/zh-cn)
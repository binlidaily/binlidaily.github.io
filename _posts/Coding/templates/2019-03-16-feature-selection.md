---
layout: post
title: Feature Selection Using Python
subtitle:
author: Bin Li
tags: [Python]
image: 
comments: true
published: true
---

　　特征选择是特征工程里的一个重要问题，其目标是寻找最优特征子集。

　　多维特征一方面可能会导致维数灾难，另一方面很容易导致过拟合，因此需要做降维处理，常见的降维方法有 PCA，t-SNE（计算复杂度很高）。 比赛中使用PCA效果通常并不好，因为大多数特征含有缺失值且缺失值个数太多，而 PCA 前提假设数据呈高斯分布，赛题数据很可能不满足。

　　常见思路：[link_1](https://zhuanlan.zhihu.com/p/32749489) [link_2](http://www.flickering.cn/ads/2014/08/%E8%BD%AC%E5%8C%96%E7%8E%87%E9%A2%84%E4%BC%B0-4%E7%89%B9%E5%BE%81%E9%80%89%E6%8B%A9%EF%BC%8D%E7%AE%80%E4%BB%8B/)

- Filter：过滤法，按照发散性或者相关性对各个特征进行评分，设定阈值或者待选择阈值的个数，选择特征。
- Wrapper：包装法，根据目标函数（通常是预测效果评分），每次选择若干特征，或者排除若干特征。
- Embedded：嵌入法，先使用某些机器学习的算法和模型进行训练，得到各个特征的权值系数，根据系数从大到小排序选择特征。类似于Filter方法，但是是通过训练来确定特征的优劣。

　　常见方法：

- 最大信息系数（MIC）：画热力图，取相关性小的用于模型融合
- 皮尔森相关系数（衡量变量间的线性相关性）
- 正则化方法（L1，L2）
- 基于模型的特征排序方法（这种比较高效：模型学习的过程和特征选择的过程是同时进行的）

## 1. Filter (过滤法)

### 1.1 热力图

```python
def corr_heatmap(v):
    correlations = train[v].corr()

    # Create color map ranging between two colors
    cmap = sns.diverging_palette(220, 10, as_cmap=True)

    fig, ax = plt.subplots(figsize=(10,10))
    sns.heatmap(correlations, cmap=cmap, vmax=1.0, center=0, fmt='.2f',
                square=True, linewidths=.5, annot=True, cbar_kws={"shrink": .75})
    plt.show();
    
v = meta[(meta.level == 'interval') & (meta.keep)].index
corr_heatmap(v)
```

![img](https://coladrill.github.io/img/post/20180318/1.png)

　　以下变量之间存在很强的相关性：

- ps_reg_02 and ps_reg_03 (0.7)
- ps_car_12 and ps_car13 (0.67)
- ps_car_12 and ps_car14 (0.58)
- ps_car_13 and ps_car15 (0.67)

　　Seaborn 有一些方便的图表可视化变量之间的（线性）关系。我们可以使用配对图来可视化变量之间的关系。但由于热图已显示有限数量的相关变量，我们将分别查看每个高度相关的变量。注意：我采用训练数据的采样来加快过程。

　　**比赛通常基于 XGBoost 来做，训练 XGBoost 的过程就是对特征重要性进行排序的过程。**

### 1.2 模型得到特征权重

　　利用 model.get_fscore() 来获得特征得分，然后排序成表:

```python
import xgboost as xgb
import os
os.mkdir('model')
os.mkdir('featurescore')

y = train.label
X = train.drop(['uid','label'],axis=1)
dtrain = xgb.DMatrix(X, label=label)

params={
    	'booster':'gbtree',
    	'objective': 'rank:pairwise',
    	'scale_pos_weight': float(len(y)-sum(y))/float(sum(y)),
        'eval_metric': 'auc',
    	'gamma':gamma,
    	'max_depth':max_depth,
    	'lambda':lambd,
        'subsample':subsample,
        'colsample_bytree':colsample_bytree,
        'min_child_weight':min_child_weight, 
        'eta': 0.04,
    	'seed':random_seed
        }
    
watchlist  = [(dtrain,'train')]
model = xgb.train(params,dtrain,num_boost_round=num_boost_round,evals=watchlist)
model.save_model('./model/xgb{0}.model'.format(iteration))
      
#get feature score
feature_score = model.get_fscore()
feature_score = sorted(feature_score.items(), key=lambda x:x[1],reverse=True)
fs = []
for (key,value) in feature_score:
    fs.append("{0},{1}\n".format(key,value))
    
with open('./featurescore/feature_score_{0}.csv'.format(iteration),'w') as f:
    f.writelines("feature,score\n")
    f.writelines(fs)
```

### 1.2.1 设置不同参数

　　实际需要随机设置不同参数，跑若干次 XGBoost 模型：

```python
import pandas as pd
import xgboost as xgb
import sys,random
import cPickle
import os

os.mkdir('featurescore')
os.mkdir('model')
os.mkdir('preds')

#load data
train_x = pd.read_csv("../../data/train_x_rank.csv")
train_y = pd.read_csv("../../data/train_y.csv")
train_xy = pd.merge(train_x,train_y,on='uid')
y = train_xy.y
train_x= train_xy.drop(["uid",'y'],axis=1)
X = train_x/15000.0
dtrain = xgb.DMatrix(X, label=y)
    
test = pd.read_csv("../../data/test_x_rank.csv")
test_uid = test.uid
test = test.drop("uid",axis=1)
test_x = test/5000.0
dtest = xgb.DMatrix(test_x)

def pipeline(iteration,random_seed,gamma,max_depth,lambd,subsample,colsample_bytree,min_child_weight):
    params={
    	'booster':'gbtree',
    	'objective': 'binary:logistic',
    	'scale_pos_weight': float(len(y)-sum(y))/float(sum(y)),
        'eval_metric': 'auc',
    	'gamma':gamma,
    	'max_depth':max_depth,
    	'lambda':lambd,
        'subsample':subsample,
        'colsample_bytree':colsample_bytree,
        'min_child_weight':min_child_weight, 
        'eta': 0.04,
    	'seed':random_seed,
    	'nthread':8
        }
    
    watchlist  = [(dtrain,'train')]
    model = xgb.train(params,dtrain,num_boost_round=1350,evals=watchlist)
    model.save_model('./model/xgb{0}.model'.format(iteration))
    
    #predict test set
    test_y = model.predict(dtest)
    test_result = pd.DataFrame(columns=["uid","score"])
    test_result.uid = test_uid
    test_result.score = test_y
    test_result.to_csv("./preds/xgb{0}.csv".format(iteration),index=None,encoding='utf-8')
    
    #save feature score
    feature_score = model.get_fscore()
    feature_score = sorted(feature_score.items(), key=lambda x:x[1],reverse=True)
    fs = []
    for (key,value) in feature_score:
        fs.append("{0},{1}\n".format(key,value))
    
    with open('./featurescore/feature_score_{0}.csv'.format(iteration),'w') as f:
        f.writelines("feature,score\n")
        f.writelines(fs)

if __name__ == "__main__":
    random_seed = range(1000,2000,10)
    gamma = [i/1000.0 for i in range(100,200,1)]
    max_depth = [6,7,8]
    lambd = range(100,200,1)
    subsample = [i/1000.0 for i in range(500,700,2)]
    colsample_bytree = [i/1000.0 for i in range(250,350,1)]
    min_child_weight = [i/1000.0 for i in range(200,300,1)]
    random.shuffle(random_seed)
    random.shuffle(gamma)
    random.shuffle(max_depth)
    random.shuffle(lambd)
    random.shuffle(subsample)
    random.shuffle(colsample_bytree)
    random.shuffle(min_child_weight)
    
    #save params for reproducing
    with open('params.pkl','w') as f:
        cPickle.dump((random_seed,gamma,max_depth,lambd,subsample,colsample_bytree,min_child_weight),f)
    
    #to reproduce my result, uncomment following lines
    """ with open('params_for_reproducing.pkl','r') as f: random_seed,gamma,max_depth,lambd,subsample,colsample_bytree,min_child_weight = cPickle.load(f) """

    #train 100 xgb
    for i in range(100):
        pipeline(i,random_seed[i],gamma[i],max_depth[i%3],lambd[i],subsample[i],colsample_bytree[i],min_child_weight[i])
```

### 1.3 卡方检验

```python
from sklearn.feature_extraction.text import CountVectorizer

train_new = pd.DataFrame()
test_new = pd.DataFrame()

cntv = CountVectorizer()
cntv.fit(data['user_tags'])
train_a = cntv.transform(train['user_tags'])
test_a = cntv.transform(test['user_tags'])

train_new = sparse.hstack((train_new, train_a), 'csr', 'bool')
test_new = sparse.hstack((test_new, test_a), 'csr', 'bool')

# 卡方检验
SKB = SelectPercentile(chi2, percentile=95).fit(train_new, train_y)
train_new = SKB.transform(train_new)
test_new = SKB.transform(test_new)
```

```python
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import chi2

#选择K个最好的特征，返回选择特征后的数据
SelectKBest(chi2, k=2).fit_transform(iris.data, iris.target)
```

### 1.4 方差选择法

　　使用方差选择法，先要计算各个特征的方差，然后根据阈值，选择方差大于阈值的特征。

```python
from sklearn.feature_selection import VarianceThreshold

#方差选择法，返回值为特征选择后的数据
#参数threshold为方差的阈值
VarianceThreshold(threshold=3).fit_transform(iris.data)
```

### 1.5 相关系数法

```python
import numpy as np
from sklearn.feature_selection import SelectKBest
from scipy.stats import pearsonr

#选择K个最好的特征，返回选择特征后的数据
#第一个参数为计算评估特征是否好的函数，该函数输入特征矩阵和目标向量，输出二元组（评分，P值）的数组，数组第i项为第i个特征的评分和P值。在此定义为计算相关系数
#参数k为选择的特征个数
#SelectKBest(lambda X, Y: array(map(lambda x:pearsonr(x, Y), X.T)).T, k=2).fit_transform(iris.data, iris.target)

SelectKBest(lambda X,Y:np.array(list(map(lambda x:pearsonr(x, Y), X.T))).T[0], k=2).fit_transform(iris.data, iris.target)
```

### 1.6 互信息法

```python
# pip install minepy

from sklearn.feature_selection import SelectKBest
from minepy import MINE

#由于MINE的设计不是函数式的，定义mic方法将其为函数式的，返回一个二元组，二元组的第2项设置成固定的P值0.5
def mic(x, y):
    m = MINE()
    m.compute_score(x, y)
    return (m.mic(), 0.5)

#选择K个最好的特征，返回特征选择后的数据
#SelectKBest(lambda X, Y: array(map(lambda x:mic(x, Y), X.T)).T, k=2).fit_transform(iris.data, iris.target)
SelectKBest(lambda X, Y: array(list(map(lambda x:mic(x, Y), X.T))).T[0], k=2).fit_transform(iris.data, iris.target)
```

## 2. Wrapper
### 2.1 递归特征消除法
　　递归消除特征法使用一个基模型来进行多轮训练，每轮训练后，消除若干权值系数的特征，再基于新的特征集进行下一轮训练。

```python
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression

#递归特征消除法，返回特征选择后的数据
#参数estimator为基模型
#参数n_features_to_select为选择的特征个数
RFE(estimator=LogisticRegression(), n_features_to_select=2).fit_transform(iris.data, iris.target)
```

## 3. Embedded
### 3.1 基于惩罚项的特征选择法
使用带惩罚项的基模型，除了筛选出特征外，同时也进行了降维。使用 feature_selection 库的 SelectFromModel 类结合带 L1 惩罚项的逻辑回归模型，来选择特征的代码如下：

```python
from sklearn.feature_selection import SelectFromModel
from sklearn.linear_model import LogisticRegression

#带L1惩罚项的逻辑回归作为基模型的特征选择
SelectFromModel(LogisticRegression(penalty="l1", C=0.1)).fit_transform(iris.data, iris.target)
```

L1 惩罚项降维的原理在于保留多个对目标值具有同等相关性的特征中的一个，所以没选到的特征不代表不重要。故，可结合 L2 惩罚项来优化。具体操作为：若一个特征在 L1 中的权值为 1，选择在 L2 中权值差别不大且在 L1 中权值为 0 的特征构成同类集合，将这一集合中的特征平分 L1 中的权值，故需要构建一个新的逻辑回归模型：

```python
from sklearn.linear_model import LogisticRegression

class LR(LogisticRegression):
    def __init__(self, threshold=0.01, dual=False, tol=1e-4, C=1.0,
                 fit_intercept=True, intercept_scaling=1, class_weight=None,
                 random_state=None, solver='liblinear', max_iter=100,
                 multi_class='ovr', verbose=0, warm_start=False, n_jobs=1):

        #权值相近的阈值
        self.threshold = threshold
        LogisticRegression.__init__(self, penalty='l1', dual=dual, tol=tol, C=C,
                 fit_intercept=fit_intercept, intercept_scaling=intercept_scaling, class_weight=class_weight,
                 random_state=random_state, solver=solver, max_iter=max_iter,
                 multi_class=multi_class, verbose=verbose, warm_start=warm_start, n_jobs=n_jobs)
        #使用同样的参数创建L2逻辑回归
        self.l2 = LogisticRegression(penalty='l2', dual=dual, tol=tol, C=C, fit_intercept=fit_intercept, intercept_scaling=intercept_scaling, class_weight = class_weight, random_state=random_state, solver=solver, max_iter=max_iter, multi_class=multi_class, verbose=verbose, warm_start=warm_start, n_jobs=n_jobs)

    def fit(self, X, y, sample_weight=None):
        #训练L1逻辑回归
        super(LR, self).fit(X, y, sample_weight=sample_weight)
        self.coef_old_ = self.coef_.copy()
        #训练L2逻辑回归
        self.l2.fit(X, y, sample_weight=sample_weight)

        cntOfRow, cntOfCol = self.coef_.shape
        #权值系数矩阵的行数对应目标值的种类数目
        for i in range(cntOfRow):
            for j in range(cntOfCol):
                coef = self.coef_[i][j]
                #L1逻辑回归的权值系数不为0
                if coef != 0:
                    idx = [j]
                    #对应在L2逻辑回归中的权值系数
                    coef1 = self.l2.coef_[i][j]
                    for k in range(cntOfCol):
                        coef2 = self.l2.coef_[i][k]
                        #在L2逻辑回归中，权值系数之差小于设定的阈值，且在L1中对应的权值为0
                        if abs(coef1-coef2) < self.threshold and j != k and self.coef_[i][k] == 0:
                            idx.append(k)
                    #计算这一类特征的权值系数均值
                    mean = coef / len(idx)
                    self.coef_[i][idx] = mean
        return self
```

使用 feature_selection 库的 SelectFromModel 类结合带 L1 以及 L2 惩罚项的逻辑回归模型，来选择特征的代码如下：

```python
from sklearn.feature_selection import SelectFromModel

#带L1和L2惩罚项的逻辑回归作为基模型的特征选择
#参数threshold为权值系数之差的阈值
SelectFromModel(LR(threshold=0.5, C=0.1)).fit_transform(iris.data, iris.target)
```

### 3.2 基于树模型的特征选择法
树模型中 GBDT 也可用来作为基模型进行特征选择，使用 feature_selection 库的 SelectFromModel 类结合 GBDT 模型，来选择特征的代码如下：

```python
from sklearn.feature_selection import SelectFromModel
from sklearn.ensemble import GradientBoostingClassifier

#GBDT作为基模型的特征选择
SelectFromModel(GradientBoostingClassifier()).fit_transform(iris.data, iris.target)
```

## References

1. [Python 特征选择篇](https://coladrill.github.io/2018/03/18/Python%E7%89%B9%E5%BE%81%E9%80%89%E6%8B%A9%E7%AF%87/)
2. [为何推荐sklearn做单机特征工程？【下】](https://mp.weixin.qq.com/s/1RHBQMlC8eyJcbNcArTtCQ)
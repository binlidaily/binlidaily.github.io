---
layout: post
title: Workflow Of Model Training
subtitle: For Machine Learning and Data Mining
author: Bin Li
tags: [Feature Engineering, Python]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

在整理特征工程的思路时，看到参考 1 中有些同行做了代码的整理，我觉得也挺不错的，以后方便很快上手，于是也开始整理了对于模型训练的代码模板整理操作，在整理时要有一个原则，要尽量将事情说清楚明白，不要嫌麻烦。

## 1. 模型调用

### 1.1 判别式模型

```python
#切分训练集数据
train = data[data.iyear <= 2017]
test  = data[data.iyear == 2018]

train_X = train.drop('label', axis=1)
train_y = train['label']

test_X = test.drop('label', axis=1)
test_y

#训练
from sklearn.svm import SVC, LinearSVC
svc = SVC()
svc.fit(train_X, train_y)
svc.score(train_X, train_y)

#预测
test_y = svc.predict(test_X)
```

### 1.1.1 判别式模型 (管道)

```python
df = pd.read_csv('data/train.csv')
y = df.author.values
X = df.text.values

df2 = pd.read_csv('data/test.csv')
X2 = df2.text.values
	
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn import svm
	
text_clf = Pipeline([('vect', CountVectorizer()),
					('tfidf', TfidfTransformer()),
					('clf', svm.LinearSVC())
					])
text_clf = text_clf.fit(X,y)
y2 = text_clf.predict(X2)
y2
```

### 1.2 生成式模型

```python
#训练集:eventid,nlp,gname
#测试集:eventid,nlp
data = pd.concat([train,test])

#文本数据词频向量化
from sklearn.feature_extraction.text import CountVectorizer,TfidfVectorizer
tfidf = TfidfVectorizer()
tfidf.fit(data['nlp'])
train_x = tfidf.transform(train['nlp'])
test_x = tfidf.transform(test['nlp'])
print('tfidf prepared !')

#choice 1: 对train_y进行编码映射
author_mapping_dict = {'Islamic State of Iraq and the Levant (ISIL)':0, 'Taliban':1, 'Al-Shabaab':2, 'Boko Haram':3, 'Houthi extremists (Ansar Allah)':4}
train_y = train['gname'].map(author_mapping_dict)

#choice 2:当train_y数据比较多的时候
from sklearn.preprocessing import LabelEncoder
enc = LabelEncoder()
train_y = enc.fit_transform(train.gname.values)

#多项式贝叶斯模型的调用
from sklearn import ensemble, metrics, model_selection, naive_bayes
from sklearn.naive_bayes import MultinomialNB

clf = MultinomialNB()
clf.fit(train_x, train_y)

cv_scores = []
cv_scores.append(metrics.log_loss(train_y, predictions))
print("Mean cv score : ", np.mean(cv_scores))

prediction = clf.predict_proba(test_x)

#对应choice 1的输出：
out_df = pd.DataFrame(prediction)
out_df.columns = ['Islamic State of Iraq and the Levant (ISIL)', 'Taliban', 'Al-Shabaab', 'Boko Haram', 'Houthi extremists (Ansar Allah)']
out_df.insert(0, 'eventid', test['eventid'])
out_df.to_csv("data/out_1.csv", index=False)

#对应choice 2的输出：
out_df = pd.DataFrame(prediction)
out_df.columns = list(enc.classes_)
out_df.insert(0, 'eventid', test['eventid'])
out_df.to_csv("data/out_2.csv", index=False)

#选取概率最大值所对应的列名输出
df = out_df.drop('eventid',axis=1)
pred = df.idxmax(axis=1)
submission = pd.DataFrame({"eventid": test['eventid'],"gname": pred})
submission.to_csv('data/out.csv', index=False)
```

### 1.3 自定义迭代

```python
def LGB_predict(train_x,train_y,test_x,res):
	print("LGB test")
	clf = lgb.LGBMClassifier(
		boosting_type='gbdt', num_leaves=31, reg_alpha=0.0, reg_lambda=1,zero_as_missing=True,
		max_depth=-1, n_estimators=500, objective='binary',
		subsample=0.9, colsample_bytree=0.8, subsample_freq=1,
		learning_rate=0.1, min_child_weight=50, random_state=2018, n_jobs=100
	)
	clf.fit(train_x, train_y, eval_set=[(train_x, train_y)], eval_metric='auc',early_stopping_rounds=100)
	res['score'] = clf.predict_proba(test_x)[:,1]
	res['score'] = res['score'].apply(lambda x: float('%.6f' % x))
	res.to_csv('../data/submission.csv', index=False)
	os.system('zip baseline.zip ../data/submission.csv')
return clf

model=LGB_predict(train_x,train_y,test_x,res)
```

## 2. 模型优化 (调参)

### 2.1 网格搜索 (Grid Search)

```python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

# 随机森林分类模型
RFC = RandomForestClassifier()

##设置备选属性用于grid search
rf_param_grid = {"max_depth": [None],
		"max_features": [1, 3, 10],
		"min_samples_split": [2, 3, 10],
		"min_samples_leaf": [1, 3, 10],
		"bootstrap": [False],
		"n_estimators" :[100,300],
		"criterion": ["gini"]}
#用于系统地遍历多种参数组合，通过交叉验证确定最佳效果参数
sRFC = GridSearchCV(RFC,param_grid = rf_param_grid, cv=kfold, scoring="accuracy", n_jobs= 4, verbose = 1)

gsRFC.fit(X_train,Y_train)
#得到最佳参数组合
RFC_best = gsRFC.best_estimator_
	
# Best score
gsRFC.best_score_
```

### 2.2 交叉验证 (Cross Validation)

```python
#按比例划分样本（随机抽样）
from sklearn.cross_validation import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)  #X为样本、y为类别、test_size为测试集比例

#通过cross_validation，设置cv=5，进行5折交叉验证，最后得到一个scores的预测准确率数组，表示每次交叉验证得到的准确率。
clf = svm.SVC(kernel='linear', C=1)
scores = cross_validation.cross_val_score(clf, X, y, cv=5)
>>>array([ 0.96...,  1.  ...,  0.96...,  0.96...,  1.        ])

print("Accuracy: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
>>>Accuracy: 0.98 (+/- 0.03)
```

[k折](https://ljalphabeta.gitbooks.io/python-/content/kfold.html)： 使用k折交叉验证来寻找最优参数要比holdout方法更稳定。一旦我们找到最优参数，要使用这组参数在原始数据集上训练模型作为最终的模型。

```python
from sklearn.cross_validation import cross_val_score # K折交叉验证模块
import matplotlib.pyplot as plt #可视化模块
from sklearn.neighbors import KNeighborsClassifier # K最近邻(kNN，k-NearestNeighbor)分类算法
	
#建立测试参数集
k_range = range(1, 31)
k_scores = []
	
#借由迭代的方式来计算不同参数对模型的影响，并返回交叉验证后的平均准确率
for k in k_range:
	knn = KNeighborsClassifier(n_neighbors=k)
	scores = cross_val_score(knn, X, y, cv=10, scoring='accuracy')
	k_scores.append(scores.mean())
	print('Fold %s, Acc: %.3f' %(k+1,scores))
	
#可视化数据
plt.plot(k_range, k_scores)
plt.xlabel('Value of K for KNN')
plt.ylabel('Cross-Validated Accuracy')
plt.show()
```

```python
# 5折LGB模型训练
lgb_clf = lgb.LGBMClassifier(boosting_type='gbdt', num_leaves=48, max_depth=-1, learning_rate=0.02, n_estimators=6000, max_bin=425, subsample_for_bin=50000, objective='binary', min_split_gain=0,min_child_weight=5, min_child_samples=10, subsample=0.8, subsample_freq=1,colsample_bytree=0.8, reg_alpha=3, reg_lambda=0.1, seed=1000, n_jobs=-1, silent=True)

skf = list(StratifiedKFold(y_loc_train, n_folds=5, shuffle=True, random_state=1024))
baseloss = []
loss = 0

for i, (train_index, test_index) in enumerate(skf):
    print("Fold", i)
    lgb_model = lgb_clf.fit(X_loc_train[train_index], y_loc_train[train_index],
                            eval_names=['train', 'valid'],
                            eval_metric='logloss',
                            eval_set=[(X_loc_train[train_index], y_loc_train[train_index]),
                                      (X_loc_train[test_index], y_loc_train[test_index])], early_stopping_rounds=100)
    baseloss.append(lgb_model.best_score_['valid']['binary_logloss'])
    loss += lgb_model.best_score_['valid']['binary_logloss']
    test_pred = lgb_model.predict_proba(X_loc_test, num_iteration=lgb_model.best_iteration_)[:, 1]
    print('test mean:', test_pred.mean())
    res['prob_%s' % str(i)] = test_pred
print('logloss:', baseloss, loss / 5)
```

## 3. 常规输出

### 3.1 表格输出

```python
submission = pd.DataFrame({
    "PassengerId": test_df["PassengerId"],
    "Survived": Y_pred
})
submission.to_csv('data/titanic.csv', index=False)
```

### 3.2 One-hot后表格输出

```python
from sklearn import preprocessing
encoder = preprocessing.LabelBinarizer()
encoder.fit(list(set(y2)))
one_hot_labels = encoder.transform(y2)                         
prediction = pd.DataFrame(one_hot_labels, columns=['EAP','HPL','MWS']).to_csv('data/author-pre.csv')
```

## 4. 模型融合

1.缘分加权融合

```python
import pandas as pd
result = pd.DataFrame()

result['nffm_75866_0'] = pd.read_csv('./nffm_final/submission_nffm_75866_0.csv')['score']
result['nffm_75866_1'] = pd.read_csv('./nffm_final/submission_nffm_75866_1.csv')['score']
result['nffm_75866_2'] = pd.read_csv('./nffm_final/submission_nffm_75866_2.csv')['score']
result['nffm_763'] = pd.read_csv('./nffm_final_preliminary/submission_nffm_763.csv')['score']
result['nffm_765'] = pd.read_csv('./nffm_final_preliminary/submission_nffm_765.csv')['score']
result['nffm_7688'] = pd.read_csv('./nffm_final_preliminary/submission_nffm_7688.csv')['score']
result['lgb'] = pd.read_csv('data_preprocessing/submission2_p.csv')['score']

a = 0.7
sub = pd.read_csv('./nffm_final/submission_nffm_75866_0.csv')
sub['score'] = round((((result['nffm_75866_1']*0.5+result['nffm_75866_2']*0.5)*0.5+result['nffm_75866_0']*0.5)*0.2+result['nffm_7688']*0.4+(result['nffm_763']*0.4+result['nffm_765']*0.6)*0.4)*a+result['lgb']*(1-a),6)

print(sub['score'].describe())
sub.to_csv('../submission.csv',index=False)
```

2.计算模型之间最大信息系数（MIC），画热力图，选择相关性小的模型进行多模型加权融合。

```python
import pandas as pd
import numpy as np
from minepy import MINE

fs = ['discret_5','R_7199','rank','discret_10','raw_rank','Py_717','Py_725','svm_6938']
out_nums = 8   #文件数

res = []
res.append(pd.read_csv('./avg_xgbs_discret_feature_5.csv').score.values)
res.append(pd.read_csv('./R_7199.csv').score.values)
res.append(pd.read_csv('./rank_feature_xgb_ensemble.csv').score.values)
res.append(pd.read_csv('./avg_xgbs_discret_feature_10.csv').score.values)
res.append(pd.read_csv('./based_on_select_rank_feature.csv').score.values)
res.append(pd.read_csv('./xgb717.csv').score.values)
res.append(pd.read_csv('./xgb725.csv').score.values)
res.append(pd.read_csv('./svm6938.csv').score.values)

cm = []

for i in range(out_nums): 
    tmp = []
    for j in range(out_nums):
        m = MINE()
        m.compute_score(res[i], res[j])
        tmp.append(m.mic())
    cm.append(tmp)

#画热力图
import numpy as np
import matplotlib.pyplot as plt

def plot_confusion_matrix(cm, title, cmap=plt.cm.Blues):
    plt.imshow(cm, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(out_nums)
    plt.xticks(tick_marks, fs, rotation=45)
    plt.yticks(tick_marks, fs)
    plt.tight_layout()

plot_confusion_matrix(cm, title='mic')
plt.show()
```

选择更能适应模型之间的差异性融合（热力图中颜色最浅的几个区域），利用排名来进行融合（一种rank_avg的融合方式）: sum(1/rank*score)

```python
import pandas as pd

xgb717 = pd.read_csv("xgb717.csv")
svm6938 = pd.read_csv('svm6938.csv')
xgb725 = pd.read_csv('xgb725.csv')

uid = xgb717.uid
score = 0.15*xgb717.score+0.25*svm6938.score+0.6*xgb725.score
pred = pd.DataFrame(uid,columns=['uid'])
pred['score'] = score

pred.to_csv('submission.csv',index=None,encoding='utf-8')
```

## References

1. [Python特征工程篇](https://coladrill.github.io/2018/03/08/Python%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B%E7%AF%87/)
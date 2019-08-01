---
layout: post
title: Training Models With Python
subtitle: For Machine Learning and Data Mining
author: Bin Li
tags: [Feature Engineering, Python]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

### LightGBM
```python
# lightgbm
params = {
    'learning_rate': 0.01,
    'boosting_type': 'gbdt',
    'objective': 'regression_l1',
    'metric': 'mae',
    'feature_fraction': 0.6,
    'bagging_fraction': 0.8,
    'bagging_freq': 2,
    'num_leaves': 31,
    'verbose': -1,
    'max_depth': 5,
    'lambda_l1': 0,
    'lambda_l2': 2.5,
    'nthread': 4
}

# k-cv
N_FOLDS = 5
y = train_df['信用分']
kfold = StratifiedKFold(n_splits=N_FOLDS, shuffle=True, random_state=2019)
kf = kfold.split(X, y)

# process the k-cv
cv_pred = np.zeros(test_df.shape[0])
valid_best_l2_all = 0

feature_importance_df = pd.DataFrame()
count = 0
for i, (train_idx, test_idx) in enumerate(kf):
    print('fold: ',i, ' training')
    X_train, X_test, y_train, y_test = X.iloc[train_idx, :], X.iloc[test_idx, :], y.iloc[train_idx], y.iloc[test_idx]
#     X_train, X_test, y_train, y_test = X[train_idx, :], X[test_idx, :], y[train_idx], y[test_idx]
    data_train = lgb.Dataset(X_train, y_train)
    data_test = lgb.Dataset(X_test, y_test)
    lgb_model = lgb.train(params, data_train, num_boost_round=10000, valid_sets=data_test, 
                          verbose_eval=-1, early_stopping_rounds=50)
    cv_pred += lgb_model.predict(X_submit, num_iteration=lgb_model.best_iteration)
    valid_best_l2_all += lgb_model.best_score['valid_0']['l1']
    
#     fold_importance_df = pd.DataFrame()
#     fold_importance_df["feature"] = list(unicode(X_train.columns))
#     fold_importance_df["importance"] = lgb_model.feature_importance(importance_type='gain', iteration=lgb_model.best_iteration)
#     fold_importance_df["fold"] = count + 1
#     feature_importance_df = pd.concat([feature_importance_df, fold_importance_df], axis=0)

    count += 1
    
cv_pred /= N_FOLDS
valid_best_l2_all /= N_FOLDS
print('cv score for valid is: ', 1 / (1 + valid_best_l2_all))

# show the importance of features
# display_importances(feature_importance_df)
```

## 保存训练好的机器学习模型
　　训练好一个模型后可以存下来，下次直接用，省得花很多时间继续跑了。

### 使用 Python 自带的 pickle

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn import datasets
import pickle

#方法一:python自带的pickle
(X,y) = datasets.load_iris(return_X_y=True)
rfc = RandomForestClassifier(n_estimators=100,max_depth=100)
rfc.fit(X,y)
print(rfc.predict(X[0:1,:]))
#save model
f = open('saved_model/rfc.pickle','wb')
pickle.dump(rfc,f)
f.close()
#load model
f = open('saved_model/rfc.pickle','rb')
rfc1 = pickle.load(f)
f.close()
print(rfc1.predict(X[0:1,:]))
```

### 使用 sklearn 中的模块 joblib
　　说是 joblib 会更快速一点。
```python
from sklearn.ensemble import RandomForestClassifier
from sklearn import datasets
from sklearn.externals import joblib
#方法二：使用sklearn中的模块joblib
(X,y) = datasets.load_iris(return_X_y=True)
rfc = RandomForestClassifier(n_estimators=100,max_depth=100)
rfc.fit(X,y)
print(rfc.predict(X[0:1,:]))
#save model
joblib.dump(rfc, 'saved_model/rfc.pkl')
#load model
rfc2 = joblib.load('saved_model/rfc.pkl')
print(rfc2.predict(X[0:1,:]))
```
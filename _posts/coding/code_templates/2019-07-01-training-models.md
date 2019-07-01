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
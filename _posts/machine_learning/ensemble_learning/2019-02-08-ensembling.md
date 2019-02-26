---
layout: post
title: Ensembling
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

在实践中有三种 Ensembling 的方式 Voting Classifier、Bagging 和 Boosting。

### Voting Classifier
投票方式看选择选用 soft 还是 hard 投票模式，可以用 SKlearn 中现成的工具：
```python
from sklearn.ensemble import VotingClassifier
ensemble_lin_rbf=VotingClassifier(estimators=[('KNN',KNeighborsClassifier(n_neighbors=10)),
                                              ('RBF',svm.SVC(probability=True,kernel='rbf',C=0.5,gamma=0.1)),
                                              ('RFor',RandomForestClassifier(n_estimators=500,random_state=0)),
                                              ('LR',LogisticRegression(C=0.05)),
                                              ('DT',DecisionTreeClassifier(random_state=0)),
                                              ('NB',GaussianNB()),
                                              ('svm',svm.SVC(kernel='linear',probability=True))
                                             ], 
                       voting='soft').fit(train_X,train_Y)
print('The accuracy for ensembled model is:',ensemble_lin_rbf.score(test_X,test_Y))
cross=cross_val_score(ensemble_lin_rbf,X,Y, cv = 10,scoring = "accuracy")
print('The cross validated score is',cross.mean())

# >>> The accuracy for ensembled model is: 0.824626865672
# >>> The cross validated score is 0.823766031097
```

值得注意的是，Voting Classifier 的集成方式用的都是不同类型的及分类器。


### Bagging
Bagging 是利用不同的数据子集对相似基模型进行集成，所以能够在一定程度上减少 Variance。
```python
model=BaggingClassifier(base_estimator=DecisionTreeClassifier(),random_state=0,n_estimators=100)
model.fit(train_X,train_Y)
prediction=model.predict(test_X)
print('The accuracy for bagged Decision Tree is:',metrics.accuracy_score(prediction,test_Y))
result=cross_val_score(model,X,Y,cv=10,scoring='accuracy')
print('The cross validated score for bagged Decision Tree is:',result.mean())

# The accuracy for bagged Decision Tree is: 0.824626865672
# The cross validated score for bagged Decision Tree is: 0.820482635342
```

### Boosting
可以用 Adaboost, XGBoost 尝试提高模型效果。

## References
1. [EDA To Prediction(DieTanic)](https://www.kaggle.com/ash316/eda-to-prediction-dietanic)
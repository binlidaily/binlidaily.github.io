---
layout: post
title: Explain the result of the model
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

## How well is the model
```python
from sklearn.metrics import classification_report, confusion_matrix
print (classification_report(test_y, y_pred, labels=logreg.classes_))
```

![-w582](/img/media/15498479724423.jpg)

```python
print (confusion_matrix(y_pred, test_y))
```
![-w140](/img/media/15498480028339.jpg)

```python
from sklearn.metrics import roc_curve, auc
#plt.style.use('seaborn-pastel')
y_score = logreg.decision_function(test_x)

FPR, TPR, _ = roc_curve(test_y, y_score)
ROC_AUC = auc(FPR, TPR)
print (ROC_AUC)

plt.figure(figsize =[11,9])
plt.plot(FPR, TPR, label= 'ROC curve(area = %0.2f)'%ROC_AUC, linewidth= 4)
plt.plot([0,1],[0,1], 'k--', linewidth = 4)
plt.xlim([0.0,1.0])
plt.ylim([0.0,1.05])
plt.xlabel('False Positive Rate', fontsize = 18)
plt.ylabel('True Positive Rate', fontsize = 18)
plt.title('ROC for Titanic survivors', fontsize= 18)
plt.show()
# 0.8348061229417161
```

## What are the most important features


## References


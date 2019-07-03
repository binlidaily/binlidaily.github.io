---
layout: post
title: Ensembling Learning
subtitle: 集成学习
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　在监督学习中，机器学习的目标是学习出一个效果稳定、在各方面表现都好的模型，然而实际情况往往不理想。集成学习采用了“三个臭皮匠顶个诸葛亮”的想法，采用多个弱学习器组合的方式达到一个强学习器的效果。弱学习器各有其优势，组合在一起后可能达到高准确率、高泛化能力的效果。

　　当然这里的强弱学习器的说法是为了说明方便，基学习器的说法比弱学习器（分类的话准确率在 50% 左右的分类器）更准确一些，因为有时候为了能用较少的基学习器组合出好结果，基学习器不一定选用弱学习器而是较强的学习器。值得注意的是若干个基学习器应当具有一定的准确性，同时也需要有一定的多样性，即好而不同，当然准确性和多样性其实是相互矛盾的，需要找到平衡。

<p align="center">
<img width="" src="/img/media/15575546857251.jpg">
</p>

　　根据个体学习成器的生成方法，目前的集成学习方法可以分为两大类：
* 个体学习器间存在强依赖关系、必须串行生成的序列化方法，如 Boosting。
* 个体学习器间不存在强依赖关系、可同时生成的并行化方法，如 Bagging。

## 1. Boosting
　　Boosting 是一类可以将弱学习器提升为强学习器的算法，工作机制是：
1. 先从初始训练集训练出一个基学习器
2. 根据基学习器的表现对训练样本的分布进行调整，使得验证错误的样本在后续得到更多关注
3. 基于调整后的样本分布训练下一个基学习器
4. 重复进行训练和调整，直到基学习器数目达到预设值 $T$
5. 将 $T$ 个基学习器的结果加权结合

　　Boosting 算法的应用:
* 最出名的是 [Adaboost](https://binlidaily.github.io/2018-10-29-adaboost/)
* XGBoost

　　对于 Boosting 的过程，值得注意的是如何对训练样本的分布进行调整，使得验证错误的样本能够得到纠正，一般来说有两种方式:
* **重赋权值法**（re-weighting）：在每一轮训练过程中，根据样本分布为每个训练样本重新赋予一个权重。
* **重采样法**（re-weighting）：对于无法接收带权重样本的基学习算法，根据样本分布对训练集重新进行采样，用重采样得到的样本集对基学习器进行训练。
    * 如何保证验证错误的样本得到更多关注？多复制一些分错样本的拷贝？

　　一般来讲，这两种方法没有明显的优劣差别。值得注意的是，利用重赋权值法在训练的每一轮都要检查当前生成的基学习器是否满足基本条件（比如是否比随机的效果好），如果不满足当前学习器就会被抛弃，导致最后基学习器个数达不到预设的 $T$。相对的，重采样法在重新获取训练样本能够减少这种情况的发生。

Boosting **优点**：
1. 能够提高模型的泛化能力。
2. Boosting 主要关注降低偏差（bias）。

Boosting **缺点**：
1. 训练较慢。

## 2. Bagging
　　欲得到泛化能力较强的集成，那么集成中的个体学习器应该尽可能相互**独立**。然而实际任务中独立无法完全做到，一个策略是在给定数据集后，对训练样本进行采样，产生若干个不同的子集分别进行训练基学习器，因为训练数据集不尽相同基学习器有望具有较大的差异，集成结果泛化能力一般不会差；然而在采样时考虑到如果每个子集完全不同，那么每个基学习器只用到了数据的一小部分，不足以有效训练，无法保证得到较好的基学习器效果，于是我们采用有放回的进行抽样，这样样本数可以大一些。

　　Bagging (Bootstrap AGGregatING) 基于自主采样法 (bootstrap sampling)，流程如下：
1. 在给定含 $m$ 个样本的数据集中随机**有放回地**抽取 $m$ 个样本（大约有 63.2% 不重复的样本），训练一个基学习器。
2. 重复上述过程训练出 $T$ 个基学习器。
3. 将 $T$ 个基学习器的结果加权结合

<p align="center">
<img width="600" src="/img/media/15575681447743.jpg">
</p>

Bagging **优点**：
1. Bagging 是一个高效的集成学习算法，可以并行。
2. Bagging 主要关注降低方差（variance）。


### 2.1 Bagging 与 Boosting的区别

1. 样本选择上：Bagging 采用的是 Bootstrap 随机有放回抽样；而Boosting 每一轮的训练集是不变的，改变的只是每一个样本的权重。
2. 样本权重：Bagging 使用的是均匀取样，每个样本权重相等；Boosting 根据错误率调整样本权重，错误率越大的样本权重越大。
3. 预测函数：Bagging 所有的预测函数的权重相等；Boosting 中误差越小的预测函数其权重越大。
4. 并行计算：Bagging 各个预测函数可以并行生成；Boosting 各个预测函数必须按顺序迭代生成。
　　

## 3. 结合策略
　　训练好 $T$ 个基学习器 $\{h_1, h_2, \dots, h_T \}$ 后就要进行结合了，针对回归与分类的不同任务，常见的组合策略如下。

### 3.1 多专家组合
### 3.1.1 平均法
　　对于数值型 (回归) 输出 $h_{i}(\boldsymbol{x}) \in \mathbb{R}$，最常见的是平均法（averaging）：

* **简单平均法（simple averaging）**

$$
H(\boldsymbol{x})=\frac{1}{T} \sum_{i=1}^{T} h_{i}(\boldsymbol{x})
$$

* **加权平均法（weighted averaging）**

$$
H(\boldsymbol{x})=\sum_{i=1}^{T} w_{i} h_{i}(\boldsymbol{x})
$$

　　一般来说，在个体学习器的性能相差较大时宜采用加权平均法，而个体学习器性能相近时宜采用简单平均法。通常要求 $ w_{i} \ge 0$，$\sum_{i=1}^T w_i= 1$。

### 3.1.2 投票法
　　对于分类任务来说，学习器 $h_i$ 从类别集 $\{c_1, c_2, \dots, c_N \}$ 中预测出一个标记，比较常见的组合策略是用投票法（voting），为了方便讨论，记 $h_i^j(x)$ 是 $h_i$ 在类别 $c_j$ 上的输出。

* **绝对多数投票法（majority voting）**

$$
H(\boldsymbol{x})=\left\{\begin{array}{ll}{c_{j},} & {\text { if } \sum_{i=1}^{T} h_{i}^{j}(\boldsymbol{x})>0.5 \sum_{k=1}^{N} \sum_{i=1}^{T} h_{i}^{k}(\boldsymbol{x})}, \\ {\text {reject, }} & {\text { otherwise. }}\end{array}\right.
$$

　　表示某类别超过半数才标记，否则拒绝预测。

* **相对多数投票法（plurality voting）**

$$
H(\boldsymbol{x})=c_{\arg \max\limits_{j} } \sum_{i=1}^{T} h_{i}^{j}(\boldsymbol{x})
$$

　　预测为类别的票最多的，如果有多个的票最多的类别，随机选择。
* **加权投票法（weighted voting）**

$$
H(\boldsymbol{x})=c_{\mathrm{arg} \max\limits_{j} } \sum_{i=1}^{T} w_{i} h_{i}^{j}(\boldsymbol{x})
$$


　　通常要求 $ w_{i} \ge 0$，$\sum_{i=1}^T = 1$。

<p align="center">
<img width="" src="/img/media/15575740363426.jpg">
</p>

### 3.2 多级组合
### 3.2.1 Stacking
　　Stacking 是一种使用串行的组合基学习器的方法，把前一个基学习器 (Base-learner) 的结果作为特征输出到下一个学习器 (Meta-learner)，最后的学习器作为融合模型进行最后结果的预测。

<p align="center">
<img width="" src="/img/media/15620593061827.jpg">
</p>

　　Meta-learner 的选取有很多，可以是常见的 Voting，也可以是容易解释的算法如 LR 等，具体可[参考](https://blog.csdn.net/g11d111/article/details/80215381)。Stacking 实践可以用 [mlxtend](https://rasbt.github.io/mlxtend/user_guide/classifier/StackingClassifier/) 的工具。

### 3.2.2 级联算法（cascading）
TODO

## 4. 代码实践
### 4.1 Voting Classifier
　　投票方式看选择选用 soft 还是 hard 投票模式，可以用 Sklearn 中现成的工具：
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


### 4.2 Bagging
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

### 4.3 Boosting
　　可以用 Adaboost, XGBoost 尝试提高模型效果。

## References
1. [EDA To Prediction(DieTanic)](https://www.kaggle.com/ash316/eda-to-prediction-dietanic)
2. [Kaggle机器学习之模型融合（stacking）心得](https://zhuanlan.zhihu.com/p/26890738)
3. [Stacking 代码](https://blog.csdn.net/qq1483661204/article/details/80157365)
4. [从基础到实现：集成学习综合教程（附Python代码）](https://www.jiqizhixin.com/articles/2018-07-28-3)
5. [为什么说bagging是减少variance，而boosting是减少bias? - 过拟合的回答 - 知乎](https://www.zhihu.com/question/26760839/answer/40337791)
---
layout: post
title: Ensemble Learning
subtitle: 集成学习
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　在监督学习中，机器学习的目标是学习出一个效果稳定、在各方面表现都好的模型，然而实际情况往往不理想。集成学习采用了“三个臭皮匠顶个诸葛亮”的想法，采用多个弱学习器组合的方式达到一个强学习器的效果。弱学习器各有其优势，组合在一起后可能达到高准确率、高泛化能力的效果。

{% include toc.html %}

　　当然这里的强弱学习器的说法是为了说明方便，基学习器的说法比弱学习器（分类的话准确率在 50% 左右的分类器）更准确一些，因为有时候为了能用较少的基学习器组合出好结果，基学习器不一定选用弱学习器而是较强的学习器。值得注意的是若干个基学习器应当具有一定的准确性，同时也需要有一定的多样性，即好而不同，当然准确性和多样性其实是相互矛盾的，需要找到平衡。



<p align="center">
<img src="/img/media/15575546857251.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">集成个体应该好而不同</em>
</p>

　　根据个体学习成器的生成方法，目前的集成学习方法可以分为两大类：
* 个体学习器间存在强依赖关系、必须串行生成的序列化方法，如 Boosting。
* 个体学习器间不存在强依赖关系、可同时生成的并行化方法，如 Bagging。

　　我们常说集成学习中的基模型是弱模型，通常来说弱模型是偏差高（在训练集上准确度低）方差小（防止过拟合能力强）的模型，但并不是所有集成学习框架中的基模型都是弱模型。Bagging 和 Stacking 中的基模型为强模型（偏差低，方差高），而 Boosting 中的基模型为弱模型（偏差高，方差低）。

## 0. 期望和方差
　　在 Bagging 和 Boosting 框架中，通过计算基学习器的期望和方差我们能得到整体的期望和方差。为了简化模型，假设基学习器期望为 $\mu$，方差为 $\sigma^2$，模型的权重为 $r$，两两模型间的相关系数 $\rho$ 相等。由于 Bagging 和 Boosting 的基学习器都是线性组成的，那么模型总体的期望可以计算为：

$$
\begin{aligned} E(F) &=E\left(\sum_{i}^{m} r_{i} f_{i}\right) \\ &=\sum_{i}^{m} r_{i} E\left(f_{i}\right) \end{aligned}
$$

　　模型总体方差（公式推导参考协方差的性质，协方差与方差的关系）：

$$
\begin{aligned} \operatorname{Var}(F) &=\operatorname{Var}\left(\sum_{i}^{m} r_{i} f_{i}\right) \\ &=\sum_{i}^{m} \operatorname{Var}\left(r_{i} f_{i}\right)+\sum_{i \neq j}^{m} \operatorname{Cov}\left(r_{i} f_{i}, r_{j} f_{j}\right) \\ &=\sum_{i}^{m} r_{i}^{2} \operatorname{Var}\left(f_{i}\right)+\sum_{i \neq j}^{m} \rho r_{i} r_{j} \sqrt{\operatorname{Var}\left(f_{i}\right)} \sqrt{\operatorname{Var}\left(f_{j}\right)} \\ &=\operatorname{mr}^{2} \sigma^{2}+m(m-1) \rho r^{2} \sigma^{2} \\ &=m r^{2} \sigma^{2}(1-\rho)+m^{2} r^{2} \sigma^{2} \rho \end{aligned}
$$

　　模型的准确度可有偏差与方差共同决定：

$$
\text {Error}=\text{bias}^{2}+\text{var}+\xi
$$

### 0.1 Bagging 的偏差与方差
　　对于 Bagging 来说，每个基学习器的权重等于 $r=\frac{1}{m}$，且期望近似相等，故可以改写总体期望和方差：

$$
\begin{aligned} E(F) &=\sum_{i}^{m} r_{i} E\left(f_{i}\right) \\ &=m \frac{1}{m} \mu \\ &=\mu \end{aligned}
$$

$$
\begin{aligned} \operatorname{Var}(F) &=m r^{2} \sigma^{2}(1-\rho)+m^{2} r^{2} \sigma^{2} \rho \\ &=m \frac{1}{m^{2}} \sigma^{2}(1-\rho)+m^{2} \frac{1}{m^{2}} \sigma^{2} \rho \\ &=\frac{\sigma^{2}(1-\rho)}{m}+\sigma^{2} \rho \end{aligned}
$$

　　我们可以看到：
* 整体模型期望等于基学习器的期望，也就是说整体模型的偏差和基学习器的偏差近似
    * 这里就说明了为什么 Bagging 要强学习器，因为弱学习器集成的结果偏差依然很高，会影响准确率
* 整体模型的方差小于等于基学习器方差，随着基学习器数量增多，整体模型方差减少，防止过拟合，提高准确率。
    * 当且仅当相关性 $\rho = 1$ 时取等号
    * 当然方差不会随着基学习器数量增多一直快速减小，看第一项就能知道，分母越来越大，第一项的变换率会降低
* 从这个角度看 Random Forest 的效果
    * RF 是在 Bagging 上加入了样本采样和特征采样来降低基学习器间的相关性 $\rho$
    * 从而显著降低方差公式中的第二项，稍稍增加了第一项，整体降低了方差

### 0.2 Boosting 的偏差与方差
　　对于 Boosting 来说，基学习器共用同一个训练集，所以其间的具有很强的相关性，可以近似为 $\rho = 1$，则对应的整体期望和方差为：

$$
E(F) =\sum_{i}^{m} r_{i} E\left(f_{i}\right)
$$

$$
\begin{aligned} \operatorname{Var}(F) &=m r^{2} \sigma^{2}(1-\rho)+m^{2} r^{2} \sigma^{2} \rho \\ &=m \frac{1}{m^{2}} \sigma^{2}(1-1)+m^{2} \frac{1}{m^{2}} \sigma^{2} 1 \\ &=\sigma^{2} \end{aligned}
$$

　　我们可以得到：
* Booting 采用基于贪心策略的前向加法模型，整体模型的期望由各个基学习器的期望累加而成，基学习器越多，整体期望越高，对应的准确率越高
* 整体模型的方差近似等于基学习器的方差，应该还要考虑基学习器之间的权重有变化，所有不好讨论这部分的变化
    * 如果基学习器不是弱学习器，则方差很大，整体模型方差也就很大，无法达到防止过拟合的效果

　　基于 Boosting 框架的 Gradient Boosting Decision Tree 模型中基模型也为树模型，同 Random Forrest，我们也可以对特征进行随机抽样来使基模型间的相关性降低，从而达到减少方差的效果。

## 1. Boosting
　　Boosting 是一类通过逐步聚焦于基学习器犯错的样本、减少集成偏差的方法。Boosting 方法有点像人类学习的过程，从错误中学习。工作机制是：
1. 先从初始训练集训练出一个基学习器
2. 根据基学习器的表现对训练样本的分布进行调整，使得验证错误的样本在后续得到更多关注
3. 基于调整后的样本分布训练下一个基学习器
4. 重复进行训练和调整，直到基学习器数目达到预设值 $T$
5. 将 $T$ 个基学习器的结果加权结合

　　Boosting 算法的应用:
* 最出名的是 [Adaboost](https://binlidaily.github.io/2018-10-29-adaboost/)
* GBDT
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
　　Bagging (**B**ootstrap **AGG**regat**ING**) 通过全程能看出来，是基于自主采样法 (bootstrap sampling) 即有放回的采样的一种集成学习方法。可以形象的看成是集体决策，每个人表达自己的观点，然后集体决策。

　　从最前面的例子可以看到，通过一些“好而不同”的个体学习器集成起来能够达到较好的效果。从概率角度上来看，假设每个基学习器出错的概率是相互独立的，通过简单多数投票的方式集成结果，超过半数基学习器出错的概率会随着基学习器的数量增加而下降。当然这也要看基学习器的能力，这也是为什么 Bagging 要尽量用学习能力里比较强的学习器。

![](/img/media/15773517110264.jpg)


　　“不同”的学习器指的是个体学习器应该尽可能相互独立，这样能够增大相互之间的差异性，从而能够在一定程度上降低方差和过拟合现象，具有较好的泛化能力。因为数据集一般来说有限，所以每个基学习器都是通过有放回采样的方式获取训练集，无重复子集可能会导致训练样本不够。

　　Bagging 方法由采样方式的不同可以分为好多种类，如 [Pasting](https://scikit-learn.org/stable/modules/ensemble.html#b1999)，Bagging，Random Subspaces 和 Random Patches。

　　Bagging 算法的一般流程如下：
1. 在给定含 $m$ 个样本的数据集中随机**有放回地**抽取 $m$ 个样本（大约有 63.2% 不重复的样本），训练一个基学习器。
2. 重复上述过程训练出 $T$ 个基学习器。
3. 将 $T$ 个基学习器的结果加权结合

<p align="center">
<img width="600" src="/img/media/15575681447743.jpg">
</p>

Bagging **优点**：
1. Bagging 是一个高效的集成学习算法，可以并行。
2. Bagging 主要关注**降低方差（Variance）**。


### 2.1 Bagging 与 Boosting的区别

　　从多个方面来看这两者的区别：
1. 样本选择：
    * Bagging 采用的是 Bootstrap 随机有放回抽样；
    * Boosting 每一轮的训练集是不变的，改变的只是每一个样本的权重。
2. 样本权重：
    * Bagging 使用的是均匀取样，每个样本权重相等；
    * Boosting 根据错误率调整样本权重，错误率越大的样本权重越大。
3. 预测函数：
    * Bagging 所有的预测函数的权重相等；
    * Boosting 中误差越小的预测函数其权重越大。
4. 并行计算：
    * Bagging 各个预测函数可以并行生成；
    * Boosting 各个预测函数必须按顺序迭代生成。
5. 优化目标
    * Bagging 是集成弱学习器降低整体方差（Variance）
    * Boosting 是一步一步优化犯错的弱学习器，降低整体的偏差（Bias）
6. 模型训练：
    * 因为 Bagging 是要降低方差，Bagging 的基学习器最好是有着比较强学习能力的（比如完全长成的决策树）
    * Boosting 的基学习器则要求学习能力弱一些（比如浅层决策树）。


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
　　Stacking 是一种使用串行的组合基学习器的方法，把前一个基学习器 (Base-learner) 的结果**作为特征**输出到下一个学习器 (Meta-learner)，最后的学习器作为融合模型进行最后结果的预测。

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



## to manage

理论上可以证明（周志华机器学习第八章），随着集成中个体分类器数目 $T$ 的增大，集成的错误率将指数级下降，最终趋向于零。值得注意的是，这里的前提是基学习器的误差相互独立！

目前的集成方法大致分成两类：
* 个体学习器之间存在强依赖关系、必须串行生成的序列化方法（Boosting）
* 个体学习器间不存在强依赖关系、可同时生成的并行化方法（Bagging 和 Random Forest）

思想：通过将多个弱学习器集成起来能够达到强学习器的效果。“三个臭皮匠顶个诸葛亮”。

问题：
* 如何得到这些弱分类器？
* 有了弱分类器，如何集成？即结合策略。

## Boosting
![](/img/media/15445148705893.jpg)


## Bagging
![-w359](/img/media/15445149854585.jpg)

![](/img/media/15445158241697.jpg)


从图中可以看出 Bagging 的弱学习器之间并没有什么联系，为了要尽可能使得集成的个体学习器能够尽可能相互独立，在实际中因为很难做到完全独立，所以 Bagging 采取随机采样的方式，从训练集中有放回的随机采样同等大小的数据集训练对应的弱学习器，进行 $T$ 次采样训练 $T$ 个弱学习器。通过采样得到训练数据不同，使得训练得出的弱学习器尽可能的有较大差异，以达到相对个体学习器相对独立的目的。最后我们将这 $T$ 个个体学习器集成起来。


## References
1. [EDA To Prediction(DieTanic)](https://www.kaggle.com/ash316/eda-to-prediction-dietanic)
2. [Kaggle机器学习之模型融合（stacking）心得](https://zhuanlan.zhihu.com/p/26890738)
3. [Stacking 代码](https://blog.csdn.net/qq1483661204/article/details/80157365)
4. [从基础到实现：集成学习综合教程（附Python代码）](https://www.jiqizhixin.com/articles/2018-07-28-3)
5. [为什么说bagging是减少variance，而boosting是减少bias? - 过拟合的回答 - 知乎](https://www.zhihu.com/question/26760839/answer/40337791)
6. [Sklearn Ensemble methods](https://scikit-learn.org/stable/modules/ensemble.html#bagging-meta-estimator)
7. [【机器学习】决策树（中）——Random Forest、Adaboost、GBDT （非常详细）](https://zhuanlan.zhihu.com/p/86263786)
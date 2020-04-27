---
layout: post
title: Adversarial Validation
subtitle: 
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　Adversarial Validation 可以在打比赛时用来检测训练集与测试集的数据分布是否一致，如果发现不一致我们可以及时采取一些对应措施。

　　Kaggle 比赛中数据可分为训练集和测试集，国内比赛根据阶段可能分为多个测试集，由于数据集采样和分布的原因导致训练集和线上测试集可能出现不一致的情况，就会带来本地交叉验证与线上不一致的情况。

　　Adversarial Validation 核心思想是构建一个分类模型，目的是分辨训练集和测试集的来源，因为可能训练集和测试集大小相差较大，所以采用 AUC 作为分类评价指标。
* 如果分类模型无法分辨样本（AUC 接近 0.5），说明训练集和测试集数据分布比较一致
* 如果分类模型可以很好分辨样本（AUC 接近 1），说明训练集和测试集数据分布不太一致

　　Adversarial Validation 使用思路也是比较，直接对训练集和测试集打上不同的标签，然后训练分类模型看对应效果即可：

```python
train = pd.read_csv( 'data/train.csv' )
test = pd.read_csv( 'data/test.csv' )

train['TARGET'] = 1
test['TARGET'] = 0

data = pd.concat(( train, test ))
x = data.drop( [ 'TARGET', 'ID' ], axis = 1 )
y = data.TARGET

from sklearn.cross_validation import train_test_split
x_train, x_test, y_train, y_test = train_test_split(x, y)
```

　　在训练集和测试集分布一致的时候，AUC 接近 0.5，分类模型无法判别样本来源：


```shell
# logistic regression / AUC: 49.82%
# random forest, 10 trees / AUC: 50.05%
# random forest, 100 trees / AUC: 49.95%
```

　　如果 AUC 接近于 1，数据不一致有一些解决办法。

　　假设存在多个训练集，可以使用 Adversarial Validation 找到与测试集分布比较接近的训练集来进行模型训练。其他训练数据可以用来微调，完成迁移学习（[嫁接学习](https://zhuanlan.zhihu.com/p/51901122)）。

　　如果 Adversarial Validation 的 AUC 比较高，可以尝试使用 Adversarial Validation 选择出于测试集比较相似的样本，构建成验证集。

　　如果数据集可以扩增，可以使用外部数据来扩增训练数据，以保证训练集和数据集分布一致。




# References
1. [Kaggle知识点：Adversarial Validation](https://mp.weixin.qq.com/s/qcdy2GiBBbf1ctQYnqwSOg)
2. [结构化数据的迁移学习：嫁接学习](https://zhuanlan.zhihu.com/p/51901122)
3. [Adversarial validation, part one](http://fastml.com/adversarial-validation-part-one/)
4. [Adversarial validation, part two](http://fastml.com/adversarial-validation-part-two/)
5. [Adversarial Validation Codes](https://www.kaggle.com/h4211819/adversarial-validation)
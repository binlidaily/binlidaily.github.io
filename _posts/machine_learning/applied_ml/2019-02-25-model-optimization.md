---
layout: post
title: Model Optimization
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

机器学习三要素：数据，模型加算法。

## 1、训练集上欠拟合，auc 等度量指标不佳
训练集上欠拟合一般是由于数据中特征或模型无法充分刻画预测的目标导致。可以以下的优化思路：

1） 加新的好特征

好的特征可以是新的业务强相关特征，也可以是根据前面文章特征工程部分的思路提取的特征。

**特别关注和预测目标直接相关特征的细粒度刻画**。例如 ctr 预测中，将历史 ctr 点击率通过不同角度进行交叉深度表示，例如时间维度：这个词过去 x 天、过去 x 周、过去 x 月、白天、晚上、工作日、周末的历史 ctr 统计；不同广告位上的 ctr；不同广告样式下的 ctr；不同相关性系数的 ctr；不同类别用户下的 ctr 等。也可以做多维度特征交叉组合，产生细粒度的刻画特征。具体特征工程部分可以参考这里。

2） 模型上可以调低训练步长、增大树的个数以及深度等可以让模型更精细化学习的参数。

3） 使用更复杂的模型，例如深度学习或者组合模型等。

4） 如果某类样本存在预测特别差，可以考虑进行上下采样的处理，使的训练样本的分布向预测的目标倾斜。

## 2、训练集上过拟合，但预测集效果差（泛化能力差）
1）增大数据集

可能是因为数据集少，导致对训练集过度学习。

直接思路就是扩展数据集，除了常规根据业务特性加入更大范围或者更长时间段的方式外，也可以通过时间窗口滑动、上采样等手段在已有数据集通过一定技巧来产生更多数据。

2）Early stopping

在多轮迭代训练中，在训练效果收敛之前停止训练。简单说，训练时有一个校验集，当在校验集上效果不再提升时，停止训练

3）正则化方法

通过 L1 或 L2 正则，使部分特征权重变小或者权重为 0，降低模型复杂度。

4）Dropout

在神经网络中，随机丢弃一些隐层节点，也是降低模型复杂度的一种方式。

## 3、预测效果异常得好
有时候，会在模型初版阶段或者加入了少量特征后，离线模型在训练集或者预测集上的效果都非常好，例如分类问题 auc 达到 95% 以上等。这时候需要保持警惕，很有可能特征集中混入了包含 label 信息的特征，例如未来的信息等。这类模型往往在离线阶段效果好，在上线实验后，线上的效果差，但是如果在上线时才发现问题，负面效果大，项目进度也收到影响。因此，这类问题需要在离线阶段就保持敏感度，及时定位修复。

数据泄露（[Data Leakage](https://www.kaggle.com/dansbecker/data-leakage)）也可能导致这样的问题。

## 4、模型的效果提升到达一定瓶颈
在初期优化后，模型性能达到一定阶段，但进一步提升遇到瓶颈。这时候一些思路可供参考尝试。

1） 评估模型效果对应当前的机制或策略应用是否初步足够，如足够可以将更多精力放到机制等应用层面。因为这个时候模型进一步提升的难度较大，而可能机制优化更快速提升整体应用效果，投入和回报性价比更高。

2） 进行具体化的 bad case 分析，对于那些预测和实际偏差很多的具体 case，具体分析原因。具体可以看这里的[总结]()。



3） 定位已有样本以及特征中的偏差问题。

回到模型先前工作的分析和确认中，因为很多时候，一开始节奏比较快，对于使用的特征以及样本缺乏分析，可能会导致引入有偏差或异常的样本、引入存在错误的特征。

* 重视样本分布观察、样本采样、异常样本过滤、重复样本的去重等工作。

* 评估特征的业务含义、数据和线上实际数据的一致性、特征是否存在异常值等。

* 评估特征和预测 label 之间的相关性，做好特征筛选工作。

4) 审视 label 的合理性，思考是否有客观或者更能描述问题的 label。

5）重新评估建模思路，看看是否有更贴合业务以及数据的建模思路。

6）尝试其他类型的模型。

7）进行更加深度的特征工程。

在以上优化的过程中，在每步操作之间，一定要注意有**基准和确定优化方向**，版本之间的效果要有比较，避免无基准无方向的盲目尝试。

## 实践问题汇总
**1. 特征线上线下评价指标不匹配，出现过拟合，怎么有效选取特征？**

　　如果线下线上效果不匹配，可以从几个方面着手：
1. 首先分析自己线下评价方法是否合理，比如训练、测试集的划分。
2. 线下出现了过拟合，可以通过随机选择部分样本或者特征的方式来改善，也可以采用带有正则化项的模型；
3. 当然也有可能线上数据和线下数据本身的分布有差异，比如某个特征维度线上会出现训练中没有见过的取值。
4. 另外可以利用一些数据的物理意义来评估特征的有效性。
5. 看 feature_importance，逐个去掉权重靠后的特征，线下或许会下降，但是线上可能会上升。

**2. 如何判断特征的强弱？**

1. 用模型选择特征，xgboost、lightgbm、rf 等都能输出特征重要性；输出后对特征重要性小的进行适量删减或者放在另一个模型里，这样不断尝试，最终留下比较好的特征。
2. 特征分组，后用模型输出预测结果进行对比。
3. 控制变量，构建3-5列白噪声特征，然后组合一个训练集特征，放进模型输出结果。然后替换训练集特征输出结果，比较准确率；（既x个特征，输出x个结果进行比较）？
4. 首先，基于业务逻辑思考特征，如果特征有很强的可解释性，但是出现了线上降分的情况，可能是出现了特征冲突的问题，可以把该特征放在其他模型中去，使模型具有差异性，融合的时候效果会好。
5. 其次，可以看一下Pearson相关系数图，尽量选择那些特征间相关性低，但是与label相关性高的特征。

**3. 怎么发现强特？**

1. 看看有没有方差是0的，直接剔除。
2. 观察特征与应变量的变化趋势，若有明显的正/负相关趋势，基本上就是“强特”。
3. 可以看看特征在训练集与测试集上的分布，若某个特征在训练集与测试集上的分布差异很大，那这个特征有可能不太好。
4. 要发现强特，我一般的思路是先衍生构造出足够多的特征，然后根据一些指标挑选。
5. 首先你要判断从图上判断哪个特征是强特证。打个比方，假如该任务是二分类，且数据集中正样本个概率是10%。那么从某个特征图(比如用户的点击次数)上看，他们各个取值按道理应该在10%上下波动的。但是如果存在一个特征图，有些取值正样本的概率远远大于10%，有的取值正样本的概率远远小于10%。通常该特征就是强特征，因为能通过该特征的取值就能很好的区分开来。


**4. 数据预处理过程中，对缺失值（缺失值较少,其余的特征缺失值都在10%以内）和不合理的值都有哪些比较好的处理方法 如何选择最合适的？**

1. 缺失值填充的话还可以采用前向/后向填充/插值（对时序型数据比较有用），如果采用填充中位数、均值的话要注意数据分布的改变。
2. 用统计学的方法也可以，±3个西格玛，合格品率为99.73%，在这个数字之外的基本属于异常值，可以用剔除或者用99.73%这个值来填充。
3. 缺失值和不合理值，都置换为 NAN 后 ，可以构建决策树进行填充，过程是：将没有缺失的其它特征 作为特征输入，label 为要预测为空值的一类。用构建的模型对缺失值进行预测填充。
4. 在填充方法里面，还有一种名为插值法的技术，pandas 自带的插值法，有回归插值，拉格朗日插值，等等。
5. 当然这些都是一些技巧，小数据集里面可能都没有直接置为 NAN 用lgb训练来的方便。

**5. 模型和特征有什么突破的方法**

1. 模型突破：1、调参：运用调参库进行大规模参数搜索，调参工具推荐Hyperopt、Ray.tune等；2、模型融合：方法一般有：权重法、stacking、Blending等。对于深度学习的，要注意dropout，合理运用全局池化，且深度学习也能进行模型融合。
2. 特征突破：只能说特征工程是一门艺术，方法也是根据不同情景而定/一般常用的是多项式、tdf、聚合、滑窗等，这个只能建议你多看各大比赛top的开源方案
3. 找特征、组合特征、换优化算法、换三角学习率、换种子、加dropout、尝试各种模型融合方式、模型蒸馏
4. 如果使用树模型的话，对特征做log变换是没用的，树模型只关心特征值的大小关系。

## References
1. [机器学习模型优化中常见问题和解决思路](https://blog.csdn.net/mozhizun/article/details/71438821)
2. [机器学习中防止过拟合的处理方法](https://blog.csdn.net/heyongluoyao8/article/details/49429629)
3. [Error Analysis](http://mlwiki.org/index.php/Error_Analysis)
4. [机器学习模型应用以及模型优化的一些思路](https://blog.csdn.net/mozhizun/article/details/60966354)
5. [工作流程与模型调优](https://blog.csdn.net/JoyceWYJ/article/details/51659747)
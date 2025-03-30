---
layout: post
title: Classification Metrics
subtitle: 分类指标
author: Bin Li
tags: [Machine Learning, Metrics]
image: 
comments: true
published: true
---

{% include toc.html %}

　　评估指标是机器学习领域很重要的部分，其衡量我们的模型拟合的好坏程度。本文从分类、回归和排序指标等几个方面展开。

## 1. 分类评估指标（Classification Evaluation Metrics）
### 1.1 准确率（Accuracy）与错误率（Error Rate）
　　准确率（Accuracy）是指**分类**正确的样本占总样本个数的比例：

$$
\text{Accuracy}=\frac{n_\text{correct}}{n_\text{total}}
$$

　　准确率可以用在多分类，如果在二分类中（TN 等标识参考下节）有：

$$
\text{Accuracy} = \frac{\mathrm{TP}+\mathrm{TN}}{\mathrm{TP}+\mathrm{FP}+\mathrm{FN}+\mathrm{TN}}
$$

　　准确率是分类问题中最简单也最直观的评价指标，但是在数据不平衡的情况下有明显的**缺陷**。比如，当负样本当负样本占 99% 时，分类器把所有样本都预测为负样本也可以获得 99% 的准确率。所以，当不同类别的样本比例非常不均衡时，占比大的类别往往成为影响准确率的最主要因素。

　　为了解决这个问题，可采用更为有效的**加权平均准确率**（每个类别下的样本准确率的算术平均）作为模型评估的指标。

　　错误率（Error Rate）是指**分类**错误的样本占总样本个数的比例：

$$
\text{Error Rate}=\frac{n_\text{error}}{n_\text{total}}
$$

### 1.2 精确率（查准率，Precision）与召回率（查全率，Recall）
　　精准率和召回率多用于二分类，可结合混淆矩阵（Confusion Matrix）理解，如图：

<p align="center">
<img src="/img/media/15508200692360.jpg" width="660">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">二分类混淆矩阵</em>
</p>

![](/img/media/15892691231563.jpg)


　　精确率（查准率，Precision）是指真的正例数（正确被预测为正例的实例数）占所有预测被为属于正例的实例数（即真的正例数和假的正例数之和，假的正例是指被错误地预测为正例的实例）的比例，精确率是相较于对预测结果而言，尝试表达这样的效果：“**有多少被预测为正例的样本是正确的？**”

$$
\text{Precision} = \frac{\mathrm{TP}}{\mathrm{TP}+\mathrm{FP}}
$$

　　召回率（查全率，Recall）是指真的正例数（正确被预测为正例的实例数）占所有真实正例的实例数（即真的正例数和假的负例数之和，假的负例是指本来为真实正例，却被错误地预测为负例的实例）的比例，相较于真实情况而言，尝试表达这样的效果：“**有多少正例的样本被正确地检索为正例了？**”

$$
\text{Recall} = \frac{\mathrm{TP}}{\mathrm{TP}+\mathrm{FN}}
$$

　　看了精确率和召回率，我们很容易被 $\mathrm{TP}$，$\mathrm{FP}$，$\mathrm{TN}$ 和 $\mathrm{FN}$ 搞晕，其实前面的 T 或者 F 是针对真实的类别和预测类别是否一致，一致就是 T，不一致就是 F。后面的 P 或者 N 是针对预测的结果到底是正例还是负例，正例是 P，负例是 N。

　　那么通过排列组合就有下面的图，为了方便记忆，我们虚拟出一个数据流，真实的正负例样本从左侧进入混淆矩阵，然后从上面输出预测的正负例样本。

<p align="center">
<img src="/img/media/15614281343142.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">二分类混淆矩阵的形象记忆图</em>
</p>

　　管道相交的地方就对应了四种真实正负例组合预测正负例的情况，按照绿色方块与双层边框矩形的比例，我们可以据此形象定义：
1. 准确率（左子图）：预测正确的样本占总体样本的比例
2. 精确率（中子图）：预测正确的正例样本占预测为正例样本的比例
3. 召回率（右子图）：预测正确的正例样本占所有真实正例样本的比例。

　　在理想情况下，精确率和召回率两者都是越高越好，但是实际上这两者在某些情况下是相互矛盾的，一者高，另一者就低。举个极端的例子，比如在搜索网页的时候，如果只返回最相关的那一个网页，那么精确率是 100%，而召回率就很低了。相反，如果我返回全部网页，那么召回率就是 100%，那么精确率就很低了。因此在不同场合需要根据实际需要判断使用哪个指标更重要。

　　对于一个给定类，精确率和召回率的不同组合如下：
* 高精确率+高召回率：模型能够很好地检测该类；
* 高精确率+低召回率：模型不能很好地检测该类，但是在它检测到这个类时，判断结果是高度可信的；
* 低精确率+高召回率：模型能够很好地检测该类，但检测结果中也包含其他类的样本；
* 低精确率+低召回率：模型不能很好地检测该类。

　　所以问题来了，采摘蘑菇时，你是希望精确率更高，还是召回率更高？😆

### 1.3 F1 值（F1 Score）
　　精确率和召回率是既矛盾又统一的两个指标，那我们应该如何利用这两者综合评估一个模型的好坏？我们可以使用精确率和召回率的调和平均数来综合衡量模型的性能：

$$
\frac{2}{F_{1}}=\frac{1}{P}+\frac{1}{R}
$$

　　该值被称为 F1 值（F1 Score），即综合考虑精确率和召回率的指标，也能用来反映一个排序模型的性能，值越大越好：：

$$
\mathrm{Fl}=\frac{2 \times \text { precision } \times \text { recall}}{\text {precision }+\text { recall }}
$$

　　F1 值的问题是如果有两个模型，一个精确率特别高，召回率特别低，另一个召回率特别高，精确率特别低的时候，F1 值可能是差不多的，你也不能基于此来作出选择。

　　F 值还可以泛化为对精确率和召回率赋不同权重进行调和：

$$
F_{\alpha}=\frac{\left(1+\alpha^{2}\right) \cdot P \cdot R}{\alpha^{2} \cdot P+R}
$$

### 1.4 P-R 曲线 (Rrecision-Recall Curve)
　　我们可以先利用精确率和召回率画出一条曲线来观察一下这两者的变化情况：

<p align="center">
<img src="/img/media/15610870815236.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">P-R 曲线</em>
</p>

　　我们把这条曲线叫做 P-R（Precision-Recall Curve）曲线，其横轴是召回率，纵轴是精确率，可见曲线越接近右上角，精确率和召回率都较高，效果较好。那么我们要怎么绘制 P-R 曲线呢？

　　我们知道在对于一般的二分类分类器，预测的结果大多数是以概率的形式输出，概率超过一定的阈值（比如说 0.5）就被预测为正例，反之就预测为负例。那么预测结果就是所有预测样本的概率值，据此我们可以选择不同的概率值，从最小到最大，对于每一个概率值，我们都统计一次所有样本被归属的类别，进而可以计算出召回率和精确率，这二者就对应到曲线中的一个点。计算足够个阈值对应的 $(\text{召回率}, \text{精确率})$ 点后就能绘制出 P-R 曲线。

　　那么我们能从 P-R 曲线中看出什么呢？怎么判断哪个模型更好？

　　拿上面的图距离，当召回率接近于 0 时，模型 A 的精确率为 0.9，模型 B 的精确率是 1，这说明模型 B 得分前几位的样本全部是真正的正样本，而模型 A 即使得分最高的几个样本也存在预测错误的情况。并且，随着召回率的增加，精确率整体呈下降趋势。但是，当召回率为 1 时，模型 A 的精确率反而超过了模型 B。这充分说明，只用某个点对应的精确率和召回率是不能全面地衡量模型的性能，只有通过 P-R 曲线的整体表现，才能够对模型进行更为全面的评估。

P-R 缺点

### 1.5 AP（Average Precision）与 mAP（mean Average Precision）
　　为了能够衡量 P-R 曲线的整体表现，人们利用 P-R 曲线下方的整体面积作为衡量的标准，记为 AP（Average Precision）：

$$
\mathrm{AP}=\int_{0}^{1} p(r) d r
$$

　　🤔那为什么 AP 可以反映全局性能呢？

<p align="center">
<img src="/img/media/15837239333514.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">解释 AP 为何能反映全局性能</em>
</p>

　　可以看到虽然两个模型的 P-R 曲线后交集，但是整体看来红色要比黑色好？为什么呢？因为我们想要精确率和召回率都尽量高一点，那么这个尽量高的期望形成的效果就是曲线形成的面积就越大，所以可以用曲线下方的面积来作为整体衡量精确率和召回率的标准。

　　TODO 在目标检测领域做了一些改进。

<p align="center">
<img src="/img/media/15689788066970.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">mAP 示意图</em>
</p>


　　常用来做目标检测的指标衡量，越大越好，mAP 是对多个类的 AP 取了平均。

　　在多个类别的检测中，每一个类别都可以调整阈值，算出召回率从 0 到 1 时的准确率（同一召回率取最高的准确率），计算准确率的平均值，而后再对于所有类求平均得到 mAP。这个值介于 0 到 1 之间，且越大越好。

### 1.6 接收者操作特征 (Receiver Operation Characteristic, ROC)
　　接收者操作特征（Receiver Operating Characteristic Curve, ROC）起源于军事，后广泛用于医学，是二分类的一种衡量指标。和 P-R 曲线有些类似，ROC 也想绘制出一定的曲线来衡量模型的性能。

　　ROC 曲线的横坐标为假正率（False Positive Rate, FPR），纵坐标为真正率（True Positive Rate，TPR），其中真正率跟召回率的计算一致。

$$
\begin{aligned} \text{FPR} &=\frac{\text{FP}}{\text{N}}= \frac{\text{FP}}{\text{FP + TN}}  \\ \text{TPR} &=\frac{\text{TP}}{\text{P}} = \frac{\text{TP}}{\text{TP + FN}} \end{aligned}
$$

　　其中 $P$ 是真实的正样本的数量，$N$ 是真实的负样本的数量，$TP$ 是 $P$ 个正样本中被分类器预测为正样本的个数，$FP$ 是 $N$ 个负样本中被分类器预测为正样本的个数。

<p align="center">
<img src="/img/media/IMG_0944.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">从混淆矩阵看 TPR 和 FPR</em>
</p>


　　从混淆矩阵中看这两个量的计算就是每一行的阴影部分除以该行的总和：
* TPR 表示所有正例中被正确预测为正例的比例
* FPR 表示所有负例中被错误预测为**正例**的比例

　　如果当 ROC 曲线是 $y=x$：

<p align="center">
<img src="/img/media/15837408184980.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">y=x 的 ROC 曲线</em>
</p>


　　此时 TPR=FPR，也就是说：不论样本的真实类别是正例还是负例，分类器将其预测为正例的概率都是一样的，即分类器对正例和负例完全没有区分能力。

　　我们期望得到的分类器效果是：对于正例样本，分类器将其预测为正例的概率（即 TPR）要大于原本是负例却被预测为正例的概率（即 FPR），即 $TPR > FPR$，也就说对于要预测出正例，我们希望分类器是正确预测的概率要大于错误预测的概率。所以一般的 ROC 曲线如下：

<p align="center">
<img src="/img/media/15837411377514.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">常见的 ROC 曲线</em>
</p>


　　根据真正率和假正率的定义，我们肯定希望模型的真正率越高越好，假正率越低越好，反映在图上的位置就是，我们希望 ROC 曲线越接近**左上角**越好。从曲线下的面积上看，越靠近左上角的曲线，面积越大，越接近于 1，所以我们同样可以用曲线下面积来衡量模型的整体性能。

　　🤔那要怎么绘制 ROC 曲线呢？

　　为了更直观地说明这个问题，我们举一个医院诊断病人的例子。假设有 10 位疑似癌症患者，其中有3位很不幸确实患了癌症（P=3），另外7位不是癌症患者（N=7）。医院对这10位疑似患者做了诊断，诊断出3位癌症患者，其中有2位确实是真正的患者（TP=2）。那么真阳性率 TPR=TP/P=2/3。对于7位非癌症患者来说，有一位很不幸被误诊为癌症患者（FP=1），那么假阳性率 FPR=FP/N=1/7。对于“该医院”这个分类器来说，这组分类结果就对应ROC曲线上的一个点（1/7，2/3）。

　　ROC 曲线是通过不断移动分类器的截断点（Cut Point）来生成曲线上的一组关键点，截断点就是区分正负预测结果的概率阈值。我们用分类器给所有测试样本预测一个概率值，因为我们知道所有测试样本的真实类别，那么我们可以选定一个概率，超过这个概率就是正例，反之负例。那么我们可以像上述的例子那样统计算出 TPR 和 FPR，然后在图中画点，然后我们更改不同的概率，得到不同的点。选择的概率从最大到最小，依次画出点，然后连成曲线。

<p align="center">
<img src="/img/media/15837360124329.jpg" width="450">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">ROC 曲线绘制</em>
</p>

　　相比 P-R 曲线，ROC 曲线有一个特点，当正负样本的分布发生变化时，ROC 曲线的形状能够基本保持不变，而 P-R 曲线的形状一般会发生较剧烈的变化。

<p align="center">
<img src="/img/media/15837368851456.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">ROC 曲线和 P-R 曲线的对比</em>
</p>

　　可以看出，P-R 曲线发生了明显的变化，而 ROC 曲线形状基本不变。这个特点让 ROC 曲线能够尽量降低不同测试集带来的干扰，更加客观地衡量模型本身的性能。

　　这有什么实际意义呢？在很多实际问题中，正负样本数量往往很不均衡。比如，计算广告领域经常涉及转化率模型，正样本的数量往往是负样本数量的 1/1000 甚至 1/10000。若选择不同的测试集，P-R 曲线的变化就会非常大，而ROC曲线则能够更加稳定地反映模型本身的好坏。所以，ROC曲线的适用场景更多，被广泛用于排序、推荐、广告等领域。

　　然而，ROC 曲线不会随着类别分布的改变而改变的优点在一定程度上也是其缺点。因为 ROC 曲线这种不变性其实影响着的是 AUC 值，或者说是评估分类器的整体性能。但是在某些场景下，我们会更关注模型在**特定数据集**下的表现，这时候 P-R曲线则能够更直观地反映其性能。

### 1.7 AUC（Area Under Roc Curve）
　　AUC 指的是 ROC 曲线下的面积大小，正如上节所说，该面积值能够量化地反映基于 ROC 曲线衡量出的模型性能。由于 ROC 曲线一般都处于 $y=x$ 这条直线的上方（如果不是的话，只要把模型预测的概率反转成 1−p 就可以得到一个更好的分类器），所以 AUC的取值一般在 0.5～1 之间。

　　🤔那要怎么理解 AUC 呢？

　　从 Mann–Whitney U statistic 的角度来解释，AUC 就是从所有正例样本中随机选取一个样本，从所有负例样本中随机选取一个样本，然后根据你的分类器对两个随机样本进行预测，把正例样本预测为正例的概率为 p1，把负例样本预测为正例的概率为p0，p1 > p0 的概率就等于 AUC。所以 AUC 反映的是分类器**对样本的排序能力**。根据这个解释，如果我们完全随机的对样本分类，那么 AUC 应该接近 0.5。AUC 越大，说明分类器越可能把真正的正样本排在前面，分类性能越好。

　　AUC 还和基尼系数有联系：

$$
\text{Gini} + 1 = 2 \times \text{AUC}
$$

　　计算 AUC 只需要沿着 ROC 横轴做积分即可，从物理意义角度理解，AUC 计算的 ROC 曲线下的面积：

$$
\mathrm{AUC}=\sum_{i \in(P+N)} \frac{\left(\mathrm{TPR}_{i}+\mathrm{TPR}_{i-1}\right) \cdot\left(\mathrm{FPR}_{i}-\mathrm{FPR}_{i-1}\right)}{2}
$$

　　从概率意义角度理解，AUC 考虑的是样本的排序质量，与排序误差有密切关系。假设 $\mid P \mid$ 为正例数，$\mid N \mid$ 为负例数，然后我们从正负例样本中抽取一个正例和负例组成一对，然后用我们的模型去做预测得到对应的概率值。

　　我们能够组成的一个正负例对有 $\mid P \mid \times \mid N \mid$ 个，我们要求的 AUC 就是找出其中正负例对中正例概率大于负例概率的正负例对个数，然后如此所有的正负例对个数即可。

　　按照预测概率从大到小排序，我们设一个排序逆序计数 $\text{rank}_i$，即最大的概率对应的 $\text{rank}_1$ 数目最大，即所有样本的个数 $\mid P \mid + \mid N \mid$。

　　那么对于正样本中概率最大的，排序计数为 $\text{rank}_1$，比它概率小的有 $\mid P \mid - 1$ 个正样本，$\text{rank}_1 - \mid P \mid$ 个负样本，即能构成 $\text{rank}_1 - \mid P \mid$ 个正例概率大与负例概率的正负样本对。

　　对于正样本中概率第二大的，排序计数为 $rank_2$，比它概率小的有 $\mid P \mid - 2$ 个正样本，$\text{rank}_2 - \mid P \mid + 1$ 个负样本，即能构成 $\text{rank}_2 - \mid P \mid + 1$ 个正例概率大与负例概率的正负样本对。


　　以此类推，对于正样本中概率最小的，排序计数为 $\text{rank}_{\mid P \mid}$，比它概率小的有 $0$ 个正样本，$\text{rank}_{\mid P \mid} - 1$ 个负样本。那么将所有的正例概率大于负例概率的正负样本对加起来，再除以总的样本对个数，就得到了 AUC，计算公式为：

$$
\mathrm{AUC}=\frac{\sum_{i \in P} \operatorname{rank}_{i}-\frac{|P| \cdot(|P|+1)}{2}}{|P| \cdot|N|}
$$



## 2. 分类训练指标（Classification Traning Metrics）
### 2.1 0-1 损失
　　对于二分类问题，如果预测值和真实值不同，则结果为 1，相同为 0。

$$
\ell\left(y_{i}, \hat{y}_{i}\right)=\left\{\begin{array}{ll}1 & y_{i} \neq \hat{y}_{i} \\ 0 & y_{i}=\hat{y}_{i}\end{array}\right.
$$

　　该损失函数的意义就是，当预测错误时，损失函数值为1，预测正确时，损失函数值为0。该损失函数不考虑预测值和真实值的误差程度，也就是只要预测错误，预测错误差一点和差很多是一样的。例如真实值是 1，预测值为 0.999999 都会被判错。

　　0-1 Loss 的曲线如下:

<p align="center">
  <img width="" height="" src="/img/media/15576324030915.jpg">
</p>

　　可见 0-1 损失函数的几个特点：
* 0-1 损失函数是一个非凸函数，在最优化过程中求解不方便，有阶跃，不连续。
* 0-1 损失函数无法对参数进行求导，在依赖反向传播的深度学习任务重，无法使用

0-1 loss **优点**
1. 非常直观，容易理解。

0-1 loss 缺点：
1. 太过严格，只要不等于真实结果就是 0，没有一点缓冲空间
2. 无法求导，不好优化

**缺点**：
1. 0-1 loss 对所有错分的样本都赋予同样的惩罚（损失为 1），这样对于那些犯错较大的点没有进行有效的惩罚，在一定程度上不太合理。
2. 0-1 loss 不连续、非凸、不可导，难以用类似梯度下降的方法优化。故而 0-1 loss 很少被用到。

### 感知损失（Perceptron Loss）？
　　在 0-1 损失上加了一点容忍度，对于 0-1 损失来说，如果真实值是 1，预测值为 0.999999 都会被判错，感知损失就在此基础上加了一个超参数阈值 $t$，让判错

$$
\text {perceptron loss}=\sum_{i} \max \left\{0,-y_{i} f_{w, b}\left(x^{(i)}\right)\right\}
$$

### 合页损失（Hinge Loss）
　　合页损失可以用来解决间隔最大化问题，如在 SVM 中解决几何间隔最大化问题
$$
l(f(x), y)=\max (0, 1-y f(x))
$$

![](/img/media/15837586515404.jpg)

求导为

### 指数损失（Exponential Loss）

### 2.2 交叉熵损失
　　对于二分类问题，交叉熵损失有两种形式。第一种形式是基于输出标签为 $\{0,1\}$ 的表达方式，也是最常见的形式：

$$
L=-[y \log \hat{y}+(1-y) \log (1-\hat{y})]
$$

　　可以由下面公式转化得到：

$$
P(y | x)=\hat{y}^{y} \cdot(1-\hat{y})^{(1-y)}
$$

　　当 $y = 1$ 时可以画出如下的 loss [曲线](https://redstonewill.com/1584/):

<p align="center">
  <img width="" height="" src="/img/media/15576436379526.jpg">
</p>

　　第二种形式是基于输出标签为 $\{-1, +1\}$ 的表达方式：

$$
L=\log \left(1+e^{-y s}\right)
$$
　　$s$ 表示线性输出结果，下面用 $g(x)$ 表示非线性输出结果（如 Sigmoid）来说明如何得到上式。从概率角度，预测类别的概率可以写成：

$$
P(y | x)=g(y s)
$$

　　引入 log 以及加上负号使其求最小化：

$$
L=-\log g(y s)=-\log \frac{1}{1+e^{-y s}}=\log \left(1+e^{-y s}\right)
$$
　　我们以 $ys$ 为横坐标，可以绘制 Loss 的曲线如下图所示:

<p align="center">
  <img width="" height="" src="/img/media/15576452477293.jpg">
</p>

　　对于多分类交叉熵损失:

$$
L=\frac{1}{n} \sum_{X} \sum_{i=1}^{C} y_i \log (\hat{y}_i)
$$

交叉熵优点：
* 能够避免学习速率过慢


### 2.3 对数误差
　　[对数损失](https://www.zhihu.com/question/27126057)是用于极大似然估计的。

$$
L(Y, P(Y | X))=-\log P(Y | X)
$$

　　其中 $P(Y \mid X)$ 是极大似然函数，一组参数在一堆数据下的似然值，等于每一条数据再这组参数下的条件概率之积。

而损失函数一般是每条数据的损失之和，为了把积变为和，就取了对数。

再加一个负号是为了让最大似然值和最小损失对应起来。


### Softmax loss

### Sigmoid loss





### 焦损失函数




### KL 散度（Kullback-Leibler Divergence）
　　KL 散度（相对熵），是一种**量化两种概率分布 P 和 Q 之间差异的方式**，又叫相对熵。在概率学和统计学上，我们经常会使用一种更简单的、近似的分布来替代观察数据或太复杂的分布。K-L 散度能帮助我们度量使用一个分布来近似另一个分布时所损失的信息。

$$
D_{K L}(p(x) \| q(x))=\sum_{x \in X} p(x) \ln \frac{p(x)}{q(x)}
$$





## TODO
目标检测
* mAP
* 协方差

分类问题：
* Hinge loss
* Cross Entropy loss

深度学习常用分了你损失：
分类问题常用的损失函数：
（1）交叉熵损失函数，也称作softmax损失函数，可用于解决多分类问题，通过指数化将输出转换成概率的形式；
（2）合页损失函数，一般情况下，交叉熵损失函数的效果优于合页损失函数；
（3）坡道损失函数，对离群点或者噪声的抗干扰能力强，是一种鲁棒性的损失函数，对误差较大的区域会进行截断；
（4）大间隔损失函数，保证能够正确分类的同时，还满足增大类间的差异，提升了特征的分辨能力，防止网络发生过拟合；
（5）中心损失函数，保证能够正确分类的同时，还满足减少类内的差异，提升了特征的分辨能力；

分类问题常用的损失函数：
（1）交叉熵损失函数，也称作softmax损失函数，可用于解决多分类问题，通过指数化将输出转换成概率的形式；
（2）合页损失函数，一般情况下，交叉熵损失函数的效果优于合页损失函数；
（3）坡道损失函数，对离群点或者噪声的抗干扰能力强，是一种鲁棒性的损失函数，对误差较大的区域会进行截断；
（4）大间隔损失函数，保证能够正确分类的同时，还满足增大类间的差异，提升了特征的分辨能力，防止网络发生过拟合；
（5）中心损失函数，保证能够正确分类的同时，还满足减少类内的差异，提升了特征的分辨能力；



Training Metrics 和Evaluation Metrics的差异

很多时候，Evaluation Metrics 和Training Metrics可以通用，我们可以直接选定Evaluation Metrics为目标函数来对其优化，例如RMSE，但是也有很多Evaluation Metrics 不能直接作为目标函数来优化。

Skewed Datasets：Imbalanced classes，outliers， and Rare Data

## References
1. [如何理解K-L散度（相对熵）](https://www.jianshu.com/p/43318a3dc715)
2. [精确率、召回率、F1 值、ROC/AUC 、PRC各自的优缺点是什么？](http://frankchen.xyz/2016/09/21/metric/)
3. [mAP (mean Average Precision) for Object Detection](https://medium.com/@jonathan_hui/map-mean-average-precision-for-object-detection-45c121a31173)
4. [Understanding the mAP Evaluation Metric for Object Detection](https://medium.com/@timothycarlen/understanding-the-map-evaluation-metric-for-object-detection-a07fe6962cf3)
5. [一文详尽系列之模型评估指标](https://mp.weixin.qq.com/s/qExXN0B-AzwWlS728MA41g)
6. [语义分割](https://blog.csdn.net/majinlei121/article/details/78965435)
7. 《百面机器学习》
8. TODO
    1. [map](https://arleyzhang.github.io/articles/c521a01c/)
    2. [5 losses](https://heartbeat.fritz.ai/5-regression-loss-functions-all-machine-learners-should-know-4fb140e9d4b0)
    3. [losses 必看](https://zhuanlan.zhihu.com/p/72589970)
9. [精确率、召回率、F1 值、ROC、AUC 各自的优缺点是什么？](https://www.zhihu.com/question/30643044/answer/1205433761)
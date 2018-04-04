---
layout: post
title: "基于支持向量机的交叉验证与参数选择研究"
author: "Bin Li"
tags: "tags"
comments: true
published: false
---


2.1.3 常用训练算法

### 块算法(chunking algorithm)

Chunking算法[10]的出发点是删除矩阵中对应Lagrange乘数为零的行和列将不会影响最终的结果。对于给定的样本，Chunking算法的目标是通过某种迭代方式逐步排除非支持向量，从而降低训练过程对存储器容量的要求。具体做法是，将一个大型QP问题分解为一系列较小规模的QP问题，然后找到所有非零的Lagrange乘数并删除。在算法的每步中Chunking都解决一个QP问题，其样本为上一步所剩的具有非零Lagrange乘数的样本以及M个不满足KKT条件的最差样本。如果在某一步中，不满足KKT条件的样本数不足M个，则这些样本全部加入到新的QP问题中。每个QP子问题都采用上一个QP子问题的结果作为初始值。在算法进行到最后一步时，所有非零Lagrange乘数都被找到，从而解决了初始的大型QP问题。

Chunking算法将矩阵规模从训练样本数的平方减少到具有非零Lagrange乘数的样本数的平方，在很大程度上降低了训练过程对存储容量的要求。Chunking算法能够大大提高训练速度，尤其是当支持向量的数目远远小于训练样本的数目时。然而，如果支持向量个数比较多，随着算法迭代次数的增多，所选的块也会越来越大，算法的训练速度依旧会变得十分缓慢。

如块算法、Osuna方法、SVMlight、SMO算法、Generalized Decomposition Algorithm算法、GSMO算法。

### 分解算法（decomposition algorithm）

分解算法最早在文献[11]中提出，是目前有效解决大规模问题的主要方法。分解算法将二次规划问题分解成一系列规模较小的二次规划子问题，进行迭代求解。在每次迭代中，选取拉格朗日乘子分量的一个子集做为工作集，利用传统优化算法求解一个二次规划的子问题。以分类SVM为例，分解算法的主要思想是将训练样本分成工作集B和非工作集N，工作集B中的样本个数为q，q远小于训练样本总数。每次只针对工作集B中的样本进行训练，而固定N中的训练样本。该算法的关键在于选择一种最优工作集选择算法，而在工作集的选取中采用了随机的方法，因此限制了算法的收敛速度。

文献[12]在分解算法的基础上对工作集的选择做了重要改进。采用类似可行方向法的策略确定工作集B。如果存在不满足KTT条件的样本，利用最速下降法，在最速下降方向中存在q个样本，然后以这q个样本构成工作集，在该工作集上解决QP问题，直到所有样本满足KTT条件。如此改进提高了分解算法的收敛速度，并且实现了SVMlight算法。

文献[13]提出的序列最小优化(sequential minimal optimization，SMO)算法是分解算法的一个特例，工作集中只有2个样本，其优点是针对2个样本的二次规划问题可以有解析解的形式，从而避免多样本情况下的数值解不稳定及耗时问题，且不需要大的矩阵存储空间，特别适合稀疏样本。工作集的选择不是传统的最陡下降法，而是启发式。通过两个嵌套的循环寻找待优化的样本，然后在内环中选择另一个样本，完成一次优化，再循环，进行下一次优化，直到全部样本都满足最优条件。SMO算法主要耗时在最优条件的判断上，所以应寻找最合理即计算代价最低的最优条件判别式。

SMO算法提出后，许多学者对其进行了有效的改进。文献[14]提出了在内循环中每次优化3个变量，因为3个变量的优化问题同样可以解析求解，实验表明该算法比SMO的训练时间更短。文献[15-16]在迭代过程中的判优条件和循环策略上做了一定的修改，加快了算法的速度。

### 增量算法(incremental algorithm)
增量学习是机器学习系统在处理新增样本时，能够只对原学习结果中与新样本有关的部分进行增加修改或删除操作，与之无关的部分则不被触及。增量训练算法的一个突出特点是支持向量机的学习不是一次离线进行的，而是一个数据逐一加入反复优化的过程。

文献[17]最早提出了SVM增量训练算法，每次只选一小批常规二次算法能处理的数据作为增量，保留原样本中的支持向量和新增样本混合训练，直到训练样本用完。文献[18]提出了增量训练的精确解，即增加一个训练样本或减少一个样本对Lagrange系数和支持向量的影响。文献[19]提出了另一种增量式学习方法，其思想是基于高斯核的局部特性，只更新对学习机器输出影响最大的Lagrange系数，以减少计算复杂度。文献[20]提出了一种“快速增量学习算法”，该算法依据边界向量不一定是支持向量，但支持向量一定是边界向量的原理，首先选择那些可能成为支持向量的边界向量，进行SVM的增量学习，找出支持向量，最终求出最优分类面，提高训练速度。文献[21]提出了基于中心距离比值的增量运动向量机，利用中心距离比值，在保证训练和测试准确率没有改变的情况下，提高收敛速度。文献[22]提出了基于壳向量的线性SVM增量学习算法，通过初始样本集求得壳向量，进行SVM训练，得到支持向量集降低二次规划过程的复杂度，提高整个算法的训练速度和分类精度。

---

## 交叉验证
交叉验证是又一种模型选择方法，它与前面介绍的模型选择方法有所不同，是一种没有任何前提假定直接估计泛化误差的模型选择方法，由于没有任何假定，可以应用于各种模型选择中，因此具有应用的普遍性，又由于其操作的简便性，被人们认为是一种行之有效的模型选择方法。这一章我们将介绍交叉验证的基本原理接着会去定义不同交叉验证的过程，交叉验证提出一个比较好的评估性能。

### 交叉验证的思想
交叉验证的产生是一个曲折的过程，首先是人们发现用同一数据集既进行模型训练又进行泛化误差的估计会产生一个较差的结果，也就是我们常说的训练误差估计的乐观性，为了克服这个问题，交叉验证的方法被人们提了出来，它的基本思想是将数据分为两部分，一部分数据用来进行模型的训练，通常我们叫做训练集，另一部分数据用来测试训练生成模型的误差，我们叫做测试集，由于两部分数据的不同，泛化误差的估计是在新的数据上进行，这样的泛化误差的估计可以更接近真实的泛化误差，在数据足够的情况下，我们可以很好估计出真实的泛化误差，但是在实际应用中，往往只有有限的数据可用，我们必须对数据进行重用，对数据进行多次切分来得到好的估计，自从交叉验证提出以后，人们提出了不同的数据切分方式，因此产生了多种形式的交叉验证方法，下面我们对主要的交叉验证方法作一个详细的介绍。

在大多数实际应用中，只有有限的数据是可用的，这导致分裂数据的想法：部分数据（训练样本）用于训练算法，并且使用剩余数据（验证样本） 用于评估算法的性能。只要数据是独立同分布，验证样本就可以扮演“新数据”的角色。

单个数据分割产生对风险的验证估计，而对多个分割进行平均得到交叉验证估计。交叉验证的主要兴趣在于数据分裂启发式的普遍性。 它只假定数据是相同分布的，训练和验证样本是独立的，甚至可以放宽（见第8.1节）。 因此，CV可应用于（几乎）任何框架中的几乎任何算法，如回归（Stone，1974; Geisser，1975），密度估计（Rudemo，1982; Stone，1984）和分类（Devroye和Wagner ，1979; Bartlett等，2002）等等。 大多数其他模型选择程序（参见第3节）并不具备这种普遍性，这些程序往往是特定的框架，在另一个框架中可能会完全误导。 例如，C p（Mallows，1973）是特定的最小二乘回归。

### 交叉验证的定义
Geisser（1975）给出了CV策略的一般描述：简而言之，CV包括对相应于不同数据拆分的风险进行平均的几个保留估计。设$ B \geq 1 $是一个整数，$ I _ { 1} ^ { ( t ) } ,\ldots ,I _ { B } ^ { ( t ) } $是$ \{ 1,\dots ,n \} $的非空适当子集序列。$ \mathcal { A } \left( D _ { n } \right) $在训练集$ \left( I _ { j } ^ { ( t ) } \right) _ { 1\leq j \leq B } $中的风险的交叉验证估计量可以定义为

$ \hat { \mathcal { L } } ^ { \text{CV} } \left( \mathcal { A } ; D _ { n } ; \left( I _ { j } ^ { ( t ) } \right) _ { 1\leq j \leq B } \right) : = \frac { 1} { B } \sum _ { j = 1} ^ { B } \hat { \mathcal { L } } ^ { \text{I} O } \left( \mathcal { A } ; D _ { n } ; I _ { j } ^ { ( t ) } \right) $

所有通常的CV风险估计值都是这种形式（10）。 每一个由$ \left( I _ { j } ^ { ( t ) } \right) _ { 1} \leq j \leq B $唯一确定，即划分训练集和验证机方案的选择。

注意到在用于识别的模型选择中，Yang提出了CV的另一种定义（2006, 2007），称为带投票的交叉验证（CV with voting, CV-v）。 当比较两个算法$ \mathcal { A } _ { 1} $和$ \mathcal { A } _ { 2} $时，当且仅当对于大部分分裂$ j = 1,\dots ,B $满足$ \hat { \mathcal { L } } ^ { \text{HO} } \left( \mathcal { A } _ { 1} ; D _ { n } ; I _ { j } ^ { ( t ) } \right) < \hat { \mathcal { L } } ^ { \text{HO} } \left( \mathcal { A } _ { 2} ; D _ { n } ; I _ { j } ^ { ( t ) } \right) $。 相比之下，形式（10）的CV程序可以称为平均交叉验证（CV with averaging，CV-a），因为在比较之前风险的估计值是平均的。

### 交叉验证的方法
在本节中，风险的保留（或验证）估计被定义，接着引出我们对的一般定义。

比较常用的如下几种交叉验证的方法：

hold-out[8]: 最早由Devroye和Wagner在1979年提出，主要思想是将数据集进行一次切分，一部分用来训练模型，另一部分用来测试，这是最简单的一种方法，也是交叉验证的雏形。下面我们用数学语言进行描述，通常设 $I^t$ 为集合见 $D_n={\{1,\cdot \cdot \cdot, n\}}$ 的非空子集合，$I^v={(I^t)}={\{1,\cdots, n\}}$ 为其补集，我们用 $I^t$ 作为训练集来进行模型训练，$I^v$ 作为测试集来进行泛化误差的估计，这种方法通常只对数据集进行一次随机切分，训练生成的模型用 $A(D_n)$ 表示，最后泛化误差的估计为

$ \hat{R}_{HO}(A;D_n;I^i) = {1\over{n_v}}{\Sigma_{i\in{D_n^v}}L(A(D_n);\xi_i)} $

其中$D_{n}^{(t)}:=(\xi)_{i \in I^{(t)}}$是大小为$n_t={Car(I^{(t)})}$的训练样本，$D_{n}^{(t)}:=(\xi)_{i \in I^{(v)}}$，大小为$n_v=n-n_t$，$I^{(v)}$称为验证集。


leave-one-out（LOO，Stone，1974; Allen，1974; Geisser，1975）是最经典的穷举性CV程序。 它对应于选择$ n _ { t } = n - 1 $：每个数据点连续地从样本中“遗漏”并用于验证。 （t）c形式上，LOO由（10）定义，$ B = n $，$ I _ { j } ^ { ( t ) } = \{ j \} ^ { c } $，对于$ j = 1,\dots ,n $：

$ \hat { \mathcal { L } } ^ { L O O } \left( \mathcal { A } ; D _ { n } \right) = \frac { 1} { n } \sum _ { j = 1} ^ { n } \gamma \left( \mathcal { A } \left( D _ { n } ^ { ( - j ) } \right) ; \xi _ { j } \right) $

其中$ D _ { n } ^ { ( - j ) } = \left( \xi _ { i } \right) _ { i \neq j } $。LOO的名字可以追溯到Picard和Cook（1984）以及Breiman和Spector（1992）的论文; LOO在文献中有其他几个名称，如delete-one CV（Li，1987），ordinary CV（Stone，1974; Burman，1989），或者simply CV（Efron，1983; Li，1987）。

Leave-p-out（LPO，Shao，1993）与$ p \in \{ 1,\dots ,n - 1\} $是$ n _ { t } = n - p $的穷举交叉验证：p个数据的每个可能的子集被连续地“排除”在样本上并用于验证。因此，LPO定义为（10）其中$ B = \left( \begin{array} { l } { n } \\ { p } \end{array} \right) $，且$ \left( I _ { j } ^ { ( t ) } \right) _ { 1\leq j \leq B } $都是$ \{ 1,\dots ,n \} $的子集大小为$ n - p $。 LPO也被称为delete-p CV或delete-p multifold CV（Zhang，1993）。值得注意的是，$ p = 1 $的LPO是LOO。

V-fold CV (VFCV)：具有$ V \in \{ 1,\dots ,n \} $由Geisser（1975）引入，作为计算上耗时的LOO的替代方法（例如，参见Breiman等，1984）。 VFCV依靠将数据初步划分为大约相等基数$ n / V $的$V$子样本。 每个子样本依次扮演验证样本的角色。 形式上，让$ A _ { 1} ,\dots ,A _ { V } $作为$ \{ 1,\dots ,n \} $的一些分区，其中保证对于$ \forall j $有$ \operatorname{Card} \left( A _ { j } \right) \approx n / V $。 然后，$ \mathcal { A } \left( D _ { n } \right) $的风险的VFCV估计量（t）由（10）给出，其中$ B = V $和$ I _ { j } ^ { ( t ) } = A _ { j } ^ { c } $，对于$ j = 1,\dots ,B $：

$ \hat { \mathcal { L } } ^ { \text{VF} } \left( \mathcal { A } ; D _ { n } ; \left( A _ { j } \right) _ { 1\leq j \leq V } \right) = \frac { 1} { V } \sum _ { j = 1} ^ { V } \left[ \frac { 1} { \operatorname{Card} \left( A _ { j } \right) } \sum _ { i \in A _ { j } } \gamma \left( \hat { s } \left( D _ { n } ^ { \left( - A _ { j } \right) } \right) ; \xi _ { i } \right) \right] $

其中$ D _ { n } ^ { \left( - A _ { j } \right) } = \left( \xi _ { i } \right) _ { i \in A _ { j } ^ { c } } $。VFCV的计算成本仅为训练$ \mathcal { A } $的 $ n - n / V $点的$ \mathcal { V } $倍; 如果$ V \ll n $，它远小于LOO或LPO。 请注意，$ V = n $的VFCV是LOO。


#### 历史评论
简单验证是第一个类似CV的过程。 它被引入心理学领域（Larson，1931），因为需要一个可靠的替代重构替代错误的方法，正如Anderson等人所说的。（1972年）。 Herzberg（1969）使用它来评估预测因子的质量。 Stone（1974）首先考虑选择训练集的问题，其中“可控”和“不可控”数据分裂是有区别的。

## 参数选择
### 模型参数的影响
参数是机器学习算法的关键，它们是从训练数据中学习的模型的一部分。机器学习模型中一般分两类参数，一个是模型参数（model parameters），另一个是模型超参数（model hyperparameter）。模型参数是模型内部的配置变量，其值可以根据数据进行估计。在经典的机器学习文献中，我们可以将模型看作假设，将参数视为对特定数据集的假设进行裁剪。模型参数从数据中学习到，保存作为模型的一部分，其值决定了模型的能力，且在模型做预测时起作用。模型超参数是模型外部的配置，其值无法从数据中估计。我们无法知道给定问题的模型超参数的最佳值。 我们可以使用经验法则，在其他问题上使用相同的值，或通过反复试验来搜索最佳值。当机器学习算法针对特定问题进行调整时（例如，当使用网格搜索或随机搜索时），那么正在调整模型的超参数或顺序以得到最熟练的模型的参数预测。

在训练支持向量机时，我们更多需要关注的是模型超参，即模型的惩罚系数C。经分析对支持向量机有着重要影响的参数是:惩罚因子C，核函数及其参数的选取。惩罚因子C用于控制模型复杂度和逼近误差的折中，C越大则对数据的拟合程度越高,学习机器的复杂度就越高，容易出现“过学习”的现象。而C取值过小，则对经验误差的惩罚小，学习机器的复杂度低，就会出现“欠学习”的现象。当C的取值大到一定程度时，SVM模型的复杂度将超过空间复杂度的最大范围，那么当C继续增大时将几乎不在对SVM的性能产生影响。

### 模型参数选择的方法
**穷举法**
所谓穷举法就是在支持向量机模型确定以后，先根据经验对其惩罚因子C和核函数固有参数进行初始化赋值，然后通过实验测试，再根据测试数据反复调整参数值，直到得到满意的结果为止。实验表明，随着C的增加，分类精度迅速提高，但是继续增加C，性能的变化并不明显，当C的值足够大的时候，模型的性能将不再随着C的变化而变化了。通过分析我们可以知道，当C开始增加，模型的复杂度随之增加，支持向量的个数随之减少，而处于边界的支持向量则迅速减少。而当C的值足够大的时候，模型中边界支持向量的数量为0的时候，C的变化就不会再影响模型的性能。

穷举法是目前使用最为广泛的参数选择方法之一，其操作简单而有效。但是其对参数的调整完全凭借经验，缺乏足够的理论依据。该方法对于不同数量的样本，不同的核函数来说，其调整方法都可能是不同的，特别是当调整幅度比较大以及核函数参数比较多的时候，调整将会变得比较复杂。

**交叉验证法**
所谓交叉验证法就是指在训练SVM模型开始之前，对其训练数据进行一部分保留，然后利用这部分数据对训练后的模型进行评估。一般比较常用的是K折交叉验证法（K-foldcrossvalidation）。首先，将训练数据平均分成K组，然后取出其中一组进行保留，然后使用剩下的K-1组进行训练构建模型，最后用保留下的一组对训练出来的模型进行评估检测。将以上过程重复K次，保证每组数据都被保留测试过，然后根据K次评估检测得到的值来估计期望泛化误差，以此选择最优的参数。

交叉验证法是统计学习中的著名方法，被称为对泛化误差的无偏估计，它能够有效的防止过学习现象。它既具有一定的训练精度，又获得良好的泛化性能。目前该方法使用广泛，但是如果参数较多该方法将耗费大量时间，而且计算量大也是其缺点之一。

**梯度下降法**

2002年，Chapelle[3]等提出了一种采用梯度下降法、通过最小化一般错误的分解上界实现SVM参数的自动选择。梯度下降法，就是利用负梯度方向来决定每次迭代的新的搜索方向，使得每次迭代能使待优化的目标函数逐步减小。其公式如下所示：

$ x _ { n + 1} = x _ { n } - a ^ { * } g _ { n } $

其中a为称为学习速率，可以是较小的常数。gn是xn的梯度。使用梯度下降法来对SVM参数进行选择首先需要根据经验确定一组参数，作为梯度下降法的初始点，然后再使用梯度下降法寻找最佳参数。

虽然该算法在计算时间上比之交叉验证法和试凑法有了明显改善，但是梯度下降法对初始点要求较高，而且是一种线性搜索法，因此极易陷入局部最优。

**网格搜索算法**

2003年，Hsu,Chang,和Lin[4]提出使用网格搜索算法，求SVM惩罚因子和RBF核参数的最优解。网格搜索法是目前比较常用的。

数据搜索方法之一，对于RBF核SVM模型来说，其算法流程如下所示：首先，对于惩罚因子C和RBF核参数gamma分别确定其取值范围和搜索步长，从中得到M个C的值以及N个gamma的值。然后，根据M个C和N个gamma构建M*N组不同参数，使用每个参数构建SVM模型得到分类精度，以此确定最优的参数组C和gamma。

最后，如何最佳分类精度依然没有达到要求，就可以根据分类精度曲线重新选择取值范围和搜索步长，进行细搜索直到满足要求为止。

网格搜索法的优点就是可以对多个参数同时进行搜索，参数之间相互联系相互制约的关系，使其能够更好更快的得到最优解。而MxN组参数之间则是相互独立，这使得其可以进行并行搜索提高运算效率。其缺点就是当参数比较多时，如多项式核参数有3个，再加上惩罚因子C，也就是说对于多项式核SVM模型来说，需要对4个参数同时进行选择，假设4个参数的取值个数分别为M,N,P,Q,那么使用网格搜索法将计算MxNxPxQ组参数，计算量巨大。

**基于遗传算法的SVM模型参数选择**

通过分析，我们可以知道SVM模型的参数选择问题就是一个优化搜索问题。而遗传算法本身就是一种被广泛应用的随机搜索优化算法。遗传算法本身具有很强的鲁棒性，不依赖于问题的具体领域。强大的全局搜索能力和可并行性使其能够快速有效的搜索到全局最优解。因此使用遗传算法对SVM模型参数进行选择是可行的。其算法流程如下所示：

首先，选择SVM模型的核函数并确定惩罚因子C和核参数的编码方式和染色体结构。根据染色体结构设计和构建遗传算法的选择，交叉，变异等算子。

其次，随机产生染色体的初始种群，并对种群中的所有染色体进行解码，每个染色体就是一组参数。

然后，使用每组参数训练SVM分类模型并使用该模型对测试数据进行测试，得到其识别率。将该识别率作为参数所对应的染色体的适应度值。

最后，判断种群中最优适应度值是否达到要求，如果是，则将最优适应度所对应的染色体进行解码得到最优参数组，否则，开始遗传操作，对种群进行选择，交叉，变异等操作得到新一代的种群。

Chen[5]和Zheng[6]采用不同的推广能力估计作为遗传算法的适应度函数，提出了两种基于遗传算法的SVM模型参数优化方法，结果表明利用遗传算法对SVM参数进行优选不仅缩小了计算时间，而且还降低了对初始值选取的依赖度。

**基于粒子群算法的SVM模型参数选择**

2006年，Lee和Cho[7]提出使用粒子群算法用于求解SVM参数优化问题。粒子群优化PSO(Particle Swarm Optimization)算法是一种新兴的基于种群智能的随机全局优化算法，通过种群中粒子间的合作与竞争产生的群体智能指导优化搜索，与进化算法比较，PSO算法保留了基于种群的全局搜索策略，采用简单的速度位移模型，避免了复杂的杂交、遗传和变异等操作整个粒子群算法中体现了粒子在寻找食物源(最优解)中既保持自身惯性，又利用个体认知和社会认知不断修改自身飞行方向，最终导致群体朝食物源靠近。

PSO算法首先随机产生n组参数作为初始粒子群，然后通过迭代找到最优解，在每一次迭代中粒子通过个体最优解和群体最优解两个值来更新自己，使得整个种群朝着最优解的方向进化。

为了更具有普遍意义，在本研究中我们将重点研究以常用的Grid Search的方法来进行参数选择。

## 第三章 基于 Alpha Seeding 的支持向量机交叉验证优化
### 3.1 算法推导前期基础
在前一章我们介绍了支持向量机的数学基本公式，在序列最小优化算法的算法中，训练实例$x_i$与如下定义的最优性指标$f_i$相关联。

$ f _ { i } = y _ { i } \sum _ { j = 1} ^ { n } \alpha _ { j } Q _ { i ,j } - y _ { i } $

SVM训练的最优性条件是KarushKuhn-Tucker（KKT）（Kuhn，2014）条件。 当满足最优条件时，我们有最优指标满足以下约束条件。

$ \min \left\{ f _ { i } | i \in I _ { u } \cup I _ { m } \right\} \geq \max \left\{ f _ { i } | i \in I _ { l } \cup I _ { m } \right\} $

其中
$I_{m} = \{i | \boldsymbol{x}_i \in \mathcal{X}, 0 < \alpha_i < C\},  \\I_{u} = \{i | \boldsymbol{x}_i \in \mathcal{X}, y_i = +1, \alpha_i = 0\} \cup\\ \{i | \boldsymbol{x}_i \in \mathcal{X}, y_i = -1, \alpha_i = C\}, \\ I_{l} = \{i | \boldsymbol{x}_i \in \mathcal{X}, y_i = +1, \alpha_i = C\} \cup\\ \{i | \boldsymbol{x}_i \in \mathcal{X}, y_i = -1, \alpha_i = 0\} $

正如Keerthi等人所观察到的那样。 （Keerthi et al.2001），约束条件（3）等价于下面的约束条件。

$ I _ { \mathcal { R } } = \left\{ i | x _ { i } \in \mathcal { R } \right\} ,I \tau = \left\{ i | x _ { i } \in \mathcal { T } \right\} ,I _ { S } = \left\{ i | x _ { i } \in \mathcal { S } \right\} $

其中$b$是超平面的偏差，我们在接下来的章节中提出的算法会利用到这个约束条件。

$k$折交叉验证将数据集均匀分成$k$个子集。 一个子集被用作测试集合$\mathcal{T}$，而其余$(k-1)$个子集合一起形成训练集合$\mathcal{X}$.假设我们已经使用第一到第$(h-1)$训练了第h个SVM（在第$h$轮） ）和第$(h + 1)$到第$k$个子集作为训练集，第$h$个子集作为测试集（参见图1b）。 现在我们要训练第$(h + 1)$个SVM。 然后，在两轮训练之间共享第1至第$(h-1)$子集和第$(h + 2)$至第$k$子集。 为了将第$h$轮中使用的训练集转换为第$(h + 1)$轮的训练集，我们只需从第$(h + 1)$个子集中删除并将第$h$个子集添加到所使用的训练集在第$h$轮。 此后，我们分别将第$h$和第$(h + 1)$个SVM称为先前的SVM和下一个SVM。

为便于表示，我们用S表示共享子集$(k-2)$子集，用$\mathcal{S}$表示前一轮训练中的非共享子集$\mathcal{R}$，并表示前一轮测试子集$\mathcal{T}$。 让我们继续使用图1所示的例子，$\mathcal{S}$由第1到第$(h-1)$个子集和第$(h + 2)$到第$k$个子集组成; $\mathcal{R}$是第$(h + 1)$子集; $\mathcal{T}$是第$h$个子集。 为了将第$h$轮中使用的训练集$\mathcal{X}$转换为训练集$\mathcal{X^\prime}$ 对于第$(h + 1)$轮，我们只需要从$\mathcal{X}$中删除$\mathcal{R}$并将$\mathcal{T}$加到$\mathcal{X}$，即$ \mathcal { X } ^ { \prime } = \mathcal { T } \cup \mathcal { X } | \mathcal { R } = \mathcal { T } \cup \mathcal { S } $。 我们分别用$I_\mathcal {R}$，$I_\mathcal {T}$和$I_\mathcal {S}$表示如下对应于$\mathcal {R}$，$\mathcal {T}$和$\mathcal {S}$的三组索引。

$ I _ { R } = \left\{ i | x _ { i } \in \mathcal { R } \right\} ,I \tau = \left\{ i | x _ { i } \in \mathcal { T } \right\} ,I _ { S } = \left\{ i | x _ { i } \in \mathcal { S } \right\} $


两轮$k$次交叉验证通常具有许多共同的训练实例，如这里的$I_\mathcal {S}$集合的样本。 当$k$是10时，$I_\mathcal {X}$ 和$I_\mathcal {X^\prime}$中有$8\over9$（或〜90％）的实例是$I_\mathcal {S}$的实例。接下来，我们研究了三个重用先前的SVM的算法来训练下一个SVM。

我们提出了三种算法，它们重复使用先前的SVM来训练下一个SVM，我们逐渐地将一种算法依次重新定义。 （i）我们的第一种算法旨在初始化$\alpha$值$\alpha^\prime$？基于前一个SVM的$\alpha$值，将其转化为下一个SVM的最优值。我们将第一种算法称为调整阿尔法最佳值（ATO）。 （ii）为了有效地初始化$\alpha$？，我们的第二个算法保持$I_\mathcal {S}$中实例的$\alpha$值不变（即对于$ s \in I _ { S } $，$ \alpha _ { S } ^ { \prime } = \alpha _ { s } $），并估计$ a _ { t } ^ { \prime } $对于$ t \in I _ { T } $。该算法通过在问题（1）的约束下将R替换为T来有效地执行α值初始化，因此我们称之为多重实例替换（MIR）算法。 （iii）与MIR相似，我们的第三种算法也保持$\mathcal {S}$中实例的$\alpha$值不变;与MIR不同，该算法一次将$\mathcal {T}$中的实例替换为T中的实例，这大大缩短了初始化$\alpha$的时间？ 。我们称之为第三种算法单实例替换（SIR）。接下来，我们详细阐述这三种算法。


### 3.2 权重 Alpha 调优方法
第一种算法我们直接调整$\alpha$值到最优（Alpha Towards Optimum, ATO），ATO旨在将$\alpha$值初始化为最佳值。 它采用由Karasuyama和Takeuchi（Karasuyama和Takeuchi 2009）设计的在线SVM训练技术进行$k$次交叉验证。 在在线SVM训练中，从训练组X中去除过时训练实例的子集$\mathcal {R}$，即$ \mathcal { X } ^ { \prime } = \mathcal { X } \backslash \mathcal { R } $; 将新到达的训练实例的子集$ \mathcal { T }$添加到训练集中，即$ \mathcal { X } ^ { \prime } = \mathcal { X } ^ { \prime } \cup \mathcal { T } $。 先前使用X训练的SVM通过移除和添加实例的子集来调整，以获得下一个SVM。

在ATO算法中，我们首先构造一个新的训练数据集$ X ^ { \prime } $其中$ \mathcal { X } ^ { \prime } = \mathcal { S } = \mathcal { X } \backslash \mathcal { R } $然后，我们逐渐增加$ \mathcal { T } $中实例的$\alpha$值（即对于$ t \in I _{\mathcal { T }} $增加$ a _ { t } ^ { \prime } $），用$ a _ { T } ^ { \prime } $表示，知道接近它们的最优值；同时，我们逐渐减少$\mathcal { R }$中实例的$\alpha$值（即对于$ r \in I _ { R } $，减少$ \alpha _ { r } ^ { \prime } $），我们用$ \alpha _ { R } ^ { \prime } $表示。 一旦$\mathcal { T }$中实例的$\alpha$值满足最优条件（即约束（5）），我们将实例从$\mathcal { T }$移动到训练集$\mathcal{ X} ^ { \prime } $; 类似地，一旦$\mathcal { R }$中的实例的$\alpha$值等于0（成为非支持向量），我们从$\mathcal { R }$中移除实例。当$\mathcal { R }$为空时，ATO终止$\alpha$值初始化。

接着我们就要更新$\alpha$的权值了，接下来，我们介绍一下增加$ \alpha _ { T } ^ { \prime } $并减少$ \alpha _ { R } ^ { \prime } $的细节。我们用$\eta$表示在$ \alpha _ { T } ^ { \prime } $上增量的步长大小以及在$ \alpha _ { \mathcal { R } } ^ { \prime } $上递减量的步长大小。 从问题（1）的约束中，所有的$\alpha$值必须在$ [ 0,C ] $。 因此，对于$ t \in I _\mathcal{T} $是$ a _ { r } ^ { \prime } $的增量，记为$ \Delta \alpha _ { t } ^ { \prime } $，不能超过$ \left( C - \alpha _ { t } ^ { \prime } \right) $; 对于$ r \in I _ { \mathcal { R } } $的递减$ a _ { r } ^ { \prime } $表示为$ \Delta \alpha _ { r } ^ { \prime } $，不能超过$ a _ { r } ^ { \prime } $。 我们用$ \Delta \alpha _ { T } ^ { \prime } $表示$\mathcal { T }$中所有实例的$\alpha$值的变化。 并且$\mathcal { R }$中实例的所有$\alpha$值由$ \Delta \alpha _ { R } ^ { \prime } $变化？。 那么，我们可以计算$ \Delta \alpha _ { T } ^ { \prime } $和$ \Delta \alpha _ { R } ^ { \prime } $如下。

$\Delta \boldsymbol{\alpha}_\mathcal{T}'= \eta (C\boldsymbol{1} - \boldsymbol{\alpha}_\mathcal{T}'),  \Delta \boldsymbol{\alpha}_\mathcal{R}' = -\eta \boldsymbol{\alpha}_\mathcal{R}'$


其中$1$是所有维度都为1的向量，当我们加$\Delta \boldsymbol{\alpha}_\mathcal{T}'$到$\boldsymbol{\alpha}_\mathcal{T}'$和$\Delta \boldsymbol{\alpha}_\mathcal{R}'$ 到$\boldsymbol{\alpha}_\mathcal{R}'$问题（1）的约束必须满足。 但是，调整$\boldsymbol{\alpha}_\mathcal{T}'$后和$ \sum _ { i \in I \mp U I _ { S } \cup I _ { R } } y _ { i } \alpha _ { i } ^ { \prime } = 0 $，我们需要调整$\mathcal{X}$中的训练实例的$\alpha$值。（回想一下，在这个阶段$ \mathcal { X } ^ { \prime } = \mathcal { S } $）。 我们建议调整$ \mathcal { X } ^ { \prime } $中训练实例的$\alpha$值？ 这也在$\mathcal{M}$中，其中$ x _ { i } \in \mathcal { M } $，给定$ i \in I _ { m } $。 总之，增加$ a _ { T } ^ { \prime } $后同时减少$ \alpha _ { R } ^ { \prime } $，我们调整$ \alpha _ { M } ^ { \prime } $。 所以当调整$ a _ { T } ^ { \prime } $，$ \alpha _ { R } ^ { \prime } $和$ \alpha _ { M } ^ { \prime } $，根据问题（1）的约束，我们有下面的等式。

$\sum_{t \in I_\mathcal{T}}y_t \Delta \alpha_t' +\sum_{r \in I_\mathcal{R}}y_r \Delta \alpha_r' +\sum_{i \in I_m}y_i \Delta \alpha_i' =0$


$\mathcal{M}$通常具有大量的实例，并且有许多可能的方法来调整$\boldsymbol{\alpha}_\mathcal{M}'$。 在这里，我们建议使用$\boldsymbol{\alpha}_\mathcal{M}'$的调整确保$\mathcal{M}$中的所有训练实例满足最优条件（即约束（5））。 根据约束条件（5），我们有$\forall i \in I_m$和$f_i = b$。 结合$f_i = b$和$f_i$的定义（参见方程（2）），对于每个$i \in I_m$，我们有以下方程。

$y_i(\sum_{t \in I_\mathcal{T}} Q_{i,t}\Delta\alpha_t' +\sum_{r \in I_\mathcal{R}} Q_{i,r}\Delta\alpha_r' +\sum_{j \in I_m} Q_{i,j}\Delta\alpha_j')=0$


请注意，在上面的等式中$y_i$可以省略。 我们可以用M的所有训练实例的矩阵符号重写方程（8）和方程（9）。

![](/images/media/15209934994110.jpg)

我们用$\Delta \boldsymbol{\alpha}_\mathcal{T}'$和$\Delta \boldsymbol{\alpha}_\mathcal{R}'$使用等式（7）; 上面的等式可以重写如下。
$\boldsymbol{\Delta \alpha}_\mathcal{T}' = -\eta \Phi$
![](/images/media/15209935300906.jpg)

如果方程（10）中矩阵的逆不存在，我们找到伪逆（Greville，1960）。

计算步长$\eta$：给定了步长$\eta$，我们就可以用公式（7）和（10）来调整${\alpha\prime}_m$, ${\alpha\prime}_T$和${\alpha\prime}_R$。α值的变化导致所有最优性指标f的变化。 我们用Δf来表示对f的改变，这可以通过从等式（2）导出的以下等式来计算。
$\boldsymbol{y} \odot \boldsymbol{\Delta f} = \eta [-\boldsymbol{Q}_{\mathcal{X}, \mathcal{M}} \Phi+ \boldsymbol{Q}_{\mathcal{X},\mathcal{T}}(C\boldsymbol{1} - \boldsymbol{\alpha}_\mathcal{T}') - \boldsymbol{Q}_{\mathcal{X},\mathcal{R}}\boldsymbol{\alpha}_\mathcal{R}']$


如果步长$\eta$太大，更多的最优性指标往往违反约束条件（5）。 在这里，我们使用方程（11）通过让更新后的$f_i$（其中$ i \in I _ { u } \cup I _ { l } $）刚好违反约束条件（5）来计算步长$\eta$，即$ f _ { i } + \Delta f _ { i } = b $对于$ i \in I _ { u } \cup I _ { l } $。

更新$f$：在更新$\alpha\prime$之后，我们使用等式（2）和（11）更新$f$。 然后，根据约束（5）我们更新集合$ I _ { m } ,I _ { u } $和$ I _ { l } $。

重复计算$eta$和更新$ \alpha ^ { \prime } $和$f$的过程，直到$ \mathcal R $为空。

终止：当集合$R$为空时，SVM可能不是最优的，因为集合$T$可能不是空的。 从上述过程获得的阿尔法值作为下一个SVM的初始阿尔法值。 为了获得最佳SVM，我们使用SMO来调整初始$\alpha$值，直到满足最优条件。 完整算法的伪代码显示在Wen等人的算法1中（2016）。


### 3.3 多样本替换优化方法
ATO的限制是它需要调整所有的$\alpha$值，无限次（即直到$ \mathcal R $为空）。 因此，初始化$\alpha$值的成本可能非常高。 接下来，我们提出只需调整一次$ \alpha _ { T } ^ { \prime } $的多实例替换（Multiple Instance Replacement, MIR）算法。 两轮之间的共享实例的$\alpha$值保持不变（即$ \alpha _ { S } ^ { \prime } = \alpha _ { S } $），直觉是许多支持向量倾向于保持不变。 MIR的关键思想是立即用$ \mathcal T $替换$ \mathcal R $。

我们从前一个SVM获得$ \mathcal S $和$ \mathcal R $中实例的$\alpha$值，这些$\alpha$值满足以下约束条件。

$\sum_{s \in I_\mathcal{S}}{y_s\alpha_s} + \sum_{r \in I_\mathcal{R}}{y_r\alpha_r} = 0$


在下一轮SVM k-fold交叉验证中，删除 $\mathcal R $并添加 $\mathcal T $. 在重新使用$\alpha$值时，我们应该保证上面的约束条件成立。 为了提高初始化$\alpha$值的效率，我们在约束（12）的第一项中不改变$\alpha$值。例如，$ \sum _ { s \in I _ { S } } y _ { s } \alpha _ { s } $


为了满足上述约束条件，将$ \mathcal R $替换为$ \mathcal T $后，只需要确保$ \sum _ { r \in I _ { R } } y _ { r } \alpha _ { r } = \sum t \in I _ { T } y _ { t } \alpha _ { t } ^ { \prime } $。 接下来，我们提出一种计算$\alpha\prime_T$的方法。

根据等式（2），我们可以在将$R$替换为$T$之前重写$f_i$，如下所示。
$f_i = y_i(\sum_{r \in I_\R}{\alpha_r Q_{i, r}} + \sum_{s \in I_\Ss}{\alpha_s Q_{i, s}} - 1)$


在用$T$代替$R$之后，可以如下计算$f_i$。

$f_i = y_i(\sum_{t \in I_\mathcal{T}}{\alpha_t' Q_{i, t}} + \sum_{s \in I_\mathcal{S}}{\alpha_s' Q_{i, s}} - 1)$


其中$\alpha\prime_s = \alpha_s$，即$S$中的$\alpha$值保持不变。我们可以通过从等式（14）中减去等式（13）来计算$f_i$的变化，用$ \Delta f _ { i } $表示。 然后，我们有下面的等式。

$\Delta f_i = y_i[\sum_{t \in I_\mathcal{T}}{\alpha_t' Q_{i, t}} - \sum_{r \in I_\mathcal{R}}{\alpha_r Q_{i, r}}]$


为了满足在用$\cal{T}$代替$\cal{R}$之后的约束$ \sum y _ { i } \alpha _ { i } = 0 $，我们有下面的等式。

$\sum_{s \in I_\mathcal{S}}{y_s\alpha_s} + \sum_{r \in I_\mathcal{R}}{y_r\alpha_r} = \sum_{s \in I_\mathcal{S}}{y_s\alpha_s'} + \sum_{t \in I_\mathcal{T}}{y_t \alpha_t'}$


由于$\alpha\prime_s=\alpha_s$，我们重写上面的等式如下。
$\sum_{r \in I_\mathcal{R}}{y_r\alpha_r} = \sum_{t \in I_\mathcal{T}}{y_t \alpha_t'}$


等式（15）和（16）写在一起的话得到如下等式。

![](/images/media/15210173685421.jpg)

类似于我们在ATO算法中计算$\Delta f_i$的方式，给定$i$在$I_u \cup I_l$中，我们通过确保$f_i+\Delta f_i = b$（参见约束条件（5））来计算$\Delta f_i$。 给定$I_m$，我们设定$\Delta f_i = 0$，因为我们试图避免$f_i$违反约束条件（5）。 一旦我们得到了$\Delta f$，方程（17）中唯一未知的就是$\alpha \prime_T$。

找到一个$\alpha \prime _T$的近似解：等式（17）中所示的线性系统可能没有对应的解。 这是因为$\alpha\prime_S$也可能需要调整，但在等式（17）中未考虑。 在这里，我们通过使用线性最小二乘法（Lawson和Hanson 1974）找出方程（17）的近似解αT，得到如下的等式。

![](/images/media/15210273855513.jpg)

然后我们可以使用下面的等式计算$\alpha\prime _T$。
![](/images/media/15210276717556.jpg)

如果上述方程中的矩阵的逆不存在，我们找到与ATO类似的伪逆。

调整$\alpha\prime _T$： 由于就到的$\alpha\prime _t$是近似解，约束条件$0\le\alpha\prime _t\le C$和$\Sigma_{r\in I_R}y_r\alpha_r = \Sigma_{t\in I_T}y_t\alpha\prime _t$可能不成立。因此，我们需要调整$\alpha\prime _T$以满足约束，我们执行以下步骤。

* 如果$\alpha\prime _t \lt 0$，我们设$\alpha\prime _t = 0$; 如果$\alpha\prime _t \gt 0$，我们设$\alpha\prime _t = C$。
* 如果$\Sigma_{I_{\cal{T}}}y_t\alpha\prime _t \gt \Sigma_{I_{\cal{R}}}y_r\alpha _r$（如果$\Sigma_{I_{\cal{T}}}y_t\alpha\prime _t \lt \Sigma_{I_{\cal{R}}}y_r\alpha _r$），我们统一减少（增加）所有的$y_t\alpha\prime _t$直到$\Sigma_{I_{\cal{T}}}y_t\alpha\prime _t = \Sigma_{I_{\cal{R}}}y_r\alpha _r$，受到约束$0\le \alpha\prime _t \le C$.

经过上述调整，$\alpha\prime _t$满足约束$0\le \alpha\prime _t \le C$且$\Sigma_{I_{\cal{T}}}y_t\alpha\prime _t \gt \Sigma_{I_{\cal{R}}}y_r\alpha _r$。 那么，我们使用SMO和$\alpha\prime$（其中$\alpha\prime=\alpha\prime_{\cal{S}} \cup\alpha\prime_{\cal{T}}$）作为训练最优SVM的初始α值。Wen等人的算法2给出了整个算法的伪码（2016）。


### 3.4 单样本替换优化方法
ATO和MIR都有以下主要限制：计算$\alpha\prime_T$是昂贵的（例如需要计算矩阵的逆矩阵）。 ATO和MIR的目标是最大限度地减少违反最优条件的实例数量。 在我们这里提出的算法中，我们试图最小化$\Delta f_i$，希望$f_i$的小改变不会违反最优性条件。 这个目标的轻微变化导致计算$\alpha\prime_T$的计算成本大大降低。我们的主要想法是用$\cal{T}$中的类似实例一个接一个地替换$\cal{R}$中的实例。 由于我们每次用$\cal{T}$中的实例替换$\cal{R}$中的一个实例，我们称之为单实例替换（Single Instance Replacement, SIR）算法。 接下来，我们介绍SIR算法的细节。

根据等式（2），我们可以如下重写先前的SVM的$f_i$。

$f_i = y_i(\sum_{j \in I_\mathcal{S} \cup I_\mathcal{R} \setminus \{p\}}{\alpha_j Q_{i, j}} +	  \alpha_p Q_{i, p} - 1)$

其中 $p \in I_{\cal{R}}$。我们用$x_q$代替训练实例$x_p$，其中$q\in I_{\cal{T}}$，然后用$x_q$代替$x_p$后的$f_i$的值如下。

$f_i = y_i(\sum_{j \in I_\mathcal{S} \cup I_\mathcal{R} \setminus \{p\}}{\alpha_j Q_{i, j}} + \alpha_q' Q_{i, q} - 1)$


其中$\alpha\prime_q = \alpha_p$,通过从等式（20）中减去等式（19），由$\Delta f_i$表示的$f_i$的变化可以通过$\Delta f_i = y_i\alpha_p(Q_{i,q}-Q_{i,p})$来计算。 回想一下$Q_{i,j}=y_iy_jK(x_i,x_j)$。 我们可以按如下方式写出$\Delta f_i$。

$\Delta f_i = \alpha_p (y_q K(\boldsymbol{x}_i, \boldsymbol{x}_q) - y_p K(\boldsymbol{x}_i, \boldsymbol{x}_p))$


回想一下，在SIR中，我们想用$x_q$表示一个实例来代替$x_p$，这个实例使$\Delta f_i$最小化。当$\alpha_p=0$时，在将$x_p$替换为$x_q$后，$\Delta f_i$没有变化。 在下文中，我们关注$\alpha_p \gt 0$的情况。

如果$x_q$是$\cal{T}$中所有实例中$x_p$的“最相似”实例，我们建议用$x_q$代替$x_p$。 当满足以下两个条件时，实例$x_q$被称为与$\cal{T}$中所有实例之间的实例$x_p$最相似。

* $x_p$和$x_q$具有相同的标签，即$x_p = x_q$。
* 对于所有$x_t \in \cal{T}$，$K(x_p, x_q)\ge K(x_p, x_t)$。

请注意，在第二种情况下，我们使用核函数近似两个实例之间的相似性的事实（Balcan，Blum和Srebro 2008）。 如果我们可以找到与$\cal{R}$中每个实例最相似的实例，那么约束$\Sigma_{s\in I_{\cal{S}}}y_{s}\alpha\prime_{s} + \Sigma_{t\in I_{\cal{T}}}y_{t}\alpha\prime_{t} = 0$将在替换R之后被T满足。而如果我们找不到T中与$x_p$具有相同标签的任何实例，我们从$\cal{T}$中随机选取一个实例来替换$x_p$。 当上述情况发生时，违反了约束$\Sigma_{s\in I_{\cal{S}}}y_{s}\alpha\prime_{s} + \Sigma_{t\in I_{\cal{T}}}y_{t}\alpha\prime_{t} = 0$。 因此，我们需要调整$\alpha\prime_{\cal{T}}$以使约束成立。 我们使用与MIR相同的方法来调整$\alpha\prime_{\cal{T}}$。SIR的伪代码在Wen等人的算法3中给出（2016）。

## 第四章 基于 Warm Start 和 GPU 加速的支持向量机参数选择优化
已知训练SVM是耗时的，特别是当使用非线性核函数时。核化的SVM通常比线性SVM效果会更好，但是也相对更耗时。 选择合适的参数对于获得有效的SVM非常重要。 但是，参数选择过程非常昂贵，因为需要对许多SVM进行培训和评估。

这项工作旨在提高SVM参数选择的效率。 特别是，我们利用先前训练的SVM来初始化当前的SVM以实现更快的收敛。 为了进一步加速参数选择过程，我们利用图形处理单元（GPU）加速初始化和训练过程。

我们使用的技术包括α播种[1]和暖启动[2]。 我们在这项工作中的贡献总结如下。

* 这是探索非线性SVM的首次工作。 我们设计了新的技术来重用先前交叉验证中训练的SVM和先前训练过当前交叉验证的SVM以训练当前SVM。
* 为了进一步改进参数选择过程，我们开发了高度优化的基于GPU的算法，以加速初始化和训练。
* 我们进行了全面的实验，以研究我们提出的技术与现有技术（如α播种和热启动）相比的有效性。

### 4.1 复用训练好的交叉验证过程中的支持向量机
在本节中，我们介绍我们的技术，重用最后一次交叉验证的SVM来训练当前的SVM。 我们选择使用与当前SVM相同的训练数据集进行最后一次交叉验证训练的SVM，与以前有关线性SVM的热启动[2]相同。 接下来，我们提供将在我们提出的技术中使用的最优条件。

在SMO中，训练实例被划分为以下五个组。
$I_{0} = \{i | \boldsymbol{x}_i \in \mathcal{X}, 0 < \alpha_i < C\},  \\ I_{1} = \{i | \boldsymbol{x}_i \in \mathcal{X}, y_i = +1, \alpha_i = 0\}, \\ I_2 = \{i | \boldsymbol{x}_i \in \mathcal{X}, y_i = -1, \alpha_i = C\},  \\
I_{3} = \{i | \boldsymbol{x}_i \in \mathcal{X}, y_i = +1, \alpha_i = C\}, \\
I_4 = \{i | \boldsymbol{x}_i \in \mathcal{X}, y_i = -1, \alpha_i = 0\}.  $


设$I_m = I_0$, $I_u = I_1 \cup I_2$ 以及$I_l = I_3 \cup I_4$。 正如Keerthi[3]等人所观察到的那样, 最佳条件（即KKT条件）等同于以下约束条件。
$f_i > b \text{ for } i \in I_u;  f_i = b \text{ for } i \in I_m;  f_i < b \text{ for } i \in I_l$


其中b是超平面的偏差。 由于我们想要重用的SVM已经在最后的交叉验证中进行了训练，因此给定超参数（例如C）时，最优条件已满足。

当将$C$增加到$\Delta C$（其中$\Delta \gt 1$）时，$I_0$，$I_1$和$I_4$中的所有实例都满足最优条件，因为$C$的变化并不直接影响这些实例的最优条件。相比之下，$I_2$和$I_3$中的实例违反了最优条件，因为当$C$增加到$\Delta C$时，这些实例变成自由支持向量，即$I_2 \cup I_3$中的实例移动到$I_0$。更具体地说，对于任何具有$i \in I_2 \cup I_3$的实例，其最优性指标$f_i \neq b$。 由于$C$增加到$\Delta C$的变化，$i$ 被移到$I_0$，因此违反了最佳条件。 这是因为$f_i$不变（即$f_i \neq b$），但具有新参数的SVM的最优条件需要$f_i = b$。

根据以上分析，只有$I_1 \cup I_2$中的实例违反了最优条件，而其余实例满足最优条件。 一种天真的方法是使用先前的交叉验证的SVM直接初始化当前的SVM。 然后，使用SMO调整$\alpha$值直到达到最佳条件。 但是，SMO只会在每次迭代时更新两个alpha值，并且还需要计算许多内核值。

接下来，我们建议只调整$I_2 \cup I_3$中的实例的alpha值，以便更好地进行初始化，这可能会导致更快的收敛。

### 4.2 调整$i$在$I_2 \cup I_3$中的$\alpha_i$
由于$I_2$和$I_3$中的实例违反了KKT条件，目标函数可能会得到改善。 由于我们对当前的SVM有一些先验知识，因此我们可以更好地初始化当前的SVM，而不是直接在以前的交叉验证中使用SVM。我们的主要想法是以增加目标函数的方式更新$I_2$和$I_3$中的$\alpha$值。根据对偶问题的线性P约束（即$\Sigma \alpha_i y_i = 0$），我们需要修改至少两个$\alpha$值。 这里我们讨论修改两个$\alpha$值的方法，这会导致目标函数的增加。

回想一下对偶问题可以写成如下。

![](/images/media/15211263505540.jpg)

我们可以如下改写对偶问题的目标函数：
$\sum_{i=1, i \neq j}^{n}{\alpha_i}- \frac{1}{2}\sum_{i=1, i\neq j}^n\sum_{k=1, k\neq j}^n  y_i y_k \alpha_i\alpha_k K(\boldsymbol{x}_k, \boldsymbol{x}_i) \\
- \frac{1}{2}y_j \alpha_j\sum_{i=1, i\neq j}^n  y_i \alpha_i K(\boldsymbol{x}_j, \boldsymbol{x}_i)\\
+ \alpha_j - \frac{1}{2}y_j \alpha_j \sum_{i=1}^n y_i \alpha_i K(\boldsymbol{x}_j, \boldsymbol{x}_i)$


接下来，我们解释最后两个术语，即$\alpha_j - \frac{1}{2}\alpha_j y_j\sum_{i=1}^n y_i \alpha_i K(\boldsymbol{x}_j, \boldsymbol{x}_i)$


我们可以用下面的形式重写这两个术语：
$\alpha_j y_j (y_j - \frac{1}{2}\sum_{i=1}^n y_i \alpha_i K(\boldsymbol{x}_j, \boldsymbol{x}_i))$


对偶问题的线性约束表明$\Sigma_{i=1}^n \alpha_i y_i = 0$; 核函数的值近似于两个实例的相似度，因此$K(x_j, x_i)\in[0,1]$。

实际上，使用高斯核函数计算的核值总是$[0, 1]$中的。 因此，$\Sigma_{i=1}^n \alpha_i y_iK(x_j, x_i)$的范围是$[-{1\over2}C, {1\over2}C]$。 当所有$\alpha$等于$C$，$y_i\alpha_i=-C$且$K(x_j, x_i)=1$；$y_i\alpha_i=C$和$K(x_j, x_i)=0$时，能达到最小值（即$-{1\over2}C$），对于取得最大值的情况也类似这里最小值的分析。

根据最优性指标的定义$f_j = \sum_{i=1}^n y_i \alpha_i K(\boldsymbol{x}_j, \boldsymbol{x}_i) - y_j$，我们能得到$f_j \in [-\frac{n}{2}(C + 2), \frac{n}{2} (C + 2)]$以及以下的公式。
$\alpha_j y_j (y_j - \frac{1}{2}\sum_{i=1}^n y_i \alpha_i K(\boldsymbol{x}_j, \boldsymbol{x}_i)) = \frac{1}{2} \alpha_j y_j (y_j - f_j)$

同样，我们如下可以得到（4）中的第三项。
$\frac{1}{2}y_j \alpha_j\sum_{i=1, i\neq j}^n  y_i \alpha_i K(\boldsymbol{x}_j, \boldsymbol{x}_i) = \frac{1}{2}y_j \alpha_j (f_j + y_j - y_j \alpha_j K(\boldsymbol{x}_j, \boldsymbol{x}_j))$

让我们考虑以下两种情况。 请注意，我们只考虑$\alpha_j = C$的实例，因为只有这些实例违反了最优条件。

#### 4.2.1 正例的调整
如果我们将$C$增加到$\Delta C$，则（6）式的变化量是$\Delta C \frac{1}{2} (1 - f'_j) - C  \frac{1}{2} (1 - f_j) = \frac{1}{2}(\Delta C - C) + \frac{1}{2}(f_j - f'_j)$。 使用$f_j$的定义，我们有$f_j - f'_j = (C - \Delta C) K(\boldsymbol{x}_j, \boldsymbol{x}_j)$。 因此，（6）式的变化等于$\frac{1}{2}(\Delta C - C) + \frac{1}{2}(C - \Delta C) K(\boldsymbol{x}_j, \boldsymbol{x}_j) = \frac{1}{2}(\Delta C - C)(1 - K(\boldsymbol{x}_j, \boldsymbol{x}_j))$。

当$C$增加到$\Delta C$时，（7）式的变化为$(\frac{1}{2}\Delta C + \frac{1}{2}C)(f_j + 1 - C \cdot K(\boldsymbol{x}_j, \boldsymbol{x}_j)) = \frac{1}{2}(C - \Delta C)(f_j + 1 - C \cdot K(\boldsymbol{x}_j, \boldsymbol{x}_j))$。

因此，目标函数的变化是
$\frac{1}{2}(\Delta C - C)(1 - K(\boldsymbol{x}_j, \boldsymbol{x}_j)) + \frac{1}{2}(C - \Delta C)(f_j + 1 - C \cdot K(\boldsymbol{x}_j, \boldsymbol{x}_j)) \\ = \frac{1}{2}(\Delta C - C)(1 - K(\boldsymbol{x}_j, \boldsymbol{x}_j) - f_j - 1 + C \cdot K(\boldsymbol{x}_j, \boldsymbol{x}_j))\\ = \frac{1}{2}(\Delta C - C)((C - 1)K(\boldsymbol{x}_j, \boldsymbol{x}_j) - f_j)$

由于我们想要改进目标函数（即增加它的值），所以我们更新$f_j$满足以下约束条件的实例。

$\frac{1}{2}(\Delta C - C)((C - 1)K(\boldsymbol{x}_j, \boldsymbol{x}_j) - f_j) > 0\\ \Leftrightarrow f_j < (C - 1)K(\boldsymbol{x}_j, \boldsymbol{x}_j)$

在满足上述约束的所有实例中，我们更喜欢选择$f_j$较小的实例，这导致目标函数的增加较大。

影响另一个最优指标：当我们将$\alpha_j$从$C$增加到$\Delta C$时，最优指标 $f_i$ 增加 $(\Delta C - C)K(\boldsymbol{x}_i, \boldsymbol{x}_j)$。


#### 4.2.2 负例的调整
当样本是负例的情况，$y_j = -1$，因此$\alpha_j y_j = -C$; 如果我们将$C$增加到$\Delta C$，则（6）式的变化是$\Delta C \frac{1}{2} (1 + f'_j) - C  \frac{1}{2} (1 + f_j) = \frac{1}{2}(\Delta C - C) + \frac{1}{2}(f'_j - f_j)$。 通过$f_j$的定义，我们有$f'_j - f_j = (\Delta C - C) K(\boldsymbol{x}_j, \boldsymbol{x}_j)$。 那么，（6）式的变化等于$\frac{1}{2}(\Delta C - C) + \frac{1}{2}(\Delta C - C) K(\boldsymbol{x}_j, \boldsymbol{x}_j) = \frac{1}{2}(\Delta C - C)(1 + K(\boldsymbol{x}_j, \boldsymbol{x}_j))$。

当$C$增加到$\Delta C$时，（7）式的变化量是$\frac{1}{2}(\Delta C - C)(f_j - 1 + C \cdot K(\boldsymbol{x}_j, \boldsymbol{x}_j))$。

因此，目标函数的变化是$\frac{1}{2}(\Delta C - C)(1 + K(\boldsymbol{x}_j, \boldsymbol{x}_j)) + \frac{1}{2}(\Delta C - C)(f_j - 1 + C \cdot K(\boldsymbol{x}_j, \boldsymbol{x}_j))\\ = \frac{1}{2}(\Delta C - C)(1 + K(\boldsymbol{x}_j, \boldsymbol{x}_j) + f_j - 1 + C \cdot K(\boldsymbol{x}_j, \boldsymbol{x}_j))\\ = \frac{1}{2}(\Delta C - C)((C + 1)K(\boldsymbol{x}_j, \boldsymbol{x}_j) + f_j )$

当我们想要最大化目标函数时，我们更新$f_j$满足以下约束条件的实例。

$\frac{1}{2}(\Delta C - C)((C + 1)K(\boldsymbol{x}_j, \boldsymbol{x}_j) + f_j ) > 0\\ \Leftrightarrow f_j > -(C + 1)K(\boldsymbol{x}_j, \boldsymbol{x}_j)$

在满足上述约束的所有实例中，我们更喜欢选择具有较大$f_j$的实例，这导致目标函数的较大增加。

对另一个最优性指标的影响：当我们将$\alpha_j$从$C$增加到$\Delta C$时，最优性指标$f_i$减少$(\Delta C - C)K(\boldsymbol{x}_i, \boldsymbol{x}_j)$。

#### 4.2.3 成对更新样本
为了考虑更有针对性，我们更新一对类别相对应的样本（即一个正实例和一个负实例）的$\alpha$值，会有两个好处。我们用$\boldsymbol{x}_u$和$\boldsymbol{x}_v$来表示这一对样本，给定$y_u = 1$和$y_v = -1$。 首先，对偶问题的线性约束条件（即$\sum_{i=0}^n y_i \alpha_i = 0$）始终保持不变，其原因如下：第二，最优指标的变化是摊销的，因为$\alpha_u$的更新导致所有最优指标的增加，而$\alpha_v$的更新导致所有最优指标的降低。


### 4.3 基于 Warm Start 的参数选择加速过程。
我们使用（3）式来训练SVM，并且我们获得所有训练实例。（1）式中描述的训练实例被分成五个组。如果我们将$C$增加到$C\prime$（$C\prime \gt C$），则$I_2$和$I_3$中的实例将移至$I_0$。 随着$C$增加到$C\prime$，最优条件将被违反。更具体地说，对于任何具有$i \in I_2 \cup I_3$的实例，最优性指标$f_i \neq b$。 接下来，我们尝试调整$I_2 \cup I_3$中的实例的$\alpha$值以获得更快的收敛。

#### 4.3.1 调整$i$在$I_2 \cup I_3$中的$\alpha_i$
我们知道，原始KKT最优条件非常复杂。 在收敛时，模型应该具有一些等式和不等式。 Keerthi等人 [3]用简单的方式表示原始KKT最优条件。

定义：
$b_{up}(\alpha)= min\{F_i: i \in I_0(\alpha)\cup I_1(\alpha)\cup I_2(\alpha)\}\\ b_{low}(\alpha)= max\{F_i: i \in I_0(\alpha)\cup I_3(\alpha)\cup I_4(\alpha)\}$

最优值将会稳定在某个$\alpha$值当且仅当下面的式子成立

$b_{low} \leq b_{up}$

当参数$C$增加到$C\prime$时，I 2∪I 3中的实例移动到$I_0$。 我们定义$I_2 \cup I_3$，所以$b_{up}$ 和 $b_{low}$可以写成：

$b_{up}(\alpha)= min\{F_i: i \in I_0^\prime(\alpha)\cup I_1(\alpha)\}\\b_{low}(\alpha)= max\{F_i: i \in I_0^\prime(\alpha)\cup I_4(\alpha)\}$

$I_0^\prime = I_0 \cup I_{2} \cup I_{3}$中的实例在$b_{up}$和$b_{low}$中是共同的，因此当$C$增加到$C\prime$时，最优性条件$b_{up} \le b_{low}$可能不成立。 $I_{2} \cup I_{3}$中的实例违反了（1）中描述的最优条件$f_i = b$，所以我们调整$I_{2} \cup I_{3}$中的实例以获得更好的初始化。 回想（3）中的SVM的双重问题。 这个问题的目标是最大化目标函数。 因此，我们调整$I_{2} \cup I_{3}$中的实例，使目标函数增加最快的方向。


## 5.3 参数选择的实验优化

对于参数选择算法我们使用来自LibSVM网站的六个数据集madelon, ijcnn, webspam (trigram version), news20, rcv1, and yahoo-japan对我们提出的算法进行了实际评估。如下表所示，最后一列我们列出了最合适的C值，可以通过实验进行对比。我们从三个方面评估提出的 Warm Start 算法，首先对采用 Warm Start 算法前后的性能做了比较，这个实验主要考虑在每一个新的参数下，我们的 Warm Start 算法能够有多大的提升。然后在进行第二个实验，看参数选择过程的在采用Warm Start算法前后的性能比较，同时为了能够进一步在速度上的优化，我们实现了在GPU上的版本做一个对比。最后第三个实验结合交叉验证评估训练的SVM模型进一步检验了Warm Start和Alpha Seeding算法的有效性。

![](/images/media/15222134095720.jpg)



### 5.3.1 参数选择算法的性能（单轮比较，目的：证明我们的Warm start是能加速的，排除gpu的影响）
本节实验验证在采用 Warm Start 算法前后，参数选择性能的提升情况。实验对于每一个数据集都设定了一定的参数选择区间，例如在ijcnn数据集中，C取值从1开始，取步长delta为2，然后依次选取参数值2，4，8，……，512，用这十个参数来分别训练SVM，找到对应性能最好的支持向量机的参数。在使用第一个参数的时候，因为刚开始模型的所有权重都为零，所以，第一轮训练没有办法使用Warm Start算法，于是我们分开第一轮和剩下的九轮做比较。为了避免列表过长（这里有时间可以改成像那篇论文那样的用五个图展示。），后面九轮的训练结果我们采用了平均值的结果展示，结果如下图所示：

（可以画图，通过对三种策略的描述来画图。目前先用平均数来展示。）

|  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | AVG |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| madelon | 123/34 |  |  |  |  |  |  |  |  |  |  |
| ijcnn |  |  |  |  |  |  |  |  |  |  |  |
| webpam |  |  |  |  |  |  |  |  |  |  |  |
| rcv1 |  |  |  |  |  |  |  |  |  |  |  |
| yahoo-japan |  |  |  |  |  |  |  |  |  |  |  |
| news20 |  |  |  |  |  |  |  |  |  |  |  |


十个C值，第六个为最优。

作为没有使用Warm Start的第一轮结果我们可以看出，Warm Start算法的三种选择策略均比传统的LibSVM的效率高。而在后九轮训练的平均耗时中，我们可以看到，在Webspam的数据集下，Multiple的策略效果是最好的，其他数据集使用Single策略效果更为明显一些，分析认为在数据量比较大的时候，采用single方式去遍历寻找正负例的对应点会相对更耗时。从表中展示的结果可以看到在ijcnn数据集中，Warm Start 算法从第二轮开始在效率上提升的优势明显好过其他的数据集，分析认为是数据集中样本比较稀疏，导致归类到I2和I3集合中的样本点比较少，于是需要调整的样本点比较少，从而在加速效果上更为明显。

### 5.3.2 参数选择过程的优化性能（多轮比较，目的：比较引进GPU的加速）

在本节实验中我们比较在采用Warm Start算法前后的完成参数选择过程的性能，为了验证GPU加速对算法性能提升程度的影响，在实验中作了使用GPU前后的效果对比。在实验中我们尽量控制了交叉验证过程对参数选择过程中GPU和Warm Start优化的影响，实验数据中记录的结果没有包含我们用做验证时做三折交叉验证的时间。

|  | Libsvm | AllZero | Single | Multiple |
| --- | --- | --- | --- | --- |
| madelon |  | 123/gpu |  |  |
| ijcnn |  |  |  |  |
| webspam |  |  |  |  |
| rcv1 |  |  |  |  |
| yahoo-japan |  |  |  |  |
| news20 |  |  |  |  |

实验表明当在一定范围内的网格搜索下分别在六个数据集上选取不同的六个参数进行参数选择，我们提出的Warm Start算法的三个策略效果均比传统的LibSVM效果好。在这三个策略中可以从表格中看出大部分数据集实验中，成对选择策略的效果比直接替换和多样本平均化处理策略的效果要好。

### 5.3.3 结合交叉验证过程的参数选择优化性能（加上AS，目的：比较提出的两个算法结合起来对参数选择过程的提升有多大影响）
最后我们结合交叉验证进行支持向量机参数选择完整过程的实验，同样采取以上六个数据集，针对每一个数据集采用一定范围内的网格搜索进行参数选择，对于每一个选择得到的参数，我们采用交叉验证来评估该参数下的支持向量机模型的性能，为了防止有效控制整体的实验时长，我们这里的交叉验证采用三折交叉验证。

**数据**

从上图可以才看出，我们在本文提出的基于Alpha Seeding的交叉验证优化算法和基于Warm Start的参数选择优化算法对支持向量机完成的参数选择过程进行较大程度的改进，使得支持向量机的参数选择过程在日后的实践过程中得以高效使用。

---

向量是描述空间的对象。
矩阵是描述空间中的线性变换。
相似矩阵是针对同一种变换的描述。


### 1.2.2 交叉验证
https://en.wikipedia.org/wiki/Cross-validation_(statistics)

这一节，我们就交叉验证的研究现状进行一个梳理，理清交叉验证的来龙去脉，看看国内外研究者们都进行了哪些工作，以及各自从哪些方面进行了研究，这将有助于我们明确历史脉络，更好的了解交叉验证方法。

似然最大化，最小二乘和经验对比度最小化需要选择一些模型，即一个估计器将返回的集合。让我们称数据中返回估计量的函数为统计算法，例如某个给定模型的最大化似然。那么，模型选择可以被看作是一个特殊的统计算法选择问题。

CV的普及主要来自数据分裂启发式的“普遍性”。尽管如此，根据模型选择、估计或识别的目标，一些CV程序已被证明对某些模型选择问题并不有效。此外，关于CV的许多理论问题仍然值得讨论和研究。







---
layout: post
title: Field-aware Factorization Machines
subtitle: 场感知因子分解机 (FFM)
author: Bin Li
tags: [Machine Learning, Recommender System]
image: 
comments: true
published: true
---

　　场感知因子分解机（Field-aware Factorization Machine，FFM）就是在因子分解机上加入了场的概念。FM 中一个特征只对应一个隐向量，而在实际场景中特征和不同场的特征交互时应该使用不同的向量，这就是 FFM 的创作动机。

　　FFM 需要实现将特征按照规则分成多个场（Field），每一个特征被映射到多个隐向量 $v_{i 1}, \dots, v_{i f}$，每个隐向量对应一个场。当两个特征 $x_i$ 和 $x_j$ 组合时，就采用对应场的隐向量做内积即可：

$$
w_{i j}=\mathbf{v}_{i, f_{j}}^{T} \mathbf{v}_{j, f_{i}}
$$

## 1. FFM 引入
　　假设样本一共有 $n$ 个特征，$f$ 个场，则 FFM 的二次项有 $nf$ 个隐向量。FM 只有一个隐向量，可以看成是 FFM 的一个特例。

　　FFM 的决策函数可以写出来如下：

$$
\widehat{y}(\mathbf{x})=w_{0}+\sum_{i=1}^{n} w_{i} x_{i}+\sum_{i=1}^{n} \sum_{j=i+1}^{n}\left\langle\mathbf{v}_{i, f_{j}}, \mathbf{v}_{j, f_{i}}\right\rangle x_{i} x_{j}
$$

　　其中 $f_j$ 是第 $j$ 个特征所属的场。如果隐向量的长度为 $k$，那么 FFM 的二次参数有 $nfk$ 个，远多于 FM 模型的 $nk$ 个。此外，由于隐向量与场相关，因此 FFM 二次项并不能够化简，其预测复杂度是 $O(kn^2)$。


## 2. FFM 优化
　　FFM 作者在优化时，省去了决策函数中的常数项和一次项，且隐向量用常见的 $\mathbf{w}$ 表示，如下：

$$
\phi_{F F M}(\mathbf{w}, \mathbf{x})=\sum_{i=1}^{n} \sum_{j=i+1}^{n} w_{i, f_{j}} \cdot w_{j, f_{i}} x_{i} x_{j}
$$

　　假如我们采用 logloss，那么损失函数为：

$$
L_{F F M}=f(\mathbf{w}, \mathbf{x})=\frac{\lambda}{2}\|\mathbf{w}\|_{2}^{2}+\sum_{i=1}^{m} \log \left(1+\exp \left(-y_{i} \phi_{F F M}\left(\mathbf{w}, \mathbf{x}_{i}\right)\right)\right) \tag{4}
$$

　　其中 $m$ 为样本总个数，$y$ 的取值为 -1 和 +1。

　　优化方法可以采用 AdaGrad 优化算法，基于随机梯度下降来进行。

![](/img/media/15831387863164.jpg)

　　在随机梯度的每一步中，对数据点 $(y, \mathbf{x})$ 进行采样，并更新公式（4）中的 $w_{j_1,f_2}$ 和 $w_{j_2,f_1}$。因为 $\mathbf{x}$ 在 CTR 中是 onehot 表示，而且非常稀疏，这里只更新有非零值的维度。

$$
\boldsymbol{g}_{j_{1}, f_{2}} \equiv \nabla_{\boldsymbol{w}_{j_{1}, f_{2}}} f(\boldsymbol{w})=\lambda \cdot \boldsymbol{w}_{j_{1}, f_{2}}+\kappa \cdot \boldsymbol{w}_{j_{2}, f_{1}} x_{j_{1}} x_{j_{2}} \tag{5}
$$

$$
\boldsymbol{g}_{j_{2}, f_{1}} \equiv \nabla_{\boldsymbol{w}_{j_{2}, f_{1}}} f(\boldsymbol{w})=\lambda \cdot \boldsymbol{w}_{j_{2}, f_{1}}+\kappa \cdot \boldsymbol{w}_{j_{1}, f_{2}} x_{j_{1}} x_{j_{2}} \tag{6}
$$

　　其中运用到了链式法则，并且有：

$$
\kappa=\frac{\partial \log \left(1+\exp \left(-y \phi_{\mathrm{FFM}}(\boldsymbol{w}, \boldsymbol{x})\right)\right)}{\partial \phi_{\mathrm{FFM}}(\boldsymbol{w}, \boldsymbol{x})}=\frac{-y}{1+\exp \left(y \phi_{\mathrm{FFM}}(\boldsymbol{w}, \boldsymbol{x})\right)}
$$

　　然后，对每个隐向量的维度 $d=1,2,\dots,k$，累积梯度平方的和：

$$
\left(G_{j_{1}, f_{2}}\right)_{d} \leftarrow\left(G_{j_{1}, f_{2}}\right)_{d}+\left(g_{j_{1}, f_{2}}\right)_{d}^{2} \tag{7}
$$

$$
\left(G_{j_{2}, f_{1}}\right)_{d} \leftarrow\left(G_{j_{2}, f_{1}}\right)_{d}+\left(g_{j_{2}, f_{1}}\right)_{d}^{2} \tag{8}
$$

　　最后，参数 $\left(w_{j_1, f_2}\right)_d$ 和 $\left(w_{j_2, f_1}\right)_d$ 得以更新：

$$
\left(w_{j_{1}, f_{2}}\right)_{d} \leftarrow\left(w_{j_{1}, f_{2}}\right)_{d}-\frac{\eta}{\sqrt{\left(G_{j_{1}, f_{2}}\right)_{d}}}\left(g_{j_{1}, f_{2}}\right)_{d} \tag{9}
$$

$$
\left(w_{j_{2}, f_{1}}\right)_{d} \leftarrow\left(w_{j_{2}, f_{1}}\right)_{d}-\frac{\eta}{\sqrt{\left(G_{j_{2}, f_{1}}\right) _d}}\left(g_{j_{2}, f_{1}}\right)_{d} \tag{10}
$$

　　其中 $\eta$ 为步长，$\mathbf{w}$ 的初始化是通过从均匀分布 $[0,1 / \sqrt{k}]$ 中随机采样，为了防止 $\left(G_{j_1, f_{2}}\right)_d^{-\frac{1}{2}}$ 值过大，$G$ 的初始值设置为 $1$。

　　可以看出，随着迭代的进行，每个参数的历史梯度会慢慢累加，导致每个参数的学习率逐渐减小。另外，每个参数的学习率更新速度是不同的，与其历史梯度有关，根据AdaGrad的特点，对于样本比较稀疏的特征，学习率高于样本比较密集的特征，因此每个参数既可以比较快速达到最优，也不会导致验证误差出现很大的震荡。


## 3. 总结
FFM优点：
* 增加field的概念，同一特征针对不同field使用不同隐向量，模型建模更加准确

FFM缺点：
* 计算复杂度比较高，参数个数为 $nfk$ ，计算复杂度为 $O(kn^2)$

### FFM 实践注意
1. 样本归一化。对样本进行归一化，否则容易造成数据溢出，梯度计算失败
2. 特征归一化。为了消除不同特征取值范围不同造成的问题，需要对特征进行归一化
3. Early stopping。一定要设置该策略，FFM很容易过拟合
4. 省略零值特征。零值特征对模型没有任何贡献，省略零值特征，可以提高FFM模型训练和预测的速度，这也是稀疏样本采用FFM的显著优势

## 4. Q & A
### 4.1 怎么将特征划分到场中？划分多少个场？


## References
1. [深入FFM原理与实践](https://tech.meituan.com/deep_understanding_of_ffm_principles_and_practices.html)
2. [Field-aware Factorization Machines](https://www.csie.ntu.edu.tw/~r01922136/slides/ffm.pdf)
3. [第09章：深入浅出ML之Factorization家族](http://www.52caml.com/head_first_ml/ml-chapter9-factorization-family/)
4. [Papper](/assets/papers/ffm.pdf)
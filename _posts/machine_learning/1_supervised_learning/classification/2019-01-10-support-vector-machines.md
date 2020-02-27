---
layout: post
title: Support Vector Machines
subtitle: 支持向量机
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

　　支持向量机（Support Vector Machines, SVM）是一种二分类模型，是定义在特征空间上间隔最大的线性分类器，间隔最大使之有别于感知机，感知机是对误分类集合样本相关的损失函数越小越好。

　　在给定训练样本 $D=\\{(x_i,y_i)\\}_1^m$，$y_i \in \\{-1, +1\\}$ 中，支持向量机的初始想法是找到一个超平面划分正负样本，使得划分超平面对训练样本局部扰动的容忍性最好。如何体现对局部扰动容忍性最好？

　　可以想象圈住正负例分别有一个边界线，像国家的国界一样，我们想子啊两个国家的边界之间建一条直线河，让这两个国家尽量离得远，井水不犯河水，那么我们能找到的最宽的那条河的中心线就是我们想要的超平面。

## 1. 线性可分情况
### 1.1 Primal Optimization Problem

　　在样本空间中，划分超平面可以用如下线性方程描述：

$$
\boldsymbol{w}^{\mathrm{T}} \boldsymbol{x}+b=0
$$

　　再由点到超平面的距离公式，我们可知样本空间中的点 $x$ 到超平面 $(w,b)$ 的距离为：

$$
\rho(x)=\frac{\left|\boldsymbol{w}^{\mathrm{T}} \boldsymbol{x}+b\right|}{\|\boldsymbol{w}\|}
$$

　　这个距离在支持向量机中其实就是几何距离（2 倍），我们想最大化这个值。

　　假设超平面能正确分类，那么不在超平面上的点 $x$ 就可能是大于零也可能小于零。我们可以把这个大于等于零的方向跟样本类标 $y_i \in \\{-1, +1\\}$ 的正负对应上，这样方便统一式子：

$$
\boldsymbol{y_i}(\boldsymbol{w}^{\mathrm{T}} \boldsymbol{x_i}+b) \ge 0
$$

　　如果所有样本满足以上式子，表示线性可分。但是几何函数加上这个不等式约束不好优化处理，我们尝试进一步简化。几何函数可以表达成：

$$
\rho=\max _{\mathbf{w}, b: y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right) \geq 0} \min _{i \in[m]} \frac{\left|\mathbf{w} \cdot \mathbf{x}_{i}+b\right|}{\|\mathbf{w}\|}=\max _{\mathbf{w}, b} \min _{i \in[m]} \frac{y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right)}{\|\mathbf{w}\|}
$$

　　后面的 min 表示离着超平面最近的样本距离，前面的 max 说明这个最小距离都要尽可能的大，这就是我们的优化目标。因为 $y_i \in \\{-1, +1\\}$，大小不对结果造成影响，且可以平衡正负，使得可以把绝对值符号去掉。

　　再观察上面优化式子的分子部分，如果我们同时对 $w$ 和 $b$ 乘以一个正数，其实是不影响这个优化的式子的，那么，我们就尝试让使得分子部分最小的样本带进去后分子结果为定值 1。这里选择使得分子最小的那个样本做了归一化操作，是不会对其他样本最终的优化结果造成影响，即：

$$
\rho=\max _{\mathbf{w}, b: \atop \min_{i\in [m]}~ y_{i} \left(\mathbf{w} \mathbf{x}_{i}+b\right)=1} \frac{1}{\|\mathbf{w}\|}=\max _{\forall i \in[m], y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right) \geq 1} \frac{1}{\|\mathbf{w}\|}
$$

　　据此我们可以将最大化等价转换为最小化：

$$
\begin{array}{c}{\min _{\mathbf{w}, b} \frac{1}{2}\|\mathbf{w}\|^{2}} \\ {\text { subject to: } y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right) \geq 1, \forall i \in[m]}\end{array}
$$

　　该式子就是所谓的 Primal 优化问题，通过拉格朗日乘子法，可以得到：

$$
\mathcal{L}(\mathbf{w}, b, \boldsymbol{\alpha})=\frac{1}{2}\|\mathbf{w}\|^{2}-\sum_{i=1}^{m} \alpha_{i}\left[y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right)-1\right]
$$

　　由 KKT 条件可以得到：

$$
\begin{array}{ll}{\nabla_{\mathbf{w}} \mathcal{L}=\mathbf{w}-\sum_{i=1}^{m} \alpha_{i} y_{i} \mathbf{x}_{i}=0} & {\Longrightarrow \quad \mathbf{w}=\sum_{i=1}^{m} \alpha_{i} y_{i} \mathbf{x}_{i}} \\ {\nabla_{b} \mathcal{L}=-\sum_{i=1}^{m} \alpha_{i} y_{i}=0} & {\Longrightarrow \quad \sum_{i=1}^{m} \alpha_{i} y_{i}=0} \\ {\forall i, \alpha_{i}\left[y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right)-1\right]=0} & {\Longrightarrow \quad \alpha_{i}=0 \vee y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right)=1}\end{array}
$$

### 1.2 Dual Optimization Problem
　　为了得到对偶形式的优化，我们将用拉格朗日乘子计算式表示 primal 的变量 $w$ 和 $b$：

$$
\mathcal{L}=\underbrace{\frac{1}{2}\left\|\sum_{i=1}^{m} \alpha_{i} y_{i} \mathbf{x}_{i}\right\|^{2}-\sum_{i, j=1}^{m} \alpha_{i} \alpha_{j} y_{i} y_{j}\left(\mathbf{x}_{i} \cdot \mathbf{x}_{j}\right)}_{-\frac{1}{2} \sum_{i, j=1}^{m} \alpha_{i}, y_{i} y_{j}\left(\mathbf{x}_{i} \cdot \mathbf{x}_{j}\right)}-\underbrace{\sum_{i=1}^{m} \alpha_{i} y_{i} b}_{0}+\sum_{i=1}^{m} \alpha_{i}
$$

　　进而简化成：

$$
\mathcal{L}=\sum_{i=1}^{m} \alpha_{i}-\frac{1}{2} \sum_{i, j=1}^{m} \alpha_{i} \alpha_{j} y_{i} y_{j}\left(\mathbf{x}_{i} \cdot \mathbf{x}_{j}\right)
$$

　　那么对于支持向量机线性可分情况下的 dual 形式优化模型如下：

$$
\begin{array}{c}{\max _{\alpha} \sum_{i=1}^{m} \alpha_{i}-\frac{1}{2} \sum_{i, j=1}^{m} \alpha_{i} \alpha_{j} y_{i} y_{j}\left(\mathbf{x}_{i} \cdot \mathbf{x}_{j}\right)} \\ {\text { subject to: } \alpha_{i} \geq 0 \wedge \sum_{i=1}^{m} \alpha_{i} y_{i}=0, \forall i \in[m]}\end{array}
$$

　　想要了解具体拉格朗日变换的，可以参考。

## 2. 线性不可分情况
　　然而在实际的数据中，常出现线性不可分的情况，即不是所有样本都满足一下的式子：

$$
y_{i}\left[\mathbf{w} \cdot \mathbf{x}_{i}+b\right] \succeq 1
$$

　　这个时候一般的做法是为每一个不等式约束的每一项加上一个松弛变量拓展到更加宽松的约束。

$$
y_{i}\left[\mathbf{w} \cdot \mathbf{x}_{i}+b\right] \geq 1-\xi_{i}
$$

![](/img/media/15826896628741.jpg)

　　这个时候的间隔 $\rho=1 /\|\mathbf{w}\|$ 称为软间隔（soft margin），如上图所示，相对的，之前的线性可分的约束可称为硬间隔（hard margin）。

### Primal Optimization Problem
　　基于相对宽松的约束，我们可以整理出原始的优化问题，优化目标在原来的基础上需要尽量使得我们的松弛变量之和尽量小。

$$
\begin{array}{cl}{\min _{\mathbf{w}, b, \boldsymbol{\xi}}} & {\frac{1}{2}\|\mathbf{w}\|^{2}+C \sum_{i=1}^{m} \xi_{i}^{p}} \\ {\text { subject to }} & {y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right) \geq 1-\xi_{i} \wedge \xi_{i} \geq 0, i \in[m]}\end{array}
$$

　　这里的 $C$ 值可以通过 $k$ 折交叉验证得到。

　　解此优化问题同样可以用拉格朗日乘子法：

$$
\mathcal{L}(\mathbf{w}, b, \boldsymbol{\xi}, \boldsymbol{\alpha}, \boldsymbol{\beta})=\frac{1}{2}\|\mathbf{w}\|^{2}+C \sum_{i=1}^{m} \xi_{i}-\sum_{i=1}^{m} \alpha_{i}\left[y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right)-1+\xi_{i}\right]-\sum_{i=1}^{m} \beta_{i} \xi_{i}
$$

　　设定原始变量的偏导为零，得到 KKT 条件：

$$
\begin{aligned} \nabla_{\mathbf{w}} \mathcal{L}=\mathbf{w}-\sum_{i=1}^{m} \alpha_{i} y_{i} \mathbf{x}_{i}=0 & \Longrightarrow \mathbf{w}=\sum_{i=1}^{m} \alpha_{i} y_{i} \mathbf{x}_{i} \\ \nabla_{b} \mathcal{L}=-\sum_{i=1}^{m} \alpha_{i} y_{i}=0 & \Longrightarrow \sum_{i=1}^{m} \alpha_{i} y_{i}=0 \\ \nabla_{\xi_{i}} \mathcal{L}=C-\alpha_{i}-\beta_{i}=0 & \Longrightarrow \alpha_{i}+\beta_{i}=C \\ \forall i, \alpha_{i}\left[y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right)-1+\xi_{i}\right]=0 & \Longrightarrow \alpha_{i}=0 \vee y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right)=1-\xi_{i} \\ \forall i, \beta_{i} \xi_{i}=0 & \Longrightarrow \beta_{i}=0 \vee \xi_{i}=0 \end{aligned}
$$

### Dual Optimization Problem
　　为了转换为对偶形式，我们只采用拉格朗日乘子作为参数变量：

$$
\mathcal{L}=\underbrace{\frac{1}{2}\left\|\sum_{i=1}^{m} \alpha_{i} y_{i} \mathbf{x}_{i}\right\|^{2}-\sum_{i, j=1}^{m} \alpha_{i} \alpha_{j} y_{i} y_{j}\left(\mathbf{x}_{i} \cdot \mathbf{x}_{j}\right)}_{-\frac{1}{2} \sum_{i, j=1}^{m} \alpha_{i} \alpha_{j} y_{i} y_{j}\left(\mathbf{x}_{i} \cdot \mathbf{x}_{j}\right)}-\underbrace{\sum_{i=1}^{m} \alpha_{i} y_{i} b}_{0}+\sum_{i=1}^{m} \alpha_{i}
$$

　　简化之后为：

$$
\mathcal{L}=\sum_{i=1}^{m} \alpha_{i}-\frac{1}{2} \sum_{i, j=1}^{m} \alpha_{i} \alpha_{j} y_{i} y_{j}\left(\mathbf{x}_{i} \cdot \mathbf{x}_{j}\right)
$$

　　最终对偶形式的优化模型为：

$$
\begin{aligned} \max _{\boldsymbol{\alpha}} & \sum_{i=1}^{m} \alpha_{i}-\frac{1}{2} \sum_{i, j=1}^{m} \alpha_{i} \alpha_{j} y_{i} y_{j}\left(\mathbf{x}_{i} \cdot \mathbf{x}_{j}\right) \\ \text { subject to: } 0 \leq \alpha_{i} & \leq C \wedge \sum_{i=1}^{m} \alpha_{i} y_{i}=0, i \in[m] \end{aligned}
$$

　　最终的优化就只跟 $\alpha$ 有关，测试时的决策公式为：

$$
h(\mathbf{x})=\operatorname{sgn}(\mathbf{w} \cdot \mathbf{x}+b)=\operatorname{sgn}\left(\sum_{i=1}^{m} \alpha_{i} y_{i}\left(\mathbf{x}_{i} \cdot \mathbf{x}\right)+b\right)
$$

　　其中 $b$ 的计算可以选择任意一个在边界平面上的点 $0<\alpha_i<C$ 的样本带进去计算即可：

$$
b=y_{i}-\sum_{j=1}^{m} \alpha_{j} y_{j}\left(\mathbf{x}_{j} \cdot \mathbf{x}_{i}\right)
$$

　　这里整理下不同的样本类型：
* $\alpha_i \ne 0$ 的样本 $x_i$ 称为支持向量，支持向量有两种状态，要不是 outlier 就是在边界平面上。
* 如果 $\alpha_i \ne 0$，则有 $y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right)=1-\xi_{i}$：
    * 当 $\xi_{i} = 0$，有 $y_{i}\left(\mathbf{w} \cdot \mathbf{x}_{i}+b\right)=1$，所以样本 $x_i$ 坐落在边界平面上
    * 当 $\xi_{i} \ne 0$，那么样本 $x_i$ 就是一个 outlier，此时可以根据 KKT 最后一个条件知道，$\beta_i = 0$，那么又根据第三个 KKT 条件知道，$\alpha_i=C$。



## 线性支持向量机
从 hinge loss 的角度来看待线性支持向量机
![-w1304](/img/media/15662007668997.jpg)

![-w1380](/img/media/15662007998128.jpg)


ideal loss

$$
l\left(f\left(x^{n}\right), \hat{y}^{n}\right)=\max \left(0,1-\hat{y}^{n} f(x)\right)
$$

Hinge loss 对 outlier 不那么敏感。
Kernel Trick

取 1 的时候，Hinge loss 才會是 ideal loss 的一個 type 的 upper bound，如果用其他的值的话，就不会是那么 tight 的 upper bound。
![-w1437](/img/media/15662192478583.jpg)

![-w1429](/img/media/15662197118358.jpg)


## Kernel

![-w1293](/img/media/15662017087873.jpg)

![-w1328](/img/media/15662021226082.jpg)

![-w1256](/img/media/15662022088653.jpg)

![-w1424](/img/media/15662023554996.jpg)

![-w1320](/img/media/15662024844999.jpg)




![-w1420](/img/media/15662115375172.jpg)

![-w1425](/img/media/15662116890554.jpg)

![-w1423](/img/media/15662118568830.jpg)

![-w1414](/img/media/15662119911487.jpg)

![-w1415](/img/media/15662125499087.jpg)

![-w1430](/img/media/15662156239382.jpg)

内积就是表示两个向量的相似性
![-w1358](/img/media/15662162612253.jpg)


## 常见重点
几何距离，函数距离

怎么选

* [ ] 什么时候能取到等号？

## References
1. [深入理解拉格朗日乘子法（Lagrange Multiplier) 和KKT条件](https://www.cnblogs.com/mo-wang/p/4775548.html)
2. [cs229-notes3.pdf](/assets/cs229-notes3.pdf)
3. [Weak-Duality.pdf](/assets/Weak-Duality.pdf)
4. 《Foundation of Machine Learning 2nd》
5. 《CS229》
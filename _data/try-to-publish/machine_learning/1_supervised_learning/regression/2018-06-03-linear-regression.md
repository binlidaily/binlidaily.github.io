---
layout: post
title: Linear Regression
subtitle: 线性回归
tags: [Machine Learning]
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

　　线性回归作为一种非常常见的离散值预测模型，却是非常基础且重要的算法，后续的很多机器学习的算法都是在此基础上做的，例如逻辑回归。当数据中特征个数超过 1 个时，线性回归又被称为多元线性回归（Multivariate linear regression）。

## 1. 线性回归算法
　　最基本的线性回归算法想法比较简单，就是拟合一个函数，预测对应的值。我们将样本画出来发现，数据可能呈现正相关的分布，那么我们可以通过一个最简单的线性模型来拟合。

　　一般的线性模型（linear model）都是试图学习一个通过属性的线性组合来进行预测的函数，即：

$$
f(x) = w^T x + b
$$

　　由于 $w$ 直观地表达了各属性在预测中的重要性，因此线性模型有很好的可解释性。

　　那么，我们如何从一堆数据里求出回归方程呢，即找到回归系数呢？直观的想法是我们能够拟合出一条直线，使得所有点在其 $x$ 的取值下，对应的 $y$ 值跟拟合出来的直线在相同 $x$ 下的取值尽可能接近。这里的点到线段的距离和 SVM 的还不一样，SVM 为了衡量 margin 和超平面的距离，将这种点到面的距离就采用实际的垂直距离。

<p align="center">
  <img width="350" height="" src="/img/media/15470889554836.png">
</p>

　　我们就需要通过一种迭代训练的方式，从一组随机的系数开始，慢慢找到最优的系数。这里说的最优的系数，就从能够是我们预测出来的值与真实值的差距最小的系数；这种误差我们为了避免简单的加减误差会因为正误差和负误差会相互抵消，我们用平方误差来衡量。

$$
\begin{aligned}\left(w^{*}, b^{*}\right) &=\underset{(w, b)}{\arg \min } \sum_{i=1}^{m}\left(f\left(x_{i}\right)-y_{i}\right)^{2} \\ &=\underset{(w, b)}{\arg \min } \sum_{i=1}^{m}\left(y_{i}-w x_{i}-b\right)^{2} \end{aligned}
$$

　　我们先从单个样本的角度来求解模型，记 $E_{(w, b)}=\sum_{i=1}^{m}\left(y_{i}-w x_{i}-b\right)^{2}$，求导：

$$
\begin{aligned} \frac{\partial E_{(w, b)}}{\partial w} &=2\left(w \sum_{i=1}^{m} x_{i}^{2}-\sum_{i=1}^{m}\left(y_{i}-b\right) x_{i}\right) \\ \frac{\partial E_{(w, b)}}{\partial b} &=2\left(m b-\sum_{i=1}^{m}\left(y_{i}-w x_{i}\right)\right) \end{aligned}
$$

　　零导数为零，能得到最优解的闭试解：

$$
w=\frac{\sum_{i=1}^{m} y_{i}\left(x_{i}-\overline{x}\right)}{\sum_{i=1}^{m} x_{i}^{2}-\frac{1}{m}\left(\sum_{i=1}^{m} x_{i}\right)^{2}}
$$

$$
b=\frac{1}{m} \sum_{i=1}^{m}\left(y_{i}-w x_{i}\right)
$$

　　其中 $\overline{x}=\frac{1}{m} \sum_{i=1}^{m} x_{i}$ 为 $x_i$ 的均值。

　　接下来我们尝试向量化表示，然后用最小二乘（Ordinary Least Squares）来对参数进行估计。为了计算的方便，我们将 $b$ 融合到 $w$ 中，$w=(w;b)$，则损失函数变为：

$$
{1\over{2}}\sum _{i=1}^m (y_i-x_iw)^2
$$

　　前面的 $1\over2$ 是为了求导时能够与系数消掉，我们用矩阵的形式表示能够得到：


$$
{1\over 2}(y-Xw)^T(y-Xw)
$$


　　这里可以通过矩阵的大小来判断，$w$ 还真得放到 $X$ 的右边，loss 最终的结果是一个实数，通过结果反推各个部分矩阵的大小即可。

$$
y: (m,1)\\
X: (m, n)\\
w: (m, 1)\\
y-Xw: (m, 1)
$$


　　对应的我们开始求偏导，首先我们新定义一个向量 $v$ 作为中间变量：


$$
v=y-Xw
$$


　　然后我们利用 [Frobenius inner product](https://en.wikipedia.org/wiki/Frobenius_inner_product)（即公式中的 “:”）表示上面的式子：


$$
f={1\over2}||v||_F^2={1\over 2}v:v
$$


　　接着求解函数 $f$ 的微分（differential）$df$：


$$
\begin{aligned}
df &= {1\over2}\times2v:dv \\
&= -v:Xdw \\
&= -X^Tv:dw
\end{aligned}
$$


　　具体判断加不加转置或者位置问题，都可以通过标识出矩阵大小的方式清晰地分辨出来。接着再求对应的梯度（gradient）：


$$
\begin{aligned}
{\partial f}\over {\partial w} &=  -X^Tv \\
&= -X^T(y-Xw)
\end{aligned}
$$


　　于是，我们对 $w$ 求导有 $-X^T(y-Xw)$，令其为零，解出 $w$ 的最优解：

$$
-X^T(y-Xw) = -X^Ty+X^TXw = 0
$$

　　有当 $X^TX$ 满秩状态下的解析解：

$$
\hat{w} = (X^TX)^{-1}X^Ty
$$

　　当然还会出现 $X^TX$ **不满秩**的情况，此时可以解出多个 $\hat{w}$ 都能是得均方误差最小化，那具体选择哪一个作为输出，可能就依赖学习算法的偏好决定了。对于 $X^TX$ 不满秩的情况，比较常见的做法是引入正则化（regularization）项，比如在损失函数中加入对参数的 L2-norm：

$$
E = \frac { 1 } { 2 } \sum _ { i = 1 } ^ { m } (y_i-x_iw)^2 + \frac { \gamma } { 2 } \| \mathbf { w } \| ^ { 2 }
$$


　　引入正则化项后求解的参数公式就变成了：


$$
\hat { w }= \left( \gamma \mathbf { I } + X ^ { T } X \right) ^ { - 1 } X ^ { T } y
$$

　　对于求解办法，除了上面这种[最小二乘法求解](https://mp.weixin.qq.com/s?__biz=MzAwNjM1ODkxNQ==&mid=2650889909&idx=1&sn=e71820b81c167c5039b91a7a6f9083f7&chksm=80fb6c59b78ce54f946f9611fd08bbcef7154b0c7480684121780374f4056be4b83522963ed1&scene=21#wechat_redirect)的，还可以用梯度下降的方式求解。

　　当然对于推导还有一种[全展开的形式](https://towardsdatascience.com/analytical-solution-of-linear-regression-a0e870b038d5)，这里就不再细究了。然而其中还有一个现没有搞清楚的问题，即如果引入了正则化参数之后，直接求闭试解是否一定能得到闭试解？目前的理解是，毕竟 $X^TX$ 此时已经满秩了，那么此时需要考虑的就是矩阵相乘计算的问题了。

　　当然，现实生活中并非很多数据是符合线性回归的那种直线分布的，于是可以令线性回归模型预测值逼近 $y$ 的衍生物，比如：


$$
\ln y = w^Tx + b
$$


　　这个就是对数线性回归 (Log-linear regression)，其实际上是在用 $e^{w^Tx+b}$ 逼近 $y$。

<p align="center">
  <img width="420" height="" src="/img/media/image-20190324210041215.png">
</p>

## 2. 基于最大似然估计的理解
　　线性回归使用最小二乘法的本质其实是利用最大似然估计得到的，接下来我们从一个假设开始探索。首先我们有这样的式子：

$$
t=y(\mathbf{x}, \mathbf{w})+\epsilon
$$

　　$t$ 是目标变量（即采样得到的目标值），$y(\mathbf{x}, \mathbf{w})=\sum_{j=0}^{M-1} w_{j} \phi_{j}(\mathbf{x})=\mathbf{w}^{\mathrm{T}} \boldsymbol{\phi}(\mathbf{x})$ 是生成函数（理想情况下的结果），$\epsilon$ 是误差。一般来讲，我们都假设误差服从零均值的高斯分布：

$$
\epsilon \sim \mathcal{N}\left(0, \sigma^{2}\right)
$$

　　则有

$$
p(\epsilon) = \frac{1}{\sqrt{2 \pi \sigma^{2}}} e^{-\frac{\left(\epsilon\right)^{2}}{2 \sigma^{2}}} = \frac{1}{\sqrt{2 \pi \sigma^{2}}} e^{-\frac{\left(t-y(\mathbf{x}, \mathbf{w})\right)^{2}}{2 \sigma^{2}}} = \mathcal{N}\left(t | y(\mathbf{x}, \mathbf{w}), \sigma^{2}\right)
$$

　　我们按照统一的记号方法，记 $\frac{1}{\sigma^{2}}$ 为 $\beta$，为 precision (inverse variance)，有：

$$
p(t | \mathbf{x}, \mathbf{w}, \beta)=\mathcal{N}\left(t | y(\mathbf{x}, \mathbf{w}), \beta^{-1}\right)
$$

　　那么我们的目标就是求出参数 $w$ 和 $\beta$，对于已经收集到的数据集，我们可以假设样本之间相互独立，采用极大似然估计来估计参数，假设样本个数为 $N$。

$$
p(\mathbf{t} | \mathbf{X}, \mathbf{w}, \beta)=\prod_{n=1}^{N} \mathcal{N}\left(t_{n} | \mathbf{w}^{\mathrm{T}} \boldsymbol{\phi}\left(\mathbf{x}_{n}\right), \beta^{-1}\right)
$$

　　连乘不好操作，我们等价处理成连加:

$$
\begin{aligned} \ln p(\mathbf{t} | \mathbf{w}, \beta) &=\sum_{n=1}^{N} \ln \mathcal{N}\left(t_{n} | \mathbf{w}^{\mathrm{T}} \boldsymbol{\phi}\left(\mathbf{x}_{n}\right), \beta^{-1}\right) \\ &=\frac{N}{2} \ln \beta-\frac{N}{2} \ln (2 \pi)-\beta E_{D}(\mathbf{w}) \end{aligned}
$$

　　其中 $E_D$ 为最小二乘项，为了方便起见单独列出：

$$
E_{D}(\mathbf{w})=\frac{1}{2} \sum_{n=1}^{N}\left\{t_{n}-\mathbf{w}^{\mathrm{T}} \boldsymbol{\phi}\left(\mathbf{x}_{n}\right)\right\}^{2}
$$

　　那么极大似然是要最大化上面的等式，我们单独看 $w$ 时，前两项可以舍去，优化目标也就变成了最小化 $E_D$，即最小化最小二乘的结果，跟之前优化目标一致。

　　然后求导：

$$
\nabla \ln p(\mathbf{t} | \mathbf{w}, \beta)=\sum_{n=1}^{N}\left\{t_{n}-\mathbf{w}^{\mathrm{T}} \boldsymbol{\phi}\left(\mathbf{x}_{n}\right)\right\} \boldsymbol{\phi}\left(\mathbf{x}_{n}\right)^{\mathrm{T}}
$$

　　令导数为零：

$$
0=\sum_{n=1}^{N} t_{n} \boldsymbol{\phi}\left(\mathbf{x}_{n}\right)^{\mathrm{T}}-\mathbf{w}^{\mathrm{T}}\left(\sum_{n=1}^{N} \boldsymbol{\phi}\left(\mathbf{x}_{n}\right) \boldsymbol{\phi}\left(\mathbf{x}_{n}\right)^{\mathrm{T}}\right)
$$

　　求导最优的 $w$:

$$
\mathbf{w}_{\mathrm{ML}}=\left(\mathbf{\Phi}^{\mathrm{T}} \mathbf{\Phi}\right)^{-1} \mathbf{\Phi}^{\mathrm{T}} \mathbf{t}
$$

　　其中有：

$$
\mathbf{\Phi}=\left(\begin{array}{cccc}{\phi_{0}\left(\mathbf{x}_{1}\right)} & {\phi_{1}\left(\mathbf{x}_{1}\right)} & {\cdots} & {\phi_{M-1}\left(\mathbf{x}_{1}\right)} \\ {\phi_{0}\left(\mathbf{x}_{2}\right)} & {\phi_{1}\left(\mathbf{x}_{2}\right)} & {\cdots} & {\phi_{M-1}\left(\mathbf{x}_{2}\right)} \\ {\vdots} & {\vdots} & {\ddots} & {\vdots} \\ {\phi_{0}\left(\mathbf{x}_{N}\right)} & {\phi_{1}\left(\mathbf{x}_{N}\right)} & {\cdots} & {\phi_{M-1}\left(\mathbf{x}_{N}\right)}\end{array}\right)
$$

　　求到最优的 $w$ 后，可以将其代入上面的等式，并以 $\beta$ 为参考变量，$w$ 为常量，经过上述同样的求导令零流程可以求得最优的 $\beta$ 等式，也就是方差 $\sigma^2$：

$$
\frac{1}{\beta_{\mathrm{ML}}}=\frac{1}{N} \sum_{n=1}^{N}\left\{t_{n}-\mathbf{w}_{\mathrm{ML}}^{\mathrm{T}} \boldsymbol{\phi}\left(\mathbf{x}_{n}\right)\right\}^{2}
$$



## Implementation

　　对于线性回归的求解办法也是规规矩矩的几个步骤：
```
1. 初始化权重
2. 计算并更新权重
    * 通过 Gradient Descent
    * 通过 Projection Matrix
3. 没有达到最大迭代次数或者 SSE 变化很小时则继续迭代，否则退出
```

　　其中用 SVD 的部分还需要重新整理理解下！除了通过 SVD 的方式，还可以用 QR 分解来计算，而且在小规模的数据量下更建议用这两种分解方式来求。🤔

<details><summary markdown="span">Click to show the Code</summary>
```python
class LinearRegression(Regression):
    """
    Linear model.

    Parameters:
    -----------
    n_iterations: float
        The number of training iterations the algorithm will tune the weights for.
    learning_rate: float
        The step length that will be used when updating the weights.
    gradient_descent: boolean
        True or false depending if gradient descent should be used when training. If
        false then we use batch optimization by least squares.

    """

    def __init__(self, n_iterations=100, learning_rate=0.001, gradient_descent=True):
        self.gradient_desent = gradient_descent
        # regularization is a class
        self.regularization = lambda x: 0
        self.regularization.grad = lambda x: 0
        super(LinearRegression, self).__init__(n_iterations=n_iterations,
                                               learning_rate=learning_rate)

    def fit(self, X, y):
        # If not gradient descent => Least squares approximation of w
        if not self.gradient_desent:
            # add bias weights (set 1 default) to training data x
            X = np.insert(X, 0, 1, axis=1)
            # Calculate weights by least squares (using Moore-Penrose pseudoinverse)
            # Use Projection Matrix calculate weights
            U, S, V = np.linalg.svd(X.T.dot(X))
            S = np.diag(S)
            X_sq_reg_inv = V.dot(np.linalg.pinv(S)).dot(U.T)
            self.w = X_sq_reg_inv.dot(X.T).fit(X, y)
        else:
            super(LinearRegression, self).fit(X, y)
```
</details>

**优点**：
* 思路直观，解释性强。
* 实现简单，计算简单。
* 当特征数量打过训练数据点的数量，任何目标 y 都可以（在训练集上）用线性函数完美拟合。

**缺点**：
* 不能拟合非线性数据。
* 对复杂数据拟合效果不好，欠拟合。
    * 多项式回归
    * 局部线性回归
* 对异常值比较敏感
    * 正则化

### 注意点：
* 注意在矩阵形式下和在展开写的形势下如何求偏导（外层是迭代，内层是所有样本的循环）
* 迭代更新参数时，具体如何在所所有样本进行每一轮更新（$i$ 针对的是更新轮数，不是第 $i$ 个样本）

　　当数据量不太大而且闭试解存在时可以使用公式直接计算（如果是稀疏的会更好，可以减少存储量），但是当数据量比较大而且是 Dense 的，在存储上都会成问题，更不用说快速计算了。所以可以 Gradient Descent 来实现，不需要非常大的存储量。当时更建议使用 QR 和 SVD 的方式来计算。

### 实践示例
　　可以用 Sklearn 集成的接口来操作:
```python
import sklearn.linear_model as lm          # 线性模型模块
model_ln = lm.LinearRegression()               # 构建线性回归器
model_ln.fit(train_x, train_y)                 # 训练数据  不返回k和b model中存储
pred_y_ln = model_ln.predict(train_x)
```

## 总结
* 核心思想
    * 假设自变量和因变量有存在线性关系，通过优化算法去拟合这种线性关系
    * 假设误差服从零均值的高斯分布，能够计算出损失函数为平方误差
* 决策函数
    * 线性计算：$$h(x) = x^T \hat{w}$$
* 损失函数
    * 平方损失（最小二乘）：$$\hat{w}=\text{argmin}_{w} \sum_{x, y}\left(y-x^{T} w\right)^{2}$$
* 优化算法
    * 解析解直接计算：$\hat { w } = \left( \gamma \mathbf { I } + X ^ { T } X \right) ^ { - 1 } X ^ { T } y$
    * 逆不存在可以用梯度下降：
        1. 输入 $X$, $y$, 初始化权重 $w_0$
        2. 计算损失函数对参数 $w$ 的偏导并迭代更新
        3. 达到最大迭代次数，或者损失降低到一定程度退出
* **优点**：
    * 实现简单，计算简单。
* **缺点**：
    * 不能拟合非线性数据。
    * 对异常值非常敏感。（平方误差的缺点？）

### 线性回归最重要的假设是什么？
* A linear relationship
* Restricted Multi-collinearity value
* Homoscedasticity

Firstly, there has to be a linear relationship between the dependent and the independent variables. To check this relationship, a scatter plot proves to be useful.

Secondly, there must no or very little multi-collinearity between the independent variables in the dataset. The value needs to be restricted, which depends on the domain requirement.

The third is the homoscedasticity. It is one of the most important assumptions which states that the errors are equally distributed.


## References
1. [Matrix calculus in multiple linear regression OLS estimate derivation](https://math.stackexchange.com/questions/1968478/matrix-calculus-in-multiple-linear-regression-ols-estimate-derivation)
2. [How to Solve Linear Regression Using Linear Algebra](https://machinelearningmastery.com/solve-linear-regression-using-linear-algebra/)
3. [Why is SVD applied on Linear Regression](https://stackoverflow.com/questions/37072067/why-is-svd-applied-on-linear-regression)
4. [Do we need gradient descent to find the coefficients of a linear regression model?](https://stats.stackexchange.com/questions/160179/do-we-need-gradient-descent-to-find-the-coefficients-of-a-linear-regression-mode/164164#164164)
5. [Lecture 9. Linear Least Squares. Using SVD Decomposition.](https://www2.math.uconn.edu/~leykekhman/courses/MATH3795/Lectures/Lecture_9_Linear_least_squares_SVD.pdf)
6. [你应该掌握的 7 种回归模型](https://zhuanlan.zhihu.com/p/40141010)
7. [最小二乘回归和线性回归](http://sofasofa.io/forum_main_post.php?postid=1000997)
8. [Linear Regression: Implementation, Hyperparameters and their Optimizations](http://pavelbazin.com/post/linear-regression-hyperparameters/)
9. [scikit-learn : 线性回归，多元回归，多项式回归](https://blog.csdn.net/SA14023053/article/details/51703204)
10. [盘点｜最实用的机器学习算法优缺点分析，没有比这篇说得更好了](https://juejin.im/post/5930cc4c2f301e006bd4b2a9)
11. [機器學習經典算法優缺點總結](https://bigdatafinance.tw/index.php/392-2017-06-01-13-30-40)
12. [Lecture 6: The Method of Maximum Likelihood for Simple Linear Regression](/assets/lecture-06.pdf)
13. 《PRML》- p140

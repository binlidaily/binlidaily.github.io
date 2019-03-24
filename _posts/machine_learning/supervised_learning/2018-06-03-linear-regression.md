---
layout: post
title: Linear Regression
tags: [Machine Learning]
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

线性回归作为一种非常常见的离散值预测模型，却是非常基础且重要的算法，后续的很多机器学习的算法都是在此基础上做的，例如逻辑回归。

## 线性回归算法
最基本的线性回归算法想法比较简单，就是拟合一个函数，预测对应的值。我们将样本 plot 出来发现，数据可能呈现正相关的分布，那么我们可以通过一个最简单的线性模型来拟合。

那么，我们如何从一堆数据里求出回归方程呢，即找到回归系数呢？直观的想法是我们能够拟合出一条直线，使得所有点在其 $x$ 的取值下，对应的 $y$ 值跟拟合出来的直线在相同 $x$ 下的取值尽可能接近。这里的点到线段的距离和 SVM 的还不一样，SVM 为了衡量 margin 和超平面的距离，将这种点到面的距离就采用实际的垂直距离。

<p align="center">
  <img width="220" height="" src="/img/media/15470889554836.jpg">
</p>
我们就需要通过一种迭代训练的方式，从一组随机的系数开始，慢慢找到最优的系数。这里说的最优的系数，就从能够是我们预测出来的值与真实值的差距最小的系数；这种误差我们为了避免简单的加减误差会因为正误差和负误差会相互抵消，我们用平方误差来衡量。
$$
{1\over{2}}\sum _{i=1}^m (y_i-x_iw)^2
$$
前面的 $1\over2$ 是为了求导时能够与系数消掉，我们用矩阵的形式表示能够得到：

$$
{1\over 2}(y-Xw)^T(y-Xw)
$$


这里可以通过矩阵的大小来判断，$w​$ 还真得放到 $X​$ 的右边，loss 最终的结果是一个实数，通过结果反推各个部分矩阵的大小即可。

$$
y: (m,1)\\
X: (m, n)\\
w: (m, 1)\\
y-Xw: (m, 1)
$$


对应的我们开始求偏导，首先我们新定义一个向量 $v​$ 作为中间变量：

$$
v=y-Xw
$$
然后我们利用 [Frobenius inner product](https://en.wikipedia.org/wiki/Frobenius_inner_product)（即公式中的 “:”）表示上面的式子：

$$
f={1\over2}||v||_F^2={1\over 2}v:v
$$
接着求解函数 $f​$ 的微分（differential）$df​$：

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
则有当 $X^TX​$ 满秩状态下的解析解：

$$
\hat{w} = (X^TX)^{-1}X^Ty
$$
当然还会出现 $X^TX$ **不满秩**的情况，此时可以解出多个 $\hat{w}$ 都能是得均方误差最小化，那具体选择哪一个作为输出，可能就依赖学习算法的偏好决定了。对于 $X^TX$ 不满秩的情况，比较常见的做法是引入正则化（regularization）项，比如在损失函数中加入对参数的 L2-norm：

$$
E = \frac { 1 } { 2 } \sum _ { i = 1 } ^ { m } (y_i-x_iw)^2 + \frac { \gamma } { 2 } \| \mathbf { w } \| ^ { 2 }
$$

引入正则化项后求解的参数公式就变成了：

$$
\hat { w }^* = \left( \gamma \mathbf { I } + X ^ { T } X \right) ^ { - 1 } X ^ { T } y
$$

当然对于推导还有一种[全展开的形式](https://towardsdatascience.com/analytical-solution-of-linear-regression-a0e870b038d5)，这里就不再细究了。然而其中还有一个现没有搞清楚的问题，即如果引入了正则化参数之后，直接求闭试解是否一定能得到闭试解？目前的理解是，毕竟 $X^TX$ 此时已经满秩了，那么此时需要考虑的就是矩阵相乘计算的问题了。


## Implementation

对于线性回归的求解办法也是规规矩矩的几个步骤：
```
1. 初始化权重
2. 计算并更新权重
    * 通过 Gradient Descent
    * 通过 Projection Matrix
3. 没有达到最大迭代次数或者 SSE 变化很小时则继续迭代，否则退出
```

参考了 Github 的实现自己[手写了一遍](https://github.com/binlidaily/machine-learning-from-scratch/blob/master/supervised_learning/regression.py)，其中用 SVD 的部分还需要重新整理理解下！除了通过 SVD 的方式，还可以用 QR 分解来计算，而且在小规模的数据量下更建议用这两种分解方式来求。🤔

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


### 注意点
* 注意在矩阵形式下和在展开写的形势下如何求偏导（外层是迭代，内层是所有样本的循环）
* 迭代更新参数时，具体如何在所所有样本进行每一轮更新（i 针对的是更新轮数，不是第 i 个样本）

当数据量不太大而且闭试解存在时可以使用公式直接计算（如果是稀疏的会更好，可以减少存储量），但是当数据量比较大而且是 Dense 的，在存储上都会成问题，更不用说快速计算了。所以可以 Gradient Descent 来实现，不需要非常大的存储量。当时更建议使用 QR 和 SVD 的方式来计算。

## References
1. [Matrix calculus in multiple linear regression OLS estimate derivation](https://math.stackexchange.com/questions/1968478/matrix-calculus-in-multiple-linear-regression-ols-estimate-derivation)
2. [How to Solve Linear Regression Using Linear Algebra](https://machinelearningmastery.com/solve-linear-regression-using-linear-algebra/)
3. [Why is SVD applied on Linear Regression](https://stackoverflow.com/questions/37072067/why-is-svd-applied-on-linear-regression)
4. [Do we need gradient descent to find the coefficients of a linear regression model?](https://stats.stackexchange.com/questions/160179/do-we-need-gradient-descent-to-find-the-coefficients-of-a-linear-regression-mode/164164#164164)
5. [Lecture 9. Linear Least Squares. Using SVD Decomposition.](https://www2.math.uconn.edu/~leykekhman/courses/MATH3795/Lectures/Lecture_9_Linear_least_squares_SVD.pdf)
6. [你应该掌握的 7 种回归模型](https://zhuanlan.zhihu.com/p/40141010)







---
layout: post
title: "Random Features for Large-Scale Kernel Machines"
author: "Bin Li"
tags: [Machine Learning]
comments: true
style: |
  .container {
        max-width: 48rem;
    } 
---

最近要在组会上汇报一篇这篇文章，于是就做了更多了解。 [Random Features for Large-Scale Kernel Machines](https://people.eecs.berkeley.edu/~brecht/papers/07.rah.rec.nips.pdf) 是 2007 年的 NIPS 文章，在 2017 年的时候这篇文章获得的 Test-of-time Award，作为解决大规模 Kernel Machines 的算法，可见其有效性，我们将简要做一介绍。这篇文章的作者在 2017 年获奖时做报告的时候还提出了一个富有争议性的观点，[“Machine Learning is Alchemy.”](http://www.argmin.net/2017/12/05/kitchen-sinks/)，这个论点被 Yann Lecun 抨击了，各有己见吧。

<!--more-->

## Motivation
现在的数据集普遍非常大，能用 kernel machines 处理的数据量比较小，因为有 kernel matrix 的存在，需要相对较大的存储和计算资源。而且一般的 kernel machines 都有如下的形式：

$$f(x) = \Sigma_{i=1}^N c_i k(X_i, X) \Longrightarrow O(N*d)$$

及时是在测试或者预测的时候，计算复杂度依然是很高。于是，这篇文章想针对 large scale 的 kernel machines 做一个优化，提高其训练和测试（预测）的速度。

## Introduction
在实践过程中我们知道，很多情况下，我们是没有办法保证所有的数据都是线性可分的，那么，于是我们就会使用核技巧，使得在原来空间不可分的数据，映射到高维的特征空间后变得线性可分。具体就不展开介绍，如下图所示：

![](/img/media/15149048791755.jpg)


我们从核函数的特性出发，每个核函数都有如下的特性：

$$k(x,y) = <\phi(x),\phi(y)>$$

但是问题是我们将原来的数据空间映射到**高维**的特征空间后，往往是使得我们的模型变得复杂了。那么我们能不能找到一种映射或者转换，使得在保证结果和向高维映射的结果接近但其本身是很低维的转换呢？这篇论文就是朝着这个目标出发，想办法设计这样的**低维转换**。

$$k(x,y) = ~ <\phi(x),\phi(y)>  ~ \approx z(x)^T z(y)$$

即我们想要找到这样的转换 $z(x)$，使得输入数据空间转换之后的结果与往高维映射后的结果接近。那么接下来的问题就是我们怎么去找这个 $z(x)$ 了。

但是文中对于怎么找 $z(x)$ 的思考过程没有给出详细的阐释，就直接给出了结果说我们针对 shift-invariant kernels 有了基于傅里叶变换和基于平移网格变换的两种方法 Random Fourier Features 和 Random Binning Features。

> Let $x,y∈ℝ$ where $y=x−t$. Translation-invariant (or shift-invariant) kernel $κ(⋅,⋅)$ is defined as $κ(x,y)=κ(x,x−t)=κ(t)$.

## Random Fourier Features
![](/img/media/15149073920888.jpg)

![](/img/media/15149074215505.jpg)

这里其实还没有完全从数学的角度推导细致，大家先看下，如有问题请在评论区指出。

该算法有两个条件：

1. 核函数是平移不变核（shift-invariant kernels），$k(x,y) = k(z)$, 其中 $x-y=z$。
2. k(z) 必须在 $R^d$ 上正定

Random Fourier Features 算法步骤如下：

1. Compute the Fourier transform of $k$: 
    $$\mathcal{F}_k(w) = \frac{1}{(2\pi)^{\frac{d}{2}}} \int_{\mathbb{R}^d} k(\textbf{z}) e^{i\langle w,z \rangle} d\textbf{z} $$
2. Sample $D$ $i.i.d$ vectors $w$ from: 
    $$p(\textbf{w}) = \frac{1}{(2\pi)^{\frac{d}{2}}} \mathcal{F}_k(w) $$ 
3. Sample $D$  $i.i.d$ vectors b from the uniform distribution.
4. Compute the new features
    $$Z(X) = \sqrt{\frac{2}{D}}\left[ cos(w_1X + u_1), \dots, cos(w_DX + u_D) \right] $$

5. Compute the Kernel estimates:
    $$ k(\textbf{x},\textbf{y}) = \langle Z(\textbf{x}), Z(\textbf{y}) \rangle $$

代码实现非常简洁：

```python
class RFF(BaseEstimator):
    def __init__(self, gamma = 1, D = 50, metric = "rbf"):
        self.gamma = gamma
        self.metric = metric
        #Dimensionality D (number of MonteCarlo samples)
        self.D = D
        self.fitted = False
        
    def fit(self, X, y=None):
        """ Generates MonteCarlo random samples """
        d = X.shape[1]
        #Generate D iid samples from p(w) 
        if self.metric == "rbf":
            self.w = np.sqrt(2*self.gamma)*np.random.normal(size=(self.D,d))
        elif self.metric == "laplace":
            self.w = cauchy.rvs(scale = self.gamma, size=(self.D,d))
        
        #Generate D iid samples from Uniform(0,2*pi) 
        self.u = 2*np.pi*np.random.rand(self.D)
        self.fitted = True
        return self
    
    def transform(self,X):
        """ Transforms the data X (n_samples, n_features) to the new map space Z(X) (n_samples, n_components)"""
        if not self.fitted:
            raise NotFittedError("RBF_MonteCarlo must be fitted beform computing the feature map Z")
        #Compute feature map Z(x):
        Z = np.sqrt(2/self.D)*np.cos((X.dot(self.w.T) + self.u[np.newaxis,:]))
        return Z
    
    def compute_kernel(self, X):
        """ Computes the approximated kernel matrix K """
        if not self.fitted:
            raise NotFittedError("RBF_MonteCarlo must be fitted beform computing the kernel matrix")
        Z = self.transform(X)
        K = Z.dot(Z.T)
        return K
```

其他部分后续再继续补充了。

### References
1. [Code for Random Fourier Features](https://github.com/hichamjanati/srf/blob/master/RFF-I.ipynb)
2. [“Machine Learning is Alchemy.”](http://www.argmin.net/2017/12/05/kitchen-sinks/)
3. [An Addendum to Alchemy](http://www.argmin.net/2017/12/11/alchemy-addendum/)
4. [Solving Large Scale Kernel Machines using Random Features](http://www.mit.edu/~9.520/spring11/project-ideas/9520_Nick.pdf)


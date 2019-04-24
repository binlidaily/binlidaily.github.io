---
layout: post
title: Recurrent Neural Networks
subtitle: 循环神经网络
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　循环神经网络（Recurrent Neural Network, RNN）作为深度学习的一个重要网络，主要解决的是样本数据为序列的建模问题，如语音序列，语言序列。

## RNN 原理
　　给定一个长度为 $T$ 输入序列 $\left \{ x_{0}, x_{1},..., x_{t},...,x_{T}\right \}$，这里 $x_{t}$ 表示的是序列在 $t$ 时刻的输入特征向量，这里的 $t$ 时刻并不一定真的指的是时间，只是用来表明这是一个序列输入问题。现在要得到每个时刻的隐含特征 $\left \{ h_{0}, h_{1},..., h_{t},...,h_{T}\right \} $，这些隐含特征用于后面层的特征输入。如果采用传统的神经网络模型，只需要计算：

$$h_{t}=f(Ux_{t}+b)$$

　　其中 $f$ 为非线性激活函数。为了考虑前一时刻的特征，需要在公式中引入前一个时刻的隐含特征 $h_{t-1} $，其计算过程如下：

$$h_{t}=f(Ux_{t}+Wh_{t-1}+b)$$

　　显然这样可以捕捉到序列中依赖关系，可以认为 $h_{t-1}$ 是一个记忆特征，其提取了前面 $t-1$ 个时刻的输入特征，有时候又称 $h_{t-1}$ 为旧状态，而 $h_{t}$ 为新状态。因此，RNN 模型特别适合序列问题。从结构上看，RNN 可以看成有环的神经网络模型，如图1所示。不过可以将其展开成普通的神经网络模型，准确地说展开成 $T$ 个普通的神经网络模型。但是这 $T$ 个神经网络不是割立的，其所使用参数是一样的，即权重共享。这样每一个时刻，RNN 执行的是相同的计算过程，只不过其输入不一样而已。所以本质上，RNN 也只不过多个普通的神经网络通过权值共享连接而成。

<p align="center">
<img src="/img/media/15560242719743.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;"> RNN 模型及展开简图</em>
</p>

　　还有一点，RNN 可以提取一组特征 $\left\{ h_{0}, h_{1},..., h_{t},...,h_{T}\right\} $，但是并不是所有的特征都会送入后面的层，如果你只是需要根据输入序列进行分类，可能你仅需要最后时刻的特征 $h_{T}$。也就是说 RNN 结果可以是序列，这当然和具体的应用场景相关。

<p align="center">
<img src="/img/media/15560255518749.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;"> RNN 输入输出类型</em>
</p>

## RNN 后向传播算法
　　我们将注意力放到时刻 $t$ 附近：

<p align="center">
<img src="/img/media/15560742882857.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;"> RNN 模型结构细节</em>
</p>

　　其中：
* $x^{(t)}$ 代表在时刻 $t$ 时训练样本的输入。
* $h^{(t)}$ 代表在时刻 $t$ 时模型的隐藏状态。$h^{(t)}$ 由 $x^{(t)}$ 和 $h^{(t-1)}$ 共同决定。
* $o^{(t)}$ 代表在时刻 $t$ 时模型的输出。$o^{(t)}$ 只由模型当前的隐藏状态 $h^{(t)}$ 决定。
* $L^{(t)}$ 代表在时刻 $t$ 时模型的损失函数。
* $y^{(t)}$ 代表在时刻 $t$ 时训练样本序列的真实输出。
* $U, W, V$ 这三个矩阵是我们的模型的线性关系参数，它在整个 RNN 网络中是**共享**的，这点和 DNN 很不相同。也正因为是共享了，它体现了 RNN 的模型的“循环反馈”的思想。

　　基于上述符号标定，对于任意一个时刻 $t$，隐藏状态 $h^{(t)}$ 由 $x^{(t)}$ 和 $h^{(t-1)}$ 得到：

$$
h^{(t)}=\sigma\left(z^{(t)}\right)=\sigma\left(U x^{(t)}+W h^{(t-1)}+b\right)
$$

　　其中 $\sigma$ 为 RNN 的激活函数，一般为 tanh，$b$ 为线性关系的偏置。

　　时刻 $t$ 时模型的输出 $o^{(t)}$ 的表达式比较简单：

$$
o^{(t)}=V h^{(t)}+c
$$

　　最终在时刻 $t$ 是预测输出为：

$$
\hat{y}^{(t)}=\sigma\left(o^{(t)}\right)
$$

　　通常由于 RNN 是识别类的分类模型，所以上面这个激活函数一般是 softmax。通过损失函数 $L^{(t)}$，比如对数似然损失函数，我们可以量化模型在当前位置的损失，即 $\hat{y}^{(t)}$ 和 $y^{(t)}$ 的差距。这一部分是 RNN **前向传播**的过程。

　　对于 RNN 的后向传播算法思路和 DNN 是一样的，通过梯度下降一轮轮迭代更新并得到合适的参数 $U, W, V, b, c$，由于 RNN 是基于时间的反向传播，所以也被叫做 BPTT（BackPropagation Through Time）。与 DNN 反向传播的较大不同点在于 $U, W, V, b, c$ 在各个时刻都是共享的，也就是说反向传播更新的是相同的参数。

　　为了简化描述，这里的损失函数我们为交叉熵损失函数，输出的激活函数为 softmax 函数，隐藏层的激活函数为 tanh 函数。

　　对于 RNN，由于我们在序列的每个位置都有损失函数，因此最终的损失 $L$ 为：

$$
L=\sum_{t=1}^{\tau} L^{(t)}
$$

　　其中 $V$, $c$, 的梯度计算是比较简单的：

$$
\begin{array}{c}{\frac{\partial L}{\partial c}=\sum_{t=1}^{\tau} \frac{\partial L^{(t)}}{\partial c}=\sum_{t=1}^{\tau} \frac{\partial L^{(t)}}{\partial o^{(t)}} \frac{\partial o^{(t)}}{\partial c}=\sum_{t=1}^{\tau} \hat{y}^{(t)}-y^{(t)}} \\ {\frac{\partial L}{\partial V}=\sum_{t=1}^{\tau} \frac{\partial L^{(t)}}{\partial V}=\sum_{t=1}^{\tau} \frac{\partial L^{(t)}}{\partial o^{(t)}} \frac{\partial o^{(t)}}{\partial V}=\sum_{t=1}^{\tau}\left(\hat{y}^{(t)}-y^{(t)}\right)\left(h^{(t)}\right)^{T}}\end{array}
$$

　　但是 $W,U,b$ 的梯度计算就相对复杂一些。从 RNN 的模型可以看出，在反向传播时，在某一时刻 $t$ 的梯度损失由当前位置的输出对应的梯度损失和时刻 $t+1$ 的梯度损失两部分共同决定。对于 $W$ 在某一序列位置 $t$ 的梯度损失需要反向传播一步步的计算。我们定义时刻 $t$ 位置的隐藏状态的梯度（误差）为：

$$
\delta^{(t)}=\frac{\partial L}{\partial h^{(t)}}
$$

　　这样我们可以像 DNN 一样从 $\delta^{(t+1)}$ 递推 $\delta^{(t)}$。

$$
\delta^{(t)}=\frac{\partial L}{\partial o^{(t)}} \frac{\partial o^{(t)}}{\partial h^{(t)}}+\frac{\partial L}{\partial h^{(t+1)}} \frac{\partial h^{(t+1)}}{\partial h^{(t)}}=V^{T}\left(\hat{y}^{(t)}-y^{(t)}\right)+W^{T} \delta^{(t+1)} \operatorname{diag}\left(1-\left(h^{(t+1)}\right)^{2}\right)
$$

　　对于 $\delta^{(t)}$，由于它的后面没有其他时刻状态了，因此有：

$$
\delta^{(\tau)}=\frac{\partial L}{\partial o^{(\tau)}} \frac{\partial o^{(\tau)}}{\partial h^{(\tau)}}=V^{T}\left(\hat{y}^{(\tau)}-y^{(\tau)}\right)
$$

　　有了 $\delta^{(t)}$，计算 $W,U,b$ 就容易了，这里给出 $W,U,b$ 的梯度计算表达式：

$$
\begin{array}{c}{\frac{\partial L}{\partial W}=\sum_{t=1}^{\tau} \frac{\partial L}{\partial h^{(t)}} \frac{\partial h^{(t)}}{\partial W}=\sum_{t=1}^{\tau} \operatorname{diag}\left(1-\left(h^{(t)}\right)^{2}\right) \delta^{(t)}\left(h^{(t-1)}\right)^{T}} \\ {\frac{\partial L}{\partial b}=\sum_{t=1}^{\tau} \frac{\partial L}{\partial h^{(t)}} \frac{\partial h^{(t)}}{\partial b}=\sum_{t=1}^{\tau} \operatorname{diag}\left(1-\left(h^{(t)}\right)^{2}\right) \delta^{(t)}} \\ {\frac{\partial L}{\partial U}=\sum_{t=1}^{\tau} \frac{\partial L}{\partial h^{(t)}} \frac{\partial h^{(t)}}{\partial U}=\sum_{t=1}^{\tau} \operatorname{diag}\left(1-\left(h^{(t)}\right)^{2}\right) \delta^{(t)}\left(x^{(t)}\right)^{T}}\end{array}
$$

> **RNN 反向传播算法描述 待整理**
1. **输入 $x$**：为输入层设置对应的激活值 $h^1$。
2. **前向传播**：对每个 $l=2, 3, \dots, L$ 计算相应的 $z^{l}=w^{l} a^{l-1}+b^{l}$ 和 $a^{l}=\sigma\left(z^{l}\right)$。
3. **输出层误差 $\delta^{L}$**：计算向量 $\delta^{L}=\nabla_{a} C \odot \sigma^{\prime}\left(z^{L}\right)$。
4. **反向误差传播**：对每个 $l=L-1, L-2, \dots, 2$，计算 $\delta^{l}=\left(\left(w^{l+1}\right)^{T} \delta^{l+1}\right) \odot \sigma^{\prime}\left(z^{l}\right)$。
5. **输出**：代价函数的梯度由 $\frac{\partial C}{\partial w_{j k}^{l}}=a_{k}^{l-1} \delta_{j}^{l}$ 和 $\frac{\partial C}{\partial b_{j}^{l}}=\delta_{j}^{l}$ 得出，然后通过权重更新的公式更新 $w^l$ 和 $b^l$。


![](/img/media/15560770783992.jpg)


## References
1. [Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)
2. [The Unreasonable Effectiveness of Recurrent Neural Networks](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
3. [循环神经网络(RNN)模型与前向反向传播算法](https://www.cnblogs.com/pinard/p/6509630.html)
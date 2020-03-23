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

　　循环神经网络（Recurrent Neural Network, RNN）作为深度学习的一个重要网络，可以将其看成带记忆的神经网络，主要解决的是样本数据为序列的建模问题，如语音序列，语言序列。

{% include toc.html %}

　　之前的神经网路在输入和输入之间没有保存任何状态，他们的操作是将数据一次一股脑扔给网络，得到最后结果。然而对于有前后关联的数据，例如文本、语音，这样的做法可能不好，失去了上下文特征。那么我们需要一种串行输入数据的处理方式，并能够利用到之前输入的数据。

　　RNN 就有这样的特性，可以将其视作带记忆的神经网络，输入数据的方式是按照时间轴的方式顺序串行处理。

## 1. RNN 原理
　　给定一个长度为 $T$ 输入序列 $ \\{ x_{0}, x_{1},..., x_{t},...,x_{T} \\}$，这里 $x_{t}$ 表示的是序列在 $t$ 时刻的输入特征向量，这里的 $t$ 时刻并不一定真的指的是时间，只是用来表明这是一个序列输入问题。现在要得到每个时刻的隐含特征 $ \\{ h_{0}, h_{1},..., h_{t},...,h_{T}\\} $，这些隐含特征用做后面层的特征输入。如果采用传统的神经网络模型，只需要计算：

$$
h_{t}=f(Ux_{t}+b)
$$

　　其中 $f$ 为非线性激活函数。为了考虑前一时刻的特征，需要在公式中引入前一个时刻的隐含特征 $h_{t-1} $，其计算过程如下：

$$
h_{t}=f(Ux_{t}+Wh_{t-1}+b)
$$

　　那么这样就可以捕捉到序列中的依赖关系，我们可以认为新加入的 $h_{t-1}$ 是一个记忆特征，它提取了前面 $t-1$ 个时刻的输入特征，有时候又称 $h_{t-1}$ 为旧状态，而 $h_{t}$ 为新状态。因此，RNN 模型特别适合序列问题。

<p align="center">
<img src="/img/media/15560242719743.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;"> RNN 模型及展开简图</em>
</p>

　　从结构上看，RNN 可以看成有环的神经网络模型，如上图所示。不过可以将其展开成普通的神经网络模型，即展开成 $T$ 个普通的神经网络模型。但是这 $T$ 个神经网络不是割立的，其所使用参数是一样的，即权重共享（这里的 $U$ 和 $W$ 相同）。这样每一个时刻，RNN 执行的是相同的计算过程，只不过其输入不一样而已。所以本质上，RNN 也只不过多个普通的神经网络通过权值共享连接而成。

　　还有一点，RNN 虽然可以提取一组特征 $\{ h_{0}, h_{1},..., h_{t},...,h_{T}\}$，但是并不是所有的特征都会送入后面的层，如果你只是需要根据输入序列进行分类，可能你仅需要最后时刻的特征 $h_{T}$。RNN 结果可以是序列的，这当然和具体的应用场景相关。

<p align="center">
<img src="/img/media/15560255518749.jpg" width="">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;"> RNN 输入输出类型</em>
</p>

　　如上图所示，我们针对不同的场景需要，可以配置不同的 RNN 输出类型。


## 2. RNN 的训练
　　RNN 的训练同样也可以用后向传播算法。

　　首先，我们将注意力放到时刻 $t$ 附近：

<p align="center">
<img src="/img/media/15560742882857.jpg" width="500">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;"> RNN 模型结构细节</em>
</p>

　　图中的变量表示：
* $x^{(t)}$ 代表在时刻 $t$ 时训练样本的输入。
* $h^{(t)}$ 代表在时刻 $t$ 时模型的隐藏状态，$h^{(t)}$ 由 $x^{(t)}$ 和 $h^{(t-1)}$ 共同决定。
* $o^{(t)}$ 代表在时刻 $t$ 时模型的输出，$o^{(t)}$ 只由模型当前的隐藏状态 $h^{(t)}$ 决定。
* $L^{(t)}$ 代表在时刻 $t$ 时模型的损失函数值。
* $y^{(t)}$ 代表在时刻 $t$ 时训练样本序列的真实输出。
* $U, W, V$ 这三个矩阵是我们的模型的线性关系参数
    * 隐藏单元到隐藏单元的循环连接由权重矩阵 $W$ 参数化
    * 输入到隐藏单元的连接由权重矩阵 $U$ 参数化
    * 隐藏单元到输出的连接由权重矩阵 $V$ 参数化
    * 这三个参数在整个 RNN 网络中是**共享**的，这点和 DNN 很不相同。
    * 正因为参数共享，它体现了 RNN 的模型的“循环反馈”的思想。

### 2.1 RNN 的前向传播

　　基于上述符号标定，对于任意一个时刻 $t$，隐藏状态 $h^{(t)}$ 由 $x^{(t)}$ 和 $h^{(t-1)}$ 得到：

$$
h^{(t)}=\sigma\left(z^{(t)}\right)=\sigma\left(U x^{(t)}+W h^{(t-1)}+b\right)
$$

　　其中 $\sigma$ 为 RNN 的激活函数，一般为 tanh，注意要与图中的模型输出 $o$ 区别开。$b$ 为线性关系的偏置。

　　时刻 $t$ 时模型的输出 $o^{(t)}$ 的表达式比较简单：

$$
o^{(t)}=V h^{(t)}+c
$$

　　其中 $c$ 也是线性关系的偏置。

　　最终在时刻 $t$ 是预测输出为：

$$
\widehat{y}^{(t)}=\sigma\left(o^{(t)}\right)
$$

　　通常由于 RNN 是识别类的分类模型，所以上面这个激活函数一般是 softmax。通过损失函数 $L^{(t)}$，比如对数似然损失函数，我们可以量化模型在当前位置的损失，即 $\hat{y}^{(t)}$ 和 $y^{(t)}$ 的差距。

　　这里假如 $L^{(t)}$ 为给定的 $x^{(1)}, x^{(2)}, \dots, x^{(t)}$ 后 $y^{(t)}$ 的负对数似然，则有：

$$
\begin{array}{l}L\left(\left\{\boldsymbol{x}^{(1)}, \ldots, \boldsymbol{x}^{(\tau)}\right\},\left\{\boldsymbol{y}^{(1)}, \ldots, \boldsymbol{y}^{(\tau)}\right\}\right) \\ =\sum_{t} L^{(t)} \\ =-\sum_{t} \log p_{\text {model }}\left(y^{(t)} |\left\{\boldsymbol{x}^{(1)}, \ldots, \boldsymbol{x}^{(t)}\right\}\right)\end{array}
$$

　　其中 $p_{\text{model}}\left(y^{(t)} \mid \left\{x^{(1)}, \ldots, x^{(t)}\right\}\right)$ 需要读取模型输出向量 $\widehat{y}^{(t)}$ 中对应于 $y^{(t)}$ 的项。



　　以上过程就是 RNN **前向传播**的过程。

### 2.2 RNN 的后向传播

　　对于 RNN 的后向传播算法思路和 DNN 是一样的，通过梯度下降一轮轮迭代更新并得到合适的参数 $U$，$W$，$V$，$b$，$c$，由于 RNN 是基于时间的反向传播，所以也被叫做**通过时间反向传播**（BackPropagation Through Time，BPTT）。与 DNN 反向传播的较大不同点在于 $U, W, V, b, c$ 在各个时刻都是共享的，也就是说反向传播更新的是相同的参数。

　　为了简化描述，这里的损失函数我们为交叉熵损失函数，输出的激活函数为 softmax 函数，即我们可以将输出 $o^{(t)}$ 作为 softmax 函数的参数，计算出关于输出概率的向量 $\widehat{y}$，隐藏层的激活函数为 tanh 函数。

　　对于 RNN，由于我们在序列的每个位置都有损失函数，因此最终的损失 $L$ 为：

$$
L=\sum_{t=1}^{\tau} L^{(t)}
$$

　　那么，对于 $t$ 时刻损失偏导：

$$
\frac{\partial L}{\partial L^{(t)}}=1
$$

　　对于所有的 $i$ 和 $t$，关于时间步 $t$ 输出的梯度：

$$
\left(\nabla_{o^{(t)}} L\right)_{i}=\frac{\partial L}{\partial o_{i}^{(t)}}=\frac{\partial L}{\partial L^{(t)}} \frac{\partial L^{(t)}}{\partial o_{i}^{(t)}}=\hat{y}_{i}^{(t)}-\mathbf{1}_{i, y^{(t)}}
$$

　　我们从序列末尾往前走，反向进行计算。在最后时间步 $\tau$，$\boldsymbol{h}^{(\tau)}$ 只有 $\boldsymbol{o}^{(\tau)}$ 作为后续节点。那么对于隐藏状态的梯度计算比较简单：

$$
\nabla_{h^{(\tau)}} L=\boldsymbol{V}^{\top} \nabla_{o^{(\tau)}} L
$$

　　接着从时刻 $t=\tau-1$ 到 $t=1$ 反向迭代，通过时间反向传播梯度。注意 $\boldsymbol{h}^{(t)}(t<\tau)$ 同时具有 $\boldsymbol{o}^{(t)}$ 和 $\boldsymbol{h}^{(t+1)}$ 两个后续节点，所以中间时间步的隐藏状态梯度计算公式为：

$$
\begin{array}{l}\nabla_{h^{(t)}} L=\left(\frac{\partial \boldsymbol{h}^{(t+1)}}{\partial \boldsymbol{h}^{(t)}}\right)^{\top}\left(\nabla_{\boldsymbol{h}^{(t+1)}} L\right)+\left(\frac{\partial \boldsymbol{o}^{(t)}}{\partial \boldsymbol{h}^{(t)}}\right)^{\top}\left(\nabla_{\boldsymbol{o}^{(t)}} L\right) \\ =\boldsymbol{W}^{\top}\left(\nabla_{\boldsymbol{h}^{(t+1)}} L\right) \operatorname{diag}\left(1-\left(\boldsymbol{h}^{(t+1)}\right)^{2}\right)+\boldsymbol{V}^{\top}\left(\nabla_{\boldsymbol{o}^{(t)}} L\right)\end{array}
$$

　　其中 $\operatorname{diag}\left(1-\left(\boldsymbol{h}^{(t+1)}\right)^{2}\right)$ 表示包含元素 $1-\left(\boldsymbol{h}^{(t+1)}\right)^{2}$ 的对角矩阵。

　　因为 $U, W, V$ 三个参数在全局共享，为了消除歧义，们可以使用 $\nabla_{\boldsymbol{W}^{(t)}}$ 表示权重在时间步 $t$ 对梯度的贡献，则所有参数的梯度可以表示为：

$$
\begin{aligned} \nabla_{c} L &=\sum_{t}\left(\frac{\partial \boldsymbol{o}^{(t)}}{\partial \boldsymbol{c}}\right)^{\top} \nabla_{o^{(t)}} L=\sum_{t} \nabla_{o^{(t)}} L \\ \nabla_{b} L &=\sum_{t}\left(\frac{\partial \boldsymbol{h}^{(t)}}{\partial \boldsymbol{b}^{(t)}}\right)^{\top} \nabla_{\boldsymbol{h}^{(t)}} L=\sum_{t} \operatorname{diag}\left(1-\left(\boldsymbol{h}^{(t)}\right)^{2}\right) \nabla_{\boldsymbol{h}^{(t)}} L \\ \nabla_{\boldsymbol{V}} L &=\sum_{t} \sum_{i}\left(\frac{\partial L}{\partial o_{i}^{(t)}}\right) \nabla_{\boldsymbol{V}} o_{i}^{(t)}=\sum_{t}\left(\nabla_{\boldsymbol{o}^{(t)}} L\right) \boldsymbol{h}^{(t)^{\top}} \\ \nabla_{\boldsymbol{W}} L &=\sum_{t} \sum_{i}\left(\frac{\partial L}{\partial h_{i}^{(t)}}\right) \nabla_{\boldsymbol{W}^{(t)}} h_{i}^{(t)} \\ &=\sum_{t} \operatorname{diag}\left(1-\left(\boldsymbol{h}^{(t)}\right)^{2}\right)\left(\nabla_{\boldsymbol{h}^{(t)}} L\right) \boldsymbol{h}^{(t-1)^{\top}} \\ \nabla_{\boldsymbol{U}} L &=\sum_{t} \sum_{i}\left(\frac{\partial L}{\partial h_{i}^{(t)}}\right) \nabla_{\boldsymbol{U}^{(t)}} h_{i}^{(t)} \\ &=\sum_{t} \operatorname{diag}\left(1-\left(\boldsymbol{h}^{(t)}\right)^{2}\right)\left(\nabla_{\boldsymbol{h}^{(t)}} L\right) \boldsymbol{x}^{(t)^{\top}} \end{aligned}
$$


<details><summary markdown="span">　　另外，还有一种类似 CNN 后向传播时利用错误小恶魔的计算方式整理，点击 >></summary>

　　对于 RNN，由于我们在序列的每个位置都有损失函数，因此最终的损失 $L$ 为：

$$
L=\sum_{t=1}^{\tau} L^{(t)}
$$

　　所有参数中 $V$ 和 $c$ 的梯度计算是比较简单的：

$$
\begin{array}{c}{\frac{\partial L}{\partial c}=\sum_{t=1}^{\tau} \frac{\partial L^{(t)}}{\partial c}=\sum_{t=1}^{\tau} \frac{\partial L^{(t)}}{\partial o^{(t)}} \frac{\partial o^{(t)}}{\partial c}=\sum_{t=1}^{\tau} \hat{y}^{(t)}-y^{(t)}} \\ {\frac{\partial L}{\partial V}=\sum_{t=1}^{\tau} \frac{\partial L^{(t)}}{\partial V}=\sum_{t=1}^{\tau} \frac{\partial L^{(t)}}{\partial o^{(t)}} \frac{\partial o^{(t)}}{\partial V}=\sum_{t=1}^{\tau}\left(\hat{y}^{(t)}-y^{(t)}\right)\left(h^{(t)}\right)^{T}}\end{array}
$$

　　但是 $W,U,b$ 的梯度计算就相对复杂一些。从 RNN 的模型可以看出，在反向传播时，在某一时刻 $t$ 的梯度损失由当前位置的输出对应的梯度损失和时刻 $t+1$ 的梯度损失两部分共同决定。对于 $W$ 在某一序列位置 $t$ 的梯度损失需要反向传播一步步的计算。我们定义时刻 $t$ 位置的隐藏状态的梯度（误差）为：

$$
\delta^{(t)}=\frac{\partial L}{\partial h^{(t)}}
$$

　　这样我们可以像 DNN 一样从 $\delta^{(t+1)}$ 递推 $\delta^{(t)}$。

$$
\begin{aligned} \delta^{(t)} &=\frac{\partial L}{\partial o^{(t)}} \frac{\partial o^{(t)}}{\partial h^{(t)}}+\frac{\partial L}{\partial h^{(t+1)}} \frac{\partial h^{(t+1)}}{\partial h^{(t)}} \\ &=V^{T}\left(\hat{y}^{(t)}-y^{(t)}\right)+W^{T} \delta^{(t+1)} \text{diag}\left(1-\left(h^{(t+1)}\right)^{2}\right) \end{aligned}
$$

　　对于 $\delta^{(t)}$，由于它的后面没有其他时刻状态了，因此有：

$$
\delta^{(\tau)}=\frac{\partial L}{\partial o^{(\tau)}} \frac{\partial o^{(\tau)}}{\partial h^{(\tau)}}=V^{T}\left(\hat{y}^{(\tau)}-y^{(\tau)}\right)
$$

　　有了 $\delta^{(t)}$，计算 $W,U,b$ 就容易了，这里给出 $W,U,b$ 的梯度计算表达式：

$$
\begin{array}{c}{\frac{\partial L}{\partial W}=\sum_{t=1}^{\tau} \frac{\partial L}{\partial h^{(t)}} \frac{\partial h^{(t)}}{\partial W}=\sum_{t=1}^{\tau} \text{diag}\left(1-\left(h^{(t)}\right)^{2}\right) \delta^{(t)}\left(h^{(t-1)}\right)^{T}} \\ {\frac{\partial L}{\partial b}=\sum_{t=1}^{\tau} \frac{\partial L}{\partial h^{(t)}} \frac{\partial h^{(t)}}{\partial b}=\sum_{t=1}^{\tau} \text{diag}\left(1-\left(h^{(t)}\right)^{2}\right) \delta^{(t)}} \\ {\frac{\partial L}{\partial U}=\sum_{t=1}^{\tau} \frac{\partial L}{\partial h^{(t)}} \frac{\partial h^{(t)}}{\partial U}=\sum_{t=1}^{\tau} \text{diag}\left(1-\left(h^{(t)}\right)^{2}\right) \delta^{(t)}\left(x^{(t)}\right)^{T}}\end{array}
$$

</details>



> **RNN 反向传播算法描述 待整理**
1. **输入 $x$**：为输入层设置对应的激活值 $h^1$。
2. **前向传播**：对每个 $l=2, 3, \dots, L$ 计算相应的 $z^{l}=w^{l} a^{l-1}+b^{l}$ 和 $a^{l}=\sigma\left(z^{l}\right)$。
3. **输出层误差 $\delta^{L}$**：计算向量 $\delta^{L}=\nabla_{a} C \odot \sigma^{\prime}\left(z^{L}\right)$。
4. **反向误差传播**：对每个 $l=L-1, L-2, \dots, 2$，计算 $\delta^{l}=\left(\left(w^{l+1}\right)^{T} \delta^{l+1}\right) \odot \sigma^{\prime}\left(z^{l}\right)$。
5. **输出**：代价函数的梯度由 $\frac{\partial C}{\partial w_{j k}^{l}}=a_{k}^{l-1} \delta_{j}^{l}$ 和 $\frac{\partial C}{\partial b_{j}^{l}}=\delta_{j}^{l}$ 得出，然后通过权重更新的公式更新 $w^l$ 和 $b^l$。

### 2.3 网络结构深入理解
　　我们也是用图片作为例子，看一下 RNN 是怎么操作的，我们把图片拉成一个一个 pixel，每个 pixel 对应一个输入，且每一个 pixel 有三通道。

<p align="center">
<img src="/img/media/15560770783992.jpg" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">RNN 全连接结构</em>
</p>


　　先思考一下 RNN 在这个图上是怎么运行的。

<p align="center">
<img src="/img/media/20180917195028940.gif" width="600">
</p>
<p style="margin-top:-2.5%" align="center">
    <em style="color:#808080;font-style:normal;font-size:80%;">RNN 的动态运行过程</em>
</p>

　　可以从标不同颜色的部分看出，之前的状态能传到后面。

## 3. 总结
优点：
* 能够处理时序性数据

缺点：
* 虽然简单循环网络理论上可以建立长时间间隔的状态之间的依赖关系，但是由于梯度爆炸或消失问题，实际上只能学习到短期（两个时间间隔不能太长）的依赖关系。

## References
1. [Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)
2. [The Unreasonable Effectiveness of Recurrent Neural Networks](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
3. [循环神经网络(RNN)模型与前向反向传播算法](https://www.cnblogs.com/pinard/p/6509630.html)
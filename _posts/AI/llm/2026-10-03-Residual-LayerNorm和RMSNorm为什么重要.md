---
layout: post
title: Residual、LayerNorm 和 RMSNorm 为什么重要？
subtitle: 深层 Transformer 怎样保留信息并让数值保持稳定
tags: [大模型, LLM, Transformer, 深度学习]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,800px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:305px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十课目录</strong><a href="#1为什么深层网络难训练">1、深层网络的困难</a><a href="#2residual给信息留一条直路">2、Residual</a><a href="#3norm-到底在归一化什么">3、Norm 的对象</a><a href="#4layernorm-怎样计算">4、LayerNorm</a><a href="#5rmsnorm-省略了什么">5、RMSNorm</a><a href="#6pre-norm-与-post-norm">6、Pre / Post-Norm</a><a href="#7放回-transformer-block">7、放回 Block</a><a href="#第十课复习总图">复习总图</a></nav></details>

　　上一课打开 Transformer Block，看到每个子层都有一条残差路径，前面还有一次 RMSNorm。它们看起来不像 Attention 那样“聪明”，却决定了几十层甚至上百层的模型能不能稳定训练。

　　Residual 解决的是信息和梯度如何穿过深层网络，Norm 解决的是每一层接收到的数值尺度是否稳定。两者分工不同，又必须配合使用。

> Residual 给信息留一条直路，Norm 把送进子层的数值调到合适尺度。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-Residual-LayerNorm和RMSNorm为什么重要/residual-and-normalization.svg" target="_blank" title="点击查看原始 SVG">
    <img src="/img/AI/llm-learning/2026-10-03-Residual-LayerNorm和RMSNorm为什么重要/residual-and-normalization.svg" alt="Residual LayerNorm RMSNorm 对比" style="display:block;width:100%;max-width:none;">
  </a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">Residual、LayerNorm、RMSNorm 与 Pre-Norm，点击查看原始 SVG</p>
</div>

## 1、为什么深层网络难训练

　　如果把很多非线性子层首尾相接，每一层都完全改写上一层的输出，会遇到两个直观问题：

1. 原始信息经过很多次变换后更容易丢失。
2. 反向传播要连续穿过每个子层，梯度可能变得过大、过小或不稳定。

　　同时，不同层输出的数值范围可能逐渐漂移。后一层今天接到很大的数，下一步又接到很小的数，学习会变得困难。

　　Residual 和 Norm 就是在改善这两个问题。

## 2、Residual：给信息留一条直路

　　普通子层直接输出 $F(x)$，残差结构则输出：

$$
y=x+F(x)
$$

　　这里的 $x$ 沿旁路直接到达输出，$F(x)$ 只需要学习“在原表示上补充什么”。如果当前子层暂时学不到有用内容，只要 $F(x)$ 接近 0，信息仍可以近似原样通过。

　　反向传播时也多了一条直接路径：

$$
\frac{\partial y}{\partial x}=I+\frac{\partial F(x)}{\partial x}
$$

　　式子里的 $I$ 来自那条不经过子层的旁路。它不能保证训练永远不会出问题，但能显著改善深层网络中的梯度传播。

　　残差是逐元素相加，不是拼接。因此 $x$ 与 $F(x)$ 的形状必须相同。

## 3、Norm 到底在归一化什么

　　在 Transformer 中，LayerNorm 和 RMSNorm 通常对**每个 Token 自己的隐藏维度**做计算。

　　假设张量形状是 `[B, T, d_model]`，那么每个 Token 都有一条长度为 `d_model` 的向量。Norm 会分别处理这 `B×T` 条向量，而不是把整个 Batch 混在一起。

```text
Token A：[0.2, -1.1, 0.7, ...]  → 单独归一化
Token B：[3.4,  0.5, 1.2, ...]  → 单独归一化
```

　　因此，LayerNorm 与 BatchNorm 的对象不同。LLM 的序列长度和 Batch Size 经常变化，按 Token 隐藏维归一化更自然。

## 4、LayerNorm 怎样计算

　　对一个 Token 的向量 $x=(x_1,\ldots,x_d)$，LayerNorm 先求均值与方差：

$$
\mu=\frac{1}{d}\sum_{i=1}^{d}x_i
$$

$$
\sigma^2=\frac{1}{d}\sum_{i=1}^{d}(x_i-\mu)^2
$$

　　然后执行：

$$
LayerNorm(x)=\gamma\odot\frac{x-\mu}{\sqrt{\sigma^2+\epsilon}}+\beta
$$

　　减去均值让结果重新居中，除以标准差让尺度更稳定。γ 和 β 是可学习参数，让模型可以重新缩放和平移；ε 是防止除以零的小常数。

## 5、RMSNorm 省略了什么

　　RMSNorm 不减均值，只根据均方根调整尺度：

$$
RMS(x)=\sqrt{\frac{1}{d}\sum_{i=1}^{d}x_i^2+\epsilon}
$$

$$
RMSNorm(x)=\gamma\odot\frac{x}{RMS(x)}
$$

　　它保留了 LayerNorm 中最关键的尺度控制，但省去了重新居中的计算，形式更简单。Llama 等现代大模型广泛使用 RMSNorm。

| 对比 | LayerNorm | RMSNorm |
|---|---|---|
| 是否减均值 | 是 | 否 |
| 缩放依据 | 标准差 | 均方根 |
| 可学习参数 | 通常有 γ、β | 通常有 γ |
| 主要目标 | 调整中心与尺度 | 主要调整尺度 |
| 常见位置 | Transformer、视觉与通用网络 | Llama 等现代 LLM |

　　RMSNorm 更简单，不代表它在任何模型中都必然更好。架构选择仍要结合训练稳定性和实验结果。

## 6、Pre-Norm 与 Post-Norm

　　Norm 放在子层之前还是之后，会形成两种结构。

```text
Pre-Norm： x + Sublayer(Norm(x))
Post-Norm：Norm(x + Sublayer(x))
```

　　原始 Transformer 使用 Post-Norm。许多现代大模型采用 Pre-Norm，因为残差主路径更直接，深层训练通常更稳定。

　　代价是 Pre-Norm 的不同层可能更接近“在同一条主干上做增量修正”。实际模型通常还会在全部 Block 之后放一次最终 Norm，再送入 LM Head。

## 7、放回 Transformer Block

　　上一课的两行结构现在可以看得更具体：

```python
# Attention 子层
h = x + attention(rms_norm_1(x))

# FFN 子层
y = h + ffn(rms_norm_2(h))
```

　　注意这两条路径的分工：

| 路径 | 经过什么 | 负责什么 |
|---|---|---|
| 残差主路径 | 直接从输入到加法节点 | 保留信息和梯度通路 |
| 子层路径 | Norm → Attention / FFN | 计算需要增加的变化量 |

　　Norm 不会替代 Residual，Residual 也不会替代 Norm。一个稳定输入尺度，一个提供直接通路，共同让 Block 可以连续堆叠。

## 一个小例子

　　假设某个 Token 的隐藏向量是：

```text
x = [2, 4, 6, 8]
```

　　LayerNorm 会先减去均值 5，再按标准差缩放，所以结果围绕 0 分布。RMSNorm 不减 5，只按向量整体大小缩放，所以仍保留各维度原来的正负与相对方向。

　　这里不必手算每个小数，真正要记住的是：LayerNorm 同时调整中心和尺度，RMSNorm 主要调整尺度。

## 容易混淆的 4 件事

1. **Norm 不会在不同 Token 之间传递信息。** 它分别处理每个 Token 的隐藏向量。
2. **Residual 不是把两份向量拼起来。** 它执行逐元素相加。
3. **RMSNorm 不是没有可学习参数。** 它通常保留缩放参数 γ。
4. **Pre-Norm 和 Post-Norm 的差异不只是代码顺序。** 它会影响残差路径和训练行为。

## 记住这 5 件事

1. Residual 让子层只学习需要补充的变化量。
2. 残差旁路为信息和梯度提供更直接的通道。
3. LayerNorm 会减均值并按标准差缩放。
4. RMSNorm 不减均值，主要按均方根调整尺度。
5. 现代 LLM 常用 `x + Sublayer(RMSNorm(x))` 的 Pre-Norm 结构。

## 第十课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-Residual-LayerNorm和RMSNorm为什么重要/tenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG">
    <img src="/img/AI/llm-learning/2026-10-03-Residual-LayerNorm和RMSNorm为什么重要/tenth-lesson-summary.svg" alt="大模型第十课复习总图" style="display:block;width:100%;max-width:none;">
  </a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第十课复习总图，点击查看原始 SVG</p>
</div>

　　下一课继续看另一个基础问题：**模型没有钟表和坐标，怎样知道 Token 的先后顺序？**

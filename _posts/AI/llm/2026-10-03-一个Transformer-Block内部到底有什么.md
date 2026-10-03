---
layout: post
title: 一个 Transformer Block 内部到底有什么？
subtitle: 看懂 Attention、FFN、RMSNorm 与残差连接怎样协作
tags: [大模型, LLM, Transformer, 深度学习]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,800px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:300px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第九课目录</strong><a href="#1block-是模型的基本积木">1、基本积木</a><a href="#2先看完整数据流">2、完整数据流</a><a href="#3attention负责-token-之间交流">3、Attention</a><a href="#4ffn-负责逐个-token-加工">4、FFN</a><a href="#5残差连接保留原始信息">5、Residual</a><a href="#6norm-让数值保持稳定">6、Norm</a><a href="#7形状为什么始终不变">7、形状变化</a><a href="#第九课复习总图">复习总图</a></nav></details>

　　第一课里，我们把 Transformer 当成一个黑盒：Token 向量进去，带有上下文的信息出来。现在把黑盒打开一层。

　　大语言模型并不是只有一个巨大的 Transformer。它会把结构相同的 Transformer Block 堆叠很多次。每个 Block 都做两件核心工作：让 Token 之间交换信息，再分别加工每个 Token 的表示。

> Attention 负责“彼此交流”，FFN 负责“各自加工”；Residual 和 Norm 让这两步能够稳定地重复很多层。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-一个Transformer-Block内部到底有什么/transformer-block.svg" target="_blank" title="点击查看原始 SVG">
    <img src="/img/AI/llm-learning/2026-10-03-一个Transformer-Block内部到底有什么/transformer-block.svg" alt="Transformer Block 内部数据流" style="display:block;width:100%;max-width:none;">
  </a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">一个 Pre-Norm Transformer Block 的完整数据流，点击查看原始 SVG</p>
</div>

## 1、Block 是模型的基本积木

　　假设输入隐藏状态是：

$$
x\in\mathbb{R}^{B\times T\times d_{model}}
$$

　　一个 Block 接收 `x`，输出形状相同的新隐藏状态。然后，这个输出会成为下一个 Block 的输入。

```text
Embedding → Block 1 → Block 2 → ... → Block N → LM Head
```

　　层数越多，Token 表示经历的交流和加工次数越多。但所有 Block 不共享参数：结构看起来相同，每一层学到的权重却不同。

## 2、先看完整数据流

　　以 Llama 一类模型常见的 Pre-Norm 结构为例，一个 Block 可以写成两行：

$$
h=x+Attention(RMSNorm(x))
$$

$$
y=h+FFN(RMSNorm(h))
$$

　　第一行是 Attention 子层，第二行是 FFN 子层。每个子层前先做 Norm，子层输出再与原输入相加。

```python
def forward(x):
    x = x + attention(rms_norm_1(x))
    x = x + ffn(rms_norm_2(x))
    return x
```

　　真实代码还会处理位置编码、Attention Mask、Dropout 或缓存，但骨架就是这两次“Norm → 子层 → Add”。

## 3、Attention：负责 Token 之间交流

　　Attention 是 Block 中唯一让不同位置直接交换信息的部分。

　　例如句子“苹果发布了新手机，它很受欢迎”中，“它”的表示可以从“苹果”和“新手机”等 Token 获取信息。经过 Attention 后，每个位置仍然对应一个 Token，但向量已经融入了其他位置的上下文。

| 输入 | Attention 做的事 | 输出 |
|---|---|---|
| `[B, T, d_model]` | 不同 Token 按相关性汇总信息 | `[B, T, d_model]` |

　　Q、K、V、RoPE、GQA 等细节并没有消失，只是都包含在 Attention 这个子层内部。

## 4、FFN：负责逐个 Token 加工

　　Attention 完成交流后，FFN 会对每个 Token 的向量单独做非线性变换。它不会在 Token 之间传递信息，同一套参数会应用在所有位置上。

　　经典 FFN 可以理解为先升维、激活，再降回原维度：

$$
[B,T,d_{model}]\rightarrow[B,T,d_{ff}]\rightarrow[B,T,d_{model}]
$$

　　$d_{ff}$ 通常大于 $d_{model}$，像是先把每个 Token 放到更宽的工作空间里加工，再压回原来的宽度。现代模型常使用 SwiGLU，但它仍属于“逐 Token 加工”的 FFN。

## 5、Residual：保留原始信息

　　如果每个子层都完全覆盖输入，几十甚至上百层之后，早期信息和梯度都更难保留。残差连接直接把输入加回来：

$$
output=input+sublayer(input)
$$

　　可以把子层理解为只学习“这一次需要补充或修正什么”，而不是从头重写整个表示。

　　图中的弧形旁路就是残差路径。它绕过 Attention 或 FFN，在末端执行逐元素相加，因此两边的形状必须相同。

## 6、Norm：让数值保持稳定

　　Block 重复很多层时，隐藏状态的数值尺度可能不断变化。Norm 会把输入调整到更稳定的尺度，让后续子层更容易训练。

　　现代 LLM 常用 RMSNorm，并把 Norm 放在 Attention 和 FFN 之前，因此叫 Pre-Norm。Norm 不负责 Token 交流，也不会改变张量形状。

| 组件 | 主要作用 | 会混合 Token 吗 | 改变最终形状吗 |
|---|---|:---:|:---:|
| RMSNorm | 稳定数值尺度 | 否 | 否 |
| Attention | 汇总其他 Token 的信息 | 是 | 否 |
| FFN | 逐 Token 非线性加工 | 否 | 否 |
| Residual | 保留输入、帮助梯度传播 | 否 | 否 |

## 7、形状为什么始终不变

　　Block 内部可以暂时升维、拆成多个 Head，但入口和出口都保持 `[B, T, d_model]`。这样做有两个直接好处：

1. 残差连接能够逐元素相加。
2. 相同结构可以直接堆叠，不需要为每一层设计新的接口。

```text
输入 x            [B, T, d_model]
Attention 输出    [B, T, d_model]
第一次相加 h       [B, T, d_model]
FFN 输出          [B, T, d_model]
Block 输出 y      [B, T, d_model]
```

　　“形状没变”不代表内容没变。每经过一个 Block，同一个 Token 的向量都包含了新的上下文和新的特征。

## 堆叠很多层之后发生什么

　　早期层往往处理更局部、更表面的模式；更深层可以组合更复杂的关系。这里不必把每层机械地分配成某种固定功能，重要的是：每一层都在已有表示上继续交流和加工。

```text
第 0 层：初始 Token 表示
第 1 层：交流一次、加工一次
第 2 层：在新表示上再次交流、加工
...
第 N 层：得到送给 LM Head 的最终隐藏状态
```

## 容易混淆的 4 件事

1. **一个 Block 不等于整个 Transformer。** 模型通常会堆叠很多个 Block。
2. **Attention 与 FFN 分工不同。** 前者混合 Token，后者逐 Token 处理。
3. **Residual 不是拼接。** 它要求形状相同，并执行逐元素相加。
4. **Block 输入输出形状相同，不代表向量内容相同。** 表示已经被上下文化和加工。

## 记住这 5 件事

1. Transformer Block 是大模型反复堆叠的基本单元。
2. 一个现代 Pre-Norm Block 通常有 Attention 和 FFN 两个子层。
3. Attention 让 Token 交流，FFN 单独加工每个 Token。
4. 每个子层前做 Norm，子层后通过 Residual 加回输入。
5. Block 的输入输出都是 `[B, T, d_model]`，因此可以连续堆叠。

## 第九课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-一个Transformer-Block内部到底有什么/ninth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG">
    <img src="/img/AI/llm-learning/2026-10-03-一个Transformer-Block内部到底有什么/ninth-lesson-summary.svg" alt="大模型第九课复习总图" style="display:block;width:100%;max-width:none;">
  </a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第九课复习总图，点击查看原始 SVG</p>
</div>

　　下一课继续追问：**Residual、LayerNorm 和 RMSNorm 为什么能让深层模型更容易训练？**

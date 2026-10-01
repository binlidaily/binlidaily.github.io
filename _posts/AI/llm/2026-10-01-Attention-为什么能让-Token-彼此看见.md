---
layout: post
title: Attention 为什么能让 Token 彼此“看见”？
subtitle: 从 Q、K、V 到上下文表示，拆解一次注意力计算
tags: [大模型, LLM, 深度学习, Attention]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
typora-root-url: ../../../../binlidaily.github.io
typora-copy-images-to: ../../../img/media
---

<style>
  .blog-post pre code { font-size: 1.05rem !important; line-height: 1.75 !important; }
  .blog-post table { display: table; width: min(100%, 720px); margin: 24px auto; }
  .blog-post h2, .blog-post h3 { scroll-margin-top: 88px; }
  .lesson-toc { position: fixed; top: 118px; right: 22px; z-index: 30; color: #17314f; }
  .lesson-toc > summary { display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border:1px solid rgba(41,86,132,.22);border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.20);color:#fff;font-size:14px;font-weight:600;letter-spacing:.08em;cursor:pointer;list-style:none;user-select:none; }
  .lesson-toc > summary::-webkit-details-marker { display:none; }
  .lesson-toc[open] > summary { background:#17345a; }
  .lesson-toc nav { width:272px;margin-top:10px;padding:14px 10px;border:1px solid rgba(41,86,132,.14);border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18);backdrop-filter:blur(12px); }
  .lesson-toc nav strong { display:block;padding:4px 10px 9px;color:#17314f;font-size:13px;letter-spacing:.08em; }
  .lesson-toc nav a { display:block;padding:8px 10px;border-radius:8px;color:#405874;font-size:14px;line-height:1.35;text-decoration:none; }
  .lesson-toc nav a:hover,.lesson-toc nav a:focus { background:#edf4fb;color:#1f5f9d; }
  @media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow-y:auto}.blog-post pre code{font-size:.96rem!important}}
</style>

<details class="lesson-toc" markdown="0">
  <summary aria-label="展开或收起文章目录">目录</summary>
  <nav aria-label="本文目录">
    <strong>第二课目录</strong>
    <a href="#1为什么需要-attention">1、为什么需要 Attention</a>
    <a href="#2qkv-分别是什么">2、Q、K、V 是什么</a>
    <a href="#3算出相关性分数">3、算出相关性分数</a>
    <a href="#4mask不看未来">4、Mask：不看未来</a>
    <a href="#5softmax-与加权求和">5、Softmax 与加权求和</a>
    <a href="#6multi-head多种角度看信息">6、Multi-Head</a>
    <a href="#一次完整计算">完整计算</a>
    <a href="#记住这-5-件事">5 个复习重点</a>
    <a href="#第二课复习总图">第二课复习总图</a>
  </nav>
</details>

　　第一课里，我们把 Transformer 当成一个“上下文加工器”：Token 进入之前只有初始 Embedding，出来之后却带上了整句话的信息。

　　这个变化是怎么发生的？关键就在 Attention。

　　例如：

```text
小猫趴在窗边，因为它喜欢晒太阳
```

　　读到“它”时，我们会自然地联系前面的“小猫”。Attention 做的事情很接近：让当前 Token 在上下文中寻找与自己有关的信息，并按重要程度取回来。

> Query 提出问题，Key 用来匹配，Value 提供真正要取走的信息。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-01-Attention-为什么能让-Token-彼此看见/attention-process.svg" target="_blank" title="点击查看原始 SVG">
    <img src="/img/AI/llm-learning/2026-10-01-Attention-为什么能让-Token-彼此看见/attention-process.svg" alt="Attention 完整计算流程" style="display:block;width:100%;max-width:none;">
  </a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">Attention 完整计算流程，点击查看原始 SVG</p>
</div>

## 1、为什么需要 Attention？

　　Embedding 查表时，同一个 Token 总会拿到同一份初始向量。它还不知道自己出现在什么句子里。

　　“苹果”可以是水果，也可以是公司；“它”可能指小猫，也可能指窗户。要判断当前含义，一个 Token 必须参考上下文中的其他 Token。

　　但不是所有词都同样重要。理解“它”时，“小猫”的信息通常比“窗边”更关键。Attention 的任务就是：

1. 算出当前 Token 与其他 Token 的相关程度。
2. 按相关程度，从其他 Token 中提取信息。

## 2、Q、K、V 分别是什么？

　　假设输入向量为 $X$，模型通过三个不同的线性变换，得到 Query、Key 和 Value：

$$
Q=XW_Q,\qquad K=XW_K,\qquad V=XW_V
$$

　　$W_Q$、$W_K$、$W_V$ 都是训练得到的参数。

　　可以这样理解三者的分工：

| 名称 | 问的问题 | 直观作用 |
|---|---|---|
| Query | 我现在需要什么信息？ | 发起搜索 |
| Key | 我这里有什么特征？ | 接受匹配 |
| Value | 如果选中我，要取走什么？ | 提供内容 |

　　以“它”为例：“它”的 Query 会与前面所有 Token 的 Key 比较；如果“小猫”的 Key 更匹配，它对应的 Value 就会被赋予更高权重。

　　Key 与 Value 来自同一个 Token，但用途不同：Key 负责判断“要不要看我”，Value 负责回答“看我以后能拿走什么”。

## 3、算出相关性分数

　　Query 与 Key 的匹配程度通常用点积计算：

$$
Scores=QK^T
$$

　　点积越大，通常表示当前 Query 与这个 Key 越匹配。

　　实际公式还会除以 $\sqrt{d_k}$：

$$
Scores=\frac{QK^T}{\sqrt{d_k}}
$$

　　$d_k$ 是 Key 的维度。维度很大时，点积的绝对值容易变大，使 Softmax 过于尖锐，不利于训练。缩放可以让数值更稳定。

　　如果序列长度为 $T$，那么所有 Query 与所有 Key 两两比较，会得到一个 $T\times T$ 的 Attention Score Matrix。

## 4、Mask：不看未来

　　大模型生成文本时，当前位置只能依赖自己和前面的 Token，不能偷看尚未生成的内容。

　　因此，模型会在 Softmax 之前加入 Causal Mask。未来位置的分数被设成一个极小值，可以近似理解为 $-\infty$：

```text
可见：当前位置及之前的 Token
遮住：当前位置之后的 Token
```

　　经过 Softmax 后，这些未来位置的概率就会变成 0。

　　矩阵因此呈下三角形：第一项只能看自己，第二项能看前两项，越靠后能看到的历史越多。

## 5、Softmax 与加权求和

　　相关性分数还是任意实数，不方便直接当权重。Softmax 会把每一行转换成总和为 1 的概率分布：

$$
A=Softmax\left(\frac{QK^T}{\sqrt{d_k}}+Mask\right)
$$

　　假设“它”对前文的注意力权重为：

| Token | 小猫 | 趴在 | 窗边 | 因为 | 它 |
|---|---:|---:|---:|---:|---:|
| 权重 | 0.56 | 0.08 | 0.12 | 0.09 | 0.15 |

　　“小猫”的权重最高，表示模型在处理“它”时更重视“小猫”的信息。

　　最后，用这些权重对所有 Value 做加权求和：

$$
Attention(Q,K,V)=A V
$$

　　得到的新向量不再只表示“它”，而是混入了“小猫”“窗边”等上下文信息。这就是 Contextual Representation 的来源之一。

## 6、Multi-Head：多种角度看信息

　　一次 Attention 只能在一个表示空间里计算关系。实际 Transformer 会并行计算多组 Attention，也就是 Multi-Head Attention。

　　不同 Head 没有人工规定的固定职责，但训练后可能关注不同类型的关系，例如：

* 有的 Head 更关注指代关系。
* 有的 Head 更关注相邻词。
* 有的 Head 更关注语法结构或长距离依赖。

　　各个 Head 的结果会拼接起来，再经过一次线性变换：

$$
MultiHead(Q,K,V)=Concat(head_1,\ldots,head_h)W_O
$$

　　本课只需要记住：**多个 Head 让模型能同时从不同角度组织上下文信息。**

## 一次完整计算

| 阶段 | 计算 | 典型形状 |
|---|---|---|
| 输入 | Token 向量 $X$ | $[B,T,d_{model}]$ |
| 线性投影 | $Q=XW_Q, K=XW_K, V=XW_V$ | $[B,h,T,d_k]$ |
| 相关性 | $QK^T/\sqrt{d_k}$ | $[B,h,T,T]$ |
| Mask + Softmax | 得到注意力权重 $A$ | $[B,h,T,T]$ |
| 加权求和 | $AV$ | $[B,h,T,d_v]$ |
| 合并 Heads | $Concat(heads)W_O$ | $[B,T,d_{model}]$ |

　　输入和输出的整体形状相同，但每个 Token 的向量已经吸收了上下文信息。

## Attention 不是什么？

　　Attention Weight 能帮助我们观察模型在当前计算中更重视哪些位置，但它不等于完整的“思考过程”，也不能直接当作因果解释。

　　另外，Attention 并不负责整个 Transformer 的全部计算。它完成 Token 之间的信息交换，后面的 FFN 还会继续处理每个位置的信息。

## 记住这 5 件事

1. Query 用来发起匹配，Key 用来被匹配，Value 提供真正的信息。
2. $QK^T$ 计算 Token 之间的相关性。
3. 除以 $\sqrt{d_k}$ 是为了让数值和训练更稳定。
4. Causal Mask 保证生成时不能看到未来 Token。
5. Softmax 权重乘以 Value，得到结合上下文的新表示。

## 第二课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-01-Attention-为什么能让-Token-彼此看见/attention-second-lesson-summary.svg" target="_blank" title="点击查看原始 SVG">
    <img src="/img/AI/llm-learning/2026-10-01-Attention-为什么能让-Token-彼此看见/attention-second-lesson-summary.svg" alt="大模型第二课 Attention 复习总图" style="display:block;width:100%;max-width:none;">
  </a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第二课复习总图，点击查看原始 SVG</p>
</div>

　　下一课，我们可以继续看：**模型既然一次只预测一个 Token，训练时是怎样学会这件事的？**

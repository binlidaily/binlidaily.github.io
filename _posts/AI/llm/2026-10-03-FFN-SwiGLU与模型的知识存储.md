---
layout: post
title: FFN、SwiGLU 与模型的“知识存储”
subtitle: Attention 交流之后，每个 Token 怎样被非线性加工
tags: [大模型, LLM, FFN, SwiGLU]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,800px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十四课目录</strong><a href="#1经典-ffn升维再降维">1、经典 FFN：升维再降维</a><a href="#2为什么不能只有线性层">2、为什么不能只有线性层</a><a href="#3glu一条内容支路加一扇门">3、GLU：一条内容支路加一扇门</a><a href="#4swiglu-的结构">4、SwiGLU 的结构</a><a href="#5为什么常说-ffn-存知识">5、为什么常说 FFN 存知识</a><a href="#6ffn-的主要成本">6、FFN 的主要成本</a><a href="#容易混淆的三件事">易错点</a><a href="#第十四课复习总图">复习总图</a></nav></details>

　　Transformer Block 中参数最多的部分往往不是 Attention，而是 FFN。它对每个 Token 独立使用同一套参数，内部先扩展维度，再压回模型维度。

> Attention 负责跨 Token 取信息，FFN 负责在每个位置上把信息变换成新的特征。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-FFN-SwiGLU与模型的知识存储/ffn-swiglu.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-FFN-SwiGLU与模型的知识存储/ffn-swiglu.svg" alt="FFN、SwiGLU 与模型的“知识存储”" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第 14 课核心流程，点击查看原始 SVG</p>
</div>


## 1、经典 FFN：升维再降维

经典形式可写成 FFN(x)=W2·activation(W1·x)。第一层把 d_model 扩展到更宽的 d_ff，激活函数加入非线性，第二层再投影回 d_model。

它逐 Token 工作：不同位置不直接交流，但所有位置共享同一组 FFN 权重。
## 2、为什么不能只有线性层

连续两个没有激活函数的线性变换，仍可合并成一个线性变换。加入 ReLU、GELU 或 SiLU 后，网络才能根据输入产生更复杂的分段与门控行为。
## 3、GLU：一条内容支路加一扇门

门控线性单元把输入投影成两条支路：一条生成内容，一条生成门值，再逐元素相乘。门值决定哪些特征通过、哪些被压低。
## 4、SwiGLU 的结构

SwiGLU 使用 SiLU 作为门控激活。常见形式是：

```text
FFN(x) = W_down( SiLU(W_gate x) ⊙ (W_up x) )
```

它包含 gate、up、down 三个投影。为控制总参数量，隐藏宽度通常会相应调整。
## 5、为什么常说 FFN 存知识

一些研究发现，FFN 的神经元或参数能关联事实与模式，因此常被比喻成 Key-Value Memory。但这只是有帮助的视角，不应理解成每条知识固定存在某一个神经元里。

模型能力分布在 Embedding、Attention、FFN 和多层组合中，知识也可能冗余、纠缠并依赖上下文。
## 6、FFN 的主要成本

FFN 包含大矩阵乘法，参数量和计算量都很可观。MoE 正是在这里做改造：准备多个 FFN 专家，但每个 Token 只激活少数几个，以增加总参数而不同比例增加计算。

## 容易混淆的三件事

1. FFN 不负责跨 Token 通信。
2. 两个线性层之间必须有非线性才有意义。
3. “知识存储”是解释视角而非精确地址。

## 记住这 5 件事

1. FFN 逐 Token 处理
2. 先扩展再压回
3. 非线性不可省略
4. SwiGLU 使用门控乘法
5. 知识并非单点存储

## 参考资料

- [GLU Variants Improve Transformer](https://arxiv.org/abs/2002.05202)

## 第十四课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-FFN-SwiGLU与模型的知识存储/fourteenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-FFN-SwiGLU与模型的知识存储/fourteenth-lesson-summary.svg" alt="大模型第十四课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第十四课复习总图，点击查看原始 SVG</p>
</div>

　　下一课看 MoE：为什么准备很多专家，却只让每个 Token 经过其中几个？

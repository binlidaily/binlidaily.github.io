---
layout: post
title: FlashAttention 为什么更快、更省显存？
subtitle: 不近似 Attention，而是减少 GPU 内存之间的数据搬运
tags: [大模型, LLM, FlashAttention, GPU]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,800px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十六课目录</strong><a href="#1标准实现慢在哪里">1、标准实现慢在哪里</a><a href="#2gpu-内存有快慢层级">2、GPU 内存有快慢层级</a><a href="#3分块计算">3、分块计算</a><a href="#4softmax-为什么能分块">4、Softmax 为什么能分块</a><a href="#5backward-为什么会重算">5、Backward 为什么会重算</a><a href="#6它没有改变什么">6、它没有改变什么</a><a href="#容易混淆的三件事">易错点</a><a href="#第十六课复习总图">复习总图</a></nav></details>

　　标准 Attention 会产生 T×T 的分数矩阵。真正拖慢 GPU 的不只是乘法数量，还包括中间结果在 HBM 与片上 SRAM 之间反复读写。

> FlashAttention 没有换掉 Attention 公式，它重新安排了同一套计算的数据流。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-FlashAttention为什么更快更省显存/flashattention.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-FlashAttention为什么更快更省显存/flashattention.svg" alt="FlashAttention 为什么更快、更省显存？" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第 16 课核心流程，点击查看原始 SVG</p>
</div>


## 1、标准实现慢在哪里

朴素实现先算完整 QKᵀ，写入显存，再读取做 Softmax，之后又读取与 V 相乘。长序列下，中间矩阵很大，显存读写与峰值占用都很高。
## 2、GPU 内存有快慢层级

HBM 容量大但访问相对慢，片上 SRAM 容量小却快得多。高性能内核要尽量让已经搬进 SRAM 的数据多做计算，减少往返 HBM。
## 3、分块计算

FlashAttention 把 Q、K、V 切成能放进 SRAM 的小块。每次载入一部分，完成局部矩阵乘法与 Softmax 更新，再继续下一块。

它不把完整 T×T 分数矩阵写回 HBM，因此降低了中间显存和 IO。
## 4、Softmax 为什么能分块

Softmax 依赖一整行的最大值与分母。FlashAttention 使用在线算法，随着新块到来更新当前最大值和归一化和，并对先前结果做正确缩放。最终结果与普通精确 Attention 一致，而不是近似值。
## 5、Backward 为什么会重算

为了不保存巨大的中间分数矩阵，反向传播时可以根据 Q、K、V 和少量统计量重算部分结果。多做一些算术，换来更少的显存读写，整体反而可能更快。
## 6、它没有改变什么

FlashAttention 不会把 Attention 的理论 O(T²) 计算复杂度变成线性，也不会自动改变模型质量。它优化的是实际 GPU IO、内核融合与中间存储。硬件、形状、精度和实现版本都会影响收益。

## 容易混淆的三件事

1. FlashAttention 不是稀疏近似。
2. 省显存不等于线性复杂度。
3. 重算可能增加 FLOPs 但减少 IO。

## 记住这 5 件事

1. 结果是精确 Attention
2. 核心是 IO-aware
3. QKV 按块处理
4. 不保存完整分数矩阵
5. 计算量仍随 T² 增长

## 参考资料

- [FlashAttention 论文](https://arxiv.org/abs/2205.14135)

## 第十六课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-FlashAttention为什么更快更省显存/sixteenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-FlashAttention为什么更快更省显存/sixteenth-lesson-summary.svg" alt="大模型第十六课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第十六课复习总图，点击查看原始 SVG</p>
</div>

　　下一阶段进入生成：Temperature、Top-K 与 Top-P 怎样改变模型选出的下一个 Token？

---
layout: post
title: Prefill 与 Decode：推理为什么分成两个阶段？
subtitle: 一个阶段并行处理 Prompt，一个阶段串行生成 Token
tags: [大模型, LLM, 推理, Serving]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,800px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十九课目录</strong><a href="#1prefill-做什么">1、Prefill 做什么</a><a href="#2decode-做什么">2、Decode 做什么</a><a href="#3两个常见延迟指标">3、两个常见延迟指标</a><a href="#4为什么瓶颈不同">4、为什么瓶颈不同</a><a href="#5continuous-batching">5、Continuous Batching</a><a href="#6为什么要分页管理-kv">6、为什么要分页管理 KV</a><a href="#容易混淆的三件事">易错点</a><a href="#第十九课复习总图">复习总图</a></nav></details>

　　一次 LLM 请求先读取完整 Prompt，再逐 Token 输出回答。虽然都经过同一个模型，这两个阶段的张量形状、并行度和性能瓶颈并不相同。

> Prefill 常偏计算密集，Decode 常偏内存带宽与延迟敏感。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-Prefill与Decode推理为什么分成两个阶段/prefill-decode.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-Prefill与Decode推理为什么分成两个阶段/prefill-decode.svg" alt="Prefill 与 Decode：推理为什么分成两个阶段？" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第 19 课核心流程，点击查看原始 SVG</p>
</div>


## 1、Prefill 做什么

Prefill 把 Prompt 的所有 Token 一次送进模型，并行计算各层隐藏状态，同时建立 KV Cache。序列较长时矩阵乘法规模大，GPU 计算单元更容易被充分利用。
## 2、Decode 做什么

Decode 每一步只有一个新 Token。模型读取权重与全部历史 KV Cache，生成一个新的概率分布，再选择下一个 Token。步骤之间有依赖，不能把同一请求的未来 Token 提前并行计算。
## 3、两个常见延迟指标

TTFT（Time To First Token）主要包含排队与 Prefill，决定用户多久看到第一个字。TPOT（Time Per Output Token）描述后续 Token 的生成间隔，影响流式输出速度。
## 4、为什么瓶颈不同

Prefill 有较大的矩阵，往往更偏计算密集；Decode 每步矩阵较窄，却反复读取大量模型权重和 KV Cache，常更受内存带宽与调度影响。

这只是常见倾向，具体仍取决于模型、Batch、序列长度和硬件。
## 5、Continuous Batching

在线服务中，请求到达时间和输出长度不同。Continuous Batching 会动态把新请求的 Prefill 与已有请求的 Decode 调度到批次中，提高 GPU 利用率。

调度过度追求吞吐可能增加单请求延迟，因此服务系统要权衡吞吐、TTFT 与 TPOT。
## 6、为什么要分页管理 KV

各请求的 KV Cache 长度不断变化，连续预留大块显存会产生碎片和浪费。PagedAttention 把缓存拆成固定大小的块，用类似虚拟内存分页的方式映射，便于动态增长与共享。

## 容易混淆的三件事

1. Prefill 与 Decode 使用同一模型但瓶颈不同。
2. Decode 无法并行预测同一请求的未知未来。
3. 吞吐提高不一定让每个用户更快。

## 记住这 5 件事

1. Prefill 处理整段 Prompt
2. Decode 每步生成一个 Token
3. TTFT 关注首 Token
4. TPOT 关注后续间隔
5. 服务系统需平衡延迟与吞吐

## 参考资料

- [PagedAttention / vLLM](https://arxiv.org/abs/2309.06180)

## 第十九课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-Prefill与Decode推理为什么分成两个阶段/nineteenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-Prefill与Decode推理为什么分成两个阶段/nineteenth-lesson-summary.svg" alt="大模型第十九课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第十九课复习总图，点击查看原始 SVG</p>
</div>

　　下一课看量化：把权重从 16 位压到 INT8、INT4 时，究竟损失了什么？

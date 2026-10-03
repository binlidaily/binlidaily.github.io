---
layout: post
title: MHA、MQA、GQA 和 MLA 有什么区别？
subtitle: 从 Attention Head 到 KV Cache，理解四种注意力结构的取舍
tags: [大模型, LLM, Attention, KV Cache]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,800px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十三课目录</strong><a href="#1mha每个-head-都有自己的-qkv">1、MHA：每个 Head 都有自己的 QKV</a><a href="#2mqa所有-query-head-共享-kv">2、MQA：所有 Query Head 共享 KV</a><a href="#3gqa在两者之间分组">3、GQA：在两者之间分组</a><a href="#4mla缓存低维潜向量">4、MLA：缓存低维潜向量</a><a href="#5kv-cache-为什么决定选择">5、KV Cache 为什么决定选择</a><a href="#6不要只看缩写选架构">6、不要只看缩写选架构</a><a href="#容易混淆的三件事">易错点</a><a href="#第十三课复习总图">复习总图</a></nav></details>

　　多头注意力让不同 Head 学习不同关系，但推理时还要为历史 Token 保存 K、V。序列越长、并发越高，KV Cache 越容易成为显存瓶颈。

> 四种结构的核心差异，不在 Q 有几个 Head，而在 K、V 如何共享或压缩。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-MHA-MQA-GQA和MLA有什么区别/attention-variants.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-MHA-MQA-GQA和MLA有什么区别/attention-variants.svg" alt="MHA、MQA、GQA 和 MLA 有什么区别？" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第 13 课核心流程，点击查看原始 SVG</p>
</div>


## 1、MHA：每个 Head 都有自己的 QKV

Multi-Head Attention 中，H 个 Query Head 通常各自对应一组 Key Head 和 Value Head。表达能力直接，但每层、每个历史 Token 都要保存 H 组 K、V，KV Cache 较大。
## 2、MQA：所有 Query Head 共享 KV

Multi-Query Attention 保留多个 Query Head，却只使用一组 K 与 V。生成时缓存量显著下降，读取 KV 的带宽压力也更小。

代价是所有 Query Head 看到同一组 K、V，可能限制质量，因此它不是所有模型的统一答案。
## 3、GQA：在两者之间分组

Grouped-Query Attention 把 Query Head 分成 G 组，每组共享一组 K、V。G=H 时等价于 MHA，G=1 时接近 MQA。

它用少量 KV Head 换取明显的缓存收益，通常能在质量与推理效率之间取得较好平衡。
## 4、MLA：缓存低维潜向量

Multi-Head Latent Attention 不只是共享 KV Head，而是先把 K、V 相关信息压缩到低维潜向量。推理时缓存潜向量，需要时再通过投影恢复计算所需信息。

DeepSeek-V2 还将位置相关部分单独处理，以便低秩压缩与 RoPE 配合。
## 5、KV Cache 为什么决定选择

Decode 每次只产生一个 Token，却要读取所有历史位置的 K、V。KV Head 数越多、Head 维度越大、层数和上下文越长，缓存与内存带宽成本越高。

因此 MQA、GQA、MLA 的收益在长上下文和高并发服务中尤其明显。
## 6、不要只看缩写选架构

MHA、MQA、GQA 的工程支持成熟度不同；MLA 还需要匹配的算子与权重结构。选型要同时看质量、缓存大小、内核支持、硬件带宽与部署框架。

## 容易混淆的三件事

1. MQA 并非只有一个 Query Head。
2. GQA 是 MHA 与 MQA 的连续折中。
3. MLA 不等于普通的 KV Head 共享。

## 记住这 5 件事

1. MHA 每个 Head 有独立 KV
2. MQA 共享一组 KV
3. GQA 按组共享 KV
4. MLA 缓存低维潜表示
5. 目标是质量与缓存成本平衡

## 参考资料

- [GQA 论文](https://aclanthology.org/2023.emnlp-main.298/)
- [DeepSeek-V2 技术报告](https://arxiv.org/abs/2405.04434)

## 第十三课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-MHA-MQA-GQA和MLA有什么区别/thirteenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-MHA-MQA-GQA和MLA有什么区别/thirteenth-lesson-summary.svg" alt="大模型第十三课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第十三课复习总图，点击查看原始 SVG</p>
</div>

　　下一课回到 Block 的另一半：FFN、SwiGLU 与所谓“知识存储”到底是什么关系？

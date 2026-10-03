---
layout: post
title: Temperature、Top-K、Top-P 怎样改变生成结果？
subtitle: 从 Logits 到概率分布，理解确定性、随机性与候选截断
tags: [大模型, LLM, 推理, Sampling]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,800px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十七课目录</strong><a href="#1greedy-与-sampling">1、Greedy 与 Sampling</a><a href="#2temperature-调整分布">2、Temperature 调整分布</a><a href="#3top-k-固定保留-k-个">3、Top-K 固定保留 K 个</a><a href="#4top-p-保留累计概率">4、Top-P 保留累计概率</a><a href="#5组合顺序">5、组合顺序</a><a href="#6参数没有万能答案">6、参数没有万能答案</a><a href="#容易混淆的三件事">易错点</a><a href="#第十七课复习总图">复习总图</a></nav></details>

　　同一组 Logits 可以生成完全不同的文本。Greedy 每次选最高分，Sampling 按概率抽取；Temperature、Top-K、Top-P 会在抽样前重新塑造候选分布。

> 模型给出概率，解码策略决定如何从概率里选出下一个 Token。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-Temperature-Top-K-Top-P怎样改变生成结果/sampling-controls.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-Temperature-Top-K-Top-P怎样改变生成结果/sampling-controls.svg" alt="Temperature、Top-K、Top-P 怎样改变生成结果？" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第 17 课核心流程，点击查看原始 SVG</p>
</div>


## 1、Greedy 与 Sampling

Greedy decoding 总选概率最高的 Token，结果稳定，但容易重复或过于保守。Sampling 按分布随机抽取，让低一些的候选也有机会出现，文本更多样。
## 2、Temperature 调整分布

Softmax 前把 Logits 除以温度 T。T 小于 1 时差距被放大，分布更尖；T 大于 1 时分布更平，随机性更强。

T 接近 0 常退化为近似 Greedy。Temperature 不会直接删除候选，只改变相对概率。
## 3、Top-K 固定保留 K 个

Top-K 只保留概率最高的 K 个 Token，其余设为不可选，再重新归一化。它简单，但无论当前分布很确定还是很分散，候选数量都固定。
## 4、Top-P 保留累计概率

Top-P 又叫 Nucleus Sampling。把 Token 按概率排序，从高到低累加，保留累计概率达到阈值 p 的最小集合。

分布很集中时候选少，分布很平时候选多，因此能随上下文自适应。
## 5、组合顺序

常见流程是先用 Temperature 调整 Logits，再应用 Top-K / Top-P 截断，重新归一化后抽样。不同框架在细节和默认值上可能不同，应查看实际实现。
## 6、参数没有万能答案

事实问答和代码生成通常需要更稳定；创意写作可以增加随机性。采样参数还会与重复惩罚、最大长度、停止词和模型本身交互。评估时应固定随机种子与配置。

## 容易混淆的三件事

1. Temperature 不是直接删词。
2. Top-P 的候选数不是固定值。
3. 更随机不等于更有创造力或更正确。

## 记住这 5 件事

1. Greedy 总选最大概率
2. Temperature 改变分布尖锐度
3. Top-K 固定候选数
4. Top-P 固定累计概率
5. 截断后必须重新归一化

## 参考资料

- [Nucleus Sampling 论文](https://arxiv.org/abs/1904.09751)

## 第十七课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-Temperature-Top-K-Top-P怎样改变生成结果/seventeenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-Temperature-Top-K-Top-P怎样改变生成结果/seventeenth-lesson-summary.svg" alt="大模型第十七课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第十七课复习总图，点击查看原始 SVG</p>
</div>

　　下一课解释 KV Cache：为什么逐 Token 生成时不必反复计算整个历史？

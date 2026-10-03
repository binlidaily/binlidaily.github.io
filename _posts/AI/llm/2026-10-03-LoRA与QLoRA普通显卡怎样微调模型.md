---
layout: post
title: LoRA 与 QLoRA：普通显卡怎样微调模型？
subtitle: 冻结基础权重，用低秩增量学习任务变化
tags: [大模型, LLM, LoRA, QLoRA]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,800px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第二十二课目录</strong><a href="#1低秩增量">1、低秩增量</a><a href="#2rank-与-alpha">2、Rank 与 Alpha</a><a href="#3加在哪些层">3、加在哪些层</a><a href="#4qlora-多做了什么">4、QLoRA 多做了什么</a><a href="#5训练后怎样使用">5、训练后怎样使用</a><a href="#6省显存不等于没有代价">6、省显存不等于没有代价</a><a href="#容易混淆的三件事">易错点</a><a href="#第二十二课复习总图">复习总图</a></nav></details>

　　全参数微调要为每个参数保存梯度和优化器状态，显存代价高。LoRA 冻结基础模型，只在部分线性层旁加入两块小矩阵。

> LoRA 不直接改写大权重矩阵，而是学习一个低秩增量 ΔW。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-LoRA与QLoRA普通显卡怎样微调模型/lora-qlora.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-LoRA与QLoRA普通显卡怎样微调模型/lora-qlora.svg" alt="LoRA 与 QLoRA：普通显卡怎样微调模型？" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第 22 课核心流程，点击查看原始 SVG</p>
</div>


## 1、低秩增量

对原权重 W，LoRA 使用 W+ΔW，其中 ΔW=B·A。若隐藏维很大而秩 r 很小，A、B 的参数量远少于完整 W。

初始化通常让训练开始时 ΔW 接近 0，从基础模型行为平稳出发。
## 2、Rank 与 Alpha

Rank r 决定低秩通道宽度，越大容量与训练参数越多。Alpha 用于缩放 LoRA 更新，常见形式为 alpha/r。二者需要结合任务与目标层调节。
## 3、加在哪些层

常见目标包括 Attention 的 q_proj、k_proj、v_proj、o_proj，以及 FFN 投影。只训练少数层更省，但可能限制适应能力；覆盖更多层需要更多显存。
## 4、QLoRA 多做了什么

QLoRA 把冻结的基础模型权重量化为 4-bit，Forward 时按需反量化计算，同时让 LoRA 参数保持较高精度训练。它进一步降低基础权重占用。

经典 QLoRA 还使用 NF4、Double Quantization 与 Paged Optimizers 等设计。
## 5、训练后怎样使用

LoRA Adapter 可以单独保存并在加载基础模型时挂载，也可以合并进浮点基础权重。多个 Adapter 便于针对不同任务切换，但必须与正确的基础模型版本匹配。
## 6、省显存不等于没有代价

QLoRA 需要量化与反量化内核，训练速度未必总快于 BF16 LoRA。可训练参数少也不代表数据和评估可以放松；错误数据同样会导致过拟合与能力退化。

## 容易混淆的三件事

1. LoRA 不是只训练 Bias。
2. 4-bit 基础权重通常会反量化参与计算。
3. Adapter 必须匹配基础模型与目标层。

## 记住这 5 件事

1. 基础权重保持冻结
2. ΔW 由低秩矩阵相乘
3. Rank 控制容量
4. QLoRA 使用量化基础权重
5. Adapter 可单独保存或合并

## 参考资料

- [LoRA](https://arxiv.org/abs/2106.09685)
- [QLoRA](https://arxiv.org/abs/2305.14314)

## 第二十二课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-LoRA与QLoRA普通显卡怎样微调模型/twenty-second-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-LoRA与QLoRA普通显卡怎样微调模型/twenty-second-summary.svg" alt="大模型第二十二课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第二十二课复习总图，点击查看原始 SVG</p>
</div>

　　下一课进入偏好对齐：RLHF 与 DPO 怎样让模型更符合人类选择？

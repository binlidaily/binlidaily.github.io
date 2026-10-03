---
layout: post
title: RoPE 是怎样把位置信息放进 Attention 的？
subtitle: 把位置变成旋转，让 Q 与 K 的点积感知相对距离
tags: [大模型, LLM, RoPE, Attention]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,800px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十二课目录</strong><a href="#1把向量看成二维坐标">1、把向量看成二维坐标</a><a href="#2旋转公式在做什么">2、旋转公式在做什么</a><a href="#3为什么同时旋转-q-和-k">3、为什么同时旋转 Q 和 K</a><a href="#4为什么通常不旋转-v">4、为什么通常不旋转 V</a><a href="#5多种频率的意义">5、多种频率的意义</a><a href="#6上下文扩展不是免费午餐">6、上下文扩展不是免费午餐</a><a href="#容易混淆的三件事">易错点</a><a href="#第十二课复习总图">复习总图</a></nav></details>

　　上一课知道了位置编码负责补充顺序。现代 LLM 常用的 RoPE 并不把位置向量加到输入上，而是先把 Q、K 的二维分量按位置旋转，再计算 Attention。

> RoPE 用绝对位置决定旋转角度，却让 Attention 的点积自然呈现相对位置。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-RoPE是怎样把位置信息放进Attention的/rope.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-RoPE是怎样把位置信息放进Attention的/rope.svg" alt="RoPE 是怎样把位置信息放进 Attention 的？" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第 12 课核心流程，点击查看原始 SVG</p>
</div>


## 1、把向量看成二维坐标

RoPE 会把每个 Attention Head 的维度两两配对，例如把第 0、1 维看成一个二维点。二维旋转不会改变向量长度，只会改变方向。

位置 m 对应角度 mθ。位置越靠后，旋转得越多；不同维度组使用不同频率，因此既能表示近距离，也能表示更长距离。
## 2、旋转公式在做什么

对二维向量 (x1, x2)，旋转角度 φ 后得到：

```text
x1' = x1 cosφ - x2 sinφ
x2' = x1 sinφ + x2 cosφ
```

真实模型会同时处理许多二维分组，并预先计算 cos 与 sin，避免每一步重复求三角函数。
## 3、为什么同时旋转 Q 和 K

位置 m 的 Q 旋转 mθ，位置 n 的 K 旋转 nθ。两者做点积时，共同旋转部分会抵消，结果主要与角度差 (m−n)θ 有关。

因此模型既用每个位置的绝对编号完成旋转，又在相关性分数里获得相对距离。这是 RoPE 最关键的性质。
## 4、为什么通常不旋转 V

Q 与 K 决定“关注谁”，它们的点积进入 Attention 分数；V 保存被汇总的内容。RoPE 的目标是让相关性分数带上位置关系，因此标准做法是旋转 Q、K，不直接旋转 V。
## 5、多种频率的意义

高频维度的角度变化快，容易区分邻近 Token；低频维度变化慢，可以覆盖更长距离。把多种频率放在同一个 Head 中，相当于用多把不同刻度的尺子表示位置。
## 6、上下文扩展不是免费午餐

RoPE 可以为任意位置算出角度，但模型若只在短序列上训练，直接使用很大的位置编号可能偏离熟悉分布。位置插值、NTK-aware scaling 等方法会调整位置或频率；是否有效仍需长上下文评测。

## 容易混淆的三件事

1. RoPE 不是把位置向量加到 Embedding。
2. 标准 RoPE 不直接旋转 V。
3. 能计算长位置不等于模型已学会长上下文。

## 记住这 5 件事

1. 二维旋转保持向量长度
2. Q、K 同时旋转
3. 点积依赖位置差
4. 不同维度使用不同频率
5. 长上下文扩展需要验证

## 参考资料

- [RoFormer 论文](https://arxiv.org/abs/2104.09864)

## 第十二课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-RoPE是怎样把位置信息放进Attention的/twelfth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-RoPE是怎样把位置信息放进Attention的/twelfth-lesson-summary.svg" alt="大模型第十二课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第十二课复习总图，点击查看原始 SVG</p>
</div>

　　下一课比较 MHA、MQA、GQA 与 MLA：它们究竟共享或压缩了什么？

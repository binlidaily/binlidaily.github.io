---
layout: post
title: KV Cache 为什么能加速逐 Token 生成？
subtitle: 缓存历史 Token 的 K、V，用显存换取更少的重复计算
tags: [大模型, LLM, 推理, KV Cache]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,800px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十八课目录</strong><a href="#1没有缓存会怎样">1、没有缓存会怎样</a><a href="#2缓存保存什么">2、缓存保存什么</a><a href="#3为什么-q-不缓存">3、为什么 Q 不缓存</a><a href="#4缓存怎样增长">4、缓存怎样增长</a><a href="#5速度与显存的交换">5、速度与显存的交换</a><a href="#6什么时候缓存失效">6、什么时候缓存失效</a><a href="#容易混淆的三件事">易错点</a><a href="#第十八课复习总图">复习总图</a></nav></details>

　　自回归生成每次只多一个 Token。若每一步都重新计算整段历史的 K、V，大量工作会重复。KV Cache 把已经算过的结果保留下来。

> KV Cache 不缓存下一个答案，它缓存的是历史 Token 在每一层 Attention 中的 K 与 V。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-KV-Cache为什么能加速逐Token生成/kv-cache.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-KV-Cache为什么能加速逐Token生成/kv-cache.svg" alt="KV Cache 为什么能加速逐 Token 生成？" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第 18 课核心流程，点击查看原始 SVG</p>
</div>


## 1、没有缓存会怎样

生成第 n 个 Token 时，模型需要关注前 n−1 个 Token。若重新把完整序列送入模型，前面 Token 的 K、V 每一步都重复计算，序列越长浪费越明显。
## 2、缓存保存什么

对每层 Attention，历史 Token 的 K 与 V 在生成过程中不会改变，可以按层缓存。新 Token 到来时，只计算它自己的 Q、K、V，再用新 Q 与缓存中的全部 K 做相关性计算。
## 3、为什么 Q 不缓存

后续每一步使用的是当前新 Token 的 Q 去查询全部历史 K。过去 Token 的 Q 不会再次作为当前查询使用，因此通常无需为 Decode 保存历史 Q。
## 4、缓存怎样增长

每生成一个 Token，就把它在各层产生的新 K、V 追加到缓存。缓存大小大致随层数、KV Head 数、Head 维度、上下文长度、Batch 与数据类型线性增长。
## 5、速度与显存的交换

KV Cache 减少了重复投影计算，却持续占用显存和内存带宽。长上下文、高并发下，缓存可能比模型权重更快成为容量瓶颈。GQA、MQA、MLA、量化与 PagedAttention 都在缓解这个问题。
## 6、什么时候缓存失效

如果修改了历史 Token、Attention Mask、位置编号或模型权重，相关缓存通常不能直接复用。多个请求共享完全相同前缀时，可以在支持的系统中复用前缀缓存，但必须正确管理边界。

## 容易混淆的三件事

1. KV Cache 不保存最终答案。
2. 通常不缓存历史 Q。
3. 修改前缀后旧缓存不能盲目复用。

## 记住这 5 件事

1. 缓存每层历史 K 与 V
2. 当前 Token 的 Q 现算
3. 每步追加新 K、V
4. 用显存换重复计算
5. 缓存随上下文线性增长

## 参考资料

- [PagedAttention 论文](https://arxiv.org/abs/2309.06180)

## 第十八课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-KV-Cache为什么能加速逐Token生成/eighteenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-KV-Cache为什么能加速逐Token生成/eighteenth-lesson-summary.svg" alt="大模型第十八课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第十八课复习总图，点击查看原始 SVG</p>
</div>

　　下一课把推理拆成 Prefill 与 Decode：为什么两个阶段的性能瓶颈完全不同？

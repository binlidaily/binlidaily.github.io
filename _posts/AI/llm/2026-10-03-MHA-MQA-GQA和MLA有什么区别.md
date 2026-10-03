---
layout: post
title: MHA、MQA、GQA、MLA：它们到底在省什么？
subtitle: 从每个 Head 一套 KV，到只缓存一份低维潜表示
tags: [大模型, LLM, Attention, KV Cache]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:auto;max-width:100%;margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}.kv-lab{margin:30px auto;padding:22px;border:1px solid #dce6f0;border-radius:18px;background:linear-gradient(145deg,#f8fbff,#f4f8fc)}.kv-lab .controls{display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:16px}.kv-lab label{display:block;color:#42566f;font-size:14px}.kv-lab input{width:100%}.kv-lab .mode-row{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.kv-lab button{padding:9px 15px;border:1px solid #bfd1e3;border-radius:18px;background:#fff;color:#31516f;cursor:pointer}.kv-lab button.active{border-color:#286cab;background:#286cab;color:#fff}.kv-result{padding:18px;border-radius:14px;background:#fff;box-shadow:0 6px 20px rgba(35,66,98,.08)}.kv-bars{display:grid;grid-template-columns:90px 1fr 70px;gap:10px;align-items:center;margin-top:12px}.kv-track{height:12px;border-radius:8px;background:#e6edf4;overflow:hidden}.kv-fill{height:100%;border-radius:8px;background:linear-gradient(90deg,#2b70b6,#58a7cf);transition:width .25s}.kv-note{margin:12px 0 0;color:#5d6f82;font-size:14px}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}@media(max-width:650px){.kv-lab .controls{grid-template-columns:1fr}.kv-bars{grid-template-columns:72px 1fr 60px}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十三课目录</strong><a href="#先抓住真正的问题decode-时反复搬运-kv">1、真正的问题</a><a href="#用-8-个-query-head-看懂四种结构">2、统一例子</a><a href="#mha每个-head-保留自己的-kv">3、MHA</a><a href="#mqa所有-query-head-共用一套-kv">4、MQA</a><a href="#gqa让一组-query-head-共用-kv">5、GQA</a><a href="#mla换一条路缓存低维潜表示">6、MLA</a><a href="#动手试试kv-cache-会差多少">7、交互实验</a><a href="#实际应该怎样选择">8、怎样选择</a><a href="#第十三课复习总图">9、复习总图</a></nav></details>

　　MHA、MQA、GQA、MLA 看起来像四个需要背诵的缩写。其实先记住一个问题就够了：**生成下一个 Token 时，模型要怎样读取前文的 K 和 V？**

> 这四种结构都保留多个 Query Head。它们真正不同的地方，是历史 Token 的 K、V 如何保存：每个 Head 各存一份、多人共享一份，还是改存一份低维潜表示。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-MHA-MQA-GQA和MLA有什么区别/attention-variants.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-MHA-MQA-GQA和MLA有什么区别/attention-variants.svg" alt="MHA、MQA、GQA 和 MLA 的结构差异" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">用 8 个 Query Head 比较四种结构，点击查看原始 SVG</p>
</div>

## 先抓住真正的问题：Decode 时反复搬运 KV

　　在生成阶段，模型一次只生成一个新 Token。这个新 Token 会产生 Query，然后回头和前面所有 Token 的 Key、Value 做注意力计算。

　　前文的 K、V 不必每次重算，所以模型会把它们保存在 **KV Cache** 中。省下计算以后，另一个问题出现了：上下文越长、并发请求越多，模型每一步要从显存读取的历史 K、V 就越多。此时速度常常受制于显存带宽，而不只是算力。

　　如果先不考虑 MLA，每层、每个 Token 的 KV Cache 可以粗略写成：

$$
\text{KV bytes}=2\times n_{kv}\times d_{head}\times \text{bytes per element}
$$

　　前面的 2 代表 K 和 V。真正决定缓存大小的是 KV Head 数量 $n_{kv}$，不是 Query Head 数量。

## 用 8 个 Query Head 看懂四种结构

　　假设一个注意力层有 8 个 Query Head。可以把它们想成 8 位读者：每位读者都带着自己的问题 Q 去查阅前文。K 像索引标签，V 像索引指向的内容。

| 结构 | 8 个 Query Head 怎样使用 KV | 主要目的 |
| --- | --- | --- |
| MHA | 8 个 Q，各有一套 K、V | 保留最完整的多头表达 |
| MQA | 8 个 Q，共用 1 套 K、V | 最大幅度减少 KV Cache |
| GQA | 8 个 Q 分组，例如共用 2 套 K、V | 在质量和效率之间折中 |
| MLA | 不按“几套 KV”直接缓存，而是缓存低维潜表示 | 用低秩压缩进一步减少缓存 |

　　前三种可以放在同一条轴上理解：**KV Head 从多到少，共享程度从低到高。** MLA 则换了一种表示方式，不能简单理解成“比 MQA 更少的 KV Head”。

## MHA：每个 Head 保留自己的 KV

　　Multi-Head Attention 中，每个 Query Head 都有与它对应的 Key Head 和 Value Head。8 个 Q 对应 8 套 KV。

　　这样做很直观：不同 Head 可以用不同的 K、V 投影，分别学习语法关系、实体指代、局部搭配等模式。但生成时，每个历史 Token、每一层都要缓存 8 套 K 和 V。

　　MHA 的优势是表达自由，代价是 KV Cache 最大。

## MQA：所有 Query Head 共用一套 KV

　　Multi-Query Attention 仍然保留 8 个不同的 Query Head，但只生成 1 个 Key Head 和 1 个 Value Head。8 位读者的问题不同，却查阅同一套索引和资料。

　　如果其他维度不变，KV Cache 大约会降到 MHA 的 $1/8$。生成时读取的数据也显著减少，因此更适合高并发和长上下文服务。

　　代价也很直接：不同 Query Head 不再拥有各自独立的 K、V 表示。共享过强时，模型质量可能下降。MQA 不是“免费的加速”。

## GQA：让一组 Query Head 共用 KV

　　Grouped-Query Attention 把 8 个 Query Head 分组。例如分成 2 组，每组 4 个 Query Head，共用一套 K、V。此时有 8 个 Q Head、2 个 KV Head。

　　它连接了 MHA 和 MQA：

- KV Head 数等于 Query Head 数时，就是 MHA。
- 只有 1 个 KV Head 时，就是 MQA。
- 介于两者之间，就是 GQA。

　　GQA 牺牲一部分独立性，换来明显的缓存和带宽收益。原始 GQA 论文的实验显示，它能够做到接近 MHA 的质量，同时获得接近 MQA 的推理速度。这也是它成为许多现代大模型常见选择的原因。

## MLA：换一条路，缓存低维潜表示

　　Multi-Head Latent Attention 不是继续减少 KV Head，而是先问：**K 和 V 中是否有大量可以共同压缩的信息？**

　　以 DeepSeek-V2 的 MLA 为例，模型先把当前 Token 的隐藏状态压缩成低维潜向量 $c_t^{KV}$。生成时主要缓存这份潜向量，而不是把每个 Head 的完整 K、V 全部存下来。计算注意力时，再通过投影使用其中的信息。

　　RoPE 会让 Key 的位置相关部分难以直接并入这种压缩，所以 MLA 把一小段与 RoPE 有关的 Key 分量单独处理和缓存。更准确地说，它缓存的是：

$$
\underbrace{c_t^{KV}}_{\text{压缩后的内容信息}}
\quad + \quad
\underbrace{k_t^{R}}_{\text{单独处理的 RoPE Key}}
$$

　　Query 一侧也会经过低秩投影，但自回归生成时，历史 Query 不需要像历史 K、V 那样留在缓存里。因此 MLA 的关键收益仍然来自压缩历史 KV。

　　这也是 MLA 最容易被讲错的地方：它不是“所有 Query Head 共用一个普通 KV Head”，而是改变了 K、V 的参数化与缓存形式。

## 动手试试：KV Cache 会差多少

<div id="kv-lab" class="kv-lab" markdown="0">
  <div class="controls"><label>上下文长度：<strong id="ctx-v">4096</strong><input id="ctx" type="range" min="1024" max="32768" step="1024" value="4096"></label><label>Transformer 层数：<strong id="layers-v">32</strong><input id="layers" type="range" min="8" max="80" step="8" value="32"></label></div>
  <div class="mode-row"><button data-kv="8" class="active">MHA · 8 KV Head</button><button data-kv="2">GQA · 2 KV Head</button><button data-kv="1">MQA · 1 KV Head</button></div>
  <div class="kv-result"><strong>单个序列的 KV Cache（示意）</strong><div class="kv-bars"><span id="mode-name">MHA</span><div class="kv-track"><div id="kv-fill" class="kv-fill" style="width:100%"></div></div><strong id="kv-size">—</strong></div><p class="kv-note">假设 8 个 Query Head、Head 维度 128、BF16，每层都保存 K 和 V。这个实验用于理解比例，真实模型还受架构、精度与实现影响。</p></div>
</div>
<script>
(function(){var root=document.getElementById('kv-lab');if(!root)return;var ctx=root.querySelector('#ctx'),layers=root.querySelector('#layers'),cv=root.querySelector('#ctx-v'),lv=root.querySelector('#layers-v'),fill=root.querySelector('#kv-fill'),size=root.querySelector('#kv-size'),name=root.querySelector('#mode-name'),buttons=root.querySelectorAll('button[data-kv]'),kv=8;function show(){cv.textContent=Number(ctx.value).toLocaleString();lv.textContent=layers.value;var bytes=2*kv*128*2*Number(ctx.value)*Number(layers.value),mib=bytes/1048576;size.textContent=mib>=1024?(mib/1024).toFixed(2)+' GiB':mib.toFixed(0)+' MiB';fill.style.width=(kv/8*100)+'%';name.textContent=kv===8?'MHA':kv===1?'MQA':'GQA';}buttons.forEach(function(b){b.onclick=function(){kv=Number(b.dataset.kv);buttons.forEach(function(x){x.classList.toggle('active',x===b)});show()}});ctx.oninput=layers.oninput=show;show()})();
</script>

　　注意：这个计算器只适用于 MHA、GQA 和 MQA。MLA 的缓存不能把 $n_{kv}$ 换成一个更小数字来算，而要按照“潜向量维度 + 解耦 RoPE Key 维度”计算。这正说明 MLA 不在同一条 KV Head 数量轴上。

## 四种结构放在一起比较

| 结构 | Query Head | 历史信息怎样缓存 | KV Cache | 典型取舍 |
| --- | ---: | --- | --- | --- |
| MHA | 多个 | 每个 Head 独立 K、V | 最大 | 表达自由，缓存开销高 |
| MQA | 多个 | 所有 Q 共用一套 K、V | 很小 | 解码快，可能损失质量 |
| GQA | 多个 | 每组 Q 共用一套 K、V | 中等 | 质量与效率较均衡 |
| MLA | 多个 | 低维潜表示 + 位置相关分量 | 取决于潜维度 | 压缩更深入，实现更复杂 |

## 实际应该怎样选择

　　如果是在读模型结构，不要看到缩写就判断谁一定更先进。先问四个问题：

1. 有多少 Query Head，又有多少 KV Head？
2. Decode 时每个 Token、每层到底缓存什么？
3. 目标是训练吞吐，还是长上下文、高并发的生成吞吐？
4. 推理框架是否有对应的高效算子？

　　MHA 简单直接；MQA 把缓存压到很小；GQA 常是稳妥折中；MLA 用更复杂的低秩设计换取进一步的缓存收益。架构是否划算，最终还要看模型质量、硬件带宽和推理实现。

## 容易混淆的四件事

1. **MQA 不是只有一个 Query Head。** 它是多个 Q Head 共享一套 KV。
2. **GQA 的“组数”就是 KV Head 数。** 每组对应一套 K、V。
3. **减少 KV Cache 主要改善 Decode。** 因为生成每个 Token 都要反复读取历史 KV。
4. **MLA 不是 MQA 的另一个名字。** 它缓存的是经过低秩压缩的潜表示，并对 RoPE 相关部分做了专门设计。

## 90 秒讲解视频

<video controls preload="metadata" poster="/img/AI/llm-learning/2026-10-03-MHA-MQA-GQA和MLA有什么区别/attention-variants-poster.png" style="display:block;width:min(100%,960px);margin:24px auto;border-radius:14px;background:#0d1726;box-shadow:0 14px 36px rgba(20,40,65,.18)"><source src="/img/AI/llm-learning/2026-10-03-MHA-MQA-GQA和MLA有什么区别/attention-variants-explainer.mp4" type="video/mp4">你的浏览器暂不支持 HTML5 视频。</video>

## 参考资料

- [Attention Is All You Need：Multi-Head Attention](https://arxiv.org/abs/1706.03762)
- [Fast Transformer Decoding: One Write-Head is All You Need：MQA](https://arxiv.org/abs/1911.02150)
- [GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints](https://aclanthology.org/2023.emnlp-main.298/)
- [DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model：MLA](https://arxiv.org/abs/2405.04434)

## 第十三课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-MHA-MQA-GQA和MLA有什么区别/thirteenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-MHA-MQA-GQA和MLA有什么区别/thirteenth-lesson-summary.svg" alt="MHA、MQA、GQA、MLA 第十三课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">从 KV Head 共享到潜表示压缩，点击查看原始 SVG</p>
</div>

　　下一课回到 Transformer Block 的另一半：FFN、SwiGLU 与所谓“知识存储”到底是什么关系？

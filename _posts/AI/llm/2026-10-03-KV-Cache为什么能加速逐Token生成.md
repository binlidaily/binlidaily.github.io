---
layout: post
title: KV Cache 为什么能加速逐 Token 生成？
subtitle: 旧 Token 的 K、V 不再重算；新 Query 仍要看历史
tags: [大模型, LLM, 推理, KV Cache]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:auto;max-width:100%;margin:24px auto}.blog-post h2{scroll-margin-top:88px}.paper-cite a{color:#2869aa;text-decoration:none}.paper-refs{padding-left:1.8em}.paper-refs li{margin:0 0 14px;padding-left:5px;line-height:1.7}.paper-refs .ref-back{margin-left:6px;text-decoration:none}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:320px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}.cache-lab{margin:28px auto;padding:22px;border:1px solid #dce6f0;border-radius:18px;background:linear-gradient(145deg,#f8fbff,#f5f8fc)}.cache-lab .controls{display:flex;gap:9px;flex-wrap:wrap}.cache-lab button{padding:9px 16px;border:1px solid #bfd1e3;border-radius:18px;background:#fff;color:#31516f;cursor:pointer}.cache-lab button.active{border-color:#286cab;background:#286cab;color:#fff}.cache-lab .cache-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:15px 0}.cache-lab .cell{padding:10px 14px;border-radius:10px;background:#e3eef9;color:#2f628f;font-weight:600}.cache-lab .cell.fresh{background:#def3eb;color:#277960}.cache-lab .query{margin:14px 0;padding:14px;border-radius:12px;background:#fff;border:1px solid #d9e5ee}.cache-lab .result{margin:15px 0 0;padding:14px;border-radius:12px;background:#eaf2fa;color:#34506c}.cache-lab .note{font-size:14px;color:#667b90}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十八课目录</strong><a href="#一段话为什么会被重复计算">1、重复计算</a><a href="#缓存到底保存了什么">2、保存什么</a><a href="#跟着生成过程走两步">3、交互演示</a><a href="#为什么不保存历史-q">4、为什么不存 Q</a><a href="#省下计算后付出什么代价">5、显存代价</a><a href="#什么时候不能直接复用">6、复用边界</a><a href="#第十八课复习总图">7、复习总图</a></nav></details>

　　模型收到“法国的首都是”，回答出“巴黎”。如果还要继续生成句号，它会再次处理当前上下文。问题是：前面的“法国、的、首都、是”早已算过，为什么每多生成一个 Token，还要把它们的 Key 和 Value 再算一遍？

> KV Cache 保存历史 Token 在每一层 Attention 中的 K、V。下一个 Token 到来时，只为它生成新的 Q、K、V，并让新 Q 查询缓存中的历史 K、V。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-KV-Cache为什么能加速逐Token生成/kv-cache.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-KV-Cache为什么能加速逐Token生成/kv-cache.svg" alt="提示词预填充后，KV Cache 随逐 Token 生成增长" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">从 Prefill 到 Decode：旧 K/V 复用，新 K/V 追加。点击查看原始 SVG</p>
</div>

## 一段话为什么会被重复计算

　　自回归生成一次只决定下一个 Token。若每一步都把**完整前缀**重新送进模型，第 1 次处理 4 个 Token，第 2 次处理 5 个，第 3 次处理 6 个；前面位置的表示和 K/V 又跟着计算。对因果 Attention 而言，旧位置不会看到未来新 Token，所以只要模型权重、位置和掩码等条件不变，旧位置算好的 K/V 就可以复用。

　　这也是“缓存”二字的含义：不是提前猜好答案，而是避免重复做已经做过的工作。

| 生成轮次 | 本次输入的前缀 | 不缓存：送入模型的位置数 | 缓存：新送入的位置数 |
| --- | --- | ---: | ---: |
| 首次预测 | 法国 / 的 / 首都 / 是 | 4 | 4（Prefill） |
| 继续预测 | 上述前缀 / 巴黎 | 5 | 1（巴黎） |
| 再继续 | 上述前缀 / 巴黎 / 。 | 6 | 1（。） |

　　表中的 4、5、6 对比 4、1、1，只是在数“本轮重新送入模型的位置”。**它不是运行时间或 FLOPs 的比例。**有缓存时，新 Query 仍要读取历史 K/V，并与越来越长的前缀做 Attention。

## 缓存到底保存了什么

　　在每个 Transformer 层，新 Token 的当前表示分别投影出 Query、Key、Value。Query 用来发问；Key 用来匹配；Value 提供被汇总的信息。对之后的生成步骤，旧 Token 的 Key 和 Value 还会被新 Query 用到，所以按层保存。每来一个新 Token，就在每层缓存末尾追加它的 K/V。

　　要特别注意“按层”：第 1 层的 K/V 不能拿去充当第 2 层的 K/V。每层输入表示和投影权重不同，缓存也各有一份。

　　缓存并没有省掉新 Token 与历史的相关性计算，也没有把长上下文的注意力变成常数成本。它省的是**旧 Token 的重复前向计算**；生成越往后，读取历史缓存的开销仍会增长。增量解码中的 K/V 带宽也是后来 MQA、GQA 等结构要解决的问题。<sup id="cite-1" class="paper-cite"><a href="#ref-1">[1]</a></sup>

## 跟着生成过程走两步

<div id="cache-lab" class="cache-lab" markdown="0">
  <div class="controls"><button data-step="0" class="active" type="button">1 · 读完提示词</button><button data-step="1" type="button">2 · 输入“巴黎”</button><button data-step="2" type="button">3 · 输入“。”</button></div>
  <div id="cache-tokens" class="cache-row"></div>
  <p id="cache-query" class="query"></p><p id="cache-result" class="result" aria-live="polite"></p>
  <p class="note">教学示意：方块代表“每一层中对应位置的一组 K/V”，不是实际向量内容。这里只画单条请求，不画多层、多头维度。</p>
</div>
<script>
(function(){var root=document.getElementById('cache-lab');if(!root)return;var buttons=root.querySelectorAll('button[data-step]'),tokens=root.querySelector('#cache-tokens'),query=root.querySelector('#cache-query'),result=root.querySelector('#cache-result'),names=['法国','的','首都','是','巴黎','。'];function show(n){buttons.forEach(function(b){b.classList.toggle('active',Number(b.dataset.step)===n)});var count=4+n;tokens.innerHTML='<strong>已保存 K/V：</strong>'+names.slice(0,count).map(function(x,i){return '<span class="cell '+(i===count-1&&n>0?'fresh':'')+'">'+x+'</span>'}).join('');if(n===0){query.textContent='Prefill：并行处理 4 个提示词位置；最后一个位置的输出用于预测“巴黎”。';result.textContent='缓存长度 4。下一轮无需重新生成这 4 个位置的 K/V。'}else if(n===1){query.textContent='Decode：输入“巴黎”，只算它的新 Q/K/V；新 Q 读取 4 个旧 K/V 和自己的 K/V。';result.textContent='追加“巴黎”的 K/V，缓存长度变为 5；这一轮预测下一个 Token“。”。'}else{query.textContent='Decode：输入“。”，只算它的新 Q/K/V；新 Q 读取此前 5 个 K/V 和自己的 K/V。';result.textContent='追加“。”的 K/V，缓存长度变为 6；若继续生成，下一轮可沿用这 6 个位置的缓存。'}}buttons.forEach(function(b){b.addEventListener('click',function(){show(Number(b.dataset.step))})});show(0)})();
</script>

## 为什么不保存历史 Q

　　继续生成时，新的 Query 只关心“我现在该看哪些历史信息”。旧 Token 的 Query 已经在它们自己的步骤使用过；后面的新 Token 不会拿旧 Query 再发一次问。因此通常不为 Decode 持久保存历史 Q。这里说的是**持久的增量推理缓存**；训练和 Prefill 的临时张量另当别论。

## 省下计算后，付出什么代价

　　缓存会占显存，而且随上下文和并发增长。对一种常见的 K/V 存储布局，可以先用下面的近似式估算原始张量大小：

$$M_{KV}\approx 2\times L\times B\times S\times H_{KV}\times d_{head}\times b$$

　　$L$ 是层数，$B$ 是请求批量，$S$ 是缓存长度，$H_{KV}$ 是每层 K/V 头数，$d_{head}$ 是每头维度，$b$ 是每个元素的字节数；开头的 2 对应 K 和 V。比如 $L=32$、$B=1$、$S=4096$、$H_{KV}=8$、$d_{head}=128$、FP16 的 $b=2$，仅这些原始 K/V 张量就约 **512 MiB**。真实占用还会受内存分配、分页、量化、位置编码实现等影响。

　　并发多、上下文长时，KV Cache 可能成为显存与带宽瓶颈。MQA/GQA 通过减少 K/V 头数降低每 Token 的缓存量；PagedAttention 着重改善缓存的内存管理与共享，减少碎片和重复副本。它们解决的是相邻但不同的问题。<sup id="cite-2" class="paper-cite"><a href="#ref-2">[2]</a></sup><sup id="cite-3" class="paper-cite"><a href="#ref-3">[3]</a></sup>

## 什么时候不能直接复用

　　复用的前提是：旧位置算 K/V 时所依据的内容和条件仍相同。改了提示词中间的内容、位置编号、Attention 掩码或模型权重，就不能盲目沿用受影响位置及其后续的缓存。完全相同的前缀在支持前缀共享的服务系统里可以复用，但需要正确匹配模型、位置与其他计算条件。<sup id="cite-3b" class="paper-cite"><a href="#ref-3">[3]</a></sup>

　　把本课收束成一句话：**旧 K/V 不重算，新 Q 仍读历史；拿显存与带宽换掉重复的前向计算。**

## 约 90 秒讲解视频

<video controls preload="metadata" poster="/img/AI/llm-learning/2026-10-03-KV-Cache为什么能加速逐Token生成/kv-cache-poster.png" style="display:block;width:min(100%,960px);margin:24px auto;border-radius:14px;background:#0d1726;box-shadow:0 14px 36px rgba(20,40,65,.18)"><source src="/img/AI/llm-learning/2026-10-03-KV-Cache为什么能加速逐Token生成/kv-cache-explainer.mp4" type="video/mp4">你的浏览器暂不支持 HTML5 视频。</video>

## 参考文献（References）

<ol class="paper-refs">
  <li id="ref-1">Shazeer, N. “<a href="https://arxiv.org/abs/1911.02150" target="_blank" rel="noopener">Fast Transformer Decoding: One Write-Head is All You Need</a>.” arXiv preprint arXiv:1911.02150, 2019.<a class="ref-back" href="#cite-1" aria-label="返回正文引用 1">↩</a></li>
  <li id="ref-2">Ainslie, J., Lee-Thorp, J., de Jong, M., et al. “<a href="https://arxiv.org/abs/2305.13245" target="_blank" rel="noopener">GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints</a>.” <em>EMNLP</em>, 2023. arXiv:2305.13245.<a class="ref-back" href="#cite-2" aria-label="返回正文引用 2">↩</a></li>
  <li id="ref-3">Kwon, W., Li, Z., Zhuang, S., et al. “<a href="https://arxiv.org/abs/2309.06180" target="_blank" rel="noopener">Efficient Memory Management for Large Language Model Serving with PagedAttention</a>.” <em>SOSP</em>, 2023. arXiv:2309.06180.<a class="ref-back" href="#cite-3" aria-label="返回正文引用 3">↩</a></li>
</ol>

## 第十八课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-KV-Cache为什么能加速逐Token生成/eighteenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-KV-Cache为什么能加速逐Token生成/eighteenth-lesson-summary.svg" alt="KV Cache 第十八课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">保存什么、为何加速、付出什么代价，一页回顾。点击查看原始 SVG</p>
</div>

　　下一课把推理拆成 Prefill 与 Decode：为什么两个阶段的性能瓶颈不同？

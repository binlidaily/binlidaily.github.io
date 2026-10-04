---
layout: post
title: Prefill 与 Decode：推理为什么分成两个阶段？
subtitle: 先读完提示词，再一个一个写出回答
tags: [大模型, LLM, 推理, Serving]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:auto;max-width:100%;margin:24px auto}.blog-post h2{scroll-margin-top:88px}.paper-cite a{color:#2869aa;text-decoration:none}.paper-refs{padding-left:1.8em}.paper-refs li{margin:0 0 14px;padding-left:5px;line-height:1.7}.paper-refs .ref-back{margin-left:6px;text-decoration:none}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:320px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}.pd-lab{margin:28px auto;padding:22px;border:1px solid #dce6f0;border-radius:18px;background:linear-gradient(145deg,#f8fbff,#f5f8fc)}.pd-lab .controls{display:flex;gap:14px;flex-wrap:wrap;align-items:center}.pd-lab label{display:inline-flex;gap:8px;align-items:center}.pd-lab input[type=range]{width:150px;accent-color:#286cab}.pd-lab .timeline{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.pd-lab .step{padding:14px 16px;border-radius:12px;background:#e7f0fa;color:#2f648d;font-weight:600}.pd-lab .step.decode{background:#e2f4ed;color:#287b62}.pd-lab .result{margin:15px 0 0;padding:14px;border-radius:12px;background:#eaf2fa;color:#34506c}.pd-lab .note{font-size:14px;color:#667b90}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十九课目录</strong><a href="#一次回答的时间线">1、时间线</a><a href="#prefill先把提示词读完">2、Prefill</a><a href="#decode一次走一个新位置">3、Decode</a><a href="#自己改变提示词和回答长度">4、交互演示</a><a href="#为什么两个阶段的瓶颈不同">5、性能差异</a><a href="#用户实际感受到的两个等待">6、延迟指标</a><a href="#当很多请求同时来到">7、服务调度</a><a href="#第十九课复习总图">8、复习总图</a></nav></details>

　　我们输入“法国的首都是”，模型回答“巴黎。”。这看起来是一件连续的事，计算机却会把它分成两种很不一样的工作：先处理整个提示词，再根据已经生成的内容逐个预测后续 Token。研究 LLM 推理系统时，通常把它们叫作 **Prefill** 和 **Decode**。<sup id="cite-1" class="paper-cite"><a href="#ref-1">[1]</a></sup>

> Prefill 负责“读”；Decode 负责“接着写”。它们用的是同一模型，但每次送进模型的 Token 数量不同。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-Prefill与Decode推理为什么分成两个阶段/prefill-decode.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-Prefill与Decode推理为什么分成两个阶段/prefill-decode.svg" alt="Prefill 处理提示词并预测首 Token，Decode 逐个续写" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">同一请求的时间线。点击查看原始 SVG</p>
</div>

## 一次回答的时间线

　　为便于画图，我们把提示词示意性地切成“法国 / 的 / 首都 / 是”四个位置；这不代表实际 Tokenizer 一定这样切分。模型先对这四个位置运行一次前向计算，并从最后一个位置的输出预测第一个回答 Token“巴黎”。接下来把“巴黎”作为新输入，再预测“。”。如果还要继续，才把“。”送回模型。

| 时刻 | 本次送入模型的内容 | 本轮产生的下一个 Token | 阶段 |
| --- | --- | --- | --- |
| 首次前向 | 四个提示词位置 | 巴黎 | Prefill |
| 下一轮前向 | 刚生成的“巴黎” | 。 | Decode |
| 若继续 | 刚生成的“。” | 下一个 Token | Decode |

　　**第一个输出 Token 通常来自 Prefill 的最后位置**，不是先把提示词 Prefill 一遍、再额外做一次完整 Decode 才得到它。不同实现的调度与统计口径可能略有差别，但这条计算依赖关系值得记住。

## Prefill：先把提示词读完

　　Prefill 一次处理提示词中的多个位置。因果掩码仍然有效：前面的 Token 看不到后面的 Token；但各位置的计算可以在一次前向中用较大的矩阵运算组织起来。同时，模型会建立各层的 KV Cache，供后续生成复用。

　　提示词越长，这一步要处理的位置就越多。Prefill 通常有较大的矩阵乘法，GPU 的并行计算能力比较容易发挥出来，因此在常见配置下往往更偏**计算密集**。这只是性能倾向，不是对所有长度、模型和硬件的绝对判断。<sup id="cite-1b" class="paper-cite"><a href="#ref-1">[1]</a></sup>

## Decode：一次走一个新位置

　　第一个回答 Token 出来后，同一请求还不能并行算出所有未知的未来 Token。下一步的输入要等上一步选出结果。因此 Decode 是一个接一个的依赖链。

　　有 KV Cache 时，每轮只把**刚生成的那个 Token**作为新位置送进模型，计算它的 Q、K、V；新 Query 仍要读取历史 K/V 做 Attention，然后预测再下一个 Token。缓存省去旧位置的重复计算，不能省去当前 Query 读取历史的工作。

　　“一个接一个”说的是**同一请求内部**。服务器可以把多个用户请求的 Decode 步骤放进一个批次，并行使用 GPU。不能把这两种并行混为一谈。

## 自己改变提示词和回答长度

<div id="pd-lab" class="pd-lab" markdown="0">
  <div class="controls"><label>提示词位置数 <input id="pd-prompt" type="range" min="4" max="32" step="4" value="8"><strong id="pd-prompt-value">8</strong></label><label>输出 Token 数 <input id="pd-output" type="range" min="2" max="8" step="1" value="4"><strong id="pd-output-value">4</strong></label></div>
  <div id="pd-timeline" class="timeline"></div><p id="pd-result" class="result" aria-live="polite"></p>
  <p class="note">教学示意：方块表示每次前向中新处理的位置数，不表示耗时或 FLOPs。假设首个输出 Token 由 Prefill 产生，后续每轮 Decode 产生一个。</p>
</div>
<script>
(function(){var root=document.getElementById('pd-lab');if(!root)return;var a=root.querySelector('#pd-prompt'),b=root.querySelector('#pd-output'),timeline=root.querySelector('#pd-timeline'),result=root.querySelector('#pd-result');function draw(){var p=Number(a.value),n=Number(b.value);root.querySelector('#pd-prompt-value').textContent=p;root.querySelector('#pd-output-value').textContent=n;var html='<span class="step">Prefill<br>'+p+' 个位置 → 输出 1</span>';for(var i=2;i<=n;i++)html+='<span class="step decode">Decode '+(i-1)+'<br>1 个新位置 → 输出 '+i+'</span>';timeline.innerHTML=html;result.textContent='提示词 '+p+' 个位置、输出 '+n+' 个 Token：先有 1 次 Prefill，再有 '+(n-1)+' 次 Decode。Prefill 建立历史 KV Cache；Decode 每次读取并追加缓存。这里不能用位置数直接推断两阶段耗时。'}[a,b].forEach(function(x){x.addEventListener('input',draw)});draw()})();
</script>

## 为什么两个阶段的瓶颈不同

　　Prefill 同时处理多个位置，矩阵乘法通常较大；Decode 单个请求每轮只处理一个新位置，却要读模型权重和不断增长的 KV Cache。常见 GPU 部署中，前者更容易受计算吞吐限制，后者往往更受显存带宽、缓存读取和小批次效率影响。多个请求一起 Decode 会改变批大小和瓶颈，因此不能把这句话当作固定定律。<sup id="cite-2" class="paper-cite"><a href="#ref-2">[2]</a></sup>

| 观察角度 | Prefill | Decode |
| --- | --- | --- |
| 同一请求每轮新处理的位置 | 多个提示词位置 | 通常 1 个新位置 |
| 主要产物 | 首个输出 Token、提示词 KV Cache | 下一 Token、新增 KV Cache |
| 常见性能倾向 | 较大的矩阵计算 | 权重与 KV 读取、逐步延迟 |
| 是否依赖未知的上一步输出 | 不依赖 | 依赖 |

　　两个阶段的资源需求不同，还会互相干扰。比如一个很长的 Prefill 插入正在运行的 Decode 批次，可能让其他用户等更久。相关研究会采用分块 Prefill，或将 Prefill 与 Decode 放到不同资源上运行；这些是服务系统的调度选择，不是模型结构突然变成了两个模型。<sup id="cite-1c" class="paper-cite"><a href="#ref-1">[1]</a></sup><sup id="cite-2b" class="paper-cite"><a href="#ref-2">[2]</a></sup>

## 用户实际感受到的两个等待

　　**TTFT（Time to First Token）** 是从请求发出到看到第一个输出 Token 的时间，包含排队、Prefill、首次选词和传输等环节。**TPOT（Time per Output Token）** 描述首 Token 之后，输出 Token 之间的平均间隔；有的系统也用相邻 Token 的 **ITL（inter-token latency）** 来看抖动。TTFT 主要受首次处理影响，TPOT/ITL 更能反映持续 Decode 的体验。<sup id="cite-2c" class="paper-cite"><a href="#ref-2">[2]</a></sup>

　　一个长提示词可能让首字迟迟不出现；首字很快出现，也不保证后面写得流畅。所以评价服务速度时，不能只看“每秒多少 Token”，还要看这两类等待。

## 当很多请求同时来到

　　用户请求的提示词长度、到达时间和输出长度都不同。在线服务会动态调整批次：新请求可以进入，已结束的请求可以退出，正在生成的请求继续运行。这类**连续批处理**提高资源利用率；同时需要在吞吐、首 Token 延迟和后续输出间隔之间做取舍。KV Cache 还会随各请求动态增长，PagedAttention 等方法则重点改善它的内存管理。<sup id="cite-3" class="paper-cite"><a href="#ref-3">[3]</a></sup>

　　把本课收束成一句话：**Prefill 一次读入已知提示词并给出首 Token；Decode 依赖已生成的 Token，逐步续写。它们要优化的等待，不是同一种等待。**

## 约 90 秒讲解视频

<video controls preload="metadata" poster="/img/AI/llm-learning/2026-10-03-Prefill与Decode推理为什么分成两个阶段/prefill-decode-poster.png" style="display:block;width:min(100%,960px);margin:24px auto;border-radius:14px;background:#0d1726;box-shadow:0 14px 36px rgba(20,40,65,.18)"><source src="/img/AI/llm-learning/2026-10-03-Prefill与Decode推理为什么分成两个阶段/prefill-decode-explainer.mp4" type="video/mp4">你的浏览器暂不支持 HTML5 视频。</video>

## 参考文献（References）

<ol class="paper-refs">
  <li id="ref-1">Agrawal, A., Panwar, A., Mohan, J., et al. “<a href="https://arxiv.org/abs/2308.16369" target="_blank" rel="noopener">SARATHI: Efficient LLM Inference by Piggybacking Decodes with Chunked Prefills</a>.” arXiv preprint arXiv:2308.16369, 2023.<a class="ref-back" href="#cite-1" aria-label="返回正文引用 1">↩</a></li>
  <li id="ref-2">Zhong, Y., Liu, S., Chen, J., et al. “<a href="https://arxiv.org/abs/2401.09670" target="_blank" rel="noopener">DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving</a>.” <em>OSDI</em>, 2024. arXiv:2401.09670.<a class="ref-back" href="#cite-2" aria-label="返回正文引用 2">↩</a></li>
  <li id="ref-3">Kwon, W., Li, Z., Zhuang, S., et al. “<a href="https://arxiv.org/abs/2309.06180" target="_blank" rel="noopener">Efficient Memory Management for Large Language Model Serving with PagedAttention</a>.” <em>SOSP</em>, 2023. arXiv:2309.06180.<a class="ref-back" href="#cite-3" aria-label="返回正文引用 3">↩</a></li>
</ol>

## 第十九课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-Prefill与Decode推理为什么分成两个阶段/nineteenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-Prefill与Decode推理为什么分成两个阶段/nineteenth-lesson-summary.svg" alt="Prefill 与 Decode 第十九课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">计算形态、性能瓶颈、体验指标和服务调度，一页回顾。点击查看原始 SVG</p>
</div>

　　下一课看量化：把权重从 16 位压到 INT8、INT4 时，究竟损失了什么？

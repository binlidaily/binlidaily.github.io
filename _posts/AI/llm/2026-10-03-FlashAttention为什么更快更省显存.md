---
layout: post
title: FlashAttention 为什么更快、更省显存？
subtitle: 公式没变，改变的是数据在 GPU 里怎么走
tags: [大模型, LLM, FlashAttention, GPU]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:auto;max-width:100%;margin:24px auto}.blog-post h2{scroll-margin-top:88px}.paper-cite a{color:#2869aa;text-decoration:none}.paper-refs{padding-left:1.8em}.paper-refs li{margin:0 0 14px;padding-left:5px;line-height:1.7}.paper-refs .ref-back{margin-left:6px;text-decoration:none}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:320px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}.flash-lab{margin:28px auto;padding:22px;border:1px solid #dce6f0;border-radius:18px;background:linear-gradient(145deg,#f8fbff,#f5f8fc)}.flash-lab button{padding:8px 16px;border:1px solid #bfd1e3;border-radius:18px;background:#fff;color:#31516f;cursor:pointer}.flash-lab button.active{border-color:#286cab;background:#286cab;color:#fff}.flash-lab .lab-controls{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.flash-lab .lab-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:17px}.flash-lab .lab-card{padding:17px;border:1px solid #d7e2ec;border-radius:13px;background:#fff}.flash-lab .lab-card.active{border-color:#3679ba;background:#e9f3fc}.flash-lab .lab-card strong,.flash-lab .lab-card span{display:block}.flash-lab .lab-card span{color:#62778b;font-size:14px}.flash-lab .lab-result{margin:17px 0 0;padding:14px;border-radius:12px;background:#eaf2fa;color:#34506c}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}@media(max-width:650px){.flash-lab .lab-cards{grid-template-columns:1fr}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十六课目录</strong><a href="#从一张注意力矩阵说起">1、问题在哪</a><a href="#显存大不等于访问快">2、两级存储</a><a href="#把整张表改为分块计算">3、分块计算</a><a href="#softmax-分块后怎么保持结果不变">4、在线 Softmax</a><a href="#动手看看中间结果去了哪里">5、交互演示</a><a href="#反向传播为什么还要重算">6、反向传播</a><a href="#更快的边界在哪里">7、适用边界</a><a href="#第十六课复习总图">8、复习总图</a></nav></details>

　　前面学 Attention 时，我们写下了一个很简洁的公式：

$$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

　　公式只占一行，照着它一步一步计算，却可能在 GPU 上反复搬运一张很大的中间表。FlashAttention 的核心不是改掉这个公式，而是改变计算顺序：**尽量在片上算完当前的一小块，不把整张注意力矩阵写回显存。**<sup id="cite-1" class="paper-cite"><a href="#ref-1">[1]</a></sup>

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-FlashAttention为什么更快更省显存/flashattention.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-FlashAttention为什么更快更省显存/flashattention.svg" alt="普通 Attention 与 FlashAttention 的数据流对比" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">两种数据流：公式相同，搬运方式不同。点击查看原始 SVG</p>
</div>

## 从一张注意力矩阵说起

　　假设一段输入有 $T$ 个 Token。每个 Query 都要与 Key 比较，分数形成一张 $T\times T$ 的表。朴素实现先算 $QK^\top$，把分数写到 GPU 显存；读出来做 Softmax，再写回；接着又读出来与 $V$ 相乘。

　　如果 $T=4096$，仅一张单头、单样本的 FP16 分数表就有 $4096^2$ 个数，约 32 MiB。这还没算其他中间结果、多个头和批次。关键不只是“放不放得下”：**写出、再读回**这张表，也要花时间。

## 显存大，不等于访问快

　　可以把 GPU 的 HBM 想成仓库：容量大，但从中取货有搬运成本。片上 SRAM 像工作台：空间小，取用却快。这个比喻只用于理解存储层级，不代表真实 GPU 只有两层内存。

　　如果每做一步都把整张表送回仓库，计算单元就会等数据。FlashAttention 设计时把这种读写成本也算进去，所以论文称它为 **IO-aware（考虑数据搬运的算法）**。<sup id="cite-1b" class="paper-cite"><a href="#ref-1">[1]</a></sup>

| 存储位置 | 在这篇文章里的作用 | 直观特点 |
| --- | --- | --- |
| HBM（GPU 显存） | 保存输入、输出及较大的数据 | 容量大，往返搬运有成本 |
| SRAM（片上存储） | 暂存正在计算的小块 | 容量小，访问快 |

## 把整张表改为分块计算

　　FlashAttention 将 $Q$、$K$、$V$ 划成能放进片上存储的块。对一块 Query，依次载入 Key 和 Value 的小块，计算局部分数，更新当前输出，然后再处理下一块。已经处理过的局部分数无需组成完整的 $T\times T$ 表写回 HBM。

　　这里要留意：它**仍然会比较需要比较的 Query 和 Key**。常见的精确 FlashAttention 没有把平方量级的注意力计算变成线性；省下的是大块中间矩阵的存储与搬运。论文另讨论了 block-sparse 近似变体，那是另一回事。<sup id="cite-1c" class="paper-cite"><a href="#ref-1">[1]</a></sup>

## Softmax 分块后怎么保持结果不变

　　真正容易卡住的是这里：Softmax 要知道一整行所有分数，分块时后面的分数还没见到，怎么先算前面的块？答案是保存一小组**可更新的统计量**，而不是保存整行的所有中间分数。

　　以一行分数 $[1,2,3]$ 为例。先看 $[1,2]$：当前最大值是 $m=2$，指数和是 $\ell=e^{1-2}+e^{2-2}$。当分数 $3$ 到来，最大值变为 $m'=3$。原先那一部分相对新最大值要乘 $e^{2-3}$，因此：

$$\ell'=e^{m-m'}\ell+e^{3-m'}=e^{-1}(e^{-1}+1)+1$$

　　输出向量的加权和也按同样比例缩放，再加上新块对 $V$ 的贡献。所有块处理完后，用累计的指数和做归一化。这就是在线 Softmax 的直觉：**旧块不用重新存一遍，但遇到更大的分数时必须重新标定旧贡献。**对同一数学定义，它得到精确 Attention 的结果；真实计算仍会有浮点舍入差异，不能把“精确”理解为逐位完全相同。<sup id="cite-1d" class="paper-cite"><a href="#ref-1">[1]</a></sup>

## 动手看看中间结果去了哪里

<div id="flash-lab" class="flash-lab" markdown="0">
  <div class="lab-controls"><span>选择计算方式：</span><button data-mode="ordinary" class="active">朴素实现</button><button data-mode="flash">分块实现</button><span>序列长度：</span><button data-t="512">512</button><button data-t="2048" class="active">2048</button><button data-t="4096">4096</button></div>
  <div class="lab-cards"><div class="lab-card" data-card="scores"><strong>分数矩阵</strong><span>是否完整写回 HBM？</span></div><div class="lab-card" data-card="softmax"><strong>Softmax 中间矩阵</strong><span>是否完整写回 HBM？</span></div><div class="lab-card" data-card="output"><strong>最终输出</strong><span>两种方式都要写回</span></div></div>
  <p class="lab-result" id="flash-result" aria-live="polite"></p>
</div>
<script>
(function(){var root=document.getElementById('flash-lab');if(!root)return;var mode='ordinary',t=2048,buttons=root.querySelectorAll('button'),cards=root.querySelectorAll('.lab-card'),result=root.querySelector('#flash-result');function update(){buttons.forEach(function(b){b.classList.toggle('active',b.dataset.mode===mode||Number(b.dataset.t)===t)});cards.forEach(function(c){c.classList.toggle('active',c.dataset.card==='output'||(mode==='ordinary'&&c.dataset.card!=='output'))});var mib=(t*t*2/1048576).toFixed(1);result.textContent=mode==='ordinary'?'单头、单样本、FP16：一张 '+t+'×'+t+' 中间表约 '+mib+' MiB。朴素流程可能将分数和 Softmax 结果完整写回 HBM，再读出继续计算。':'单头、单样本、FP16：若完整保存，一张 '+t+'×'+t+' 中间表约 '+mib+' MiB。分块实现不将这两张完整中间表写回 HBM，而是逐块更新统计量与输出。两者都要保存最终输出。'}buttons.forEach(function(b){b.onclick=function(){if(b.dataset.mode)mode=b.dataset.mode;else t=Number(b.dataset.t);update()}});update()})();
</script>

　　这里的大小只用于比较一张 FP16 $T\times T$ 表；真实显存峰值还取决于批量、头数、精度、内核实现和训练阶段。交互展示的是**数据流差异**，不是性能基准测试。

## 反向传播为什么还要重算

　　训练时需要求梯度。朴素做法可以存下大量前向中间结果，反向时直接读取。FlashAttention 选择保存更少的信息，反向时从 $Q,K,V$ 和少量统计量重算需要的局部分数。这会多做一些算术，但减少 HBM 读写和显存占用；在合适的 GPU 与输入形状下，整体训练反而更快。<sup id="cite-1e" class="paper-cite"><a href="#ref-1">[1]</a></sup>

## 更快的边界在哪里

　　FlashAttention 优化的是一种具体的计算实现，不是新的 Attention 定义。它不保证任何 GPU、任何序列长度都能按同一个倍数提速；内核版本、硬件、精度、头维度和掩码方式都会影响收益。FlashAttention-2 又进一步改进了工作划分与并行度，说明“减少 IO”之后，如何把 GPU 算力用满仍然重要。<sup id="cite-2" class="paper-cite"><a href="#ref-2">[2]</a></sup>

　　记住三条边界就够了：**精确 Attention 不等于逐位相同；省中间显存不等于消灭全部显存开销；更少 IO 不等于理论计算量从 $O(T^2)$ 变成 $O(T)$。**

## 约 90 秒讲解视频

<video controls preload="metadata" poster="/img/AI/llm-learning/2026-10-03-FlashAttention为什么更快更省显存/flashattention-poster.png" style="display:block;width:min(100%,960px);margin:24px auto;border-radius:14px;background:#0d1726;box-shadow:0 14px 36px rgba(20,40,65,.18)"><source src="/img/AI/llm-learning/2026-10-03-FlashAttention为什么更快更省显存/flashattention-explainer.mp4" type="video/mp4">你的浏览器暂不支持 HTML5 视频。</video>

## 参考文献（References）

<ol class="paper-refs">
  <li id="ref-1">Dao, T., Fu, D. Y., Ermon, S., Rudra, A., and Ré, C. “<a href="https://arxiv.org/abs/2205.14135" target="_blank" rel="noopener">FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness</a>.” <em>NeurIPS</em>, 2022. arXiv:2205.14135.<a class="ref-back" href="#cite-1" aria-label="返回正文引用 1">↩</a></li>
  <li id="ref-2">Dao, T. “<a href="https://arxiv.org/abs/2307.08691" target="_blank" rel="noopener">FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning</a>.” <em>ICLR</em>, 2024. arXiv:2307.08691.<a class="ref-back" href="#cite-2" aria-label="返回正文引用 2">↩</a></li>
</ol>

## 第十六课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-FlashAttention为什么更快更省显存/sixteenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-FlashAttention为什么更快更省显存/sixteenth-lesson-summary.svg" alt="FlashAttention 第十六课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">分块、在线 Softmax、重算与边界，一页回顾。点击查看原始 SVG</p>
</div>

　　下一课进入生成：Temperature、Top-K 与 Top-P 怎样改变模型选出的下一个 Token？

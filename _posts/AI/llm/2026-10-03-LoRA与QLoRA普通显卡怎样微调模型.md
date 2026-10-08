---
layout: post
title: LoRA 与 QLoRA：普通显卡怎样微调模型？
subtitle: 少训练参数，不等于只需装下这一小部分参数
tags: [大模型, LLM, LoRA, QLoRA]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:auto;max-width:100%;margin:24px auto}.blog-post h2{scroll-margin-top:88px}.paper-cite a{color:#2869aa;text-decoration:none}.paper-refs{padding-left:1.8em}.paper-refs li{margin:0 0 14px;padding-left:5px;line-height:1.7}.paper-refs .ref-back{margin-left:6px;text-decoration:none}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}.lora-lab{margin:28px auto;padding:22px;border:1px solid #dce6f0;border-radius:18px;background:linear-gradient(145deg,#f8fbff,#f4f9f8)}.lora-lab label{display:block;color:#294a63;font-weight:600}.lora-lab input[type=range]{width:min(340px,100%);accent-color:#267b86;vertical-align:middle}.lora-lab .values{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;margin:18px 0}.lora-lab .value{padding:14px;border:1px solid #dbe5ee;border-radius:12px;background:#fff;text-align:center}.lora-lab .value span,.lora-lab .value strong{display:block}.lora-lab .value span{color:#657b8c;font-size:14px}.lora-lab .value strong{margin-top:5px;color:#173d56;font-size:23px}.lora-lab .note{font-size:14px;color:#607487}.lora-lab .bar{height:20px;overflow:hidden;border-radius:10px;background:#dfe8f0}.lora-lab .bar i{display:block;min-width:3px;height:100%;background:#2b8a79}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}@media(max-width:650px){.lora-lab .values{grid-template-columns:1fr}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第二十二课目录</strong><a href="#lora-problem">1、显存从哪来</a><a href="#lora-update">2、低秩增量</a><a href="#lora-rank">3、试试 Rank</a><a href="#lora-placement">4、加在哪里</a><a href="#qlora-difference">5、QLoRA</a><a href="#lora-budget">6、显存与速度</a><a href="#lora-use">7、训练后怎么用</a><a href="#lora-summary">8、复习总图</a></nav></details>

　　上一课讲 SFT：用示范对话，让基础模型学会按我们的期望接话。问题随之而来：如果给大模型的**每个参数**都算梯度、保存优化器状态，普通显卡很快就装不下。LoRA 和 QLoRA 解决的是训练时的资源问题，而不是把训练目标换掉。

> LoRA：冻结原模型，只训练附加的小矩阵。QLoRA：在此基础上，把冻结的原模型权重以 4-bit 形式存放，进一步节省显存。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-LoRA与QLoRA普通显卡怎样微调模型/lora-qlora.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-LoRA与QLoRA普通显卡怎样微调模型/lora-qlora.svg" alt="LoRA 与 QLoRA 的参数更新及基础权重精度对比" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">同一层如何从全量更新，变成 LoRA 和 QLoRA。点击查看原始 SVG</p>
</div>

## 显存到底花在哪里？ {#lora-problem}

　　假设我们用 SFT 教模型按固定格式回答：“法国的首都是哪里？请只返回 JSON。”示范答案是 “{"answer":"巴黎"}”。不管采用哪种微调方法，模型都要读取问题、完成前向计算，再根据答案的 Loss 反向传播。

　　全参数微调时，模型权重之外，还要容纳梯度、优化器状态和激活值。**冻结权重可以省去这部分权重的梯度与优化器状态，却不能让基础模型在训练时消失。**LoRA 的想法是：给选中的线性层加一条可训练的“小支路”，原权重保持冻结。<sup id="cite-1" class="paper-cite"><a href="#ref-1">[1]</a></sup>

## 一块大矩阵，怎样用两块小矩阵来调整？ {#lora-update}

　　设原来的线性层权重是 $W$，输入是 $x$。普通输出是 $Wx$。LoRA 不直接更新 $W$，而是学习增量 $\Delta W$：

$$y=Wx+\frac{\alpha}{r}B(Ax),\qquad \Delta W=BA$$

　　$A$ 先把输入压到较窄的 $r$ 维，$B$ 再映射回输出维度。$r$ 叫 **Rank**，$\alpha/r$ 是常见的缩放方式；不同变体也可能用别的缩放规则。训练开始时，通常让这条支路的输出为零，从原模型行为出发学习。<sup id="cite-1b" class="paper-cite"><a href="#ref-1">[1]</a></sup><sup id="cite-3" class="paper-cite"><a href="#ref-3">[3]</a></sup>

　　看一个具体数字：若 $W$ 是 **4096×4096**，它有 **16,777,216** 个参数。选 $r=8$，$A$ 和 $B$ 合起来只有 $8×4096+4096×8=65,536$ 个可训练参数，约为原矩阵的 **0.39%**。这是**单个线性层的演示**；整个模型在多个目标层放 Adapter，比例需要重新计算。

| 同一个 4096×4096 线性层 | 原权重参数 | 需训练的新增参数 | 说明 |
| --- | ---: | ---: | --- |
| 全参数微调 | 16,777,216 | 16,777,216 | 直接更新 $W$ |
| LoRA，$r=8$ | 16,777,216（冻结） | 65,536 | 更新 $A$ 和 $B$ |
| QLoRA，$r=8$ | 16,777,216（冻结、低比特存放） | 65,536 | 可训练部分仍是 Adapter |

## 自己调一调 Rank {#lora-rank}

　　拖动 Rank，看看同一层的可训练参数怎样变化。这里比较的是**参数量**，不是整卡显存预测。

<div id="lora-lab" class="lora-lab" markdown="0">
  <label for="lora-rank">Rank：<strong id="lora-rank-value">8</strong> <input id="lora-rank" type="range" min="1" max="64" step="1" value="8"></label>
  <div class="values"><div class="value"><span>原矩阵参数（冻结）</span><strong>16,777,216</strong></div><div class="value"><span>LoRA 可训练参数</span><strong id="lora-trainable">65,536</strong></div><div class="value"><span>占原矩阵比例</span><strong id="lora-percent">0.39%</strong></div></div>
  <div class="bar" aria-label="LoRA 参数占原矩阵比例"><i id="lora-bar" style="width:0.39%"></i></div>
  <p class="note">公式：r×4096+4096×r。条形图为示意，低比例设有最小可见宽度。Rank 越大，容量与状态开销都增加；效果不保证单调变好。</p>
</div>
<script>(function(){var root=document.getElementById('lora-lab');if(!root)return;var input=root.querySelector('#lora-rank');function update(){var r=Number(input.value),n=8192*r,p=n/16777216*100;root.querySelector('#lora-rank-value').textContent=r;root.querySelector('#lora-trainable').textContent=n.toLocaleString('en-US');root.querySelector('#lora-percent').textContent=p.toFixed(2)+'%';root.querySelector('#lora-bar').style.width=p+'%'}input.addEventListener('input',update);update()})();</script>

　　Rank 不是越大越好：它给增量更大的表达空间，也增加参数、显存和过拟合风险。$\alpha$ 控制小支路的缩放；“Rank=8”本身不能说明适配效果。Hugging Face 的 PEFT 文档把 Rank、$\alpha$ 和目标模块列为独立配置项。<sup id="cite-3b" class="paper-cite"><a href="#ref-3">[3]</a></sup>

## 小支路加在哪里？ {#lora-placement}

　　LoRA 通常加在线性投影层，例如 Attention 的 Q、K、V、输出投影，或 FFN 中的投影。只选少数层更省资源，但可能限制模型能学到的变化；覆盖更多层通常需要更多训练资源。目标层名称随架构而变，不能把某个模型的配置原样套给所有模型。PEFT 允许自行选择目标模块；QLoRA 风格配置常覆盖更多线性层。<sup id="cite-3c" class="paper-cite"><a href="#ref-3">[3]</a></sup>

　　对刚才的 JSON 回答任务，训练数据决定**要学什么**，LoRA 决定**用哪些参数来学**。它不能把错误的示范变成正确答案。

## QLoRA 又多省了哪一笔？ {#qlora-difference}

　　LoRA 已经不更新基础权重，但训练时仍要把基础模型装进显存。QLoRA 再把**冻结的基础权重**以 4-bit 量化形式存放，计算时按实现方式把数值还原到计算精度，梯度沿计算图传给 LoRA Adapter。它**不是把所有训练计算都变成 INT4**，也不是对量化基础权重做全参数更新。原论文还引入 NF4、Double Quantization 和 Paged Optimizers，分别处理量化表示、量化常数占用和显存峰值。<sup id="cite-2" class="paper-cite"><a href="#ref-2">[2]</a></sup>

　　仍拿这一块 4096×4096 矩阵比较：只算原权重，BF16 存放约 **32 MiB**；理想的 4-bit 位数换算约 **8 MiB**。但实际量化还要保存 Scale 等元数据，有些层保持更高精度；**8 MiB 不是该层训练显存，更不是整模型显存需求**。

| 方法 | 基础权重 | 可训练部分 | 主要省在哪里 |
| --- | --- | --- | --- |
| 全参数微调 | 高精度，参与更新 | 整个模型 | 不以省显存为目标 |
| LoRA | 高精度，冻结 | 低秩 Adapter | 梯度与优化器状态 |
| QLoRA | 低比特，冻结 | 低秩 Adapter | 在 LoRA 基础上再压基础权重 |

## 为什么参数少了，显卡仍可能装不下？ {#lora-budget}

　　训练显存不只有权重。序列越长，激活往往越占空间；Batch、优化器、Attention 实现、梯度检查点和目标层选择也会改变峰值。QLoRA 的 4-bit 权重能节省一笔，但反量化和内核实现也有成本，**不保证比 BF16 LoRA 训练得更快**。能否在某张显卡运行，必须按具体模型、上下文长度和训练配置实测。QLoRA 论文的单卡案例是特定硬件与设置下的结果，不是“任意普通显卡都能微调任意大模型”的承诺。<sup id="cite-2b" class="paper-cite"><a href="#ref-2">[2]</a></sup>

　　实操时至少分别记录：模型质量、显存峰值、每步耗时。LoRA/QLoRA 是**资源策略**，不是免评估的质量保证。

## 训练完怎么用？ {#lora-use}

　　LoRA Adapter 可以单独保存，推理时加载到**对应版本**的基础模型上；也可以在合适精度下把增量合并进权重。单独保存便于切换任务，但 Adapter 不包含完整基础模型，不能脱离它独立使用。量化基础权重上的合并方式还受格式和实现约束，部署前要检查实际输出。PEFT 文档提供了加载、切换与合并 Adapter 的接口。<sup id="cite-3d" class="paper-cite"><a href="#ref-3">[3]</a></sup>

　　把本课收成一句话：**LoRA 省的是“要训练多少参数”；QLoRA 还省“冻结基础权重怎么存”。两者都没有让数据质量、激活显存和真实评估变得不重要。**

## 约 100 秒讲解视频

<video controls preload="metadata" poster="/img/AI/llm-learning/2026-10-03-LoRA与QLoRA普通显卡怎样微调模型/lora-qlora-poster.png" style="display:block;width:min(100%,960px);margin:24px auto;border-radius:14px;background:#0d1726;box-shadow:0 14px 36px rgba(20,40,65,.18)"><source src="/img/AI/llm-learning/2026-10-03-LoRA与QLoRA普通显卡怎样微调模型/lora-qlora-explainer.mp4" type="video/mp4">你的浏览器暂不支持 HTML5 视频。</video>

## 参考文献（References）

<ol class="paper-refs">
  <li id="ref-1">Hu, E. J., Shen, Y., Wallis, P., et al. “<a href="https://arxiv.org/abs/2106.09685" target="_blank" rel="noopener">LoRA: Low-Rank Adaptation of Large Language Models</a>.” <em>ICLR</em>, 2022. arXiv:2106.09685.<a class="ref-back" href="#cite-1" aria-label="返回正文引用 1">↩</a></li>
  <li id="ref-2">Dettmers, T., Pagnoni, A., Holtzman, A., and Zettlemoyer, L. “<a href="https://arxiv.org/abs/2305.14314" target="_blank" rel="noopener">QLoRA: Efficient Finetuning of Quantized LLMs</a>.” <em>NeurIPS</em>, 2023. arXiv:2305.14314.<a class="ref-back" href="#cite-2" aria-label="返回正文引用 2">↩</a></li>
  <li id="ref-3">Hugging Face. “<a href="https://huggingface.co/docs/peft/main/en/conceptual_guides/lora" target="_blank" rel="noopener">LoRA</a>.” PEFT Documentation, accessed 2026-10-09.<a class="ref-back" href="#cite-3" aria-label="返回正文引用 3">↩</a></li>
</ol>

## 第二十二课复习总图 {#lora-summary}

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-LoRA与QLoRA普通显卡怎样微调模型/twenty-second-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-LoRA与QLoRA普通显卡怎样微调模型/twenty-second-summary.svg" alt="LoRA 与 QLoRA 第二十二课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">更新参数、基础权重精度与训练显存，一张图复习。点击查看原始 SVG</p>
</div>

　　下一课进入偏好对齐：RLHF 与 DPO 怎样让模型更符合人类选择？

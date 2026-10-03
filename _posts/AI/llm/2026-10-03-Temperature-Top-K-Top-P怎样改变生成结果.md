---
layout: post
title: Temperature、Top-K、Top-P 怎样改变生成结果？
subtitle: 从同一组候选词出发，看懂“调权重、删候选、再抽样”
tags: [大模型, LLM, 推理, Sampling]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:auto;max-width:100%;margin:24px auto}.blog-post h2{scroll-margin-top:88px}.paper-cite a{color:#2869aa;text-decoration:none}.paper-refs{padding-left:1.8em}.paper-refs li{margin:0 0 14px;padding-left:5px;line-height:1.7}.paper-refs .ref-back{margin-left:6px;text-decoration:none}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:320px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}.sampling-lab{margin:28px auto;padding:22px;border:1px solid #dce6f0;border-radius:18px;background:linear-gradient(145deg,#f8fbff,#f5f8fc)}.sampling-lab .controls{display:flex;gap:14px;flex-wrap:wrap;align-items:center}.sampling-lab label{display:inline-flex;gap:8px;align-items:center;white-space:nowrap}.sampling-lab input[type=range]{width:145px;accent-color:#286cab}.sampling-lab button{padding:8px 16px;border:1px solid #bfd1e3;border-radius:18px;background:#fff;color:#31516f;cursor:pointer}.sampling-lab button.active,.sampling-lab button.draw{border-color:#286cab;background:#286cab;color:#fff}.sampling-lab .rows{margin-top:18px}.sampling-lab .row{display:grid;grid-template-columns:66px minmax(50px,1fr) 58px;align-items:center;gap:9px;margin:8px 0;color:#3a5671}.sampling-lab .track{height:21px;border-radius:7px;background:#e7eef5;overflow:hidden}.sampling-lab .fill{height:100%;border-radius:7px;background:#72a5d2;transition:width .25s}.sampling-lab .row.off{opacity:.42}.sampling-lab .row.off .fill{background:#b3c3d1}.sampling-lab .result{margin:17px 0 0;padding:14px;border-radius:12px;background:#eaf2fa;color:#34506c}.sampling-lab .note{color:#667b90;font-size:14px}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十七课目录</strong><a href="#模型先给出一组候选">1、一组候选</a><a href="#先分清选最大还是按概率抽">2、选最大或抽样</a><a href="#temperature先改变概率的形状">3、Temperature</a><a href="#top-k只留下固定个数">4、Top-K</a><a href="#top-p让候选数量随分布变化">5、Top-P</a><a href="#自己调一次参数">6、交互实验</a><a href="#三个参数放在一起时">7、组合与边界</a><a href="#第十七课复习总图">8、复习总图</a></nav></details>

　　我们问模型：“法国的首都是”。模型不会直接说“我决定选巴黎”，而是先给词表里的每个 Token 一个分数，再由解码规则挑出下一个 Token。下面为了方便理解，只展示五个候选；真实词表远不止五个。

> Temperature 改变候选之间的相对权重；Top-K 和 Top-P 缩小可选范围；最后一步才是抽样。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-Temperature-Top-K-Top-P怎样改变生成结果/sampling-controls.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-Temperature-Top-K-Top-P怎样改变生成结果/sampling-controls.svg" alt="从 Logits 经 Temperature、Top-K 和 Top-P 到下一 Token 的流程" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">同一组候选，三种参数分别在哪一步起作用。点击查看原始 SVG</p>
</div>

## 模型先给出一组候选

　　假设这次预测的概率是下表这样。数字是教学示意，不代表真实模型对这句话的输出。

| 候选 Token | 概率 |
| --- | ---: |
| 巴黎 | 0.55 |
| 北京 | 0.25 |
| 伦敦 | 0.12 |
| 东京 | 0.05 |
| 其他 | 0.03 |

　　五项加起来等于 1。“巴黎”最可能，但“最可能”与“必定选中”不是同一回事。

## 先分清：选最大，还是按概率抽

　　Greedy（贪心）每一步都选当前概率最高的 Token。按上表，它会选“巴黎”。Sampling（抽样）像按权重抽签：“巴黎”的签最多，其他候选仍有机会。Top-K、Top-P 和 Temperature 主要是给**抽样前的分布**定规则。

　　贪心路径并不保证整段话是概率最高或质量最好的；抽样也不保证内容更正确。解码策略影响结果，同一个模型也可能因选词方式不同，写出很不一样的文本。<sup id="cite-1" class="paper-cite"><a href="#ref-1">[1]</a></sup>

## Temperature：先改变概率的形状

　　模型原先给的是 Logits，即尚未归一化的分数。Temperature（温度）用一个正数 $\tau$ 缩放 Logits，再做 Softmax：

$$p_i(\tau)=\frac{e^{z_i/\tau}}{\sum_j e^{z_j/\tau}},\qquad \tau>0$$

　　$\tau<1$ 时，原有分数差距被放大，高概率候选更占优势；$\tau>1$ 时，概率更平均，较弱候选更容易被抽到。温度**不直接删除**任何候选。它也不会把原来的排名颠倒：最高分仍是最高分。

　　接近 0 时，分布会越来越集中在最高分候选；但 $\tau=0$ 不能直接代入上式。有些工具把 0 当作“使用贪心”的特殊选项，那是实现约定，不是公式本身。

## Top-K：只留下固定个数

　　Top-K 保留分数最高的 $K$ 个 Token，其余候选概率设为 0，再把保留下来的概率归一化。上表若用 $K=2$，就只剩“巴黎”和“北京”；它们的原概率之比 $0.55:0.25$ 保持不变，抽样时对应约 $68.75\%$ 与 $31.25\%$。

　　它好懂，但候选个数固定：模型非常确定时也留 $K$ 个，模型犹豫时仍只留 $K$ 个。$K=1$ 等于每一步只让最高分候选入选；若抽样前没有其他约束，结果与贪心一致。

## Top-P：让候选数量随分布变化

　　Top-P，也叫 Nucleus Sampling。将候选按概率从高到低排列，取**累计概率首次达到或超过阈值 $p$ 的最小前缀**，丢掉其余候选，再归一化并抽样。<sup id="cite-1b" class="paper-cite"><a href="#ref-1">[1]</a></sup>

　　上表若设 $p=0.80$，“巴黎”占 0.55，还不够；加上“北京”恰好到 0.80，于是只留下两个。若设 $p=0.90$，前两个只有 0.80，还要加入“伦敦”，累计到 0.92 才停。这里的 $p$ 是**保留候选集所需的累计概率门槛**，不是说“最终答案有 90% 的概率正确”。

　　Top-P 的候选数会变化：分布很尖时可能只留一两个；分布较平时可能留更多。这也是它相对于固定 Top-K 的关键区别。

## 自己调一次参数

<div id="sampling-lab" class="sampling-lab" markdown="0">
  <div class="controls"><label>温度 <input id="sample-temp" type="range" min="0.5" max="1.8" step="0.1" value="1"><strong id="sample-temp-value">1.0</strong></label><label>Top-K <input id="sample-k" type="range" min="1" max="5" step="1" value="5"><strong id="sample-k-value">5</strong></label><label>Top-P <input id="sample-p" type="range" min="0.5" max="1" step="0.05" value="1"><strong id="sample-p-value">1.00</strong></label><button id="sample-draw" class="draw" type="button">抽一次</button></div>
  <div id="sample-rows" class="rows"></div><p id="sample-result" class="result" aria-live="polite"></p>
  <p class="note">教学模拟：以表中的五项概率为起点。先调温度，Top-K 过滤后归一化，再按 Top-P 截断并归一化。没有设置随机种子，点击“抽一次”可能得到不同结果。</p>
</div>
<script>
(function(){var root=document.getElementById('sampling-lab');if(!root)return;var names=['巴黎','北京','伦敦','东京','其他'],base=[.55,.25,.12,.05,.03],t=root.querySelector('#sample-temp'),k=root.querySelector('#sample-k'),p=root.querySelector('#sample-p'),rows=root.querySelector('#sample-rows'),result=root.querySelector('#sample-result');function calc(){var tau=Number(t.value),limit=Number(k.value),threshold=Number(p.value);root.querySelector('#sample-temp-value').textContent=tau.toFixed(1);root.querySelector('#sample-k-value').textContent=limit;root.querySelector('#sample-p-value').textContent=threshold.toFixed(2);var a=base.map(function(x){return Math.pow(x,1/tau)}),sum=a.reduce(function(x,y){return x+y},0);a=a.map(function(x){return x/sum});var order=a.map(function(v,i){return{i:i,v:v}}).sort(function(x,y){return y.v-x.v});var top=order.slice(0,limit),topMass=top.reduce(function(x,y){return x+y.v},0),cut=[],total=0;for(var j=0;j<top.length;j++){cut.push(top[j]);total+=top[j].v/topMass;if(total+1e-12>=threshold)break}var selected=new Set(cut.map(function(x){return x.i})),den=cut.reduce(function(x,y){return x+y.v},0),final=a.map(function(x,i){return selected.has(i)?x/den:0});rows.innerHTML=names.map(function(n,i){return '<div class="row '+(selected.has(i)?'':'off')+'"><strong>'+n+'</strong><div class="track"><div class="fill" style="width:'+(final[i]*100).toFixed(1)+'%"></div></div><span>'+(final[i]*100).toFixed(1)+'%</span></div>'}).join('');result.textContent='当前候选：'+cut.map(function(x){return names[x.i]}).join('、')+'。图中显示的是重新归一化后用于抽样的概率。';return final}function draw(){var a=calc(),r=Math.random(),s=0;for(var i=0;i<a.length;i++){s+=a[i];if(r<s||i===a.length-1){result.textContent+=' 这一次抽到：“'+names[i]+'”。';break}}}[t,k,p].forEach(function(x){x.addEventListener('input',calc)});root.querySelector('#sample-draw').addEventListener('click',draw);calc()})();
</script>

## 三个参数放在一起时

　　交互实验采用的顺序是：Logits → Temperature → Top-K → 对剩余候选归一化 → Top-P → 再归一化 → 抽样。**顺序很重要**：温度和 Top-K 都会改变 Top-P 面对的分布，所以也可能改变它留下多少候选。不同框架还可能加入重复惩罚、禁用词等规则，实际顺序与默认值要看具体实现。

　　因此没有通用的“最佳参数”。任务需要稳定输出时，可以减少随机性；探索多样写法时，可以适当放宽。但更随机不等于更有创造力，更不等于更准确。比较参数效果时，要固定模型、输入、其他解码设置，并多次抽样观察，而不是只看一次结果。

　　最后记住一句话：**Temperature 改权重，Top-K 限个数，Top-P 限累计概率；抽样只在剩下的候选中进行。**

## 约 90 秒讲解视频

<video controls preload="metadata" poster="/img/AI/llm-learning/2026-10-03-Temperature-Top-K-Top-P怎样改变生成结果/sampling-poster.png" style="display:block;width:min(100%,960px);margin:24px auto;border-radius:14px;background:#0d1726;box-shadow:0 14px 36px rgba(20,40,65,.18)"><source src="/img/AI/llm-learning/2026-10-03-Temperature-Top-K-Top-P怎样改变生成结果/sampling-explainer.mp4" type="video/mp4">你的浏览器暂不支持 HTML5 视频。</video>

## 参考文献（References）

<ol class="paper-refs"><li id="ref-1">Holtzman, A., Buys, J., Du, L., Forbes, M., and Choi, Y. “<a href="https://arxiv.org/abs/1904.09751" target="_blank" rel="noopener">The Curious Case of Neural Text Degeneration</a>.” <em>ICLR</em>, 2020. arXiv:1904.09751.<a class="ref-back" href="#cite-1" aria-label="返回正文引用 1">↩</a></li></ol>

## 第十七课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-Temperature-Top-K-Top-P怎样改变生成结果/seventeenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-Temperature-Top-K-Top-P怎样改变生成结果/seventeenth-lesson-summary.svg" alt="第十七课采样参数复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">把三个参数的区别和组合顺序放到一张图里。点击查看原始 SVG</p>
</div>

　　下一课解释 KV Cache：为什么逐 Token 生成时不必反复计算整个历史？

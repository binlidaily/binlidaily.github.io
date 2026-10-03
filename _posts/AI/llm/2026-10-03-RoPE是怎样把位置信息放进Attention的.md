---
layout: post
title: RoPE 是怎样把位置信息放进 Attention 的？
subtitle: 转动 Q 和 K，让点积看见两个 Token 相隔多远
tags: [大模型, LLM, RoPE, Attention]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:min(100%,860px);margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:310px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}.rope-lab{max-width:920px;margin:28px auto;padding:22px;border:1px solid #dce5ef;border-radius:18px;background:#f8fbff;color:#172b45}.rope-lab .controls{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:18px}.rope-lab label{display:block;font-weight:600}.rope-lab input{width:100%}.rope-lab .readout{display:flex;justify-content:space-between;color:#5e7188;font-size:14px}.rope-lab svg{display:block;width:100%;height:auto;background:#fff;border-radius:14px}.rope-lab .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.rope-lab .metric{padding:12px;text-align:center;background:#fff;border-radius:12px}.rope-lab .metric strong{display:block;font-size:20px;color:#245f9f}.rope-lab .note{margin:14px 0 0;color:#5e7188;font-size:14px;line-height:1.7}.rope-lab button{margin-top:14px;padding:9px 15px;border:0;border-radius:18px;background:#245f9f;color:#fff}.video-board td:first-child{white-space:nowrap}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}@media(max-width:620px){.rope-lab .controls,.rope-lab .metrics{grid-template-columns:1fr}.rope-lab{padding:16px}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十二课目录</strong><a href="#先记住一句话">先记住一句话</a><a href="#1rope-改了哪里">1、RoPE 改了哪里</a><a href="#2把两维看成一个平面">2、把两维看成一个平面</a><a href="#3关键是角度差">3、关键是角度差</a><a href="#4动手改变两个位置">4、交互实验</a><a href="#5真实模型不只转一个平面">5、多种频率</a><a href="#6为什么不旋转-v">6、为什么不旋转 V</a><a href="#7长上下文为什么仍需验证">7、长上下文</a><a href="#8一分钟讲解视频脚本">8、视频脚本</a><a href="#第十二课复习总图">复习总图</a></nav></details>

　　先看两个短语：

```text
我 喜欢 苹果
苹果 喜欢 我
```

　　Token 没有变。顺序变了，意思也变了。Attention 必须知道每个 Token 在哪里。

　　RoPE 的办法很特别。它不把位置向量加到 Token Embedding 上。它转动 Q 和 K，然后再计算点积。

## 先记住一句话

> RoPE 用绝对位置决定旋转角度，用两个角度的差表示相对距离。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-RoPE是怎样把位置信息放进Attention的/rope-four-step.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-RoPE是怎样把位置信息放进Attention的/rope-four-step.svg" alt="RoPE 从位置编号到 Attention 分数的四步流程" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">位置编号 → 旋转 Q/K → 计算角度差 → 得到 Attention 分数</p>
</div>

## 1、RoPE 改了哪里

　　Attention 先从每个 Token 生成 Q、K、V。

```text
Hidden State → Q、K、V
Q · K        → Attention 分数
Attention × V → 输出
```

　　RoPE 插在“生成 Q、K”和“计算点积”之间：

```text
Q → 按位置旋转 → Q′
K → 按位置旋转 → K′
Q′ · K′       → 带位置信息的分数
```

　　标准 RoPE 不直接修改 V。

## 2、把两维看成一个平面

　　先只看 Q 的两个维度。把它们写成平面上的点 `(x₁, x₂)`。

　　位置为 `m` 时，RoPE 把这个点旋转 `mθ`：

$$x_1' = x_1\cos(m\theta)-x_2\sin(m\theta)$$

$$x_2' = x_1\sin(m\theta)+x_2\cos(m\theta)$$

　　旋转只改变方向。它不改变向量长度。

　　位置 0 不转。位置 1 转 `θ`。位置 2 转 `2θ`。因此，每个绝对位置都有自己的角度。

## 3、关键是角度差

　　假设 Q 在位置 `m`，K 在位置 `n`。旋转后再做点积：

$$
(R_m q)^\top(R_n k)
=q^\top R_m^\top R_n k
=q^\top R_{n-m}k
$$

　　中间的共同旋转会抵消。最后只剩 `n-m`。

　　例如，位置 2 和位置 5 相差 3。位置 20 和位置 23 也相差 3。对于同一组 Q、K 内容向量，这两组位置产生相同的相对旋转。

　　这就是 RoPE 最关键的性质：它用绝对位置完成旋转，却让 Q、K 点积自然包含相对位置。

## 4、动手改变两个位置

　　下面是一个二维玩具模型。Q 和 K 使用相同的单位向量，只保留位置带来的影响。真实模型的分数还包含 Token 内容、不同维度和缩放。

<div class="rope-lab" id="rope-lab">
  <div class="controls">
    <label>Q 的位置 m <span class="readout"><span>0</span><strong id="rope-m-value">2</strong><span>12</span></span><input id="rope-m" type="range" min="0" max="12" value="2" step="1"></label>
    <label>K 的位置 n <span class="readout"><span>0</span><strong id="rope-n-value">5</strong><span>12</span></span><input id="rope-n" type="range" min="0" max="12" value="5" step="1"></label>
  </div>
  <svg id="rope-stage" viewBox="0 0 820 360" role="img" aria-labelledby="rope-stage-title rope-stage-desc">
    <title id="rope-stage-title">RoPE 二维旋转实验</title><desc id="rope-stage-desc">改变 Q 和 K 的位置，观察旋转角度、相对距离与点积。</desc>
    <line x1="70" y1="180" x2="350" y2="180" stroke="#cad7e6"/><line x1="210" y1="40" x2="210" y2="320" stroke="#cad7e6"/>
    <circle cx="210" cy="180" r="112" fill="none" stroke="#dce6f0"/>
    <line x1="470" y1="180" x2="750" y2="180" stroke="#cad7e6"/><line x1="610" y1="40" x2="610" y2="320" stroke="#cad7e6"/>
    <circle cx="610" cy="180" r="112" fill="none" stroke="#dce6f0"/>
    <text x="210" y="28" text-anchor="middle" fill="#273f5d" font-size="18">Q 按 mθ 旋转</text><text x="610" y="28" text-anchor="middle" fill="#273f5d" font-size="18">K 按 nθ 旋转</text>
    <line id="rope-q-line" x1="210" y1="180" x2="322" y2="180" stroke="#3478c9" stroke-width="7" stroke-linecap="round"/><circle id="rope-q-dot" cx="322" cy="180" r="8" fill="#3478c9"/>
    <line id="rope-k-line" x1="610" y1="180" x2="722" y2="180" stroke="#d97942" stroke-width="7" stroke-linecap="round"/><circle id="rope-k-dot" cx="722" cy="180" r="8" fill="#d97942"/>
    <text id="rope-q-label" x="210" y="344" text-anchor="middle" fill="#3478c9" font-size="16"></text><text id="rope-k-label" x="610" y="344" text-anchor="middle" fill="#d97942" font-size="16"></text>
  </svg>
  <div class="metrics">
    <div class="metric"><span>相对距离 n−m</span><strong id="rope-distance">3</strong></div>
    <div class="metric"><span>相对角度</span><strong id="rope-angle">60°</strong></div>
    <div class="metric"><span>位置项 cos(Δ)</span><strong id="rope-score">0.50</strong></div>
  </div>
  <button id="rope-play" type="button">播放等距离演示</button>
  <p class="note" id="rope-note">位置 2 与位置 5 相差 3。把两者同时向后移动，角度差和位置项保持不变。</p>
</div>

<script>
(function(){
  var root=document.getElementById('rope-lab');if(!root)return;
  var m=root.querySelector('#rope-m'),n=root.querySelector('#rope-n'),timer=null;
  function point(cx,cy,a){var r=112,rad=a*Math.PI/180;return [cx+r*Math.cos(rad),cy-r*Math.sin(rad)];}
  function setLine(idLine,idDot,cx,cy,a){var p=point(cx,cy,a),line=root.querySelector(idLine),dot=root.querySelector(idDot);line.setAttribute('x2',p[0]);line.setAttribute('y2',p[1]);dot.setAttribute('cx',p[0]);dot.setAttribute('cy',p[1]);}
  function draw(){var mv=Number(m.value),nv=Number(n.value),unit=20,ma=mv*unit,na=nv*unit,d=nv-mv,delta=d*unit,score=Math.cos(delta*Math.PI/180);root.querySelector('#rope-m-value').textContent=mv;root.querySelector('#rope-n-value').textContent=nv;root.querySelector('#rope-distance').textContent=d;root.querySelector('#rope-angle').textContent=delta+'°';root.querySelector('#rope-score').textContent=score.toFixed(2);root.querySelector('#rope-q-label').textContent='mθ = '+ma+'°';root.querySelector('#rope-k-label').textContent='nθ = '+na+'°';root.querySelector('#rope-note').textContent='位置 '+mv+' 与位置 '+nv+' 相差 '+d+'。位置项只由角度差 '+delta+'° 决定。';setLine('#rope-q-line','#rope-q-dot',210,180,ma);setLine('#rope-k-line','#rope-k-dot',610,180,na);}
  m.addEventListener('input',draw);n.addEventListener('input',draw);root.querySelector('#rope-play').addEventListener('click',function(){if(timer){clearInterval(timer);timer=null;this.textContent='播放等距离演示';return;}var step=0,button=this;button.textContent='停止演示';timer=setInterval(function(){if(step>8){clearInterval(timer);timer=null;button.textContent='播放等距离演示';return;}m.value=step;n.value=step+3;draw();step++;},650);});draw();
})();
</script>

## 5、真实模型不只转一个平面

　　真实 Q、K 有很多维。RoPE 把维度两两配对，并给每一对不同的频率。

| 维度组 | 角度变化 | 直观作用 |
| --- | --- | --- |
| 高频组 | 变化快 | 区分邻近位置 |
| 中频组 | 变化适中 | 表示中等距离 |
| 低频组 | 变化慢 | 覆盖更长距离 |

　　可以把这些频率看成多把尺子。短尺子看近处。长尺子看远处。模型同时使用它们。

## 6、为什么不旋转 V

　　Q 和 K 决定“关注谁”。它们的点积产生 Attention 分数。

　　V 保存要汇总的内容。RoPE 的目标是把位置放进相关性分数。因此，标准做法旋转 Q、K，不直接旋转 V。

## 7、长上下文为什么仍需验证

　　RoPE 可以为更大的位置编号计算角度。但能计算不等于能理解。

　　模型可能没有在长序列上训练。高频分量也可能在很远的位置产生陌生的相位模式。因此，扩展上下文常会调整位置或频率，例如线性缩放、动态 NTK 或 YaRN。

　　判断扩展是否有效，不能只看配置中的最大长度。还要测试长文本检索、困惑度和推理任务。

## 容易混淆的 4 件事

1. RoPE 不旋转 Token ID，也不是直接旋转原始文字。
2. RoPE 作用于 Attention 中的 Q、K。
3. 相对距离进入点积，不表示模型只知道相对位置。
4. 更长的可计算位置不保证更长的有效上下文。

## 记住这 5 件事

1. RoPE 把向量维度两两配对。
2. 位置编号决定每一对的旋转角度。
3. Q 和 K 都要旋转。
4. 点积中的共同旋转会抵消，留下相对位置。
5. 多种频率负责不同距离尺度。

## 8、一分钟讲解视频脚本

<table class="video-board">
  <thead><tr><th>时间</th><th>画面</th><th>旁白</th></tr></thead>
  <tbody>
    <tr><td>00–08 秒</td><td>“我喜欢苹果”与“苹果喜欢我”交换位置。</td><td>Token 相同，顺序不同，意思就不同。Attention 需要知道 Token 在哪里。</td></tr>
    <tr><td>08–20 秒</td><td>Q、K 两支箭头出现在坐标轴上。</td><td>RoPE 不把位置向量加到输入。它把 Q 和 K 的维度两两配对，再按位置旋转。</td></tr>
    <tr><td>20–34 秒</td><td>位置 2 的 Q 转 2θ；位置 5 的 K 转 5θ。</td><td>位置决定绝对角度。位置越靠后，旋转越多。</td></tr>
    <tr><td>34–48 秒</td><td>两个角度合并为差值 3θ，公式变成 R(n−m)。</td><td>计算点积时，共同旋转会抵消。最后留下的是两个位置的差。</td></tr>
    <tr><td>48–60 秒</td><td>多组快慢不同的圆环同时旋转。</td><td>不同维度使用不同频率。模型因此能同时观察近距离和远距离。</td></tr>
    <tr><td>60–70 秒</td><td>Q、K 高亮，V 保持不动；出现总结句。</td><td>记住：RoPE 用绝对位置旋转 Q 和 K，让 Attention 的点积看见相对距离。</td></tr>
  </tbody>
</table>

## 参考资料

- [RoFormer 原论文](https://arxiv.org/abs/2104.09864)
- [Hugging Face：RoPE 工具与缩放变体](https://huggingface.co/docs/transformers/en/internal/rope_utils)

## 第十二课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-RoPE是怎样把位置信息放进Attention的/rope-review.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-RoPE是怎样把位置信息放进Attention的/rope-review.svg" alt="RoPE 第十二课复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">第十二课复习总图，点击查看原始 SVG</p>
</div>

　　下一课比较 MHA、MQA、GQA 与 MLA：它们共享或压缩了什么？

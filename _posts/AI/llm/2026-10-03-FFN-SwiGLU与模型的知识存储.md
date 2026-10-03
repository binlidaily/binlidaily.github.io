---
layout: post
title: FFN 与 SwiGLU：Attention 之后，每个 Token 还要做什么？
subtitle: 从逐位置加工、门控选择，到“知识存储”这个比喻的边界
tags: [大模型, LLM, FFN, SwiGLU]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>
.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:auto;max-width:100%;margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{display:flex;align-items:center;justify-content:center;width:58px;height:42px;margin-left:auto;border-radius:22px;background:linear-gradient(135deg,#17345a,#2f6598);box-shadow:0 8px 24px rgba(25,54,87,.2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;list-style:none}.lesson-toc>summary::-webkit-details-marker{display:none}.lesson-toc nav{width:315px;margin-top:10px;padding:14px 10px;border:1px solid #dbe5ef;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 16px 42px rgba(25,54,87,.18)}.lesson-toc nav strong,.lesson-toc nav a{display:block;padding:7px 10px}.lesson-toc nav a{border-radius:8px;color:#405874;font-size:14px;text-decoration:none}.lesson-toc nav a:hover{background:#edf4fb;color:#1f5f9d}.ffn-lab{margin:30px auto;padding:22px;border:1px solid #dce6f0;border-radius:18px;background:linear-gradient(145deg,#f8fbff,#f5f8fc)}.ffn-tokens{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:20px}.ffn-lab button{padding:9px 17px;border:1px solid #bfd1e3;border-radius:18px;background:#fff;color:#31516f;cursor:pointer}.ffn-lab button.active{border-color:#286cab;background:#286cab;color:#fff}.ffn-flow{display:grid;grid-template-columns:1fr 48px 1.3fr 48px 1fr;align-items:center;gap:8px}.ffn-box{padding:16px;border-radius:14px;background:#fff;box-shadow:0 6px 18px rgba(35,66,98,.08);text-align:center}.ffn-arrow{text-align:center;color:#5681aa;font-size:25px}.gate-row{display:grid;grid-template-columns:86px 1fr 46px;align-items:center;gap:8px;margin:8px 0;text-align:left}.gate-track{height:11px;border-radius:7px;background:#e7edf3;overflow:hidden}.gate-fill{height:100%;border-radius:7px;background:linear-gradient(90deg,#7658c8,#b292ef);transition:width .25s}.ffn-result{margin:16px 0 0;padding:13px;border-radius:12px;background:#eaf2fa;color:#34506c;text-align:center}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:52px;max-height:65vh;overflow:auto}}@media(max-width:680px){.ffn-flow{grid-template-columns:1fr}.ffn-arrow{transform:rotate(90deg)}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav><strong>第十四课目录</strong><a href="#attention-已经交流过了为什么还需要-ffn">1、为什么还需要 FFN</a><a href="#ffn-究竟做了什么">2、FFN 做了什么</a><a href="#为什么中间必须有非线性">3、为什么需要非线性</a><a href="#从-glu-到-swiglu多加一扇门">4、SwiGLU</a><a href="#动手试试不同-token-会打开不同的门">5、交互实验</a><a href="#ffn-真的在存知识吗">6、知识存储的边界</a><a href="#为什么-ffn-又大又贵">7、参数与计算</a><a href="#第十四课复习总图">8、复习总图</a></nav></details>

　　Attention 已经让 Token 互相交换过信息了，为什么 Transformer Block 里还要紧跟一个 FFN？

　　可以先用一句话区分它们：

> Attention 负责“从其他 Token 那里取回什么”，FFN 负责“拿到这些信息以后，当前 Token 要把它加工成什么”。

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-FFN-SwiGLU与模型的知识存储/ffn-swiglu.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-FFN-SwiGLU与模型的知识存储/ffn-swiglu.svg" alt="FFN 与 SwiGLU 的工作流程" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">Attention 先交流，FFN 再逐 Token 加工，点击查看原始 SVG</p>
</div>

## Attention 已经交流过了，为什么还需要 FFN

　　假设输入是“我喜欢苹果”。经过 Attention 后，“苹果”这个位置已经能吸收“我”和“喜欢”的信息。此时它不再只是最初的词向量，而是带着上下文的表示。

　　但“收集信息”和“加工信息”是两件事。Attention 主要把不同位置的信息按权重混合；FFN 则对混合后的表示做非线性变换，识别并组合出更有用的特征。

　　更重要的是，FFN 是**逐 Token**工作的：

```text
我     ──同一个 FFN──> 新的“我”表示
喜欢   ──同一个 FFN──> 新的“喜欢”表示
苹果   ──同一个 FFN──> 新的“苹果”表示
```

　　三个位置使用同一套 FFN 参数，但每个位置独立计算。FFN 本身不会让“我”再去读取“苹果”；跨 Token 的交流已经由 Attention 完成。

## FFN 究竟做了什么

　　经典 Transformer FFN 可以写成：

$$
\operatorname{FFN}(x)=W_2\,\sigma(W_1x+b_1)+b_2
$$

　　它包含三个动作：

1. **升维**：把 $d_{model}$ 维的输入投影到更宽的 $d_{ff}$。
2. **激活**：用 ReLU、GELU 或 SiLU 加入非线性。
3. **降维**：把结果投影回 $d_{model}$，以便接回残差流。

　　如果 $d_{model}=4096$，中间宽度可能达到一万多维。可以把这片更宽的空间理解成一排“特征探测器”：有些响应语法，有些响应实体或语义模式。输入不同，亮起的组合也不同。

## 为什么中间必须有非线性

　　如果拿掉激活函数，连续两个线性层仍然只是一个线性层：

$$
W_2(W_1x)=(W_2W_1)x
$$

　　无论中间扩得多宽，都可以合并成一个矩阵，模型并没有获得新的表达能力。

　　激活函数改变了这件事。它让不同输入走出不同的响应模式：某些中间维度被压低，某些被保留。于是 FFN 不只是“换一个坐标系”，而能根据输入选择和组合特征。

## 从 GLU 到 SwiGLU：多加一扇门

　　SwiGLU 不再只计算一条升维支路，而是把输入送进两条支路：

$$
\operatorname{SwiGLU}(x)=W_{down}\left(\operatorname{SiLU}(W_{gate}x)\odot(W_{up}x)\right)
$$

　　两条支路分工如下：

- $W_{up}x$ 产生候选内容：**这里有什么特征？**
- $\operatorname{SiLU}(W_{gate}x)$ 产生门控信号：**这些特征该通过多少？**
- $\odot$ 做逐元素相乘，把门应用到候选内容上。
- $W_{down}$ 把筛选后的宽向量投影回 $d_{model}$。

　　这里的“门”并不是只能开或关。SiLU 输出的是连续数值，因此某个特征可以被加强、减弱，也可能改变符号。把它理解成一排可调节的旋钮，比“0 或 1 的开关”更准确。

## 动手试试：不同 Token 会打开不同的门

<div id="ffn-lab" class="ffn-lab" markdown="0">
  <div class="ffn-tokens"><button data-token="我">我</button><button data-token="喜欢" class="active">喜欢</button><button data-token="苹果">苹果</button></div>
  <div class="ffn-flow"><div class="ffn-box"><strong id="ffn-token">喜欢</strong><br><small>上下文化表示 x</small></div><div class="ffn-arrow">→</div><div class="ffn-box"><strong>SwiGLU 的门控响应</strong><div class="gate-row"><span>动作关系</span><div class="gate-track"><div class="gate-fill" data-gate="0"></div></div><b data-value="0"></b></div><div class="gate-row"><span>主体线索</span><div class="gate-track"><div class="gate-fill" data-gate="1"></div></div><b data-value="1"></b></div><div class="gate-row"><span>实体类别</span><div class="gate-track"><div class="gate-fill" data-gate="2"></div></div><b data-value="2"></b></div></div><div class="ffn-arrow">→</div><div class="ffn-box"><strong>W<sub>down</sub></strong><br><small>回到 d<sub>model</sub></small></div></div>
  <p id="ffn-result" class="ffn-result" aria-live="polite"></p>
</div>
<script>
(function(){var root=document.getElementById('ffn-lab');if(!root)return;var data={'我':{v:[35,92,18],t:'主体线索响应较强，输出会强化“谁在做事”的表示。'},'喜欢':{v:[94,58,25],t:'动作关系响应较强，输出会强化“主体与对象之间的关系”。'},'苹果':{v:[18,30,96],t:'实体类别响应较强，输出会强化“这是一个具体对象”的表示。'}};var bs=root.querySelectorAll('button[data-token]'),fills=root.querySelectorAll('[data-gate]'),vals=root.querySelectorAll('[data-value]'),token=root.querySelector('#ffn-token'),result=root.querySelector('#ffn-result');function show(k){var d=data[k];token.textContent=k;bs.forEach(function(b){b.classList.toggle('active',b.dataset.token===k)});fills.forEach(function(f,i){f.style.width=d.v[i]+'%'});vals.forEach(function(v,i){v.textContent=d.v[i]+'%'});result.textContent=d.t}bs.forEach(function(b){b.onclick=function(){show(b.dataset.token)}});show('喜欢')})();
</script>

　　这只是为了帮助理解的示意，不代表真实模型中存在三个写好名字的神经元。真实 FFN 的中间维度通常更宽，特征也会纠缠、叠加，一个概念可能由许多维度共同表示。

## FFN 真的在“存知识”吗

　　“FFN 像知识库”来自一个很有启发性的观察。对于经典两层 FFN，第一层的行向量可以看成一组模式匹配器；输入与某个模式越相似，对应激活越强。第二层的列向量则把这些激活重新写回模型表示。

　　因此可以用近似的 Key-Value Memory 视角理解：

$$
a_i=\sigma(k_i^\top x), \qquad \operatorname{FFN}(x)=\sum_i a_i v_i
$$

　　这里的 $a_i$ 是输入与第 $i$ 个模式的匹配强度，$v_i$ 是它被激活后写回模型表示的方向。

　　Geva 等人的实验发现，一些“Key”会响应可解释的文本模式，低层往往偏向浅层模式，高层更偏语义；对应的“Value”会推动某些词的输出概率。后续模型编辑研究也发现，中间层 FFN 对部分事实关联很重要。

　　但“知识存储”是**解释视角，不是硬盘地址**。不能把它理解成“巴黎是法国首都”完整地放在某一个神经元里：

- 一个事实可能分布在多个神经元、多个层和多种参数中。
- 同一个神经元可能参与多个不相干的模式。
- 是否能召回某个知识，还依赖 Attention 带来的上下文和残差流。
- 能编辑某层的事实，不等于知识只存放在那一层。

　　更稳妥的说法是：**FFN 参数参与保存和调用模型学到的模式与事实关联，但知识是分布式的。**

## 为什么 FFN 又大又贵

　　经典 FFN 有两个大矩阵；SwiGLU 有 gate、up、down 三个投影。如果直接沿用相同的中间宽度，参数和计算都会增加，所以使用 SwiGLU 的模型通常会相应缩小中间维度，以控制总参数量。

| 结构 | 主要投影 | 核心特点 |
| --- | --- | --- |
| ReLU/GELU FFN | up、down | 一条内容支路，结构简单 |
| SwiGLU FFN | gate、up、down | 用门控支路筛选候选内容 |

　　FFN 的大矩阵乘法也解释了为什么 MoE 通常改造 FFN：准备很多组 FFN“专家”，但每个 Token 只经过少数专家。这样可以增加参数容量，而不让每次计算同比例增长。

## 容易混淆的四件事

1. **FFN 不负责跨 Token 通信。** 它逐位置使用同一套参数。
2. **升维不是目的本身。** 更宽的空间配合非线性，才带来丰富的特征组合。
3. **SwiGLU 的门不是二进制开关。** 它是连续的、逐元素的调节信号。
4. **“FFN 存知识”不是精确地址表。** 知识分布在多个组件与层中。

## 90 秒讲解视频

<video controls preload="metadata" poster="/img/AI/llm-learning/2026-10-03-FFN-SwiGLU与模型的知识存储/ffn-swiglu-poster.png" style="display:block;width:min(100%,960px);margin:24px auto;border-radius:14px;background:#0d1726;box-shadow:0 14px 36px rgba(20,40,65,.18)"><source src="/img/AI/llm-learning/2026-10-03-FFN-SwiGLU与模型的知识存储/ffn-swiglu-explainer.mp4" type="video/mp4">你的浏览器暂不支持 HTML5 视频。</video>

## 参考资料

- [Attention Is All You Need：Position-wise Feed-Forward Networks](https://arxiv.org/abs/1706.03762)
- [GLU Variants Improve Transformer：SwiGLU](https://arxiv.org/abs/2002.05202)
- [Transformer Feed-Forward Layers Are Key-Value Memories](https://aclanthology.org/2021.emnlp-main.446/)
- [Locating and Editing Factual Associations in GPT：ROME](https://arxiv.org/abs/2202.05262)

## 第十四课复习总图

<div style="width:min(1400px,calc(100vw - 48px));margin:28px 0 34px 50%;transform:translateX(-50%);">
  <a href="/img/AI/llm-learning/2026-10-03-FFN-SwiGLU与模型的知识存储/fourteenth-lesson-summary.svg" target="_blank" title="点击查看原始 SVG"><img src="/img/AI/llm-learning/2026-10-03-FFN-SwiGLU与模型的知识存储/fourteenth-lesson-summary.svg" alt="FFN、SwiGLU 与知识存储复习总图" style="display:block;width:100%;max-width:none;"></a>
  <p style="margin:8px 0 0;text-align:center;color:#78869a;font-size:13px;">从逐 Token 加工到门控与分布式知识，点击查看原始 SVG</p>
</div>

　　下一课看 MoE：为什么准备很多专家，却只让每个 Token 经过其中几个？

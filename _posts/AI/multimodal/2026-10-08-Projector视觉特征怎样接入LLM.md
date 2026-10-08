---
layout: post
title: Projector：视觉特征怎样接入 LLM？
subtitle: 多模态第五课，从维度映射到图文问答的输入接口
tags: [多模态, Projector, LLaVA, Transformer, PyTorch]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>

.code-fold{margin:20px 0;border:1px solid #dbe5ef;border-radius:10px;background:#f8fbff}.code-fold>summary{padding:12px 16px;color:#17345a;font-weight:600;cursor:pointer}.code-fold[open]>summary{border-bottom:1px solid #dbe5ef}.code-fold pre{margin:12px!important}

.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:100%;margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{padding:10px 16px;border-radius:22px;background:#17345a;color:white;cursor:pointer}.lesson-toc nav{width:280px;padding:14px;border:1px solid #dbe5ef;border-radius:14px;background:#fff;box-shadow:0 16px 42px #19365725}.lesson-toc nav a{display:block;padding:7px;color:#405874}.vit-lab{padding:20px;margin:24px 0;border:1px solid #dbe5ef;border-radius:16px;background:#f8fbff}.vit-lab button,.vit-lab select{padding:8px;margin:4px;border:1px solid #adc4da;border-radius:8px;background:white;color:#17345a}.vit-lab canvas{display:block;width:min(100%,320px);height:auto;margin:18px auto}.vit-lab output{display:block;line-height:1.8}.vit-lab .steps{padding:12px;background:#eaf3fb;border-radius:10px}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:48px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav aria-label="本文目录"><strong>多模态第五课</strong><a href="#why">为什么需要连接器</a><a href="#mapping">向量怎样映射</a><a href="#sequence">图文怎样排成序列</a><a href="#training">接口怎样学会工作</a><a href="#code">最小代码</a><a href="#mistakes">常见误解</a><a href="#review">小结与下一课</a><a href="#references">参考文献</a></nav></details>

　　前两课的 CLIP 和 SigLIP 让图片与文字可以比较，但“这张图与哪段描述更匹配”和“根据图片回答问题”是不同任务。要生成回答，还需要把视觉信息交给语言模型。

　　这一课先看最直接的路线：视觉编码器提供一组 Patch 特征，Projector 把它们转换到语言模型的输入宽度，再与文字向量一起送入 LLM。原始 LLaVA 使用线性连接，后来的 LLaVA-1.5 使用 MLP 连接，本课以这类拼接式接口为例。<sup id="cite-1" class="paper-cite"><a href="#ref-1">[1]</a></sup><sup id="cite-2" class="paper-cite"><a href="#ref-2">[2]</a></sup>

## 1、先理解两个模型的接口 {#why}

　　视觉编码器和 LLM 像两套分别训练出来的系统：前者输出视觉特征，后者接收语言隐藏宽度的向量。假设视觉特征每条有 4 个数，而语言模型每个输入位置需要 6 个数，先用这个小例子看清连接过程。

![四条视觉向量如何接入语言模型](/img/AI/multimodal-learning/2026-10-08-Projector视觉特征怎样接入LLM/projector-interface.svg)

　　图中四条视觉向量经过同一个映射，各自从 4 维变成 6 维，再与三条文字向量拼成七个输入位置。这里的条数和维度都是教学示意，真实模型需要读取具体配置。

> 简单 Projector 改的是每条向量的宽度，通常不改变视觉 Token 的数量；连接器是否压缩序列，要看具体设计。

## 2、每条视觉向量怎样转换？ {#mapping}

### 2.1 线性投影：共享一套映射

　　设视觉特征为 $H_v\in\mathbb R^{N\times d_v}$，$N$ 是视觉 Token 数，$d_v$ 是视觉宽度，语言模型宽度为 $d_l$，则：

$$
H_{image}=H_vW+b,\qquad W\in\mathbb R^{d_v\times d_l}
$$

　　输出是 $N\times d_l$，同一个 $W$ 和 $b$ 作用于每一行。四条 4 维向量因此变成四条 6 维向量，而不是把四条合并成一条。

　　虽然都叫投影，这里的 Projector 与 CLIP 的检索投影头不是同一个接口：CLIP 的最终全图向量用于图文比较，VLM 可以读取视觉骨干某层的 Patch 特征，再映射到 LLM 的宽度。

### 2.2 两层 MLP：加入非线性

$$
H_{image}=\operatorname{GELU}(H_vW_1+b_1)W_2+b_2
$$

　　$W_1$ 把视觉宽度映射到中间宽度，GELU 加入非线性，$W_2$ 再得到语言宽度。这个逐位置 MLP 仍不混合不同 Patch；Patch 的上下文关系来自视觉编码器，进入 LLM 后还会继续参与注意力计算。

　　更灵活的映射不代表一定更好，效果仍与输入特征、数据和训练方式有关。

## 3、图文怎样排成 LLM 的输入？ {#sequence}

### 3.1 文字查表，图片提供连续向量

　　文字先分词，再查语言模型的 Embedding 表；视觉特征则经过 Projector 直接成为连续向量。实际实现通常在提示中的图片占位符处插入视觉序列，不需要为每个 Patch 找到一个文字 Token ID。

　　例如提示是“请看图片：[图片]。这里有什么？”，可以概念性地表示为：

$$
X=[E_{prefix};H_{image};E_{suffix}]
$$

　　分号表示沿序列长度拼接，三段的最后一维都必须是 $d_l$。图片占位符只是输入组织的标记，不代表模型最终只接收一个视觉向量。

### 3.2 还要处理位置、掩码和上下文预算

　　完成拼接后，还需要正确的位置编号和 Attention Mask；典型的解码器模型在生成答案时，可以读取前面的视觉与文本位置，但这些规则不能靠拼接一个数组自动补齐。

　　普通逐位置 Projector 没有压缩 Token，因此图片占用的输入位置会进入 LLM 的上下文预算。提高分辨率、多图或视频可能显著增加序列长度，后续的查询式连接器或压缩策略会处理另一部分问题。

## 4、形状接上了，为什么仍然看不懂？ {#training}

　　把两条向量都改成六维，只说明尺寸匹配，没有告诉 LLM 怎样使用其中的视觉信息。随机初始化的 Projector 也能输出正确形状，但通常不能完成有效图文问答，需要训练数据把它调整成有用的接口。

### 4.1 用文字回答产生学习信号

　　给定图片 $I$、问题 $q$ 和正确回答 $a$，训练模型逐 Token 预测答案：

$$
L=-\sum_{t\in A}\log p(a_t\mid I,q,a_{<t})
$$

　　$A$ 表示参与监督的答案位置。常见做法是屏蔽图片位置和提示位置的目标标签，只监督回答；具体聊天格式与损失掩码应遵循模型训练约定。

　　梯度从答案预测经过 LLM 回到 Projector，哪些参数真正更新则取决于冻结策略。冻结 LLM 参数并不等于切断经过 LLM 的反向传播：若还要训练 Projector，就必须保留从损失到其输出的梯度路径。

### 4.2 先学习接口，再学习跟随视觉指令

　　经典 LLaVA 的训练先让连接器学习利用图像特征，再进行视觉指令微调；不同版本会选择不同冻结策略。把它理解为“先建立接口，再学习怎么回答问题”即可，具体阶段与可训练模块要查看对应模型。<sup id="cite-1b" class="paper-cite"><a href="#ref-1">[1]</a></sup>

## 5、最小代码：看清宽度和长度 {#code}

　　下面只演示 Projector 与图文拼接，使用随机特征，不包含真实视觉编码器、LLM 或训练。安装 PyTorch 后即可运行。

```python
import torch
from torch import nn

torch.manual_seed(0)
batch, patches, dv, dl = 2, 4, 4, 6
projector = nn.Sequential(
    nn.Linear(dv, dl), nn.GELU(), nn.Linear(dl, dl)
)
visual_features = torch.randn(batch, patches, dv)
text_embedding = nn.Embedding(20, dl)
prefix = text_embedding(torch.tensor([[1], [1]]))
suffix = text_embedding(torch.tensor([[2, 3], [2, 3]]))
image_embedding = projector(visual_features)
inputs = torch.cat([prefix, image_embedding, suffix], dim=1)
print(image_embedding.shape)  # torch.Size([2, 4, 6])
print(inputs.shape)           # torch.Size([2, 7, 6])
```

　　改变 `dl` 会改变每条向量的宽度，改变 `patches` 会改变视觉序列长度；可以分别修改它们，检查这两个概念没有混在一起。真实系统还要提供正确的图像预处理、特征层、占位符替换、掩码和设备精度设置。

## 6、容易混淆的四件事 {#mistakes}

| 误解 | 怎样理解 |
|---|---|
| Projector 把图片翻译成文字 | 它输出连续向量，语言模型随后生成文字 |
| 宽度相同就不需要学习 | 还需要通过训练建立有用的表示接口 |
| 投影一定减少视觉 Token | 逐位置 Linear / MLP 通常保留 Token 数 |
| 冻结 LLM 就可以全程关闭梯度 | 训练上游 Projector 时仍需要穿过 LLM 的梯度 |

　　回到游戏截图，Projector 能转换表示，却不能恢复预处理已经丢掉的小目标，也不能凭空提供视频时间关系。选择连接器前，先确认任务需要什么视觉证据，以及编码器实际保留了什么。

## 7、记住两条线 {#review}

　　前向路线是“图片 → 视觉特征 → Projector → 与文字拼接 → LLM → 回答”，学习路线则从答案损失向后传递，让可训练参数逐渐适应图文任务。

　　试着回答：四条 4 维向量投影到 6 维，为什么还是四条？为什么图片不用查文字词表？冻结 LLM 时，为什么不能随意用 `no_grad()` 包住它的前向计算？

　　下一课学习 Q-Former：如果视觉 Token 太多，怎样用少量可学习查询从视觉特征中读取信息？

## 8、参考文献（References） {#references}

<ol class="paper-refs">
<li id="ref-1">Liu, H., Li, C., Wu, Q., and Lee, Y. J. “<a href="https://arxiv.org/abs/2304.08485" target="_blank" rel="noopener">Visual Instruction Tuning</a>.” <em>NeurIPS</em>, 2023. arXiv:2304.08485.<a class="ref-back" href="#cite-1">↩</a></li>
<li id="ref-2">Liu, H., Li, C., Li, Y., and Lee, Y. J. “<a href="https://arxiv.org/abs/2310.03744" target="_blank" rel="noopener">Improved Baselines with Visual Instruction Tuning</a>.” <em>CVPR</em>, 2024. arXiv:2310.03744.<a class="ref-back" href="#cite-2">↩</a></li>
</ol>

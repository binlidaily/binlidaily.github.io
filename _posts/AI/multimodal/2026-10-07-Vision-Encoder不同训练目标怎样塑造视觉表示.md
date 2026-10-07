---
layout: post
title: Vision Encoder：不同训练目标怎样塑造视觉表示？
subtitle: 多模态第二课，同样的图片，为什么会学出不同的特征
tags: [多模态, Vision Encoder, ViT, CLIP, DINOv2]
author: 思成言
comments: true
published: true
bigimg: /img/default_wallpaper.jpeg
---

<style>

.code-fold{margin:20px 0;border:1px solid #dbe5ef;border-radius:10px;background:#f8fbff}.code-fold>summary{padding:12px 16px;color:#17345a;font-weight:600;cursor:pointer}.code-fold[open]>summary{border-bottom:1px solid #dbe5ef}.code-fold pre{margin:12px!important}

.blog-post pre code{font-size:1.05rem!important;line-height:1.75!important}.blog-post table{display:table;width:100%;margin:24px auto}.blog-post h2{scroll-margin-top:88px}.lesson-toc{position:fixed;top:118px;right:22px;z-index:30}.lesson-toc>summary{padding:10px 16px;border-radius:22px;background:#17345a;color:white;cursor:pointer}.lesson-toc nav{width:280px;padding:14px;border:1px solid #dbe5ef;border-radius:14px;background:#fff;box-shadow:0 16px 42px #19365725}.lesson-toc nav a{display:block;padding:7px;color:#405874}.vit-lab{padding:20px;margin:24px 0;border:1px solid #dbe5ef;border-radius:16px;background:#f8fbff}.vit-lab button,.vit-lab select{padding:8px;margin:4px;border:1px solid #adc4da;border-radius:8px;background:white;color:#17345a}.vit-lab canvas{display:block;width:min(100%,320px);height:auto;margin:18px auto}.vit-lab output{display:block;line-height:1.8}.vit-lab .steps{padding:12px;background:#eaf3fb;border-radius:10px}@media(max-width:900px){.lesson-toc{top:auto;right:12px;bottom:16px}.lesson-toc nav{position:absolute;right:0;bottom:48px;max-height:65vh;overflow:auto}}
</style>
<details class="lesson-toc" markdown="0"><summary>目录</summary><nav aria-label="本文目录"><strong>多模态第二课</strong><a href="#encoder">视觉编码器是什么</a><a href="#objectives">三种训练目标</a><a href="#outputs">取哪一种特征</a><a href="#practice">动手比较特征</a><a href="#vlm">怎样连接语言模型</a><a href="#review">小结与下一课</a><a href="#references">参考文献</a></nav></details>

　　上一课把图片切成 Patch，再送进 ViT，得到了每个位置的向量。这一课继续问：同样使用 ViT，为什么有的模型擅长分类，有的能用文字找图片，有的能提供有用的局部视觉特征？

　　想象三位学生看同一张猫的照片：第一位要回答“是什么动物”，第二位要找到与它对应的描述，第三位要把不同裁剪里的视觉内容联系起来。看到的图片相同，要完成的任务却不同，学习时关注的信息也会不同。

> ViT 是处理图片的结构，训练目标决定参数怎样被调整；实际表示还受数据、规模和训练细节影响。

## 1、视觉编码器到底输出什么？ {#encoder}

　　Vision Encoder 可以理解为把图片转换成视觉特征的模块。以 ViT 为例，它通常包含 Patch Embedding、位置机制和多个 Transformer Block；分类头、图文投影头则承担后续任务，读取特征时要区分骨干输出和任务头输出。

### 1.1 全图向量与 Patch 向量

　　假设有 196 个 Patch，隐藏宽度为 768，视觉编码器可以提供一组 `[196,768]` 的 Patch 特征，也可以通过 CLS 或池化得到一条 `[768]` 的全图特征。前者保留与网格位置对应的表示，后者适合描述整张图片；每个 Patch 经过 Attention 后已经包含上下文，不再只表示原来那一小块像素。

| 表示 | 像什么 | 可以怎样使用 |
|---|---|---|
| 全图特征 | 一张图片的摘要 | 图片检索、分类 |
| Patch 特征 | 带位置的局部笔记 | 密集预测、给 VLM 提供细节 |
| 类别 logits | 对预设类别的分数 | 判断属于哪个类别 |

　　类别分数和视觉特征是不同的东西：一个 1,000 类分类头输出的 1,000 个数，并不是 1,000 个视觉 Token。

## 2、同样的骨干，三种不同的学习任务 {#objectives}

　　先看下面的任务图。三条路线都从图片提取特征，区别在于“拿什么作为训练信号”；图中箭头表示前向流程，损失产生的梯度会反过来调整模型参数。

![三种视觉表示学习任务](/img/AI/multimodal-learning/2026-10-07-Vision-Encoder不同训练目标怎样塑造视觉表示/learning-objectives.svg)

### 2.1 分类训练：让正确类别的分数更高

　　给模型一张猫的照片和“猫”这个标签，编码器提取特征，分类头输出各类别的分数，再用交叉熵惩罚错误预测：

$$
p=\operatorname{softmax}(Wh+b),\qquad L_{cls}=-\log p_y
$$

　　$h$ 是全图特征，$y$ 是正确类别。模型需要学到区分这些类别的信息，但任务未必要求它保留所有局部细节，也没有要求特征与自然语言向量对齐。

　　这不表示分类特征只能用于分类，它们也能迁移到其他任务，只是迁移效果需要验证。

### 2.2 CLIP：让匹配的图片和描述更接近

　　CLIP 分别编码图片与文本，将它们投影到共同空间，通过配对关系训练。它可以使用 ViT 视觉骨干，也可以使用 ResNet，因而“CLIP”更主要指向图文学习方法，而不是某一种视觉结构。<sup id="cite-1" class="paper-cite"><a href="#ref-1">[1]</a></sup>

　　假设一批中第 $i$ 张图对应第 $i$ 段描述，归一化后的图像向量是 $v_i$，文本向量是 $t_j$：

$$
s_{ij}=\frac{v_i^Tt_j}{\tau},\qquad
L_{i\to t}=-\frac1B\sum_i\log\frac{\exp(s_{ii})}{\sum_j\exp(s_{ij})}
$$

　　$B$ 是批大小，$\tau$ 是温度。先不用记公式，只看一行：正确描述在分子，所有候选描述在分母，训练让图片更倾向于选中与它配对的描述；CLIP 还做反方向的文本找图，通常将两个方向的损失取平均。

　　“更接近”发生在投影和归一化后的共同空间，不能拿任意一层的视觉特征直接与文本向量做比较。对比学习的细节放到第三课展开。

### 2.3 DINO：从同一图片的不同视图学习

　　没有人工类别标签和文本描述，还能训练吗？DINO 从一张图生成不同裁剪与增强，让学生网络预测教师网络给出的分布，教师参数通过学生参数的滑动平均更新，而不是直接接受梯度。<sup id="cite-2" class="paper-cite"><a href="#ref-2">[2]</a></sup>

$$
L_{DINO}=-\sum_k p_{teacher,k}\log p_{student,k},\qquad
\theta_{teacher}\leftarrow m\theta_{teacher}+(1-m)\theta_{student}
$$

　　这里 $k$ 是训练投影头的输出维度，不是人工标注的动物类别；$m$ 控制教师更新速度。上式只展示一个视图配对，实际训练使用多个视图，并通过停止教师梯度、中心化与温度等设计避免输出坍塌成同一种答案。

　　DINOv2 沿着自监督路线进一步结合全图与 Patch 层面的目标，并扩大数据和模型规模，获得可迁移的视觉表示。它不是给原版 DINO 简单换一个更大的 ViT。<sup id="cite-3" class="paper-cite"><a href="#ref-3">[3]</a></sup>

　　可以把这种学习理解为“用不同视角建立视觉联系”，但不能把所有增强都当成无害操作：如果某个任务依赖颜色或极小目标，过强增强可能丢掉任务所需的信息。

### 2.4 SigLIP 放在哪里理解？

　　SigLIP 也使用图文配对信号，但原始 SigLIP 用成对的 sigmoid 损失判断图文是否匹配，不像 CLIP 那样对整批候选做 softmax 归一化。先把它放在图文对齐路线中，具体损失留到后续课程。<sup id="cite-4" class="paper-cite"><a href="#ref-4">[4]</a></sup>

| 学习路线 | 训练信号 | 学习时要完成的任务 |
|---|---|---|
| 分类 | 图片与类别标签 | 把正确类别选出来 |
| CLIP / SigLIP | 图片与文本配对 | 区分匹配与不匹配的图文 |
| DINO / DINOv2 | 图片视图与教师目标 | 从视觉数据学习可迁移表示 |

## 3、提取特征时，先问“取的是哪里”？ {#outputs}

　　模型名并不足以说明特征怎么用，还要确认输入预处理、输出层、是否经过任务投影，以及拿到的是全图向量还是 Patch 序列。

　　例如，CLIP 做图文检索时使用投影到共同空间的全图向量，而 VLM 可能选取视觉编码器某层的 Patch 特征；DINO 的训练投影头负责构造学习目标，下游任务通常读取骨干特征。输出长度相同，也不代表两种模型学到了相同语义。

| 你想做的事 | 先检查什么 |
|---|---|
| 用一句话找图片 | 图像与文本是否来自同一对齐模型、是否正确归一化 |
| 比较图片整体相似性 | 全图特征与当前数据是否合适 |
| 保留小目标和局部细节 | 预处理是否丢细节、Patch 特征来自哪一层 |
| 给 LLM 输入图片 | 连接器期待哪种特征、多少维、怎样排列 |

## 4、动手看一组特征，而不是只看模型名字 {#practice}

　　可以先冻结一个预训练编码器，选几张大小和内容不同的图片，检查特征形状，再比较余弦相似度。下面的 PyTorch 小例子使用手工向量演示计算，不是任何真实模型的测量结果。

```python
import torch
import torch.nn.functional as F

# 三条示意全图特征，每一行对应一张图片
features = torch.tensor([
    [1.0, 0.8, 0.0],  # 图片 A
    [0.9, 0.7, 0.1],  # 图片 B
    [0.0, 0.1, 1.0],  # 图片 C
])
unit = F.normalize(features, dim=-1)
similarity = unit @ unit.T
print(similarity.round(decimals=2))
# tensor([[1.00, 0.99, 0.06],
#         [0.99, 1.00, 0.15],
#         [0.06, 0.15, 1.00]])
```

　　归一化后，每条向量长度为 1，点积就是余弦相似度；A 与 B 更接近，只说明这组表示把它们放得更近，不等于它们在所有任务中都相似。

　　换成真实编码器后，可以做三个观察：同一图片与轻微裁剪是否仍接近，背景相同但主体不同的图片会不会混淆，小目标被缩小后是否改变检索结果。比较模型时应遵循各自预处理约定，并固定样本与评价任务，不能仅凭两张热图下结论。

　　如果想画 Patch 特征图，可以选一个 Patch，与其他 Patch 逐一计算余弦相似度，再按网格位置还原成热图。这叫特征相似度图，与 Attention 权重图不同，两者都不能直接当成因果解释。

## 5、为什么分类编码器不能直接让 LLM 看懂图片？ {#vlm}

　　分类编码器当然可以接到 LLM 上，但还需要接口与训练。视觉特征的宽度可能与语言隐藏宽度不同，即使宽度恰好相同，两个模型也没有自动约定每个方向的含义。

　　连接器先完成维度映射或序列压缩，再通过图文数据学习怎样让视觉信息被语言模型利用；使用 CLIP 预训练的视觉编码器可以提供已有的图文学习基础，却不等于已经具备对话能力。

　　回到游戏截图，模型可能认出“角色”，却未必保留准星附近的微小变化。挑选编码器时应先确定任务需要整体语义还是局部细节，再检查缩放、裁剪、特征层与实际评估结果。

## 6、记住三件事 {#review}

1. **结构与目标分开看**：ViT 说明怎样计算，分类、图文对齐与自监督说明怎样学习。
2. **特征与预测分开看**：全图向量、Patch 向量和类别 logits 承担不同作用。
3. **表示好不好取决于任务**：换数据、预处理或输出层，效果也会变化。

　　试着回答两个问题：一个分类准确率更高的模型，为什么不一定更适合文字找图？同样是 `[196,768]` 的 Patch 特征，为什么不能直接互换连接器？

　　下一课深入 CLIP：图像和文字怎样进入共同空间，配对关系怎样变成训练损失？

## 7、参考文献（References） {#references}

<ol class="paper-refs">
<li id="ref-1">Radford, A., Kim, J. W., Hallacy, C., et al. “<a href="https://arxiv.org/abs/2103.00020" target="_blank" rel="noopener">Learning Transferable Visual Models From Natural Language Supervision</a>.” <em>ICML</em>, 2021. arXiv:2103.00020.<a class="ref-back" href="#cite-1">↩</a></li>
<li id="ref-2">Caron, M., Touvron, H., Misra, I., et al. “<a href="https://arxiv.org/abs/2104.14294" target="_blank" rel="noopener">Emerging Properties in Self-Supervised Vision Transformers</a>.” <em>ICCV</em>, 2021. arXiv:2104.14294.<a class="ref-back" href="#cite-2">↩</a></li>
<li id="ref-3">Oquab, M., Darcet, T., Moutakanni, T., et al. “<a href="https://arxiv.org/abs/2304.07193" target="_blank" rel="noopener">DINOv2: Learning Robust Visual Features without Supervision</a>.” arXiv preprint arXiv:2304.07193, 2023.<a class="ref-back" href="#cite-3">↩</a></li>
<li id="ref-4">Zhai, X., Mustafa, B., Kolesnikov, A., and Beyer, L. “<a href="https://arxiv.org/abs/2303.15343" target="_blank" rel="noopener">Sigmoid Loss for Language Image Pre-Training</a>.” <em>ICCV</em>, 2023. arXiv:2303.15343.<a class="ref-back" href="#cite-4">↩</a></li>
</ol>

---
layout: post
title: Activation Functions
subtitle: 激活函数
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../../binlidaily.github.io
---

　　激活函数（Activation Function）在神经网络和深度学习中起着很重要的作用，主要引入一些非线性的成分，使得模型的学习能力更强。

## Sigmoid
　　Sigmoid 是一个 $S$ 型的激活函数，缺点是可能会导致不饱和。

<p align="center">
<img src="/img/media/15560939318918.jpg" width="520">
</p>
<p style="margin-top:-2.5%" align="center">
<em style="color:#808080;font-style:normal;font-size:80%;">Sigmoid 函数和求导结果</em>
</p>



<div><div style="padding: 10px 0; margin: 20px auto; width: 90%; text-align: center;">
<div>感谢打赏，您的支持将鼓励我继续创作！</div>
<button id="rewardButton" disable="enable" onclick="var qr = document.getElementById('QR'); if (qr.style.display === 'none') {qr.style.display='block';} else {qr.style.display='none'}">
  <span>赏</span>
</button>
<div id="QR" style="display: none;">
<div id="wechat" style="display: inline-block">
  <a href="/img/media/wechat_pay.jpg" class="fancybox" rel="group"><img id="wechat_qr" src="/img/media/wechat_pay.jpg" alt=""></a>
  <p>微信打赏</p>
</div>
<div id="alipay" style="display: inline-block">
  <a href="/img/media/ali_pay.jpg" class="fancybox" rel="group"><img id="alipay_qr" src="/img/media/ali_pay.jpg" alt="狗皮膏药 Alipay"></a>
  <p>支付宝打赏</p>
</div></div></div>
</div>

## References
1. [神经网络激活函数汇总（Sigmoid、tanh、ReLU、LeakyReLU、pReLU、ELU、maxout）](https://blog.csdn.net/edogawachia/article/details/80043673)
2. [深度学习系列（8）：激活函数](https://plushunter.github.io/2017/05/12/深度学习系列（8）：激活函数/)
---
layout: post
title: Differentiation
subtitle: 导数
author: Bin Li
tags: [Mathematics]
image: 
comments: true
published: true
---

## 对数求导

$$
{\displaystyle {\begin{aligned}{\frac {{\mbox{d}}\ln x}{{\mbox{d}}x}}&=\lim _{h\to 0}{\frac {\ln(x+h)-\ln x}{h}}\\&=\lim _{h\to 0}({\frac {1}{h}}\ln({\frac {x+h}{x}}))\\&=\lim _{h\to 0}({\frac {x}{xh}}\ln(1+{\frac {h}{x}}))\\&={\frac {1}{x}}\ln(\lim _{h\to 0}(1+{\frac {h}{x}})^{\frac {x}{h}})\\&={\frac {1}{x}}\ln e\\&={\frac {1}{x}}\end{aligned}}}
$$

$$
{\frac  {{\mbox{d}}\log _{\alpha }|x|}{{\mbox{d}}x}}={1 \over \ln \alpha }{\frac  {{\mbox{d}}\ln |x|}{{\mbox{d}}x}}={1 \over x\ln \alpha }
$$

## References
1. [Differentiation rules](https://en.wikipedia.org/wiki/Differentiation_rules)
---
layout: post
title: "Latex 使用记录"
author: "Bin Li"
tags: [Tools]
comments: true
style: |
  .container {
        max-width: 44rem;
    } 
---

本文记录一下在使用 latex 的问题和解决方法。

## Math
### Greek letters

| Greek | English | Greek | English |
| :---: | :---: | :---: | :---: |
| $\alpha~A$ | \alpha A | $\nu~ N$ | \nu N |
| $\beta~B$ | \beta B | $\xi~\Xi$ | \xi \Xi |
| $\gamma ~ \Gamma$ | \gamma \Gamma | $o~ O$ | o O |
| $\delta ~ \Delta$ | \delta \Delta | $\pi ~ \Pi$ | \pi \Pi |
| $\epsilon ~ \varepsilon ~ E$ | \epsilon \varepsilon E | $\rho ~ \varrho ~ P$ | \rho\varrho P |
| $\zeta ~ Z$ | \zeta Z | $\sigma ~ \Sigma$ | \sigma \Sigma |
| $\eta ~ H$ | \eta H | $\tau ~ T$ | \tau T |
| $\theta ~ \vartheta ~ \Theta$ | \theta \vartheta \Theta | $\upsilon ~ \Upsilon$ | \upsilon \Upsilon |
| $\iota ~ I$ | \iota I | $\phi ~ \varphi ~ \Phi$ | \phi \varphi \Phi |
| $\kappa ~ K$ | \kappa K | $\chi ~ X$ | \chi X |
| $\lambda ~ \Lambda$ | \lambda \Lambda | $\psi ~ \Psi$ | \psi \Psi |
| $\mu ~ M$ | \mu M | $\omega ~ \Omega$ | \omega \Omega |

### Arrows

| Greek | English | Greek | English |
| :---: | :---: | :---: | :---: |
|$\leftarrow$ | \leftarrow | $\Leftarrow$ | \Leftarrow|
|$\rightarrow$ | \rightarrow | $\Rightarrow$ | \Rightarrow|
|$\leftrightarrow$ | \leftrightarrow | $\rightleftharpoons$ | \rightleftharpoons|
|$\uparrow$ | \uparrow | $\downarrow$ | \downarrow|
|$\Uparrow$ | \Uparrow | $\Downarrow$ | \Downarrow|
|$\Leftrightarrow$ | \Leftrightarrow | $\Updownarrow$ | \Updownarrow|
|$\mapsto$ | \mapsto | $\longmapsto$ | \longmapsto|
|$\nearrow$ | \nearrow | $\searrow$ | \searrow|
|$\swarrow$ | \swarrow | $\nwarrow$ | \nwarrow|
|$\leftharpoonup$  | \leftharpoonup | $\rightharpoonup$ | \rightharpoonup|
|$\leftharpoondown$  | \leftharpoondown | $\rightharpoondown$ | \rightharpoondown|

### Miscellaneous symbols

| Greek | English | Greek | English |
| :---: | :---: | :---: | :---: |
|$\infty$ | \infty | $\forall$ | \forall|
|$\Re$ | \Re | $\Im$ | \Im|
|$\nabla$ | \nabla | $\exists$ | \exists|
|$\partial$ | \partial | $\nexists$ | \nexists|
|$\emptyset$ | \emptyset | $\varnothing$ | \varnothing|
|$\wp$ | \wp | $\complement$ | \complement|
|$\neg$ | \neg | $\cdots$ | \cdots|
|$\square$  | \square | $\surd$  | \surd|
|$\blacksquare$ | \blacksquare | $\triangle$ | \triangle|

### Binary Operation/Relation Symbols

| Greek | English | Greek | English |
| :---: | :---: | :---: | :---: |
|$\times$ | \times | $\otimes$ | \otimes|
|$\div$ | \div | $\cap$ | \cap|
|$\cup$ | \cup | $\neq$ | \neq|
|$\leq$ | \leq | $\geq$ | \geq|
|$\in$ | \in | $\perp$ | \perp|
|$\notin$ | \notin | $\subset$ | \subset|
|$\simeq$ | \simeq | $\approx$ | \approx|
|$\wedge$ | \wedge | $\vee$ | \vee|
|$\oplus$ | \oplus | $\otimes$ | \otimes|
|$\Box$ | \Box | $\boxtimes$ | \boxtimes|
|$\equiv$ | \equiv | $\cong$ | \cong|

### 公式编辑常用
反斜杠 (\\): `$\backslash$`

花体 ($\cal{T}$): `\cal{T}`

有关在字母上加上各种特殊符号念法：
* 英文字母上方有個 `^`（尖尖的符号、尖帽号）：念 hat（也有查到可以念 roof）
* 英文字母上方有個 `-`（短横号）：念 bar 
* 英文字母上方有個 `.`（一個點）：念 dot 
* 英文字母上方有個 `~`（波浪號）：念 tilde （/'tɪldə/） 
* 英文字母上方有個 `→`（箭頭）：念 arrow 
* 英文字母右上方有個 `'` (-撇）：念 prime 
* 英文字母右上方有個 `*`（星星號）：念 star
#### 公式对齐

```latex
\begin{align}
a &= b + c \tag{3}\\
  &= d + e + f\tag{4}
\end{align}
```

$$
\begin{align}
a &= b + c \tag{3}\\
  &= d + e + f\tag{4}
\end{align}
$$

这有一个不好的是，默认是有标签的。

#### 等式上加文字
$$
A \stackrel{\text{(1)(2)}}{=} B
$$

## Presentation
### 一页ppt不会自动居中对齐
```
\begin{frame}[t]
...
\end{frame}
```

## References
[Cmd Markdown 公式指导手册](https://www.zybuluo.com/codeep/note/163962)


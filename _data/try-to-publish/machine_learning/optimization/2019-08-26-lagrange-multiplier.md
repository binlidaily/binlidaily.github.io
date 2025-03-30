---
layout: post
title: Lagrange Multiplier
subtitle: 拉格朗日乘子法
author: Bin Li
tags: [Mathematics, Convex Optimization]
image: 
comments: true
published: true
---

什么时候能取到等号？
* Constraint Qualification

$$
d^{*}=\max _{\alpha, \beta : \alpha_{i} \geq 0} \min _{w} \mathcal{L}(w, \alpha, \beta) \leq \min _{w} \max _{\alpha, \beta : \alpha_{i} \geq 0} \mathcal{L}(w, \alpha, \beta)=p^{*}
$$

　　矮子里面选高个儿一般不如高个儿里面选矮子的身高高。

![-w1418](/img/media/15662111203965.jpg)

![-w1424](/img/media/15662112439409.jpg)




![-w1162](/img/media/15679138456901.jpg)


One-Versus-All
One-Versus-One
![-w1188](/img/media/15679149993467.jpg)

![-w1089](/img/media/15679156804350.jpg)




## References
1. [深入理解拉格朗日乘子法（Lagrange Multiplier) 和KKT条件](https://www.cnblogs.com/mo-wang/p/4775548.html)
2. [cs229-notes3.pdf](/assets/cs229-notes3.pdf)
3. [Weak-Duality.pdf](/assets/Weak-Duality.pdf)
4. [10幅图帮助理解拉格朗日乘数法的原理](https://zhuanlan.zhihu.com/p/99945521)
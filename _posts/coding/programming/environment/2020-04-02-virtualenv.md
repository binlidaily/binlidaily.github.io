---
layout: post
title: virtualenv
subtitle: 
author: Bin Li
tags: [Programming]
image: 
comments: true
published: true
---

## Programming Error Collections
　　在 Mac 上用 virtualenv 时引入Matplotlib会出现以下问题：

```
RuntimeError: Python is not installed as a framework. The Mac OS X backend will not be able to function correctly if Python is not installed as a framework. See the Python documentation for more information on installing Python as a framework on Mac OS X. Please either reinstall Python as a framework, or try one of the other backends. If you are Working with Matplotlib in a virtual enviroment see 'Working with Matplotlib in Virtual environments' in the Matplotlib FAQ
```

　　在引入matplotlib时加入以下指令可以解决：

```
import matplotlib  
matplotlib.use('TkAgg')   
import matplotlib.pyplot as plt  
```

　　编写好网络代码后准备运行，报如下错误：

```
Dimensions must be equal, but are 3 and 224 for 'conv1_1/Conv2D' (op: 'Conv2D') with input shapes: [?,224,224,3], [3,224,224,64].
```

　　从 Stack Overflow上查到一个说法是：

```
shape of input = [batch, in_height, in_width, in_channels]
shape of filter = [filter_height, filter_width, in_channels, out_channels]
```

　　对应的改一下位置果然就好了。

## References
---
layout: post
title: "Jekyll 搭建博客遇到的问题"
author: "Bin Li"
tags: "Tools"
comments: true
style: |
  .container {
        max-width: 44rem;
    } 
---
## jekyll-paginate 依赖问题

当在根目录下运行 `jekyll s` 时会报如下依赖错误的话：

```shell
Dependency Error: Yikes! It looks like you don't have jekyll-paginate or one of its dependencies installed.
```

直接把 `gem` 那个设置去掉就行。

<!--more-->

## 公式显示问题

在页面上显示数学公式，这里要在` head.html` 中加入如下代码：

```html
<!--MathJax的配置脚本，用于临时简单的配置 -->
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    extensions: ["tex2jax.js"],
    <!--输入Latex公式，以HTML和CSS的形式显示输出 -->
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
      <!--$表示行内元素，$$表示块状元素 -->
      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
      displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
      processEscapes: true
    },
    "HTML-CSS": { availableFonts: ["TeX"] }
  });
</script>
<!--加载MathJax的最新文件， async表示异步加载进来 -->
<script type="text/javascript" async src="https://cdn.mathjax.org/mathjax/latest/MathJax.js">
</script>
```

测试公式：内联公式 --> $x^2=y$

换行居中公式：

$$x^2+y^2=1$$

公式中如果有竖线的话可以用 `$\vert$`

## 图片显示问题

将所有的 `post` 图片放到根目录下新建的 `media` 文件夹中，然后在引入图片的时候要用`![](\media\name_of_pic.jpg)` 这样来引入，不能有名字，要有 `\media` 开头。


## Jekyll Themes
[Simple Texture](http://jekyllthemes.org/themes/simple-texture/)

[Lanyon Plus](https://github.com/dyndna/lanyon-plus.git)



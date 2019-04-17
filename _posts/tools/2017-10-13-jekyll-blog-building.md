---
layout: post
title: "Jekyll 搭建博客遇到的问题"
author: "Bin Li"
tags: [Tools]
comments: true
---

本文记录在用 Jekyll 搭建博客时遇到的一些问题。

### TOC 操作
github 上有对应的[操作](https://github.com/toshimaru/jekyll-toc)。

### jekyll-paginate 依赖问题

当在根目录下运行 `jekyll s` 时会报如下依赖错误的话：

```shell
Dependency Error: Yikes! It looks like you don't have jekyll-paginate or one of its dependencies installed.
```

直接把 `gem` 那个设置去掉就行。

<!--more-->

### 公式显示问题

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

### 图片显示问题

将所有的 `post` 图片放到根目录下新建的 `media` 文件夹中，然后在引入图片的时候要用`![](\media\name_of_pic.jpg)` 这样来引入，不能有名字，要有 `\media` 开头。

如果想要图片对齐，以及对图片大小做操作可以用如下的方式：

```javascript
<p align="center">
  <img width="" height="" src="/images/media/15068489255584.jpg">
</p>
```

### sass
`@include`
`@mixin`
`@content`
`@media`

### 如何在 Github Pages 中加入 category 和 tags 功能
在阅读了这篇[博客](https://codinfox.github.io/dev/2015/03/06/use-tags-and-categories-in-your-jekyll-based-github-pages/)后简单试了下。

### 折叠一部分内容
<details><summary>Show Code here</summary>
 <p>

```python
print("hello world!")
```
 </p>
</details>

<details><summary markdown="span"><code>init(title:level:style:close:)</code></summary>

```swift
public init(title: String, level: MarkdownHeaderLevel = .h1, style: MarkdownHeaderStyle = .atx,
                close: Bool = false)
```
</details>

### 两个花括号连在一起时报错
```
The page build failed for the `master` branch with the following error:

The variable `{ {|D^v|}` on line 79
```
`{ {`中间加一个空格即可。

### 修改博文宽度
beautiful-jekyll 主题 中可以在 bootstrap.min.css 文件中修改 col-lg-9 宽度，改 col-lg-offset-1 即左侧空白距离，关联是在 layout 中的 post 配置。


## Jekyll Themes
1. [Simple Texture](http://jekyllthemes.org/themes/simple-texture/)
2. [Lanyon Plus](https://github.com/dyndna/lanyon-plus.git)
3. [cayman](https://pages-themes.github.io/cayman/)
4. [minima](https://jekyll.github.io/minima/)
5. [julia](http://themes.jekyllrc.org/julia/)
6. [Adding a Google Custom Search Engine to your beautiful-jekyll site](http://jasdumas.com/2016-05-07-adding-gcse-to-beautiful-jekyll/)


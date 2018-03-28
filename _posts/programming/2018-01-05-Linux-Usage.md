---
layout: post
title: "Linux 使用记录"
author: "Bin Li"
tags: "Linux Programming"
comments: true
style: |
  .container {
        max-width: 44rem;
    } 
published: true
---

本文记录平时常用的 Linux 相关的命令记录。

## 找到对应路径下所有包含关键词的命令

```shell
find /dir/to/root/ -name "keywor*"
```

## 更改一个文件夹下所有文件的后缀
替换对应的 oldextension 和 newextension 即可。

```shell
find -L . -type f -name "*.oldextension" -print0 | while IFS= read -r -d '' FNAME; do
    mv -- "$FNAME" "${FNAME%.oldextension}.newextension"
done
```

## 显示特定目录下的文件夹大小

```shell
du -sh /dir/to/root/*
```

一般进到要查的目录下：
```shell
cd /dir/to/root
du -sh */
```

## 解压文件
### .gz 后缀
```
gunzip file.gz
```

如果解压之后需要保留原压缩包，可用：

```
gunzip -k file.gz
```

### .bz2 后缀
```
bzip2 -d file.bz2
```

如果解压之后需要保留原压缩包，可用：

```
bzip2 -dk file.bz2
```

## 参数
### Verbose Mode
A verbose mode is an option available in many computer operating systems, including Microsoft Windows, macOS and Linux that provides additional details as to what the computer is doing and what drivers and software it is loading during startup.

verbose 模式就是能够输出比较详细的运行信息。


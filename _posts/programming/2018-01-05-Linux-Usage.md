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




---
layout: post
title: "Jupyter 使用记录"
author: "Bin Li"
tags: "Python Programming"
comments: true
style: |
  .container {
        max-width: 44rem;
    } 
published: true
---

使用 TensorFlow 的时候总是登陆服务器不是很方便，现在大多数开始 Jupyter，每次重新搭都忘，还是记录下来的好。

## Install
`sudo pip install jupyter`

**Start**

`jupyter notebook`

**Remote access jupyter**

首先在服务器端开启 jupyter，设定端口 8889
`jupyter notebook --port 8889`

然后在本地使用这样的命令：
`ssh -N -f -L localhost:8888:localhost:8889 server_username@server_ip`

然后本地用 `localhost:8888` 访问即可。


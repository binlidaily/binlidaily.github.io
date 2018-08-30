---
layout: post
title: "Jupyter 使用记录"
author: "Bin Li"
tags: [Python, Programming]
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

### Start

`jupyter notebook`

### Remote access jupyter

首先在服务器端开启 jupyter，设定端口 8889
`jupyter notebook --port 8889`

然后在本地使用这样的命令：
`ssh -N -f -L localhost:8888:localhost:8889 server_username@server_ip`

然后本地用 `localhost:8888` 访问即可。

## Mac 端报错
之前还总是报`ssl`的错误，于是一阵乱装之后卸掉了pip，然后一直装不上了，用了下面的方法解决：

```
curl -O https://bootstrap.pypa.io/get-pip.py
sudo python get-pip.py
```

当装 jupyter 报错：`Could not install packages due to an EnvironmentError: [Errno 1] Operation not permitted: '/System/Library/Frameworks/Python.framework/Versions/2.7/share'`时，用下面的解决办法就搞定了：

```
brew install python2
sudo pip install --user <package name>
```

用python就下载python3。

接着又报`six`的错误：`ImportError: No module named six`，于是下载安装：
```
sudo -H pip install --ignore-installed six
```

然后又报错：`ImportError: No module named dateutil.tz`，接着装：
```
sudo pip install python-dateutil --upgrade

sudo pip install pytz --upgrade
```


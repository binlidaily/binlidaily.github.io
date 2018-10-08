---
layout: post
title: 编程环境搭建综合
subtitle:
author: Bin Li
tags: [Programming]
image: 
comments: true
published: false
---

## Conda
```
# if command not found: conda
export PATH=~/anaconda2/bin:$PATH

# create
conda create -n env_name python=3 ipython numpy

# add package
conda install --name env_name scipy

# activate
source ~/anaconda3/bin/activate test_env
source activate test_env
conda activate test_env

# deactivate
source deactivate test_env

# clone
conda create -n test_env_2 -clone test_env

# check list of envs
conda info --envs

# remove
conda env remove -n test_env_2
```

## tmux
```
tmux new -s session_name
tmux ls
tmux a -t session_name
tmux kill-session -t myname
```

## Jupyter
```
sudo pip install jupyter
```

### Start
```
jupyter notebook
```
### Remote access jupyter

首先在服务器端开启 jupyter，设定端口`8889`
```
jupyter notebook --port 8889
```

然后在本地使用这样的命令：
```
ssh -N -f -L localhost:8888:localhost:8889 server_username@server_ip
```

然后本地用 `localhost:8888` 访问即可，对应的 token 可以参看 Server 端启动 jupyter 时的链接后面部分。


## Linux
让命令行翻墙，可以直接从 Shadowsocks 软件那里复制具体的命令：
```shell
export http_proxy=http://127.0.0.1:1087;export https_proxy=http://127.0.0.1:1087;
```
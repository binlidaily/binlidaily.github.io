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

## New Ubuntu Server
## Conda Packages
> ipython numpy scipy pandas jupyter matplotlib seaborn tensorflow keras pytorch mxnet gcc

## Conda
### Installation in Ubuntu
```python
# install curl first
sudo apt-get install curl

# get the anaconda package
curl -O https://repo.anaconda.com/archive/Anaconda2-5.3.1-Linux-x86_64.sh
# or use this link
curl -O https://repo.continuum.io/archive/Anaconda2-5.3.1-Linux-x86_64.sh
```

After you download this package, just run it to install anaconda.

```python
bash Anaconda2-5.3.1-Linux-x86_64.sh
```

To make the changes take effect, close and then **re-open** your Terminal window. Then you can `conda` to test it.

### Command Lines

```
# if command not found: conda
export PATH=~/anaconda2/bin:$PATH

# create
conda create -n env_name python=2 ipython numpy

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

### Offline Operation
You should use a combination of both answers.
```shell
conda install opencv --use-index-cache
```
to let conda check for dependencies and compatibility issues.

But keep using conda (not pip) for the installation (if you don´t have serious reasons not to stay in the initial framework) [wasn´t the reason using conda as package manager because pip couldn't´t provide you those opportunities and flexibility?] You can download the `*.tar.bz2` [here](https://anaconda.org/anaconda/repo).
```
conda install opencv-3.3.0-py36_200.tar.bz2
```

## tmux
```
tmux new -s session_name
tmux ls
tmux a -t session_name
tmux kill-session -t myname
```

## Jupyter
### Installation
```
sudo pip install jupyter
```

### Installation in Anaconda
If we wanna create a jupyter environment with all dependent libraries, we can use this:

```python
conda create -n py2 python=2 ipython numpy scipy pandas jupyter matplotlib seaborn 
```

To install `xgboost`, we need certain channel：
```shell
conda install -c conda-forge xgboost 
```

To install `tmux` with conda run one of the following:
```shell
conda install -c conda-forge tmux 
conda install -c conda-forge/label/gcc7 tmux 
```

### Run jupyter
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

To access easily from remote client, we can set a password for server.

```shell
jupyter notebook --generate-config
jupyter notebook password
```
## Linux
让命令行翻墙，可以直接从 Shadowsocks 软件那里复制具体的命令：
```shell
export http_proxy=http://127.0.0.1:1087;export https_proxy=http://127.0.0.1:1087;
```

离线的 server 装软件，可以先下载好 `*.deb` 包，然后利用
```python
sudo dpkg -i ./*.deb
```

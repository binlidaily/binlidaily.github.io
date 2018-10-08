---
layout: post
title: "深度学习网络结构"
author: "Bin Li"
tags: [Deep Learning]
comments: true
style: |
  .container {
        max-width: 44rem;
    } 
published: false
---

## LeNet
利用 TensorFlow 实现的 LeNet 可以参考这个 [repo](https://github.com/ganyc717/LeNet)。而细致的实现每一步的话，可以参考[这个](https://www.kaggle.com/malekbadreddine/tensorflow-convnet-lenet-5)。

![](/images/media/15177311265892.jpg)


为什么 convolutional layer 有多个，这里用 6@28x28 的意思是什么？每一个 28x28 其实是有三维的嘛？

TensorFlow 中的每一个变量都要 init

placeholder 类似于 Variable，唯一的区别是 placeholder 中的变量可能是不同的变量。可以先定义变量的类型，后用不同的参数赋值，就好像形参一样。

如何使用 tensorboard，[远程](https://stackoverflow.com/questions/37987839/how-can-i-run-tensorboard-on-a-remote-server)。
```shell
tensorboard --logdir=logs --port=6006
```

```
/usr/local/bin/jupyter notebook
ssh libin@l154 -N -f -L localhost:16006:localhost:6006
ssh -N -f -L localhost:8888:localhost:8889 libin@l154
# 8889 是服务器的port，8888是本地的

# set password
jupyter notebook password
```

## AlexNet


## TensorFlow
[集锦](https://github.com/jtoy/awesome-tensorflow)


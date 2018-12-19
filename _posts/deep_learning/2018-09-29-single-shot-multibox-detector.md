---
layout: post
title: Single Shot MultiBox Detector
subtitle:
author: Bin Li
tags: [Computer Vision]
image: 
comments: true
published: false
---


## SSD Tensorflow Implementation
Github 上早已经开源了 [SSD TensorFlow](https://github.com/balancap/SSD-Tensorflow) 版，因为其上没有详细说明该如何训练自己的数据，于是熟悉之后在此做一些记录，方便后期查看。

将项目 clone 下来之后，首先可以跑一跑 demo，看下 SSD 检测的效果，解压已经训练好后保存下来的 SSD 模型的 checkpoint 文件（在 ./checkpoint 文件夹中）：

```shell
unzip ssd_300_vgg.ckpt.zip
```

接着就可以回到项目根目录运行 demo 的 jupyter 了：
```shell
jupyter notebook notebooks/ssd_notebook.ipynb
```

如果出现找不到 datasets 的报错，确保 datasets 文件夹下有 `__init__.py` 文件，并且在 jupyter 中加入了 `sys` 导入当前目录。

在 jupyter 中可以看到测试的效果，给一张照片能够较为准确地找到要检测的目标。当然，这只是测试，那么我们如何利用数据训练对应的模型呢？

### 数据处理
首先要去[官网](http://host.robots.ox.ac.uk/pascal/VOC/voc2007/)下载 Pascal VOC 2007 数据，然后将该数据转换成 TensorFlow 能够处理 TF-Records 格式，在项目根目录下创建 tfrecords 文件夹，然后对应到你存放下载好的 voc2007 数据集的地址：
```shell
DATASET_DIR=./VOC2007/
OUTPUT_DIR=./tfrecords
python tf_convert_data.py \
    --dataset_name=pascalvoc \
    --dataset_dir=${DATASET_DIR} \
    --output_name=voc_2007_train \
    --output_dir=${OUTPUT_DIR}
```

这里指的注意的是，我们要训练自己的数据集的话，首先也要将数据整理成 Pascal VOC 2007 的格式。

> * Annotations  
> * ImageSets  
> * JPEGImages  
> * SegmentationClass 
> * SegmentationObject



train 和 val 共5012 张图片，看了下其中的图片，发现大小是不一样的，而且是已经标注好的。可以看到通过转换，将所有 jpg 格式的图片都转换成 TensorFlow 中的 tf-records 类型的数据：
![-w603](/img/media/15451909983753.jpg)

想用一下命令来测试下 Pascal VOC 2007 的模型：
```shell
DATASET_DIR=./tfrecords
EVAL_DIR=./logs/
CHECKPOINT_PATH=./checkpoints/VGG_VOC0712_SSD_300x300_ft_iter_120000.ckpt
python eval_ssd_network.py \
    --eval_dir=${EVAL_DIR} \
    --dataset_dir=${DATASET_DIR} \
    --dataset_name=pascalvoc_2007 \
    --dataset_split_name=test \
    --model_name=ssd_300_vgg \
    --checkpoint_path=${CHECKPOINT_PATH} \
    --batch_size=1
```

报了一下错误：
```shell
ValueError: No data files found in ./tfrecords/voc_2007_test_*.tfrecord
```

得去 [Pascal VOC 官网](http://host.robots.ox.ac.uk/pascal/VOC/voc2007/)再下载测试的数据，按上述流程将测试数据也转换成 tf-records 格式：
```shell
DATASET_DIR=./VOC2007/test/
OUTPUT_DIR=./tfrecords
python tf_convert_data.py \
    --dataset_name=pascalvoc \
    --dataset_dir=${DATASET_DIR} \
    --output_name=voc_2007_test \
    --output_dir=${OUTPUT_DIR}
```

接着又报了一个错误：
```shell
Traceback (most recent call last):
  File "eval_ssd_network.py", line 346, in <module>
    tf.app.run()
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/platform/app.py", line 125, in run
    _sys.exit(main(argv))
  File "eval_ssd_network.py", line 240, in main
    tp_fp_metric = tfe.streaming_tp_fp_arrays(num_gbboxes, tp, fp, rscores)
  File "/home/binli/SSD-Tensorflow/tf_extended/metrics.py", line 151, in streaming_tp_fp_arrays
    name=scope)
  File "/home/binli/SSD-Tensorflow/tf_extended/metrics.py", line 178, in streaming_tp_fp_arrays
    v_nobjects = _create_local('v_num_gbboxes', shape=[], dtype=tf.int64)
  File "/home/binli/SSD-Tensorflow/tf_extended/metrics.py", line 56, in _create_local
    validate_shape=validate_shape)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/ops/variables.py", line 185, in __call__
    return cls._variable_v2_call(*args, **kwargs)
TypeError: _variable_v2_call() got an unexpected keyword argument 'collections'
```
降级 conda 中的 TensorFlow 到1.6版本后：
```shell
conda install tensorflow-1.6.0-py27_0.tar.bz2
```
又冒出错误：
```shell
Traceback (most recent call last):
  File "eval_ssd_network.py", line 346, in <module>
    tf.app.run()
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/platform/app.py", line 126, in run
    _sys.exit(main(argv))
  File "eval_ssd_network.py", line 320, in main
    session_config=config)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/contrib/slim/python/slim/evaluation.py", line 212, in evaluate_once
    config=session_config)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/training/evaluation.py", line 188, in _evaluate_once
    eval_step_value = _get_latest_eval_step_value(eval_ops)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/training/evaluation.py", line 76, in _get_latest_eval_step_value
    with ops.control_dependencies(update_ops):
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/framework/ops.py", line 4746, in control_dependencies
    return get_default_graph().control_dependencies(control_inputs)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/framework/ops.py", line 4446, in control_dependencies
    c = self.as_graph_element(c)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/framework/ops.py", line 3459, in as_graph_element
    return self._as_graph_element_locked(obj, allow_tensor, allow_operation)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/framework/ops.py", line 3548, in _as_graph_element_locked
    types_str))
TypeError: Can not convert a tuple into a Tensor or Operation.
```

然后做一下如下操作：
```python
# import
from compiler.ast import flatten

# change two eval_op
eval_op=list(names_to_updates.values()),
eval_op=flatten(list(names_to_updates.values())),
```

然后又报错了……
```shell
NotFoundError (see above for traceback): Unsuccessful TensorSliceReader constructor: Failed to find any matching files for ./checkpoints/VGG_VOC0712_SSD_300x300_ft_iter_120000.ckpt
	 [[Node: save/RestoreV2 = RestoreV2[dtypes=[DT_INT64, DT_FLOAT, DT_FLOAT, DT_FLOAT, DT_FLOAT, ..., DT_FLOAT, DT_FLOAT, DT_FLOAT, DT_FLOAT, DT_FLOAT], _device="/job:localhost/replica:0/task:0/device:CPU:0"](_arg_save/Const_0_0, save/RestoreV2/tensor_names, save/RestoreV2/shape_and_slices)]]
```

这要就我们把 VGG_VOC0712_SSD_300x300_ft_iter_120000.ckpt.zip 解压出来的两个文件放到一个名叫 `VGG_VOC0712_SSD_300x300_ft_iter_120000.ckpt` 的文件夹里，并至于 checkpoints 文件夹下。
```shell
CHECKPOINT_PATH=./checkpoints/VGG_VOC0712_SSD_300x300_ft_iter_120000.ckpt
python eval_ssd_network.py \
    --eval_dir=${EVAL_DIR} \
    --dataset_dir=${DATASET_DIR} \
    --dataset_name=pascalvoc_2007 \
    --dataset_split_name=test \
    --model_name=ssd_300_vgg \
    --checkpoint_path=${CHECKPOINT_PATH} \
    --batch_size=1
```

然后终于可以测试了🤣。

蓝鹅，太天真了，跑出了 mAP 后果然又报错了：
```shell
Traceback (most recent call last):
  File "eval_ssd_network.py", line 346, in <module>
    tf.app.run()
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/platform/app.py", line 126, in run
    _sys.exit(main(argv))
  File "eval_ssd_network.py", line 320, in main
    session_config=config)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/contrib/slim/python/slim/evaluation.py", line 212, in evaluate_once
    config=session_config)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/training/evaluation.py", line 212, in _evaluate_once
    session.run(eval_ops, feed_dict)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/training/monitored_session.py", line 658, in __exit__
    self._close_internal(exception_type)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/training/monitored_session.py", line 690, in _close_internal
    h.end(self._coordinated_creator.tf_sess)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/contrib/training/python/training/evaluation.py", line 311, in end
    summary_str = session.run(self._summary_op, self._feed_dict)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/client/session.py", line 905, in run
    run_metadata_ptr)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/client/session.py", line 1137, in _run
    feed_dict_tensor, options, run_metadata)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/client/session.py", line 1355, in _do_run
    options, run_metadata)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/client/session.py", line 1374, in _do_call
    raise type(e)(node_def, op, message)
tensorflow.python.framework.errors_impl.InvalidArgumentError: Duplicate tag ssd_losses/cross_entropy_pos/value_1 found in summary inputs
	 [[Node: Merge/MergeSummary = MergeSummary[N=93, _device="/job:localhost/replica:0/task:0/device:CPU:0"](pascalvoc_2007_data_provider/parallel_read/filenames/fraction_of_32_full, pascalvoc_2007_data_provider/parallel_read/fraction_of_2_full, batch/fraction_of_5_full, ssd_losses/cross_entropy_pos/value_1, ssd_losses/cross_entropy_pos/value_1, ssd_losses/localization/value_1, ssd_losses/localization/value_1, ssd_losses/cross_entropy_neg/value_1, ssd_losses/cross_entropy_neg/value_1, AP_VOC07/1, AP_VOC07/1, AP_VOC12/1, AP_VOC12/1, AP_VOC07/2, AP_VOC07/2, AP_VOC12/2, AP_VOC12/2, AP_VOC07/3, AP_VOC07/3, AP_VOC12/3, AP_VOC12/3, AP_VOC07/4, AP_VOC07/4, AP_VOC12/4, AP_VOC12/4, AP_VOC07/5, AP_VOC07/5, AP_VOC12/5, AP_VOC12/5, AP_VOC07/6, AP_VOC07/6, AP_VOC12/6, AP_VOC12/6, AP_VOC07/7, AP_VOC07/7, AP_VOC12/7, AP_VOC12/7, AP_VOC07/8, AP_VOC07/8, AP_VOC12/8, AP_VOC12/8, AP_VOC07/9, AP_VOC07/9, AP_VOC12/9, AP_VOC12/9, AP_VOC07/10, AP_VOC07/10, AP_VOC12/10, AP_VOC12/10, AP_VOC07/11, AP_VOC07/11, AP_VOC12/11, AP_VOC12/11, AP_VOC07/12, AP_VOC07/12, AP_VOC12/12, AP_VOC12/12, AP_VOC07/13, AP_VOC07/13, AP_VOC12/13, AP_VOC12/13, AP_VOC07/14, AP_VOC07/14, AP_VOC12/14, AP_VOC12/14, AP_VOC07/15, AP_VOC07/15, AP_VOC12/15, AP_VOC12/15, AP_VOC07/16, AP_VOC07/16, AP_VOC12/16, AP_VOC12/16, AP_VOC07/17, AP_VOC07/17, AP_VOC12/17, AP_VOC12/17, AP_VOC07/18, AP_VOC07/18, AP_VOC12/18, AP_VOC12/18, AP_VOC07/19, AP_VOC07/19, AP_VOC12/19, AP_VOC12/19, AP_VOC07/20, AP_VOC07/20, AP_VOC12/20, AP_VOC12/20, AP_VOC07/mAP, Print, AP_VOC12/mAP, Print_1)]]
```
暂且先不管了吧，用自己的数据出问题了再说……😓

---


tensorboard 启动：
```shell
tensorboard --logdir=./log
```
如果远程看：
```shell
ssh -NfL 6006:localhost:6006 username@remote_server_address
```

如何关掉这个端口呢？
```shell
sudo lsof -nPi :yourPortNumber
# then
sudo kill -9 yourPIDnumber
```

`nvidia-smi` 是由 cuda 和驱动提供的，于是就要对应的找资源安装了 cuda_10.0.130_410.48_linux.run 和 NVIDIA-Linux-x86_64-410.78.run。

### 基于自己的数据训练模型
#### 数据转化成 Pascal VOC 格式



## Reference
1. [Understand Single Shot MultiBox Detector (SSD) and Implement It in Pytorch](https://medium.com/@smallfishbigsea/understand-ssd-and-implement-your-own-caa3232cd6ad)
2. [A guide to receptive field arithmetic for Convolutional Neural Networks](https://medium.com/mlreview/a-guide-to-receptive-field-arithmetic-for-convolutional-neural-networks-e0f514068807)
3. [Faster R-CNN Explained](https://medium.com/@smallfishbigsea/faster-r-cnn-explained-864d4fb7e3f8)
4. [Preparing Inputs](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/using_your_own_dataset.md)
5. [Face Detection for CCTV surveillance](https://blog.usejournal.com/face-detection-for-cctv-surveillance-6b8851ca3751)
6. [Tensorflow-SSD测试及训练自己的数据集](https://blog.csdn.net/ei1990/article/details/75282855)
